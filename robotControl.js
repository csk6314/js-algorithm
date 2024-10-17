const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const [N, M] = inputs[0].split(" ").map((v) => +v);
const arr = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));

const dp = Array.from({ length: N }, (row) => new Array(M).fill(0));

dp[0][0] = arr[0][0];

for (let j = 1; j < M; j++) {
  dp[0][j] = dp[0][j - 1] + arr[0][j];
}

const temp = [new Array(M).fill(0), new Array(M).fill(0)];

for (let i = 1; i < N; i++) {
  temp[0][0] = dp[i - 1][0] + arr[i][0];
  for (let j = 1; j < M; j++) {
    temp[0][j] = Math.max(dp[i - 1][j], temp[0][j - 1]) + arr[i][j];
  }

  temp[1][M - 1] = dp[i - 1][M - 1] + arr[i][M - 1];
  for (let j = M - 2; j >= 0; j--) {
    temp[1][j] = Math.max(dp[i - 1][j], temp[1][j + 1]) + arr[i][j];
  }

  for (let j = 0; j < M; j++) {
    dp[i][j] = Math.max(temp[0][j], temp[1][j]);
  }
  temp.forEach((tmp) => tmp.map((v) => 0));
}

console.log(dp[N - 1][M - 1]);
