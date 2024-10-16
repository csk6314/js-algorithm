"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");
const [N, M] = inputs[0].split(" ").map((v) => +v);
let office = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));
//console.log(N, M, office);

const cameras = [];

for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (office[i][j] > 0 && office[i][j] < 6) {
      cameras.push([i, j, office[i][j] - 1]);
    }
  }
}

const cameraDir = [
  [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
  ],
  [
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
  ],
  [
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
  ],
  [[1, 1, 1, 1]],
];

const validatePos = (y, x) => !(y < 0 || y >= N || x < 0 || x >= M);

const setObserved = (y, x, dir) => {
  switch (dir) {
    case 0:
      x++;
      while (validatePos(y, x) && office[y][x] !== 6) {
        if (office[y][x] === 0) {
          office[y][x] = -1;
        }
        x++;
      }
      break;
    case 1:
      y++;
      while (validatePos(y, x) && office[y][x] !== 6) {
        if (office[y][x] === 0) {
          office[y][x] = -1;
        }
        y++;
      }
      break;
    case 2:
      x--;
      while (validatePos(y, x) && office[y][x] !== 6) {
        if (office[y][x] === 0) {
          office[y][x] = -1;
        }
        x--;
      }
      break;
    case 3:
      y--;
      while (validatePos(y, x) && office[y][x] !== 6) {
        if (office[y][x] === 0) {
          office[y][x] = -1;
        }
        y--;
      }
      break;

    default:
      break;
  }
};

const getZeros = () => {
  let cnt = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (office[i][j] === 0) {
        cnt++;
      }
    }
  }
  return cnt;
};

let ans = 8 * 8;
const backTracking = (dep) => {
  if (dep === cameras.length) {
    ans = Math.min(ans, getZeros());
    return;
  }

  const [y, x, n] = cameras[dep];

  for (let i = 0; i < cameraDir[n].length; i++) {
    const dirs = cameraDir[n][i];
    const copyOffice = office.map((row) => [...row]);
    for (let j = 0; j < dirs.length; j++) {
      if (dirs[j] === 1) {
        setObserved(y, x, j);
      }
    }
    backTracking(dep + 1);
    office = copyOffice;
  }
};

const solution = () => {
  backTracking(0);
  console.log(ans);
};
solution();
