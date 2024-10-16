const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const [N, r, c] = fs
  .readFileSync(filePath)
  .toString()
  .split(" ")
  .map((v) => +v);

let cnt = 0;

const recur = (r, c, size) => {
  //console.log(r, c, size);
  if (size === 0) {
    console.log(cnt);
    return;
  }
  const center = Math.pow(2, size - 1);
  if (r >= center) {
    if (c >= center) {
      cnt += Math.pow(center, 2) * 3;
      recur(r - center, c - center, size - 1);
      return;
    }
    cnt += Math.pow(center, 2) * 2;
    recur(r - center, c, size - 1);
    return;
  }
  if (r < center) {
    if (c >= center) {
      cnt += Math.pow(center, 2);
      recur(r, c - center, size - 1);
      return;
    }
    recur(r, c, size - 1);
  }
};

const solution = () => {
  recur(r, c, N);
};
solution();
