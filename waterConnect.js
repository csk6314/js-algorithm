"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const N = +inputs[0];
const vertex = [];
for (let i = 0; i < N; i++) {
  vertex.push(+inputs[1 + i]);
}
const adjs = inputs.slice(1 + N).map((row) =>
  row
    .trim()
    .split(" ")
    .map((v) => +v)
);

const edges = [];
const parent = Array.from({ length: N + 1 }, (_, idx) => idx);
let res = 0;
const kruskal = () => {
  for (let i = 0; i < edges.length; i++) {
    const [src, target, w] = edges[i];
    if (findParent(src) === findParent(target)) continue;
    union(src, target);
    res += w;
  }
};

const findParent = (v) => {
  if (parent[v] === v) return v;
  return (parent[v] = findParent(parent[v]));
};

const union = (v1, v2) => {
  const r1 = findParent(v1);
  const r2 = findParent(v2);

  if (r1 === r2) return false;
  parent[r1] = parent[r2];
  return true;
};

const solution = () => {
  for (let i = 1; i < N + 1; i++) {
    edges.push([0, i, vertex[i - 1]]);
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i + 1; j++) {
      if (i === j) continue;
      const w = adjs[i][j];
      edges.push([i + 1, j + 1, w]);
    }
  }

  edges.sort((a, b) => a[2] - b[2]);
 // console.log(edges);

  kruskal();
  console.log(res);
};

solution();
