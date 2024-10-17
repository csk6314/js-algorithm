"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const n = +inputs[0];
const forest = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));

const dp = forest.map((row) => row.map((v) => -1));

const init = () => {
  let answer = -1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      answer = Math.max(dfs([i, j]), answer);
    }
  }
  console.log(answer);
};

const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];

const validatePos = (pos) =>
  !(pos[0] < 0 || pos[0] >= n || pos[1] < 0 || pos[1] >= n);

const dfs = (pos) => {
  const [y, x] = pos;
  if (dp[y][x] !== -1) {
    return dp[y][x];
  }
  const bambooQuantity = forest[y][x];
  let max = 0;

  for (let i = 0; i < 4; i++) {
    const nx = x + dx[i];
    const ny = y + dy[i];

    if (!validatePos([ny, nx])) continue;
    if (forest[ny][nx] > bambooQuantity) {
      max = Math.max(max, dfs([ny, nx]));
    }
  }

  dp[y][x] = max + 1;

  return max + 1;
};

init();
