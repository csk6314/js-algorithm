"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const [N, M, D] = inputs[0].split(" ").map((v) => +v);
let map = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));

const dx = [-1, 0, 1, 0];
const dy = [0, -1, 0, 1];

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

const enemyMove = () => {
  const canMove = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (map[i][j] === 1) {
        //go down
        if (i + 1 < N) {
          map[i][j] = 0;
          canMove.push([i, j]);
          continue;
        }
        //out of game
        map[i][j] = 0;
      }
    }
  }
  canMove.forEach((ene) => {
    const [y, x] = ene;
    map[y + 1][x] = 1;
  });
};

const validatePos = (y, x) => !(y < 0 || y >= N || x < 0 || x >= M);

const bfs = (start) => {
  const visited = Array.from({ length: N }, () => new Array(M).fill(false));
  const q = new Queue();
  const cand = [];
  q.push([...start, 0]);
  while (!q.isEmpty()) {
    const [y, x, d] = q.poll();
    if (d > D) continue;
    //console.log(map[y][x]);
    if (map[y][x] === 1) {
      //console.log(y, x);
      cand.push([y, x, d]);
      continue;
    }
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];

      if (!validatePos(ny, nx)) continue;
      if (visited[ny][nx]) continue;

      q.push([ny, nx, d + 1]);
      visited[ny][nx] = true;
    }
  }
  // console.log(cand);
  if (cand.length < 1) return null;
  cand.sort((a, b) => {
    if (a[2] === b[2]) {
      return a[1] - b[1];
    }
    return a[2] - b[2];
  });

  return cand[0];
};

const findEnemy = () => {
  const zombies = [];
  for (let i = 0; i < M; i++) {
    if (map[N][i] === 2) {
      const zombie = bfs([N, i]);
      if (zombie) {
        zombies.push(zombie);
      }
    }
  }
  return zombies;
};

const killEnemy = (zombies) => {
  let kills = 0;
  zombies.forEach((zombie) => {
    const [y, x] = zombie;
    if (map[y][x] === 1) {
      map[y][x] = 0;
      kills++;
    }
  });
  return kills;
};

const checkZombies = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (map[i][j] === 1) {
        return true;
      }
    }
  }
  return false;
};

const play = () => {
  let kills = 0;
  while (checkZombies()) {
    const zombies = findEnemy();
    //  console.log(map);
    kills += killEnemy(zombies);
    enemyMove();
  }
  return kills;
};

let answer = 0;

const placeArcher = (cnt, last, archers) => {
  if (cnt === 3) {
    const tmpMap = map.map((row) => [...row]);
    map.push(archers);
    answer = Math.max(answer, play());
    map = tmpMap;
  }

  for (let i = last; i < M; i++) {
    if (archers[i] === 0) {
      archers[i] = 2;
      placeArcher(cnt + 1, i, archers);
      archers[i] = 0;
    }
  }
};

const solution = () => {
  const archers = new Array(M).fill(0);
  placeArcher(0, 0, archers);
  console.log(answer);
};

solution();
