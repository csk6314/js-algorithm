const fs = require("fs");
const filePath = process.platform === "linux" ? "dev/stdin" : "input.txt";
const inputs = fs.readFileSync(filePath).toString().split("\n");

const N = +inputs[0];
const exp = inputs[1];

let ans = Number.MIN_SAFE_INTEGER;

const convertOperator = (op1, op2, op3) => {
  if (op3 === "+") {
    return op1 + op2;
  }
  if (op3 === "-") {
    return op1 - op2;
  }
  if (op3 === "*") {
    return op1 * op2;
  }
};

const operand = [];
const operator = [];

for (let i = 0; i < exp.length; i++) {
  if (i % 2 === 0) {
    operand.push(+exp.charAt(i));
    continue;
  }
  operator.push(exp.charAt(i));
}

const dfs = (res, idx) => {
  if (idx === operand.length - 1) {
    ans = Math.max(res, ans);
    return;
  }

  if (idx + 2 < operand.length) {
    const parseVal = convertOperator(
      operand[idx + 1],
      operand[idx + 2],
      operator[idx + 1]
    );

    dfs(convertOperator(res, parseVal, operator[idx]), idx + 2);
  }

  dfs(convertOperator(res, operand[idx + 1], operator[idx]), idx + 1);
};

dfs(operand[0], 0);
console.log(ans);
// const K = operand.length;
// const poss = [];
// let ans = Number.MIN_SAFE_INTEGER;

// const calc = (poss) => {
//   const newOperands = [];
//   const newOperator = [];
//   let possIdx = 0;
//   //console.log(poss);
//   for (let i = 0; i < operand.length; i++) {
//     newOperands.push(operand[i]);
//     if (i > 0) {
//       newOperator.push(operator[i - 1]);
//       if (poss[possIdx] === i - 1) {
//         const op1 = newOperands.pop();
//         const op2 = newOperands.pop();
//         const op3 = newOperator.pop();
//         newOperands.push(convertOperator(op2, op1, op3));
//         possIdx++;
//       }
//     }
//   }
//   let res = 0;
//   for (let i = 0; i < newOperator.length; i++) {
//     if (i === 0) {
//       res = convertOperator(newOperands[i], newOperands[i + 1], newOperator[i]);
//       continue;
//     }

//     res = convertOperator(res, newOperands[i + 1], newOperator[i]);
//   }

//   if (newOperands.length > 0 && newOperator.length < 1) {
//     res = newOperands[0];
//   }

//   //   console.log(newOperands, newOperator);
//   //   console.log(res);

//   ans = Math.max(ans, res);
//   // console.log(res);
// };

// const convertOperator = (op1, op2, op3) => {
//   if (op3 === "+") {
//     return op1 + op2;
//   }
//   if (op3 === "-") {
//     return op1 - op2;
//   }
//   if (op3 === "*") {
//     return op1 * op2;
//   }
// };

// const comb = (cur, depth) => {
//   if (K < cur) {
//     return;
//   }

//   calc(poss);
//   for (let i = cur; i < K; i++) {
//     poss.push(i);
//     comb(i + 2, depth + 1);
//     poss.pop();
//   }
// };

// const solution = () => {
//   comb(0, 0);
//   console.log(ans);
// };
// solution();
