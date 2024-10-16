const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = 9;
const board = inputs.map((input) => input.split(" ").map((v) => +v));
let result;

const getSection = (y, x) => {
  const col = Math.floor(x / 3);
  const row = Math.floor(y / 3);

  return row * 3 + (col + 1);
};

const possibleNum = (y, x) => {
  const possRow = new Set(possibleRow(y));
  const possCol = new Set(possibleCol(x));
  const possSec = new Set(possibleSec(getSection(y, x)));

  const result = [...possRow]
    .filter((v) => possCol.has(v))
    .filter((v) => possSec.has(v));
  return result;
};

const checkRow = (y, value) => {
  for (let i = 0; i < N; i++) {
    if (board[y][i] === value) return false;
  }
  return true;
};

const checkCol = (x, value) => {
  for (let i = 0; i < N; i++) {
    if (board[i][x] === value) return false;
  }
  return true;
};

const checkSec = (sec, value) => {
  const row = Math.floor((sec - 1) / 3);
  const col = (sec - 1) % 3;
  const num = new Array(10).fill(false);
  for (let i = row * 3; i < (row + 1) * 3; i++) {
    for (let j = col * 3; j < (col + 1) * 3; j++) {
      if (board[i][j] === value) return false;
    }
  }

  return true;
};

const bt = (idx, pos) => {
  if (idx === pos.length) {
    result = board.map((v) => [...v]);
    // console.log(result);
    return;
  }
  if (result) return;
  const [y, x] = pos[idx];
  //console.log(idx, pos.length);
  for (let i = 1; i <= 9; i++) {
    if (!checkRow(y, i) || !checkCol(x, i) || !checkSec(getSection(y, x), i))
      continue;
    board[y][x] = i;
    bt(idx + 1, pos);
    board[y][x] = 0;
  }
};
const solution = () => {
  const pos = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === 0) {
        pos.push([i, j]);
      }
    }
  }
  //console.log(pos);
  bt(0, pos);
  console.log(result.map((row) => row.join(" ")).join("\n"));
  //printResult();
};

solution();
