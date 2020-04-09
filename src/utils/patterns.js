// Ninji's code: https://gist.github.com/Treeki/85be14d297c80c8b3c0a76375743325b

const randfloat = (arr, min, max, [minBasePrice, maxBasePrice], cb) => {
  arr.push([min * minBasePrice, max * maxBasePrice, cb]);
};

const randFloatRelative = (
  arr,
  [minStart, maxStart],
  [minDelta, maxDelta],
  i,
  filter,
  basePrice,
  cb
) => {
  const previousPredition = i ? arr.slice(-1)[0] || basePrice : basePrice;
  const [minVerification, maxVerification] = previousPredition;
  const [minPreviousPrice, maxPreviousPrice] = [
    filter ? filter - 1 : minVerification,
    filter ? filter + 1 : maxVerification,
  ];
  // min = 100 * 0.9 === 90, i = 0
  // min = [0.9 * 100] + -0.05 * [0.9 * 100] / 0.9 ,- i = 1 === 85
  // min = [0.85 * 100] + -0.05 * [0.85 * 100] / 0.85 ,- i = 2 === 80
  const minPrediction = i
    ? minPreviousPrice +
      (minDelta * minPreviousPrice) / (minStart + minDelta * (i - 1))
    : minPreviousPrice * minStart;
  const minPossible = i
    ? minVerification +
      (minDelta * minVerification) / (minStart + minDelta * (i - 1))
    : minVerification * minStart;
  const maxPredition = i
    ? maxPreviousPrice +
      (maxDelta * maxPreviousPrice) / (maxStart + maxDelta * (i - 1))
    : maxPreviousPrice * maxStart;
  const maxPossible = i
    ? maxVerification +
      (maxDelta * maxVerification) / (maxStart + maxDelta * (i - 1))
    : maxVerification * maxStart;
  const minValue = Math.max(minPrediction, minPossible);
  const maxValue = Math.min(maxPredition, maxPossible);
  arr.push(
    minValue > maxValue
      ? [minPossible, maxPossible, cb]
      : [minValue, maxValue, cb]
  );
};

const roundPrediction = (arr) => {
  return arr.map(([min, max, cb = (v) => v]) =>
    [min, max]
      .map((v) => Math.trunc(v + 0.99999))
      .map(cb)
      .map((v, i) => (i === 0 ? v - 1 : v + 1))
  );
};

// PATTERN 0: high, decreasing, high, decreasing, high
const pattern0 = (basePrice, filters) => {
  const probabilities = [];
  const current = [];

  // decPhaseLen1 = randbool() ? 3 : 2;
  for (let decPhaseLen1 = 2; decPhaseLen1 <= 3; decPhaseLen1++) {
    // decPhaseLen2 = 5 - decPhaseLen1;
    const decPhaseLen2 = 5 - decPhaseLen1;
    // hiPhaseLen1 = randint(0, 6);
    for (let hiPhaseLen1 = 0; hiPhaseLen1 <= 6; hiPhaseLen1++) {
      // hiPhaseLen2and3 = 7 - hiPhaseLen1;
      const hiPhaseLen2and3 = 7 - hiPhaseLen1;
      // hiPhaseLen3 = randint(0, hiPhaseLen2and3 - 1);
      for (let hiPhaseLen3 = 0; hiPhaseLen3 < hiPhaseLen2and3; hiPhaseLen3++) {
        // // high phase 1
        // work = 2;
        // for (int i = 0; i < hiPhaseLen1; i++)
        // {
        //   sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
        // }
        let work = 2;
        for (let i = 0; i < hiPhaseLen1; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
          work += 1;
        }
        // // decreasing phase 1
        // rate = randfloat(0.8, 0.6);
        // for (int i = 0; i < decPhaseLen1; i++)
        // {
        //   sellPrices[work++] = intceil(rate * basePrice);
        //   rate -= 0.04;
        //   rate -= randfloat(0, 0.06);
        // }
        for (let i = 0; i < decPhaseLen1; i++) {
          randFloatRelative(
            current,
            [0.6, 0.8],
            [-0.1, -0.04],
            i,
            filters[work - 3],
            basePrice
          );
          work += 1;
        }
        // // high phase 2
        // for (int i = 0; i < (hiPhaseLen2and3 - hiPhaseLen3); i++)
        // {
        //   sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
        // }
        for (let i = 0; i < hiPhaseLen2and3 - hiPhaseLen3; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
          work += 1;
        }

        // // decreasing phase 2
        // rate = randfloat(0.8, 0.6);
        // for (int i = 0; i < decPhaseLen2; i++)
        // {
        //   sellPrices[work++] = intceil(rate * basePrice);
        //   rate -= 0.04;
        //   rate -= randfloat(0, 0.06);
        // }
        for (let i = 0; i < decPhaseLen2; i++) {
          randFloatRelative(
            current,
            [0.6, 0.8],
            [-0.1, -0.04],
            i,
            filters[work - 3],
            basePrice
          );
          work += 1;
        }

        // // high phase 3
        // for (int i = 0; i < hiPhaseLen3; i++)
        // {
        //   sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
        // }
        for (let i = 0; i < hiPhaseLen3; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
          work += 1;
        }

        // commit probability
        probabilities.push(roundPrediction(current));
        current.length = 0;
      }
    }
  }

  return probabilities;
};

