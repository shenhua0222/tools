<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Tree } from "@src/utils/tree";

interface TreeNode {
  id?: number;
  name: string;
  children?: TreeNode[];
}

const treeData = ref<TreeNode>(null as any);
const vHtml = ref<string>("<div>woaini</div>");

watch(
  () => treeData.value,
  (newValue) => {
    if (newValue) {
      const svg = Tree(newValue, {
        label: (d) => d.name,
        title: (d, n) =>
          `${n
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join(".")}`, // hover text
        link: (d, n) =>
          `https://github.com/prefuse/Flare/${
            n.children ? "tree" : "blob"
          }/master/flare/src/${n
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join("/")}${n.children ? "" : ".as"}`,
        width: 1152,
      });
      vHtml.value = svg.outerHTML; // Update the HTML content with the new tree structure
    }
  }
);

onMounted(() => {
  fetch("tree.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      treeData.value = data;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
</script>

<template>
  <div class="app">
    <div v-html="vHtml"></div>
    <!-- <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a> -->
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
