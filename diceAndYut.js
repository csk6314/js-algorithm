const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().trim().split("\n");

const diceNum = input[0].split(" ").map((v) => +v);

//console.log(diceNum);
const points = {
  start: {
    children: ["1"],
    score: 0,
  },
  end: {
    children: [],
    score: 0,
  },
  21: { children: ["22"], score: 13 },
  22: { children: ["23"], score: 16 },
  23: { children: ["50"], score: 19 },
  31: { children: ["32"], score: 22 },
  32: { children: ["50"], score: 24 },
  41: { children: ["42"], score: 28 },
  42: { children: ["43"], score: 27 },
  43: { children: ["50"], score: 26 },
  50: { children: ["51"], score: 25 },
  51: { children: ["52"], score: 30 },
  52: { children: ["20"], score: 35 },
};

for (let i = 1; i <= 20; i++) {
  if (i === 20) {
    points[i] = {
      children: ["end"],
      score: i * 2,
    };
    continue;
  }
  points[i] = {
    children: [`${i + 1}`],
    score: i * 2,
  };
}

points[5].children.push("21");
points[10].children.push("31");
points[15].children.push("41");

//console.log(points);

let answer = -1;

const init = () => {
  const horse = Array.from({ length: 4 }, (v) => "start");
  dfs(horse, 0, 0);
  console.log(answer);
};

const move = (start, num) => {
  const isBlue = points[start].children.length > 1 ? true : false;

  if (isBlue) {
    start = points[start].children[1];
    num--;
  }

  while (num > 0 && points[start].children.length > 0) {
    start = points[start].children[0];
    num--;
  }

  return start;
};

const validateHorse = (horse, horseNum) => {
  if (horse[horseNum] === "end") return true;

  for (let i = 0; i < 4; i++) {
    if (i === horseNum) continue;
    if (horse[i] === horse[horseNum]) {
      return false;
    }
  }

  return true;
};

const dfs = (horse, idx, sum) => {
  if (idx === 10) {
    answer = Math.max(sum, answer);
    return;
  }
  for (let i = 0; i < 4; i++) {
    if (horse[i] === "end") continue;

    const temp = horse[i];
    horse[i] = move(horse[i], diceNum[idx]);

    if (validateHorse(horse, i)) {
      dfs(horse, idx + 1, sum + points[horse[i]].score);
    }

    horse[i] = temp;
  }
};

init();
