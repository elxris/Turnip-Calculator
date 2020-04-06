const ProgressBar = require("progress");
const { yieldCalculate } = require("./calculator");

const bar = new ProgressBar("[:bar] :percent :elapseds/:etas :rate", {
  total: 0xffffffff,
  renderThrottle: 100,
});
const calculator = yieldCalculate([110, 56, 88]);

let result = calculator.next();

while (!result.done && !result.value[1]) {
  result = calculator.next();
  bar.tick();
}

console.log(result.value[3].join());
