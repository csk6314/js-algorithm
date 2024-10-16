"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");
const N = +input[0];
const blocks = new Array(N + 1);
let dst;
input[2].split(" ").forEach((v) => {
  blocks[+v] = 1;
  if (+v === N) {
    dst = 1;
  }
});
input[3].split(" ").forEach((v) => {
  blocks[+v] = 2;
  if (+v === N) {
    dst = 2;
  }
});
input[4].split(" ").forEach((v) => {
  blocks[+v] = 3;
  if (+v === N) {
    dst = 3;
  }
});

const moveTop = new Array(N + 1);
moveTop[1] = 0;
for (let i = 2; i < moveTop.length; i++) {
  moveTop[i] = (moveTop[i - 1] + 1 + moveTop[i - 1]) % 1000000;
}

const solution = () => {
  console.log(dst);
  let answer = 0;
  let cur = N;
  let pos = 3;
  while (cur > 0) {
    if (pos === blocks[cur]) {
      console.log(cur);
      cur--;
      continue;
    }
    answer = (answer + moveTop[cur] + 1) % 1000000;
    console.log(answer, cur);
    for (let i = 1; i <= 3; i++) {
      if (i !== pos && i !== blocks[cur]) {
        pos = i;
        break;
      }
    }
    cur--;
  }
  console.log(answer);
};

solution();
