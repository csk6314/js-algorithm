"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const N = +input[0];
const adjs = Array.from({ length: N + 1 }, () => []);
for (let i = 0; i < N - 1; i++) {
  const [src, target, w] = input[1 + i].split(" ").map((v) => +v);
  adjs[src].push([target, w]);
}
let max = -1;

const dfs = (nodeId, w) => {
  if (adjs[nodeId].length < 1) {
    return w;
  }

  const v = [];
  for (const edge of adjs[nodeId]) {
    v.push(dfs(edge[0], edge[1]));
  }
  v.sort((a, b) => b - a);
  // console.log(nodeId, v);
  if (v.length < 2) {
    max = Math.max(max, v[0]);
  } else {
    max = Math.max(max, v[0] + v[1]);
  }
  return w + v[0];
};

const solution = () => {
  if (N <= 1) {
    console.log(0);
    return;
  }
  dfs(1, 0);
  console.log(max);
};

solution();
