<template>
    <div class="v-gridlist">
        <div v-if="$slots.form" class="v-gridlist__toolbar">
            <slot name="form" :query="state.query" :data="state"></slot>
        </div>
        <div v-if="$slots.table" class="v-gridlist__grid" v-loading="state.$xargs?.loading && !state.$xargs?.silent">
            <slot name="table" :grid="state"></slot>
        </div>
        <div v-if="showPagination && !isEmpty(state.pager) && !isEmpty(state.list)" class="v-gridlist__pagination">
            <slot name="pagination" :pager="state.pager">
                <el-pagination
                    :total="state.pager.total"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-size="!isEmpty(pageSizes) ? state.pager.size : Math.max(10, ~~(state.pager.size / 5) * 5)"
                    :page-sizes="defaultTo(pageSizes, [10, 15, 20, 30], (o) => !isEmpty(o))"
                    :current-page="pageFrom0 ? state.pager.page + 1 : state.pager.page"
                    @update:currentPage="state.pager.page = $event"
                    @size-change="onSizeChange"
                    @current-change="onPageChange" />
            </slot>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, getCurrentInstance, computed, onBeforeUnmount } from "vue";
import qs from "query-string";
import { Base64 } from "js-base64";
import { assign, cloneDeep, defaultTo, defer, get, isEmpty, isEqual, merge, omit, set, unset, debounce, isFunction } from "lodash";
import { v4 as uuidv4 } from "uuid";
// import { useTimeout, useTimeoutFn } from "@vueuse/core";

function sanitizePST(raw) {
    const { query, pager: rawPager } = raw ?? {};
    let pager = null;
    if (rawPager) {
        const { page, size } = rawPager;
        pager = {
            page,
            size,
        };
    }
    return {
        query,
        pager,
    };
}

