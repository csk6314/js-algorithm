"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = +inputs[0];
const lines = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));
//console.log(N, lines);

const solution = () => {
  lines.sort((line1, line2) => {
    const len1 = line1[1] - line1[0];
    const len2 = line2[1] - line2[0];
    if (line1[0] === line2[0]) {
      return len2 - len1;
    }
    return line1[0] - line2[0];
  });

  let ans = 0;
  let maxEnd = -1000000001;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line[0] > maxEnd) {
      maxEnd = line[1];
      ans += line[1] - line[0];
      continue;
    }
    if (line[1] > maxEnd) {
      ans += line[1] - maxEnd;
      maxEnd = line[1];
      continue;
    }
  }
  console.log(ans);
};
solution();
