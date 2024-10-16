"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().trim().split("\n");
const strA = inputs[0].trim();
const strB = inputs[1].trim();
//console.log(strA, strB);
const N = strA.length + 1;
const M = strB.length + 1;
const dp = Array.from({ length: N }, () => new Array(M).fill(0));

const solution = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (i == 0 || j == 0) {
        dp[i][j] = 0;
        continue;
      }
      if (strA.charAt(i - 1) === strB.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        continue;
      }
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  console.log(dp[N - 1][M - 1]);
  //console.log(dp.map((row) => row.join(" ")).join("\n"));
  const lcsLen = dp[N - 1][M - 1];
  const lcs = new Array(lcsLen);
  let r = N - 1;
  let c = M - 1;
  let idx = lcsLen - 1;
  while (idx >= 0 && r > 0 && c > 0) {
    const cur = dp[r][c];
    if (dp[r - 1][c] === cur) {
      r--;
      continue;
    }
    if (cur === dp[r][c - 1]) {
      c--;
      continue;
    }
    lcs[idx--] = strA.charAt(r - 1);
    r--;
    c--;
  }
  console.log(lcs.join(""));
};
solution();
