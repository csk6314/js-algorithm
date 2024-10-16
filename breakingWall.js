"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const [N, M] = inputs[0].split(" ").map((v) => +v);
const map = inputs.slice(1).map((row) =>
  row
    .trim()
    .split("")
    .map((v) => +v)
);

class Queue {
  constructor() {
    this.data = [];
    this.head = 0;
    this.tail = 0;
  }

  push(item) {
    this.data[this.tail++] = item;
  }

  shift() {
    const removed = this.data[this.head];
    this.head++;
    return removed;
  }

  front() {
    return this.data[this.head];
  }

  rear() {
    return this.data[this.tail - 1];
  }

  isEmpty() {
    return this.head === this.tail;
  }

  size() {
    return Math.abs(this.head - this.tail);
  }
}

const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

const visited = Array.from({ length: N }, (v) =>
  Array.from({ length: M }, (_) => new Array(2).fill(false))
);

let res = 1000 * 1000;
let cnt = 0;
const bfs = (startPos) => {
  const q = new Queue();
  visited[startPos[0]][startPos[1]][0] = true;
  visited[startPos[0]][startPos[1]][1] = true;
  q.push([...startPos, 1, false]);

  while (!q.isEmpty()) {
    cnt++;
    const [qy, qx, move, flag] = q.shift();
    // console.log(qy, qx, move, flag);
    if (qy === N - 1 && qx === M - 1) {
      res = Math.min(res, move);
      return;
    }
    for (let i = 0; i < 4; i++) {
      const ny = qy + dy[i];
      const nx = qx + dx[i];
      if (!validatePos(ny, nx)) continue;
      if (map[ny][nx] === 1 && !visited[ny][nx][1] && !flag) {
        visited[ny][nx][1] = true;
        q.push([ny, nx, move + 1, true]);
        continue;
      }
      const flagNum = flag ? 1 : 0;
      if (map[ny][nx] === 0 && !visited[ny][nx][flagNum]) {
        visited[ny][nx][flagNum] = true;
        q.push([ny, nx, move + 1, flag]);
      }
    }
  }
};

const validatePos = (y, x) => !(y < 0 || y >= N || x < 0 || x >= M);

const solution = () => {
  bfs([0, 0]);
  //   console.log(
  //     visited.map((row) => row.map((v) => v.join(" ")).join(" , ")).join("\n")
  //   );
  console.log(res === 1000 * 1000 ? -1 : res);
  console.log(cnt);
};
solution();