// // PATTERN 1: decreasing middle, high spike, random low
const pattern1 = (basePrice, filters) => {
  const probabilities = [];
  const current = [];

  // peakStart = randint(3, 9);
  // rate = randfloat(0.9, 0.85);
  for (let peakStart = 3; peakStart <= 9; peakStart++) {
    // for (work = 2; work < peakStart; work++)
    // {
    //   sellPrices[work] = intceil(rate * basePrice);
    //   rate -= 0.03;
    //   rate -= randfloat(0, 0.02);
    // }
    let work = 2;
    for (; work < peakStart; work++) {
      const i = work - 2;
      randFloatRelative(
        current,
        [0.85, 0.9],
        [-0.05, -0.03],
        i,
        filters[work - 3],
        basePrice
      );
    }

    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(2.0, 6.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 2.0, 6.0, basePrice);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 0.9, 1.4, basePrice);
    work += 5;

    // for (; work < 14; work++)
    // {
    //   sellPrices[work] = intceil(randfloat(0.4, 0.9) * basePrice);
    // }
    for (; work < 14; work++) {
      randfloat(current, 0.4, 0.9, basePrice);
    }

    // commit probability
    probabilities.push(roundPrediction(current));
    current.length = 0;
  }

  return probabilities;
};

// PATTERN 2: consistently decreasing
const pattern2 = (basePrice, filters) => {
  const current = [];

  // rate = 0.9;
  // rate -= randfloat(0, 0.05);
  // for (work = 2; work < 14; work++)
  // {
  //   sellPrices[work] = intceil(rate * basePrice);
  //   rate -= 0.03;
  //   rate -= randfloat(0, 0.02);
  // }
  let work = 2;
  for (; work < 14; work++) {
    const i = work - 2;
    randFloatRelative(
      current,
      [0.85, 0.9],
      [-0.05, -0.03],
      i,
      filters[work - 3],
      basePrice
    );
  }

  return [roundPrediction(current)];
};

// PATTERN 3: decreasing, spike, decreasing
const pattern3 = (basePrice, filters) => {
  const probabilities = [];
  const current = [];

  // peakStart = randint(2, 9);
  for (let peakStart = 2; peakStart <= 9; peakStart++) {
    // // decreasing phase before the peak
    // rate = randfloat(0.9, 0.4);
    // for (work = 2; work < peakStart; work++)
    // {
    //   sellPrices[work] = intceil(rate * basePrice);
    //   rate -= 0.03;
    //   rate -= randfloat(0, 0.02);
    // }
    let work = 2;
    for (; work < peakStart; work++) {
      const i = work - 2;
      randFloatRelative(
        current,
        [0.4, 0.9],
        [-0.05, -0.03],
        i,
        filters[work - 3],
        basePrice
      );
    }

    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * (float)basePrice);
    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    // rate = randfloat(1.4, 2.0);
    // sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    // sellPrices[work++] = intceil(rate * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 1.4, 2.0, basePrice, (v) => v - 1);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 1.4, 2.0, basePrice, (v) => v - 1);
    work += 5;

    // // decreasing phase after the peak
    // if (work < 14)
    // {
    //   rate = randfloat(0.9, 0.4);
    //   for (; work < 14; work++)
    //   {
    //     sellPrices[work] = intceil(rate * basePrice);
    //     rate -= 0.03;
    //     rate -= randfloat(0, 0.02);
    //   }
    // }
    let i = 0;
    for (; work < 14; work++) {
      randFloatRelative(
        current,
        [0.4, 0.9],
        [-0.05, -0.03],
        i,
        filters[work - 3],
        basePrice
      );
      i++;
    }

    probabilities.push(roundPrediction(current));
    current.length = 0;
  }

  return probabilities;
};

const filterByPattern = (filters) => (pattern) =>
  pattern.every(([min, max], i) =>
    filters[i + 1] ? min <= filters[i + 1] && max >= filters[i + 1] : true
  );

const possiblePatterns = (filters) => {
  const patterns = Array.from({ length: 4 }, (v, i) => i);
  const fns = [pattern0, pattern1, pattern2, pattern3];
  const result = [];

  const basePrice = filters[0];
  patterns.forEach((fn) => {
    let posibilities;
    if (!basePrice || basePrice < 90 || basePrice > 110) {
      posibilities = fns[fn]([90, 110], filters.slice(1));
    } else {
      posibilities = fns[fn]([basePrice, basePrice], filters.slice(1));
    }
    const filtered = posibilities.filter(filterByPattern(filters));
    result.push(filtered);
  });

  return result;
};

// Take all patternsOptions and make them single [min, max] values.
const minMaxReducer = (prev, current) => {
  return prev.map(([min, max], i) => {
    const [newMin, newMax] = current[i];
    return [min > newMin ? newMin : min, max < newMax ? newMax : max];
  });
};

const averageReducer = (prev, current) => {
  return prev.map(([avg, count, flag], i) => {
    const [min, max] = current[i];
    if (!flag) return [(avg + count + min + max) / 4, 4, true];
    return [(avg * count + min + max) / (count + 2), count + 2, true];
  });
};

// This reducer will get all-week minimum.
const maxReducer = ([a], [b]) => [Math.max(a, b)];
const minWeekReducer = (prev, current, i) => {
  const [a] = current.reduce(maxReducer);
  const [b] = i === 1 ? prev.reduce(maxReducer) : prev;
  return [Math.min(a, b)];
};

const patternReducer = (patternsCategories, reducer = minMaxReducer) => {
  const allPatterns = patternsCategories.reduce(
    (acc, current) => [...acc, ...current],
    []
  );
  if (allPatterns.length === 0) return [];
  if (allPatterns.length === 1)
    return [allPatterns[0], allPatterns[0]].reduce(reducer);
  return allPatterns.reduce(reducer);
};

module.exports = {
  possiblePatterns,
  patternReducer,
  minMaxReducer,
  averageReducer,
  minWeekReducer,
};
