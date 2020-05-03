const wasm = import("patterns");
const mockPatterns = "./mockPatterns.json";

// The lower score, the better.
const calculateScore = (filters, pattern) => {
  return pattern.reduce(
    (prev, [min, max], i) =>
      prev +
      (filters[i + 1]
        ? filters[i + 1] < min
          ? min - filters[i + 1]
          : filters[i + 1] > max
          ? filters[i + 1] - max
          : 0
        : 0),
    0
  );
};
const heuristicFilter = (filters, patterns) => {
  const scores = new Map();
  patterns.forEach((pattern) => {
    scores.set(pattern, calculateScore(filters, pattern));
  });
  patterns.sort(
    (patternA, patternB) => scores.get(patternA) - scores.get(patternB)
  );
  const firstScore = scores.get(patterns[0]);
  return patterns.filter((pattern) => scores.get(pattern) <= firstScore * 1.1);
};

const possiblePatterns = async (filters) => {
  const probabilities = [140, 105, 55, 100]; // out of 400

  let wasmPatterns;
  try {
    wasmPatterns = JSON.parse((await wasm).calculate(filters.join("-")));
  } catch (error) {
    console.log(error);
    wasmPatterns = mockPatterns;
  }

  const all = wasmPatterns.map(([patternNumber, ...pattern]) => {
    pattern.pattern = patternNumber;
    return pattern;
  });

  const results = heuristicFilter(filters, all);
  const countPerPattern = results.reduce(
    (acc, pattern) => {
      acc[pattern.pattern]++;
      return acc;
    },
    [0, 0, 0, 0]
  );
  const allPatternsProb = countPerPattern.reduce(
    (acc, count, i) => (count ? acc + probabilities[i] : acc),
    0
  );
  return results.map((pattern) => {
    pattern.probability =
      probabilities[pattern.pattern] /
      allPatternsProb /
      countPerPattern[pattern.pattern];
    return pattern;
  });
};

// Take all patternsOptions and make them single [min, max] values.
const minMaxReducer = (prev, current) => {
  return prev.map(([min, max], i) => {
    const [newMin, newMax] = current[i];
    return [min > newMin ? newMin : min, max < newMax ? newMax : max];
  });
};

const averageReducer = (prev, current) => {
  const probability = prev.probability;
  const cProbability = current.probability;
  return prev.map(([avg, count, flag], i) => {
    const [min, max] = current[i];
    if (!flag)
      return [
        ((avg + count) * probability * 0.5 + (min + max) * cProbability * 0.5) /
          (probability + cProbability),
        probability + cProbability,
        true,
      ];
    return [
      (avg * count + (min + max) * cProbability * 0.5) / (count + cProbability),
      count + cProbability,
      true,
    ];
  });
};

// This reducer will get all-week minimum.
const maxReducer = ([a], [b]) => [Math.max(a, b)];
const minWeekReducer = (prev, current, i) => {
  const [a] = current.reduce(maxReducer);
  const [b] = i === 1 ? prev.reduce(maxReducer) : prev;
  return [Math.min(a, b)];
};

const patternReducer = (allPatterns, reducer) => {
  if (allPatterns.length === 1) {
    return [allPatterns[0], allPatterns[0]].reduce(reducer);
  }
  return allPatterns.reduce(reducer);
};

const calculate = async (filter) => {
  let patterns = await possiblePatterns(filter);
  const minMaxPattern = patternReducer(patterns, minMaxReducer);
  const avgPattern = patternReducer(patterns, averageReducer).reduce(
    (acc, [avg]) => [...acc, Math.trunc(avg)],
    []
  );
  const [minWeekValue] = patternReducer(patterns, minWeekReducer);

  const result = {
    patterns,
    minMaxPattern,
    avgPattern,
    minWeekValue,
  };

  return result;
};

export {
  possiblePatterns,
  patternReducer,
  minMaxReducer,
  averageReducer,
  minWeekReducer,
  calculate,
};
