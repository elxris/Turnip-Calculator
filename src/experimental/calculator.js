const { UINT32, UINT64 } = require("cuint");
const { possiblePatterns, patternReducer } = require("./optimizer");

const initCalc = (arg, plus) =>
  UINT32(0x6c078965)
    .multiply(arg.clone().xor(arg.clone().shiftRight(30)))
    .add(UINT32(plus));

const initContext = (seed) => {
  const $c0 = initCalc(UINT32(seed), 1);
  const $c1 = initCalc($c0, 2);
  const $c2 = initCalc($c1, 3);
  const $c3 = initCalc($c2, 4);
  return [$c0, $c1, $c2, $c3];
};

const getUINT32 = ($c) => {
  const [$c0, $c1, $c2, $c3] = $c;
  const n = $c0.clone().xor($c0.clone().shiftLeft(11));

  $c.splice(
    0,
    5,
    $c1,
    $c2,
    $c3,
    n
      .clone()
      .xor(n.clone().shiftRight(8))
      .xor($c3)
      .xor($c3.clone().shiftRight(19))
  );

  return $c[3].clone();
};

const randint = ($c, min, max) => {
  return UINT64(getUINT32($c).toNumber())
    .multiply(UINT64(max).subtract(UINT64(min)).add(UINT64(1)))
    .shiftRight(32)
    .add(UINT64(min))
    .toNumber();
};

const randfloat = ($c, a, b) => {
  const val = UINT32(0x3f800000).or(getUINT32($c).shiftRight(9)).toNumber();

  const view = new DataView(new ArrayBuffer(32));
  view.setUint32(0, val);

  const valf = view.getFloat32();

  return a + (valf - 1.0) * (b - a);
};

const randbool = ($c) => {
  return getUINT32($c).and(UINT32(0x80000000)).toNumber();
};

const intceil = (val) => {
  return Math.trunc(val + 0.99999);
};

function* calculate(seed, pattern) {
  const $c = initContext(seed);
  const basePrice = randint($c, 90, 110);
  yield basePrice;
  const chance = randint($c, 0, 99);

  // select the next pattern
  let whatPattern;

  switch (pattern) {
    case 0:
      if (chance < 20) {
        whatPattern = 0;
      } else if (chance < 50) {
        whatPattern = 1;
      } else if (chance < 65) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }
      break;
    case 1:
      if (chance < 50) {
        whatPattern = 0;
      } else if (chance < 55) {
        whatPattern = 1;
      } else if (chance < 75) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }
      break;
    case 2:
      if (chance < 25) {
        whatPattern = 0;
      } else if (chance < 70) {
        whatPattern = 1;
      } else if (chance < 75) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }
      break;
    case 3:
      if (chance < 45) {
        whatPattern = 0;
      } else if (chance < 70) {
        whatPattern = 1;
      } else if (chance < 85) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }
      break;
    default:
      whatPattern = 2;
      break;
  }

  yield whatPattern;

  const sellPrices = new Array(14);
  sellPrices[0] = basePrice;
  sellPrices[1] = basePrice;

  let work;
  let decPhaseLen1;
  let decPhaseLen2;
  let peakStart;
  let hiPhaseLen1;
  let hiPhaseLen2and3;
  let hiPhaseLen3;
  let rate;

  switch (whatPattern) {
    case 0:
      // PATTERN 0: high, decreasing, high, decreasing, high
      work = 2;
      decPhaseLen1 = randbool($c) ? 3 : 2;
      decPhaseLen2 = 5 - decPhaseLen1;

      hiPhaseLen1 = randint($c, 0, 6);
      hiPhaseLen2and3 = 7 - hiPhaseLen1;
      hiPhaseLen3 = randint($c, 0, hiPhaseLen2and3 - 1);

      // high phase 1
      for (let i = 0; i < hiPhaseLen1; i += 1) {
        yield (sellPrices[work++] = intceil(
          randfloat($c, 0.9, 1.4) * basePrice
        ));
      }

      // decreasing phase 1
      rate = randfloat($c, 0.8, 0.6);
      for (let i = 0; i < decPhaseLen1; i++) {
        yield (sellPrices[work++] = intceil(rate * basePrice));
        rate -= 0.04;
        rate -= randfloat($c, 0, 0.06);
      }

      // high phase 2
      for (let i = 0; i < hiPhaseLen2and3 - hiPhaseLen3; i++) {
        yield (sellPrices[work++] = intceil(
          randfloat($c, 0.9, 1.4) * basePrice
        ));
      }

      // decreasing phase 2
      rate = randfloat($c, 0.8, 0.6);
      for (let i = 0; i < decPhaseLen2; i++) {
        yield (sellPrices[work++] = intceil(rate * basePrice));
        rate -= 0.04;
        rate -= randfloat($c, 0, 0.06);
      }

      // high phase 3
      for (let i = 0; i < hiPhaseLen3; i++) {
        yield (sellPrices[work++] = intceil(
          randfloat($c, 0.9, 1.4) * basePrice
        ));
      }
      break;
    case 1:
      // PATTERN 1: decreasing middle, high spike, random low
      peakStart = randint($c, 3, 9);
      rate = randfloat($c, 0.9, 0.85);
      for (work = 2; work < peakStart; work++) {
        yield (sellPrices[work] = intceil(rate * basePrice));
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }
      yield (sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice));
      yield (sellPrices[work++] = intceil(randfloat($c, 1.4, 2.0) * basePrice));
      yield (sellPrices[work++] = intceil(randfloat($c, 2.0, 6.0) * basePrice));
      yield (sellPrices[work++] = intceil(randfloat($c, 1.4, 2.0) * basePrice));
      yield (sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice));
      for (; work < 14; work++) {
        yield (sellPrices[work] = intceil(randfloat($c, 0.4, 0.9) * basePrice));
      }
      break;
    case 2:
      // PATTERN 2: consistently decreasing
      rate = 0.9;
      rate -= randfloat($c, 0, 0.05);
      for (work = 2; work < 14; work++) {
        yield (sellPrices[work] = intceil(rate * basePrice));
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }
      break;
    case 3:
      // PATTERN 3: decreasing, spike, decreasing
      peakStart = randint($c, 2, 9);

      // decreasing phase before the peak
      rate = randfloat($c, 0.9, 0.4);
      for (work = 2; work < peakStart; work++) {
        yield (sellPrices[work] = intceil(rate * basePrice));
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }

      yield (sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice));
      yield (sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice));
      rate = randfloat($c, 1.4, 2.0);
      yield (sellPrices[work++] =
        intceil(randfloat($c, 1.4, rate) * basePrice) - 1);
      yield (sellPrices[work++] = intceil(rate * basePrice));
      yield (sellPrices[work++] =
        intceil(randfloat($c, 1.4, rate) * basePrice) - 1);

      // decreasing phase after the peak
      if (work < 14) {
        rate = randfloat($c, 0.9, 0.4);
        for (; work < 14; work++) {
          yield (sellPrices[work] = intceil(rate * basePrice));
          rate -= 0.03;
          rate -= randfloat($c, 0, 0.02);
        }
      }
      break;
    default:
      break;
  }
}

