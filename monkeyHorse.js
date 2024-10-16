"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const K = +inputs[0];
const [W, H] = inputs[1]
  .trim()
  .split(" ")
  .map((v) => +v);
const map = inputs.slice(2).map((row) =>
  row
    .trim()
    .split(" ")
    .map((v) => +v)
);

//console.log(K, W, H, map);

const dx = [1, 0, -1, 0, 2, 2, 1, 1, -1, -1, -2, -2];
const dy = [0, 1, 0, -1, 1, -1, 2, -2, 2, -2, 1, -1];

class Queue {
  constructor() {
    this.data = [];
    this.head = 0;
    this.tail = 0;
  }

  push(value) {
    this.data[this.tail] = value;
    this.tail++;
  }

  pop() {
    const value = this.data[this.head];
    this.head++;
    if (this.head === this.tail) {
      this.head = 0;
      this.tail = 0;
    }
    return value;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  size() {
    return this.tail - this.head;
  }
}

const visited = Array.from({ length: H }, (v) =>
  Array.from({ length: W }, (v) => new Array(K + 1).fill(false))
);
let res = -1;
//console.log(visited);

const bfs = (startPos) => {
  const q = new Queue();
  q.push([...startPos, 0, 0]);
  visited[startPos[0]][startPos[1]] = new Array(K + 1).fill(true);
  while (!q.isEmpty()) {
    const [y, x, move, horseMove] = q.pop();
    if (y === H - 1 && x === W - 1) {
      res = move;
      return;
    }
    for (let i = 0; i < 12; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (i > 3 && horseMove === K) break;
      if (!validatePos(ny, nx)) continue;

      if (i > 3 && map[ny][nx] === 0 && !visited[ny][nx][horseMove + 1]) {
        q.push([ny, nx, move + 1, horseMove + 1]);
        visited[ny][nx][horseMove + 1] = true;
        continue;
      }
      if (i < 4 && map[ny][nx] === 0 && !visited[ny][nx][horseMove]) {
        q.push([ny, nx, move + 1, horseMove]);
        visited[ny][nx][horseMove] = true;
      }
    }
  }
};

const validatePos = (y, x) => !(y < 0 || y >= H || x < 0 || x >= W);

const solution = () => {
  bfs([0, 0]);
  console.log(res);
};

solution();
