const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = +inputs[0];
const innings = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));
//console.log(N, innings);

const M = 9;

const hitBall = (type, base) => {
  let score = 0;
  switch (type) {
    case 1:
      score += base[2];
      base[2] = base[1];
      base[1] = base[0];
      base[0] = 1;
      break;
    case 2:
      score += base[2] + base[1];
      base[2] = base[0];
      base[1] = 1;
      base[0] = 0;
      break;
    case 3:
      score += base[2] + base[1] + base[0];
      base[2] = 1;
      base[1] = 0;
      base[0] = 0;
      break;
    case 4:
      score += base[2] + base[1] + base[0] + 1;
      base[2] = base[1] = base[0] = 0;
      break;
    default:
      break;
  }
  return score;
};

const getInningResult = (num, start, batter) => {
  const base = new Array(3).fill(0);
  let outCount = 0;
  let score = 0;

  while (outCount < 3) {
    const seq = batter[start];
    const type = innings[num][seq];
    if (type === 0) {
      outCount++;
      start++;
      if (start > M - 1) {
        start = 0;
      }
      continue;
    }
    score += hitBall(type, base);
    start++;
    if (start > M - 1) {
      start = 0;
    }
  }

  return [start, score];
};

const getResult = (batter) => {
  let start = 0;
  let res = 0;
  for (let i = 0; i < N; i++) {
    const [sIdx, score] = getInningResult(i, start, batter);
    res += score;
    start = sIdx;
  }
  return res;
};

const visited = new Array(M - 1).fill(false);
const batterSeq = [];
let ans = 0;
const dfs = (depth) => {
  if (depth === M) {
    // getResult(batterSeq);
    // console.log(batterSeq);
    ans = Math.max(ans, getResult(batterSeq));
    return;
  }

  if (depth === 3) {
    batterSeq.push(0);
    dfs(depth + 1);
    batterSeq.pop();
    return;
  }

  for (let i = 1; i <= M - 1; i++) {
    if (!visited[i]) {
      visited[i] = true;
      batterSeq.push(i);
      dfs(depth + 1);
      batterSeq.pop();
      visited[i] = false;
    }
  }
};
dfs(0);
console.log(ans);
