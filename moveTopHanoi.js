"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString();
const N = +input;

let count = 0;
let log = "";

const buildTop = (src, target, size) => {
  let sub = 0;
  for (let i = 1; i <= 3; i++) {
    if (i !== src && i !== target) {
      sub = i;
      break;
    }
  }

  if (size === 1) {
    log += `${src} ${target}\n`;
    count++;
    return;
  }

  buildTop(src, sub, size - 1);
  log += `${src} ${target}\n`;
  count++;
  buildTop(sub, target, size - 1);
};

const solution = () => {
  buildTop(1, 3, N);
  console.log(count);
  console.log(log);
};

solution();
