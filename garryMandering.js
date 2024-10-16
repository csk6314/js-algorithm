"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().split("\n");

const N = +input[0];
const population = input[1].split(" ").map((v) => +v);
const populationSum = population.reduce((acc, cur) => acc + cur, 0);
const adj = new Array(N);
for (let i = 0; i < N; i++) {
  const [n, ...k] = input[2 + i].split(" ").map((v) => +v - 1);
  adj[i] = k;
}

class Queue {
  constructor() {
    this.data = [];
    this.head = 0;
    this.tail = 0;
  }

  push(value) {
    this.data[this.tail++] = value;
  }

  shift() {
    const removed = this.data[this.head++];
    if (this.tail === this.head) {
      this.head = 0;
      this.tail = 0;
    }
    return removed;
  }

  isEmpty() {
    return this.head === this.tail;
  }
}
const visited = Array.from({ length: N }, () => false);
const team = [];

const halfDepth = Math.ceil(N / 2);
let ans = 100 * 10;
const combination = (cur, depth) => {
  if (depth > halfDepth || cur > N) {
    return;
  }
  if (cur !== 0) {
    const anotherTeam = [];
    for (let i = 0; i < N; i++) {
      if (!visited[i]) {
        anotherTeam.push(i);
      }
    }

    if (checkConnected(team) && checkConnected(anotherTeam)) {
      const teamPopulation = team.reduce(
        (acc, cur) => acc + population[cur],
        0
      );

      const another = populationSum - teamPopulation;
      ans = Math.min(ans, Math.abs(teamPopulation - another));
    }
  }
  for (let i = cur; i < N; i++) {
    if (!visited[i]) {
      team.push(i);
      visited[i] = true;
      combination(i + 1, depth + 1);
      visited[i] = false;
      team.pop();
    }
  }
};

const checkConnected = (team) => {
  const q = new Queue();
  const v = new Array(N).fill(true);
  for (let i = 0; i < team.length; i++) {
    v[team[i]] = false;
  }

  q.push(team[0]);
  v[team[0]] = true;
  while (!q.isEmpty()) {
    const node = q.shift();
    // console.log(team);
    // console.log("NODE", node);
    for (const edges of adj[node]) {
      if (!v[edges]) {
        v[edges] = true;
        q.push(edges);
      }
    }
  }

  for (let i = 0; i < team.length; i++) {
    if (!v[team[i]]) {
      return false;
    }
  }

  return true;
};

const solution = () => {
  combination(0, 0);
  if (ans === 10 * 100) {
    console.log(-1);
  } else {
    console.log(ans);
  }
};
solution();
