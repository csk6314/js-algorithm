const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const input = fs.readFileSync(filePath).toString().trim().split("\n");

const [N, M] = input[0]
  .trim()
  .split(" ")
  .map((v) => +v);

const Tk = input.slice(1).map((v) => +v);
//console.log(N, M, Tk);

const init = () => {
  let high = BigInt(Math.min(...Tk) * M);
  let low = BigInt(0);

  while (high > low + 1n) {
    const mid = (high + low) / 2n;

    if (check(mid)) {
      high = mid;
    } else {
      low = mid;
    }
    // console.log(mid, high, low);
  }

  console.log(high.toString());
};

const check = (time) => {
  const sum = Tk.reduce((cur, acc) => {
    return cur + time / BigInt(acc);
  }, 0n);
  if (sum >= BigInt(M)) {
    return true;
  }
  return false;
};

init();
