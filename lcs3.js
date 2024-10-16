"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().trim().split("\n");
const strA = inputs[0].trim();
const strB = inputs[1].trim();
const strC = inputs[2].trim();
//console.log(strA, strB);
const N = strA.length + 1;
const M = strB.length + 1;
const K = strC.length + 1;
const dp = Array.from({ length: N }, () =>
  Array.from({ length: M }, () => new Array(K))
);

const solution = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      for (let k = 0; k < K; k++) {
        if (i === 0 || j === 0 || k === 0) {
          dp[i][j][k] = 0;
          continue;
        }
        if (
          strA.charAt(i - 1) === strB.charAt(j - 1) &&
          strB.charAt(j - 1) === strC.charAt(k - 1)
        ) {
          dp[i][j][k] = dp[i - 1][j - 1][k - 1] + 1;
          continue;
        }
        dp[i][j][k] = Math.max(
          Math.max(dp[i][j][k - 1], dp[i][j - 1][k]),
          dp[i - 1][j][k]
        );
      }
    }
  }
  console.log(dp[N - 1][M - 1][K - 1]);
};
solution();