const $average = (array, index, count, next) =>
  array.splice(index, 1, (count * array[index] + next) / (count + 1));

const $minMax = (current, result) => {
  if (current[0] > result) current.splice(0, 1, result);
  if (current[1] < result) current.splice(1, 1, result);
};

const makePaternFilter = (patterns) => {
  return patterns
    .map((options, i) => [options.length, i])
    .filter(([v]) => v)
    .map(([, i]) => i);
};

const optimizeFilters = (filters) => {
  const [basePrice = 0] = filters;
  const patterns = possiblePatterns(filters);
  const minMaxPatterns = patternReducer(patterns);
  // Create a copy, with size 14. [baseprice, patterns, ...weekPrices]
  const $filters = Array.from({ length: 14 }, (val, i) => filters[i + 1] || 0);

  const patternFilter = makePaternFilter(patterns);
  return $filters.map((filter, index) => {
    if (index === 0) {
      return [basePrice] || minMaxPatterns[0];
    }
    if (index === 1) {
      return patternFilter;
    }
    return filter ? [filter, filter] : minMaxPatterns[index];
  });
};

function* yieldCalculate(filters = []) {
  let count = 0;
  let total = 0;
  const average = Array.from({ length: 13 }, () => 0);
  const minMax = Array.from({ length: 13 }, () => [Infinity, -Infinity]);
  const results = Array.from({ length: 13 }, () => 0);
  const $filters = optimizeFilters(filters);
  const randomStart = Math.trunc(Math.random() * 0xffffffff);
  for (let i = 0; i < 0xffffffff; i++) {
    for (let ii = 0; ii < 4; ii++) {
      const calculator = calculate((randomStart + i) % 0xffffffff, ii);
      const success = $filters.every((filter, index) => {
        const { value } = calculator.next();
        // Short circuit more useless iterations
        if (index === 0 && !filter.includes(value)) ii += 4;
        if (index === 1 && !filter.includes(value)) ii += 4;

        // Copy the resulting array
        results.splice(index, 1, value);
        const [min, max] = filter;
        return min <= value && max >= value;
      });
      if (success) {
        // eslint-disable-next-line no-loop-func
        results.forEach((result, index) => {
          $average(average, index, count, result);
          $minMax(minMax[index], result);
        });
        count += 1;
      }
    }
    total += 1;
    yield [total, count, minMax, average];
  }
}

function* yieldCalculateByTime(filters = [], ms) {
  const calculator = yieldCalculate(filters);
  let flag = Date.now();
  let result = calculator.next();
  while (!result.done) {
    if (Date.now() - flag > ms) {
      yield result.value;
      flag = Date.now();
    }
    result = calculator.next();
  }
}

module.exports = {
  yieldCalculate,
  yieldCalculateByTime,
  initContext,
  randint,
  randfloat,
  randbool,
};
