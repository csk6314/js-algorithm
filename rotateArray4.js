"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const [N, M, K] = input[0].split(" ").map((v) => +v);
let arr = input.slice(1, 1 + N).map((row) => row.split(" ").map((v) => +v));
//console.log(N, M, K, arr);
const rotateCalc = [];
for (let i = 0; i < K; i++) {
  const [r, c, s] = input[N + 1 + i].split(" ").map((v) => +v);
  rotateCalc.push([r, c, s]);
}

const rotateArr = (r, c, s) => {
  if (s === 0) {
    return;
  }
  rotateArr(r, c, s - 1);

  const len = s * 2;
  const edges = [
    [r - s, c - s],
    [r - s, c + s],
    [r + s, c + s],
    [r + s, c - s],
  ];

  const edgeVal = edges.map(([y, x]) => arr[y][x]);
  for (let i = len - 1; i >= 0; i--) {
    arr[edges[0][0]][edges[0][1] + i + 1] = arr[edges[0][0]][edges[0][1] + i];
    arr[edges[1][0] + i + 1][edges[1][1]] = arr[edges[1][0] + i][edges[1][1]];
    arr[edges[2][0]][edges[2][1] - (i + 1)] = arr[edges[2][0]][edges[2][1] - i];
    arr[edges[3][0] - (i + 1)][edges[3][1]] = arr[edges[3][0] - i][edges[3][1]];
  }

  arr[edges[0][0]][edges[0][1] + 1] = edgeVal[0];
  arr[edges[1][0] + 1][edges[1][1]] = edgeVal[1];
  arr[edges[2][0]][edges[2][1] - 1] = edgeVal[2];
  arr[edges[3][0] - 1][edges[3][1]] = edgeVal[3];
};

const getSum = () => {
  let sum = 50 * 100;
  arr.forEach((row) => {
    sum = Math.min(
      sum,
      row.reduce((acc, cur) => acc + cur, 0)
    );
  });
  return sum;
};

const visited = new Array(K).fill(false);
const rotateSeq = new Array(K);
const rotateSeqs = [];
let ans = 50 * 100 + 1;

const rotateDfs = (depth) => {
  if (depth === K) {
    rotateSeqs.push([...rotateSeq]);
    return;
  }

  for (let i = 0; i < K; i++) {
    if (!visited[i]) {
      visited[i] = true;
      rotateSeq[depth] = i;
      rotateDfs(depth + 1);
      visited[i] = false;
    }
  }
};

const solution = () => {
  rotateDfs(0);

  rotateSeqs.forEach((seq) => {
    const tempArr = arr.map((row) => [...row]);
    seq.forEach((n) => {
      const [r, c, s] = rotateCalc[n];
      rotateArr(r - 1, c - 1, s);
    });
    ans = Math.min(getSum(), ans);
    arr = tempArr;
  });
  console.log(ans);
};

solution();
