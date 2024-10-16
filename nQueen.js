const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const N = +fs.readFileSync(filePath).toString().trim();
//console.log(N);

let usedCol = new Array(N).fill(false);
let usedDiagRight = new Array(2 * N - 1).fill(false);
let usedDiagLeft = new Array(2 * N - 1).fill(false);
let cnt = 0;

const dfs = (row) => {
  //console.log(rowQueen);
  if (row === N) {
    cnt++;
    return;
  }

  for (let i = 0; i < N; i++) {
    if (
      !usedCol[i] &&
      !usedDiagRight[i + row] &&
      !usedDiagLeft[N + row - (i + 1)]
    ) {
      usedCol[i] = true;
      usedDiagRight[i + row] = true;
      usedDiagLeft[N + row - (i + 1)] = true;
      dfs(row + 1);
      usedCol[i] = false;
      usedDiagRight[i + row] = false;
      usedDiagLeft[N + row - (i + 1)] = false;
    }
  }
};

const solution = () => {
  dfs(0);
  console.log(cnt);
  //console.log(board.map((row) => row.join("\t")).join("\n"));
};
solution();
