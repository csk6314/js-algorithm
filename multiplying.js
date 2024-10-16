"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const [A, B, C] = fs
  .readFileSync(filePath)
  .toString()
  .split(" ")
  .map((v) => +v);

const map = new Map();

const getMaxBin = (v) => {
  let max = 1;
  while (max * 2 <= v) {
    max *= 2;
  }
  return max;
};
const mult = (rpt) => {
  //console.log(rpt);
  if (map.has(rpt)) return map.get(rpt);

  const max = getMaxBin(rpt);
  //console.log(max);
  if (max === rpt) {
    const res =
      BigInt(mult(max / 2) % BigInt(C)) * BigInt(mult(max / 2) % BigInt(C));
    map.set(rpt, res);
    return res;
  }
  const res =
    BigInt(mult(rpt - max) % BigInt(C)) * BigInt(mult(max) % BigInt(C));
  map.set(rpt, res);
  return res;
};
const solution = () => {
  map.set(1, BigInt(A % C));
  console.log((mult(B) % BigInt(C)).toString());
};

solution();
