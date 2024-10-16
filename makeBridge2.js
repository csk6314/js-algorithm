"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const [N, M] = input[0].split(" ").map((v) => +v);
const map = [];
for (let i = 1; i < 1 + N; i++) {
  map.push(input[i].split(" ").map((v) => +v));
}

const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

const visited = Array.from({ length: N }, (_) => new Array(M).fill(false));
const islands = [];
let islandIdx = -1;

const bridges = [];
const parent = [];
const edges = [];

const solution = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (!visited[i][j] && map[i][j] === 1) {
        islandIdx++;
        bfs(i, j);
      }
    }
  }

  const islandNum = islands.length;

  for (let i = 0; i < islandNum; i++) {
    for (let j = 0; j < islands[i].length; j++) {
      findBridge(islands[i][j][0], islands[i][j][1], i);
    }
  }

  bridges.sort((a, b) => a[2] - b[2]);

  for (let i = 0; i < islands.length; i++) {
    parent.push(i);
  }

  //console.log(bridges);

  kruskal();

  if (edges.length < parent.length - 1) {
    console.log(-1);
    return;
  }

  console.log(
    edges.length < 1
      ? -1
      : edges.reduce((acc, cur) => {
          return acc + cur;
        }, 0)
  );
};

const kruskal = () => {
  while (edges.length < parent.length && bridges.length > 0) {
    const [src, target, size] = bridges.shift();
    if (findMom(src) === findMom(target)) continue;
    // console.log(src, target, size);
    union(src, target);
    edges.push(size);
  }
};

const union = (a, b) => {
  const root1 = findMom(a);
  const root2 = findMom(b);

  if (root1 === root2) return false;
  if (root1 > root2) {
    parent[root1] = root2;
  } else {
    parent[root2] = root1;
  }

  return true;
};

const findMom = (v) => {
  if (parent[v] === v) return v;
  return findMom(parent[v]);
};

const findBridge = (y, x, src) => {
  for (let i = 0; i < 4; i++) {
    let ny = y + dy[i];
    let nx = x + dx[i];

    if (!validPoint(ny, nx)) continue;
    if (map[ny][nx] === 0) {
      const [size, target] = canConnect(ny, nx, i);
      //console.log(size, target);
      if (size < 2) continue;
      bridges.push([src, target, size]);
    }
  }
};

const canConnect = (sy, sx, dir) => {
  let size = 0;
  while (map[sy][sx] === 0) {
    size++;
    sy += dy[dir];
    sx += dx[dir];
    if (!validPoint(sy, sx)) return [-1, 0];
  }

  return [size, getIslandIndex(sy, sx)];
};

const getIslandIndex = (y, x) => {
  for (let i = 0; i < islands.length; i++) {
    if (islands[i].findIndex(([iy, ix]) => iy === y && ix === x) > -1) {
      return i;
    }
  }
  return -1;
};

const bfs = (i, j) => {
  const q = [];
  q.push([i, j]);
  islands.push([[i, j]]);
  visited[i][j] = true;

  while (q.length !== 0) {
    const [y, x] = q.shift();

    for (let k = 0; k < 4; k++) {
      const ny = y + dy[k];
      const nx = x + dx[k];
      if (!validPoint(ny, nx)) continue;
      if (map[ny][nx] === 1 && !visited[ny][nx]) {
        q.push([ny, nx]);

        islands[islandIdx].push([ny, nx]);
        visited[ny][nx] = true;
      }
    }
  }
};

const validPoint = (y, x) => {
  return y >= 0 && y < N && x >= 0 && x < M;
};

solution();