export default defineComponent({
    name: "GridList",
    props: {
        storeLoadList: {
            type: Function,
            required: true,
        },
        storeState: {
            type: [Object, Array],
            default: () => ({}),
        },
        initialState: {
            type: Object,
        },
        showPagination: {
            type: Boolean,
            default: true,
        },
        pageSizes: {
            type: Array,
        },
        loadOnCreated: {
            type: Boolean,
            default: true,
        },
        chainQuery: {
            type: Function,
            default: (query) => ({ ...query }),
        },
        paramsReduce: {
            type: Function,
            default: (params) => ({ ...params }),
        },
        autoReload: {
            type: [Boolean, Object],
            default: false,
        },
        clearSelectionOnLoad: {
            type: Boolean,
            default: true,
        },
        syncUrlState: {
            type: Boolean,
        },
        queryStateKey: {
            type: String,
            default: "_sts",
        },
        showLoading: {
            type: Boolean,
            default: false,
        },
        pageFrom0: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { expose, emit }) {
        const debounceRef = ref(null);
        const gridState = reactive({
            query: {},
            pager: {
                size: 10,
                page: 1,
            },
            list: [],
            $xargs: {
                loading: false,
            },
            lastLoadTime: null,
        });
        const initPST = ref(null);
        const lastPST = ref(null);
        const timer = ref(-1);
        const route = useRoute()
        const router = useRouter()
        const guid = () => {
            return uuidv4();
        };

        const internalPageCount = computed(() => {
            const pager = gridState.pager || {};
            return Math.ceil(get(pager, "total", 0) / get(pager, "size", 10));
        });

        const getPST = () => {
            return cloneDeep(
                sanitizePST({
                    query: gridState.query,
                    pager: gridState.pager,
                })
            );
        };

        function assertInitialState(listParams) {
            const keys = Object.keys(listParams);
            if (keys.indexOf("list") !== -1) {
                console.error("Invalid `initialState` ref, `.list` is reserved. see IListParams for more details");
                unset(listParams, "list");
            }
        }
        /**
         *  生命周期
         */
        onMounted(async () => {
            setMultiState(props.storeState);

            const initialState = props.initialState;
            if (initialState) {
                assertInitialState(initialState);
            }

            const initial = merge(
                {
                    query: {},
                    pager: {
                        size: 10,
                        page: 1,
                    },
                    list: [],
                    $xargs: {
                        loading: false,
                    },
                },
                initialState
            );
            if (props.showPagination) {
                initial.pager = { ...initial.pager };
            }
            setMultiState(initial);

            initPST.value = getPST();

            if (props.syncUrlState) {
                _initStateSync();
            }

            if (props.loadOnCreated) {
                await _load();
            }

            _setupLoadDaemon();
        });
        onActivated(async () => {
            await _load();
            _setupLoadDaemon();
        });
        onDeactivated(() => {
            clearTimeout(timer.value);
            timer.value = -1;
        });
        onBeforeUnmount(() => {
            clearTimeout(timer.value);
            timer.value = -1;
        });

        const load = (params = {}, opts = {}) => {
            return _load(params, opts).finally(() => {
                if (props.clearSelectionOnLoad) {
                    const table = findChildComponent(getCurrentInstance(), "ElTable");
                    if (table) {
                        try {
                            table.clearSelection();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            });
        };

        const onSizeChange = (size) => {
            setState("pager.size", size);
            debounceLoad();
        };

        const onPageChange = (page) => {
            console.log("onPageChange", page);
            setState("pager.page", props.pageFrom0 ? page - 1 : page);
            debounceLoad();
        };

        const onSortChange = ({ prop, order }) => {
            const sortOrder = order || undefined;
            const sortProp = sortOrder ? prop : undefined;
            setState("query", { sortProp, sortOrder });
            debounceLoad();
        };

        const setState = (k, v) => {
            set(gridState, k, v);
        };

        const setMultiState = (obj) => {
            Object.assign(gridState, obj);
        };

        const debounceLoad = debounce(p => {
            _load(p);
        }, 100);

        const _load = (params = {}, opts = {}) => {
            const debounce = opts.debounce || 0;
            const pst = getPST();
            const merged = merge({}, pst, params);
            if (!props.showPagination) {
                merged.pager = undefined;
            }

            if (debounce > 0) {
                const ref = debounceRef.value;
                if (ref) {
                    if (ref[0]) {
                        clearTimeout(ref[0]);
                        ref[1] = merged;
                    } else {
                        const isModified = !isEqual(lastPST.value, pst);
                        return !isModified ? ref[2] : ref[2].finally(() => _load(params, opts));
                    }
                }

                const def = defer();

                def.finally(() => (debounceRef.value = null));

                timer.value = setTimeout(() => {
                    const ref = debounceRef.value;
                    ref[0] = 0;
                    _fetchApi(ref[1]).then(def.resolve, def.reject);
                }, debounce);

                debounceRef.value = [timer.value, merged, def];
                return def;
            }

            return _fetchApi(merged);
        };

        const _fetchApi = (params, opts = {}) => {
            params = (params && cloneDeep(params)) || {};

            if (!props.showPagination) {
                unset(params, "pager");
            } else {
                params.pager = {
                    ...{ size: 10, page: 1 },
                    ...gridState.pager,
                    ...params.pager,
                };
            }

            const hoist = { ...params.query };
            params.query = defaultTo(props.chainQuery(hoist), hoist, (v) => v !== undefined);

            params = props.paramsReduce(params);

            let isRequestValid = true;
            const seqId = guid();

            // store.hmset(params, true);
            // store.set("$xargs", { loading: props.showLoading, seqId });
            setMultiState({
                ...params,
                $xargs: { loading: props.showLoading, seqId },
            });

            lastPST.value = getPST();
            emit("beforeLoad", [params, opts]);

            const loader = isFunction(props.storeLoadList) ? props.storeLoadList : () => Promise.resolve(props.storeLoadList || []);

            return loader(params)
                .then((res) => {
                    emit("dataLoaded", res);
                    isRequestValid = gridState.$xargs?.seqId === seqId;
                    if (!isRequestValid) {
                        throw new Error("Invalid parallel request (aborted)");
                    }

                    const p0 = get(params, "pager") || {};
                    let p1 = get(res, "pager") || {};

                    p1.page = p1.page !== undefined ? p1.page : p0.page;
                    p1.size = p1.size !== undefined ? p1.size : p0.size;
                    p1.total = p1.total !== undefined ? p1.total : 0;

                    if (p0 && p1 && p1.total) {
                        const { size } = p1;
                        const totalPage = Math.ceil(p1.total / size);

                        if (p0.page > totalPage) {
                            return _fetchApi(
                                {
                                    ...params,
                                    pager: { ...p0 },
                                },
                                opts
                            );
                        }
                    }
                    setState("pager", p1);
                    return setMultiState({ ...omit(res, ["query"]) });
                    // return setMultiState(merge(omit(res, ["query"]), params));
                })
                .finally(() => {
                    if (isRequestValid) {
                        gridState.$xargs = null;
                        gridState.lastLoadTime = Date.now();
                    }
                });
        };

        const _setupLoadDaemon = () => {
            const reloadOptions = ((opts) => {
                const ret = {
                    enable: false,
                    interval: 5000,
                };
                if (typeof opts === "boolean") {
                    ret.enable = opts;
                } else {
                    assign(ret, opts);
                }
                return ret;
            })(props.autoReload);

            const { enable, interval } = reloadOptions;

            if (enable) {
                timer.value = 0;
                const run = () => {
                    if (timer.value === -1) {
                        return;
                    }
                    if (timer.value) {
                        clearTimeout(timer.value);
                    }

                    timer.value = setTimeout(() => {
                        const isLoading = gridState.$xargs?.loading;
                        const lastLoadTime = gridState.lastLoadTime;
                        if (isLoading || (lastLoadTime && Date.now() - lastLoadTime < interval)) {
                            run();
                        } else {
                            _load({ $xargs: { silent: true } }).finally(() => {
                                unset(gridState, "$xargs.silent");
                                run();
                            });
                        }
                    }, interval);
                };

                run();
            }
        };

        const _initStateSync = () => {
            const loc = location;

            const deserializeState = (qs) => {
                const s = get(qs.parse(qs), props.queryStateKey);
                if (s) {
                    try {
                        return JSON.parse(Base64.decode(s));
                    } catch (e) {
                        console.error("Parse query state error", e);
                    }
                }
                return null;
            };

            const serializeState = (s) => Base64.encode(JSON.stringify(sanitizePST(s)));

            const qsKey = props.queryStateKey;
            const sts = deserializeState(loc.search);
            if (sts) {
                setMultiState(sts);
            }

            let lastQs;
            watch(
                () => route.query,
                (to) => {
                    if (lastQs === to[qsKey]) {
                        return;
                    }

                    const sts = deserializeState(loc.search) || initPST.value;
                    lastQs = serializeState(sts);

                    _fetchApi(sts, { trigger: "router" });
                }
            );

            watch(
                () => getPST(),
                (params) => {
                    if (get(params, "$xargs.silent")) {
                        return;
                    }

                    const newQs = serializeState(params);
                    if (lastQs !== newQs) {
                        lastQs = newQs;
                        const currQs = qs.parse(loc.search);
                        router[currQs[qsKey] ? "replace" : "push"]({
                            query: { ...currQs, [qsKey]: newQs },
                        });
                    }
                }
            );
        };

        const findChildComponent = (instance, componentName) => {
            if (!instance || !instance.subTree) return null;
            const { subTree } = instance;
            if (subTree.type.name === componentName) return subTree.component.proxy;
            if (subTree.children) {
                for (const child of subTree.children) {
                    const found = findChildComponent(child.component, componentName);
                    if (found) return found;
                }
            }
            return null;
        };

        expose({
            load: debounceLoad,
        });

        return {
            internalPageCount,
            load,
            onSizeChange,
            onPageChange,
            onSortChange,
            setState,
            state: gridState,
            isEmpty,
            guid,
            defaultTo,
            get,
        };
    },
});
</script>

<style lang="scss">
%clearfix {
    &::after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
}

.v-gridlist {
    .v-gridlist__toolbar .master-btns {
        margin-right: 10px;
        float: left;
    }

    &__toolbar {
        @extend %clearfix;

        padding-bottom: 6px;
        line-height: 32px;

        form {
            @extend %clearfix;

            text-align: right;

            &.align-left {
                text-align: left;
            }
        }

        .el-form-item {
            margin-bottom: 10px;

            // .el-form-item__label {
            //   padding-right: 8px;
            //   color: $color-text-regular;
            // }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    &__grid {
        .el-table-column--selection {
            .cell {
                text-overflow: initial;
                padding: 0;
                text-align: center;
            }
        }
    }

    &__pagination {
        margin-top: 20px;
        text-align: right;

        .el-pagination {
            justify-content: end;
            .el-select .el-input {
                width: 84px;
            }
        }
    }

    .v-gridlist__pagination {
        .el-pagination {
            justify-content: flex-end;
        }
    }
}
</style>
