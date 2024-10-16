const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = 10;
const MAX = 5;

const confettiNum = new Array(6).fill(0);

const bgPaper = Array.from({ length: inputs.length }, (_, idx) =>
  inputs[idx].split(" ").map((v) => +v)
);
let ans = MAX * MAX + 1;

const bt = (y, x) => {
  if (!checkConfettiNumber()) return;
  if (checkFin()) {
    const sum = confettiNum.reduce((acc, cur) => acc + cur, 0);
    // console.log(sum, !checkConfettiNumber(), checkFin());
    ans = Math.min(ans, sum);
    return;
  }

  const dx = x + 1 === N ? 0 : x + 1;
  const dy = x + 1 === N ? y + 1 : y;
  if (bgPaper[y][x] === 1) {
    for (let size = 1; size <= MAX; size++) {
      // console.log(!validate(y, x));
      if (!check(y, x, size)) continue;
      attach(y, x, size, 0);
      confettiNum[size] += 1;
      bt(dy, dx);
      confettiNum[size] -= 1;
      attach(y, x, size, 1);
    }
    return;
  }
  bt(dy, dx);
};

const check = (y, x, size) => {
  for (let i = y; i < y + size; i++) {
    for (let j = x; j < x + size; j++) {
      if (validate(i, j)) return false;
      if (bgPaper[i][j] === 0) return false;
    }
  }
  return true;
};

const checkConfettiNumber = () => {
  for (let i = 1; i <= 5; i++) {
    if (confettiNum[i] > MAX) {
      return false;
    }
  }

  return true;
};

const checkFin = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (bgPaper[i][j] === 1) {
        return false;
      }
    }
  }
  return true;
};

const validate = (y, x) => y < 0 || y >= N || x < 0 || x >= N;

const attach = (y, x, size, value) => {
  for (let i = y; i < y + size; i++) {
    for (let j = x; j < x + size; j++) {
      bgPaper[i][j] = value;
    }
  }
};

const solution = () => {
  bt(0, 0);
  console.log(ans === MAX * MAX + 1 ? -1 : ans);
};

solution();
