const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const N = +input[0];
const fishTank = input.slice(1).map((v) => v.split(" ").map((char) => +char));

let sharkPos = [0, 0];
let sharkSize = 2;
let exp = 0;

let remainPreys = [];

const dx = [-1, 0, 1, 0];
const dy = [0, -1, 0, 1];

let result = 0;

const solution = () => {
  sharkPos = initSharkPos();
  console.log(fishTank);

  findPreys();
  while (remainPreys.length > 0) {
    console.log(remainPreys);
    eatPrey();
    findPreys();
  }
  console.log(result);
};

const initSharkPos = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (fishTank[i][j] === 9) {
        fishTank[i][j] = 0;
        return [i, j];
      }
    }
  }
  return [-1, -1];
};

const eatPrey = () => {
  const [y, x, moveNum] = remainPreys.shift();
  fishTank[y][x] = 0;
  exp++;
  result += moveNum;
  sharkPos = [y, x];
  remainPreys = [];

  if (exp === sharkSize) {
    exp = 0;
    sharkSize++;
  }
};

const findPreys = () => {
  const q = [];
  const visited = Array.from({ length: N }, () => new Array(N).fill(false));
  q.push([...sharkPos, 0]);
  visited[sharkPos[0]][sharkPos[1]] = true;

  while (q.length !== 0) {
    const [y, x, moveNum] = q.shift();
    if (fishTank[y][x] > 0 && fishTank[y][x] < sharkSize) {
      remainPreys.push([y, x, moveNum]);
    }

    for (let i = 0; i < 4; i++) {
      const nx = x + dx[i];
      const ny = y + dy[i];
      // console.log(ny, nx);
      if (!isValidPos(ny, nx)) continue;
      if (fishTank[ny][nx] > sharkSize) continue;
      if (!visited[ny][nx]) {
        // console.log(ny, nx);
        q.push([ny, nx, moveNum + 1]);
        visited[ny][nx] = true;
      }
    }
  }

  remainPreys.sort((prey1, prey2) => {
    if (prey1[2] === prey2[2]) {
      if (prey1[0] === prey2[0]) return prey1[1] - prey2[1];
      return prey1[0] - prey2[0];
    }
    return prey1[2] - prey2[2];
  });
};

const isValidPos = (y, x) => {
  return y >= 0 && y < N && x >= 0 && x < N;
};

solution();
