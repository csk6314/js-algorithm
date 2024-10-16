"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const [M, N] = inputs[0]
  .trim()
  .split(" ")
  .map((v) => +v);
const map = inputs.slice(1).map((row) =>
  row
    .trim()
    .split(" ")
    .map((v) => +v)
);

//console.log(map);
const dp = Array.from({ length: M }, () => new Array(N));

const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

let cnt = 0;

const dfs = (y, x) => {
  if (y === M - 1 && x === N - 1) {
    cnt++;
    return 1;
  }
  // console.log(y, x);
  let ways = 0;
  if (dp[y][x] !== undefined) {
    return dp[y][x];
  }
  for (let i = 0; i < 4; i++) {
    const ny = y + dy[i];
    const nx = x + dx[i];
    //console.log(ny, nx);
    if (!validatePos(ny, nx)) continue;
    if (map[ny][nx] < map[y][x]) {
      ways += dfs(ny, nx);
    }
  }
  dp[y][x] = ways;
  //   console.log(y, x, `ways : ${ways}`);
  //   console.log(dp[16][17]);
  return ways;
};

const validatePos = (y, x) => !(y < 0 || y >= M || x < 0 || x >= N);

const solution = () => {
  console.log(dfs(0, 0));
};

solution();
