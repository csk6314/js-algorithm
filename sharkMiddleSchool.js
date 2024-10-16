"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const [N, M] = input[0].split(" ").map((v) => +v);

const map = input.slice(1).map((row) => row.split(" ").map((v) => +v));
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
let answer = 0;

class Queue {
  constructor() {
    this.data = [];
    this.head = 0;
    this.tail = 0;
  }

  push(value) {
    this.data[this.tail++] = value;
  }

  shift() {
    const removed = this.data[this.head++];
    return removed;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  asArray() {
    return this.data;
  }
}

const visited = Array.from({ length: N }, () => new Array(N).fill(false));

const findBlocks = () => {
  const blocks = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (map[i][j] > 0 && !visited[i][j]) {
        const block = getBlock(i, j, map[i][j]);
        if (block[1].size >= 2) {
          blocks.push(block);
        }
      }
    }
  }
  return blocks;
};

const getBlock = (y, x, type) => {
  const state = {
    size: 1,
    rainbow: 0,
  };

  const q = new Queue();
  const rainbow = [];
  q.push([y, x]);
  visited[y][x] = true;
  while (!q.isEmpty()) {
    const [y, x] = q.shift();
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];

      if (!validatePos(ny, nx)) continue;
      if (visited[ny][nx]) continue;
      if (map[ny][nx] === -1) continue;

      if (map[ny][nx] === type) {
        q.push([ny, nx]);
        visited[ny][nx] = true;
        state.size += 1;
        continue;
      }
      if (map[ny][nx] === 0) {
        q.push([ny, nx]);
        rainbow.push([ny, nx]);
        visited[ny][nx] = true;
        state.size += 1;
        state.rainbow += 1;
        continue;
      }
    }
  }

  rainbow.forEach((pos) => {
    const [y, x] = pos;
    visited[y][x] = false;
  });

  return [q.asArray(), state];
};

const getBiggestBlock = (blocks) => {
  blocks.sort((a, b) => {
    if (b[1].size === a[1].size) {
      if (b[1].rainbow === a[1].rainbow) {
        const aBlock = a[0][0];
        const bBlock = b[0][0];
        if (bBlock[0] === aBlock[0]) {
          return bBlock[1] - aBlock[1];
        }
        return bBlock[0] - aBlock[0];
      }
      return b[1].rainbow - a[1].rainbow;
    }
    return b[1].size - a[1].size;
  });
  return blocks[0];
};

const removeBlock = (block) => {
  block[0].forEach((pos) => {
    const [y, x] = pos;
    map[y][x] = null;
  });
  answer += block[1].size ** 2;
};

const applyGravity = () => {
  for (let i = 0; i < N; i++) {
    setColumnGravity(i);
  }
};

const setColumnGravity = (col) => {
  let moveTo = N - 1;
  for (let i = N - 1; i >= 0; i--) {
    if (map[i][col] === null) continue;
    if (map[i][col] === -1) {
      moveTo = i - 1;
      continue;
    }
    if (map[i][col] >= 0) {
      if (i === moveTo) {
        moveTo--;
        continue;
      }
      map[moveTo][col] = map[i][col];
      map[i][col] = null;
      moveTo--;
    }
  }
};

const rotateMap = () => {
  const rotatedMap = Array.from({ length: N }, (_, row) =>
    Array.from({ length: N }, (_, col) => map[col][N - (row + 1)])
  );
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      map[i][j] = rotatedMap[i][j];
    }
  }
};

const resetVisited = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      visited[i][j] = false;
    }
  }
};

const validatePos = (y, x) => !(y < 0 || y >= N || x < 0 || x >= N);

const solution = () => {
  let blocks = findBlocks();
  while (blocks.length > 0) {
    //console.log(blocks.join("\n"));
    const bigBlock = getBiggestBlock(blocks);
    removeBlock(bigBlock);
    applyGravity();
    rotateMap();
    applyGravity();
    resetVisited();
    blocks = findBlocks();
  }

  console.log(answer);
};

solution();
