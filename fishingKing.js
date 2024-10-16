"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().trim().split("\n");
const [R, C, M] = inputs[0].split(" ").map((v) => +v);
let sharkInfo = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));
const move = (idx) => {
  const [r, c, s, dir] = sharkInfo[idx];

  //up down
  if (dir < 3) {
    let nr = r;
    let cnt = s % ((R - 1) * 2);
    let go = dir === 1 ? -1 : 1;
    while (cnt > 0) {
      if (nr + go > R || nr + go < 1) {
        go = -go;
      }
      nr += go;
      cnt--;
    }
    sharkInfo[idx][0] = nr;
    sharkInfo[idx][3] = go === -1 ? 1 : 2;
    return;
  }

  if (dir >= 3) {
    let nc = c;
    let cnt = s % ((C - 1) * 2);
    let go = dir === 3 ? 1 : -1;
    while (cnt > 0) {
      if (nc + go > C || nc + go < 1) {
        go = -go;
      }
      nc += go;
      cnt--;
    }
    sharkInfo[idx][1] = nc;
    sharkInfo[idx][3] = go === -1 ? 4 : 3;
    return;
  }
};

const moveShark = () => {
  const newSharkInfo = [];
  const oceon = Array.from({ length: R + 1 }, () => new Array(C + 1));

  for (let i = 0; i < sharkInfo.length; i++) {
    move(i);
    const [r, c, _, __, size] = sharkInfo[i];
    if (oceon[r][c] === undefined) {
      oceon[r][c] = i;
      continue;
    }
    if (sharkInfo[oceon[r][c]][4] < size) {
      oceon[r][c] = i;
      continue;
    }
  }
  //console.log(oceon);
  for (let i = 1; i < R + 1; i++) {
    for (let j = 1; j < C + 1; j++) {
      if (oceon[i][j] !== undefined) {
        newSharkInfo.push(sharkInfo[oceon[i][j]]);
      }
    }
  }
  //console.log(newSharkInfo);
  return newSharkInfo;
};

let current = 1;
let ans = 0;
const catchShark = () => {
  let closest = -1;
  let closestRow = R + 1;
  for (let i = 0; i < sharkInfo.length; i++) {
    if (sharkInfo[i][1] === current) {
      if (closestRow > sharkInfo[i][0]) {
        closest = i;
        closestRow = sharkInfo[i][0];
      }
    }
  }

  if (closest > -1) {
    ans += sharkInfo[closest][4];
    sharkInfo.splice(closest, 1);
  }
};

const solution = () => {
  while (current <= C) {
    catchShark();
    sharkInfo = moveShark();
    current++;
  }
  console.log(ans);
};

solution();
