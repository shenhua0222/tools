/**
 * SVG 图标自动加载工具
 * 将 src/icons 目录下的 SVG 文件转换为 Vue 组件
 */

const modules = import.meta.glob("../icons/*.svg", { query: "?component" });

export const svgIcons: Record<string, any> = {};

for (const path in modules) {
  // 从路径提取文件名，例如: ../icons/home.svg -> home
  const filename = path.split("/").pop()?.split(".")[0] || "";
  const componentName = `svg-${filename}`;

  // 动态加载并注册组件
  modules[path]().then((mod: any) => {
    svgIcons[componentName] = mod.default;
  });
}

export default svgIcons;
