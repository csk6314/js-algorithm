"use strict";
const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = +inputs[0];
let board = inputs.slice(1).map((row) => row.split(" ").map((v) => +v));

//console.log(N, board);

/**
 * 1. 합치고 (둘다 안합쳐진 상태.)
 * 2. 이동
 */

const combined = Array.from({ length: N }, () => new Array(N).fill(false));

const combine = (src, target) => {
  const [sy, sx] = src;
  const [ty, tx] = target;

  board[ty][tx] = board[ty][tx] * 2;
  board[sy][sx] = 0;
  combined[ty][tx] = true;
};

const validateCombine = (src, target) => {
  const [sy, sx] = src;
  const [ty, tx] = target;

  if (board[sy][sx] === 0 || board[ty][tx] === 0) return false;
  if (combined[sy][sx] || combined[ty][tx]) return false;

  if (board[sy][sx] === board[ty][tx]) {
    return true;
  }
  return false;
};

const combineAll = (dir) => {
  if (dir === 0) {
    for (let col = 0; col < N; col++) {
      for (let i = 0; i < N - 1; i++) {
        if (validateCombine([i + 1, col], [i, col])) {
          combine([i + 1, col], [i, col]);
        }
      }
    }
    return;
  }
  if (dir === 1) {
    for (let row = 0; row < N; row++) {
      for (let i = N - 1; i > 0; i--) {
        if (validateCombine([row, i - 1], [row, i])) {
          combine([row, i - 1], [row, i]);
        }
      }
    }
  }
  if (dir === 2) {
    for (let col = 0; col < N; col++) {
      for (let i = N - 1; i > 0; i--) {
        if (validateCombine([i - 1, col], [i, col])) {
          combine([i - 1, col], [i, col]);
        }
      }
    }
    return;
  }
  if (dir === 3) {
    for (let row = 0; row < N; row++) {
      for (let i = 0; i < N - 1; i++) {
        if (validateCombine([row, i + 1], [row, i])) {
          combine([row, i + 1], [row, i]);
        }
      }
    }
    return;
  }
};

const resetCombined = () => {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      combined[i][j] = false;
    }
  }
};

const swap = (pos1, pos2) => {
  const [y1, x1] = pos1;
  const [y2, x2] = pos2;
  const tmp = board[y1][x1];
  board[y1][x1] = board[y2][x2];
  board[y2][x2] = tmp;
};

const move = (dir) => {
  if (dir === 0) {
    for (let col = 0; col < N; col++) {
      let moveTop = 0;
      for (let i = 0; i < N; i++) {
        if (i === moveTop && board[i][col] !== 0) {
          moveTop++;
          continue;
        }
        if (board[i][col] === 0) {
          continue;
        }

        swap([i, col], [moveTop, col]);
        moveTop++;
      }
    }

    return;
  }

  if (dir === 1) {
    for (let row = 0; row < N; row++) {
      let moveRight = N - 1;
      for (let i = N - 1; i >= 0; i--) {
        if (i === moveRight && board[row][i] !== 0) {
          moveRight--;
          continue;
        }
        if (board[row][i] === 0) {
          continue;
        }

        swap([row, i], [row, moveRight]);
        moveRight--;
      }
    }

    return;
  }

  if (dir === 2) {
    for (let col = 0; col < N; col++) {
      let moveBottom = N - 1;
      for (let i = N - 1; i >= 0; i--) {
        if (i === moveBottom && board[i][col] !== 0) {
          moveBottom--;
          continue;
        }
        if (board[i][col] === 0) {
          continue;
        }

        swap([i, col], [moveBottom, col]);
        moveBottom--;
      }
    }

    return;
  }

  if (dir === 3) {
    for (let row = 0; row < N; row++) {
      let moveLeft = 0;
      for (let i = 0; i < N; i++) {
        if (i === moveLeft && board[row][i] !== 0) {
          moveLeft++;
          continue;
        }
        if (board[row][i] === 0) {
          continue;
        }

        swap([row, i], [row, moveLeft]);
        moveLeft++;
      }
    }

    return;
  }
};

let answer = 0;
const getMaxValue = () => {
  let max = 0;
  for (const row of board) {
    for (const v of row) {
      max = Math.max(v, max);
    }
  }
  return max;
};

const bt = (cnt) => {
  if (cnt === 5) {
    answer = Math.max(answer, getMaxValue());
    //    console.log(board);
    return;
  }

  for (let i = 0; i < 4; i++) {
    const tmp = board.map((row) => [...row]);
    move(i);
    combineAll(i);
    move(i);
    resetCombined();
    bt(cnt + 1);
    board = tmp;
  }
};

bt(0);
console.log(answer);
