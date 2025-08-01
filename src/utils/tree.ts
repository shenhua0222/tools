import * as d3 from "d3";

interface TreeData {
  name: string;
  children?: TreeData[];
}

interface TreeOptions {
  path?: (d: any) => string; // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id?: (d: any) => string; // if tabular data, given a d in data, returns a unique identifier (string)
  parentId?: (d: any) => string; // if tabular data, given a node d, returns its parent’s identifier
  children?: (d: any) => any[]; // if hierarchical data, given a d in data, returns its children
  tree?: () => d3.TreeLayout<any>; // layout algorithm (typically d3.tree or d3.cluster)
  sort?: (a: d3.HierarchyNode<any>, b: d3.HierarchyNode<any>) => number; // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label?: (d: any, node: d3.HierarchyNode<any>) => string; // given a node d, returns the display name
  title?: (d: any, node: d3.HierarchyNode<any>) => string; // given a node d, returns its hover text
  link?: (d: any, node: d3.HierarchyNode<any>) => string | null; // given a node d, its link (if any)
  linkTarget?: string; // target attribute for links
  width?: number;
  height?: number;
  r?: number; // radius of nodes
  padding?: number; // horizontal padding for first and last column
  fill?: string; // fill for nodes
  stroke?: string; // stroke for links
  strokeWidth?: number; // stroke width for links
  strokeOpacity?: number; // stroke opacity for links
  strokeLinejoin?: any; // stroke line join for links
  strokeLinecap?: any; // stroke line cap for links
  halo?: string; // color of label halo
  haloWidth?: number; // padding around the labels
  curve?: any; // curve for the link
  // [key: string]: any;  // allow additional options
}

export function Tree(data: TreeData[], option?: TreeOptions) {
  let {
    path,
    id =  Array.isArray(data) ? d => d.id : null,
    parentId = Array.isArray(data) ? d => d.parentId : null,
    children,
    tree = d3.tree,
    sort,
    label,
    title,
    link,
    linkTarget = "_blank",
    width = 640,
    height,
    r = 3,
    padding = 1,
    fill = "#999",
    stroke = "#555",
    strokeWidth = 1.5,
    strokeOpacity = 0.4,
    strokeLinejoin,
    strokeLinecap,
    halo = "#fff",
    haloWidth = 3,
    curve = d3.curveBumpX,
  } = option || {};

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.

  const root =
    path != null
      ? d3.stratify().path(path)(data)
      : id != null || parentId != null
      ? // @ts-ignore
        d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  // Sort the nodes.
  if (sort != null) root.sort(sort);

  // Compute labels and titles.
  const descendants = root.descendants();
  const L = label == null ? null : descendants.map((d) => label(d.data, d));

  // Compute the layout.
  const dx = 10;
  const dy = width / (root.height + padding);
  tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -x0;
  root.each((d) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the default height.
  if (height === undefined) height = x1 - x0 + dx * 2;

  // Use the required curve
  if (typeof curve !== "function") throw new Error(`Unsupported curve`);

  const svg = d3
    .create("svg")
    .attr("viewBox", [(-dy * padding) / 2, x0 - dx, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-width", strokeWidth)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .link(curve)
        .x((d) => d.y)
        .y((d) => d.x)
    );

  const node = svg
    .append("g")
    .selectAll("a")
    .data(root.descendants())
    .join("a")
    .attr("xlink:href", link == null ? null : (d) => link(d.data, d))
    .attr("target", link == null ? null : linkTarget)
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("circle")
    .attr("fill", (d) => (d.children ? stroke : fill))
    .attr("r", r);

  if (title != null) node.append("title").text((d) => title(d.data, d));

  if (L)
    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.children ? -6 : 6))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("paint-order", "stroke")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth)
      .text((d, i) => L[i]);

  return svg.node();
}
