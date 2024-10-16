const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const DIRECTION = [
  null,
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
];

const N = 4;

const fishTank = input.map((row) => {
  const rowValue = row.split(" ").map((v) => +v);
  const arr = Array.from({ length: rowValue.length / 2 }, (_, idx) => [
    rowValue[idx * 2],
    rowValue[idx * 2 + 1],
  ]);
  return arr;
});

const fish = new Array(N * N + 1);
let sharkPos;
let sharkDir;
let ans = 0;
let initAns = 0;

const solution = () => {
  initShark();
  initFish();
  backTracking(0);
  console.log(ans + initAns);
};

const backTracking = (sum) => {
  //console.log(sum);
  fishTurn();

  const preys = findPreys();

  if (preys.length === 0) {
    ans = Math.max(ans, sum);
    return;
  }

  for (const preyNum of preys) {
    if (!fish[preyNum]) continue;
    const [fy, fx, dir] = fish[preyNum];
    const tmpSharkPos = [...sharkPos];
    const tmpSharkDir = sharkDir;
    const tmpfishTank = createTempTank();
    const tmpFish = fish.map((v) => (v ? [...v] : null));

    sharkPos = [fy, fx];
    sharkDir = dir;
    fishTank[fy][fx] = null;
    fish[preyNum] = null;
    //   console.log(fish);
    //  console.log(sum, preyNum, sharkPos, sharkDir);

    backTracking(sum + preyNum);

    sharkPos = tmpSharkPos;
    sharkDir = tmpSharkDir;
    resetFishTank(tmpfishTank);
    resetFish(tmpFish);
  }
};

const initShark = () => {
  initAns += fishTank[0][0][0];
  sharkDir = fishTank[0][0][1];
  sharkPos = [0, 0];
  fishTank[0][0] = null;
};

const initFish = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!fishTank[i][j]) continue;
      const [num, dir] = fishTank[i][j];
      fish[num] = [i, j, dir];
    }
  }
};

const fishTurn = () => {
  for (let i = 1; i <= 16; i++) {
    if (!fish[i]) continue;
    let [y, x, dir] = fish[i];
    let ny = y + DIRECTION[dir][0];
    let nx = x + DIRECTION[dir][1];

    let count = 0;
    while (!validPos(ny, nx) && count < 8) {
      dir = rotateDir(dir);
      count++;
      ny = y + DIRECTION[dir][0];
      nx = x + DIRECTION[dir][1];
    }

    if (count >= 8) continue;

    if (fishTank[ny][nx]) {
      const tempFish = fishTank[ny][nx];
      fishTank[ny][nx] = [i, dir];
      fishTank[y][x] = tempFish;
      fish[tempFish[0]] = [y, x, tempFish[1]];
      fish[i] = [ny, nx, dir];
      continue;
    }

    fishTank[y][x] = null;
    fishTank[ny][nx] = [i, dir];
    fish[i] = [ny, nx, dir];
  }
};

const findPreys = () => {
  const preys = [];
  const [y, x] = sharkPos;
  let ny = y + DIRECTION[sharkDir][0];
  let nx = x + DIRECTION[sharkDir][1];

  while (validPos(ny, nx)) {
    if (fishTank[ny][nx]) {
      preys.push(fishTank[ny][nx][0]);
    }
    ny = ny + DIRECTION[sharkDir][0];
    nx = nx + DIRECTION[sharkDir][1];
  }

  // console.log(preys);
  return preys;
};

const validPos = (ny, nx) => {
  if (sharkPos[0] === ny && sharkPos[1] === nx) return false;
  if (ny < 0 || ny >= N || nx < 0 || nx >= N) return false;
  return true;
};

const rotateDir = (dir) => (dir + 1 > 8 ? 1 : dir + 1);

const resetFishTank = (tmp) => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      fishTank[i][j] = tmp[i][j];
    }
  }
};

const resetFish = (tmp) => {
  for (let i = 0; i < tmp.length; i++) {
    fish[i] = tmp[i];
  }
};

const createTempTank = () => {
  const tmp = Array.from({ length: 4 }, (v) => new Array(4));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!fishTank[i][j]) {
        fishTank[i][j] = null;
        continue;
      }
      tmp[i][j] = [fishTank[i][j][0], fishTank[i][j][1]];
    }
  }
  return tmp;
};

solution();
