"use strict";
class RotateQueue {
  constructor() {
    this.data = [];
    this.head = 0;
    this.tail = 0;
    this.MAX = 7;
  }

  push(value) {
    this.data[this.tail++] = value;
    if (this.tail > this.MAX) this.tail = 7;
  }

  peek() {
    return this.data[this.head];
  }

  get(idx) {
    const convIdx =
      idx + this.head > this.data.length - 1
        ? idx + this.head - this.data.length
        : idx + this.head;
    return this.data[convIdx];
  }

  rotate(dir) {
    if (dir === -1) {
      this.tail++;
      if (this.tail > this.data.length - 1) this.tail = 0;
      this.head++;
      if (this.head > this.data.length - 1) this.head = 0;
      return;
    }
    if (dir === 1) {
      this.tail--;
      if (this.tail < 0) this.tail = this.data.length - 1;
      this.head--;
      if (this.head < 0) this.head = this.data.length - 1;
      return;
    }
    return;
  }
}
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const gear = new Array(4);

for (let i = 0; i < 4; i++) {
  const q = new RotateQueue();
  input[i]
    .trim()
    .split("")
    .map((v) => +v)
    .forEach((v) => {
      q.push(v);
    });
  gear[i] = q;
}
const K = +input[4];
const rotateInfo = [];
for (let i = 0; i < K; i++) {
  rotateInfo.push(input[5 + i].split(" ").map((v) => +v));
}
const rotateWheel = (idx, dir) => {
  const right = propagateRight(idx, dir);
  const left = propagateLeft(idx, dir);
  gear[idx].rotate(dir);

  for (let i = 0; i < right.length; i++) {
    gear[idx + 1 + i].rotate(right[i]);
  }
  for (let i = 0; i < left.length; i++) {
    gear[idx - (1 + i)].rotate(left[i]);
  }
};

const propagateRight = (idx, dir) => {
  const right = [];
  let flag = true;
  idx++;
  while (idx < 4) {
    if (!flag) break;

    if (gear[idx - 1].get(2) !== gear[idx].get(6)) {
      dir = -dir;
      right.push(dir);
      flag = true;
      idx++;
      continue;
    }
    flag = false;
    continue;
  }
  return right;
};

const propagateLeft = (idx, dir) => {
  const left = [];
  let flag = true;
  idx--;
  while (idx >= 0) {
    if (!flag) break;

    if (gear[idx + 1].get(6) !== gear[idx].get(2)) {
      dir = -dir;
      left.push(dir);
      flag = true;
      idx--;
      continue;
    }
    flag = false;
    continue;
  }
  return left;
};

const solution = () => {
  rotateInfo.forEach((info) => {
    const [idx, dir] = info;
    rotateWheel(idx - 1, dir);
  });

  let ans = 0;
  if (gear[0].peek() === 1) {
    ans += 1;
  }
  if (gear[1].peek() === 1) {
    ans += 2;
  }
  if (gear[2].peek() === 1) {
    ans += 4;
  }
  if (gear[3].peek() === 1) {
    ans += 8;
  }
  console.log(ans);
};

solution();
