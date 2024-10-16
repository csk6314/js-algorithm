"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const [N, M, F] = inputs[0].split(" ").map((v) => +v);
const map = inputs.slice(1, 1 + N).map((row) => row.split(" ").map((v) => +v));
let startPos = inputs[1 + N].split(" ").map((v) => +(v - 1));
const passengers = inputs
  .slice(2 + N)
  .map((row) => row.split(" ").map((v) => +(v - 1)));

passengers.forEach((passenger, idx) => {
  const [py, px, ey, ex] = passenger;
  map[py][px] = 2 + idx;
});

const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];

class Queue {
  constructor() {
    this.head = 0;
    this.tail = 0;
    this.data = [];
  }

  push(value) {
    this.data[this.tail++] = value;
  }

  poll() {
    const removed = this.data[this.head++];
    if (this.head === this.tail) {
      this.head = 0;
      this.tail = 0;
    }
    return removed;
  }

  isEmpty() {
    return this.head === this.tail;
  }
}

const validatePos = (y, x) => !(y < 0 || y >= N || x < 0 || x >= N);

const bfs = (start, fuel) => {
  const q = new Queue();
  const visited = Array.from({ length: N }, () => new Array(N).fill(false));
  const p = [];
  let minFuel = N * N;

  q.push([...start, 0]);
  visited[start[0]][start[1]] = true;

  while (!q.isEmpty()) {
    const [y, x, f] = q.poll();

    if (f > fuel || f > minFuel) continue;
    if (map[y][x] >= 2) {
      minFuel = f;
      p.push([y, x, f]);
      continue;
    }

    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];

      if (!validatePos(ny, nx)) continue;
      if (visited[ny][nx]) continue;
      if (map[ny][nx] === 1) continue;

      q.push([ny, nx, f + 1]);
      visited[ny][nx] = true;
    }
  }

  if (p.length < 1) return null;
  p.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1];
    }
    return a[0] - b[0];
  });
  return p[0];
};

const nextPassenger = (fuel) => {
  const [y, x] = startPos;

  if (map[y][x] === 1) {
    return [y, x, 0];
  }

  return bfs(startPos, fuel);
};

const takeToDestintaion = (passenger, fuel) => {
  const [y, x, ey, ex] = passenger;
  const q = new Queue();
  const visited = Array.from({ length: N }, () => new Array(N).fill(false));
  q.push([y, x, 0]);
  visited[y][x] = true;
  while (!q.isEmpty()) {
    const [y, x, f] = q.poll();
    // console.log(ey, ex);
    if (f > fuel) continue;
    if (y === ey && x === ex) {
      return f;
    }

    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];

      if (!validatePos(ny, nx)) continue;
      if (visited[ny][nx]) continue;
      if (map[ny][nx] === 1) continue;

      q.push([ny, nx, f + 1]);
      visited[ny][nx] = true;
    }
  }
  return null;
};

const solution = () => {
  let fuel = F;
  let cnt = 0;
  while (cnt < M) {
    const p = nextPassenger(fuel);
    if (!p) return -1;
    const pIndex = map[p[0]][p[1]] - 2;
    const passenger = passengers[pIndex];
    fuel -= p[2];
    const cost = takeToDestintaion(passenger, fuel);
    if (!cost) return -1;
    fuel += cost;
    startPos = [passenger[2], passenger[3]];
    map[passenger[0]][passenger[1]] = 0;
    cnt++;
  }
  return fuel;
};
console.log(solution());
