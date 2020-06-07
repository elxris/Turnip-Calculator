// Ninji's code: https://gist.github.com/Treeki/85be14d297c80c8b3c0a76375743325b

use std::fmt;

#[derive(Clone)]
pub struct MinMax<T> {
  pub min: T,
  pub max: T,
}

impl fmt::Display for MinMax<i32> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "[{},{}]", self.min, self.max)
  }
}

impl<T> MinMax<T> {
  fn new(min: T, max: T) -> MinMax<T> {
    MinMax { min, max }
  }
}

struct MinMaxPoint {
  min: f32,
  max: f32,
  plus_value: i32,
}

impl MinMaxPoint {
  fn to_min_max(&self) -> MinMax<i32> {
    MinMax {
      min: (self.min + 0.99999) as i32 + self.plus_value,
      max: (self.max + 0.99999) as i32 + self.plus_value,
    }
  }
}

// Maxmimum rate values need special treatment (issue #134)
// Function partially extracted from: https://github.com/chengluyu/turnip-price
fn max_float(a: f32, b: f32) -> f32 {
  let val: u32 = 0x3F800000 | (std::u32::MAX >> 9);
  let pval: *const u32 = &val;
  unsafe {
    let fval: f32 = *(pval as *const f32);
    a + ((fval - 1.0f32) * (b - a))
  }
}

fn rand_float(
  current: &mut Vec<MinMaxPoint>,
  min: f32,
  max: f32,
  base_price: &MinMax<i32>,
  plus_value: i32,
) {
  let _max = max_float(min, max);
  current.push(MinMaxPoint {
    min: min * base_price.min as f32,
    max: _max * base_price.max as f32,
    plus_value,
  });
}

fn rand_float_relative(
  arr: &mut Vec<MinMaxPoint>,
  start: MinMax<f32>,
  delta: MinMax<f32>,
  i: i32,
  filter: Option<&Option<i32>>,
  base_price: &MinMax<i32>,
  plus_value: i32,
) {
  if i == 0 {
    return rand_float(arr, start.min, start.max, &base_price, plus_value);
  }
  let verification: MinMax<f32> = MinMax {
    min: base_price.min as f32 * (start.min + delta.min * i as f32),
    max: base_price.max as f32 * (start.max + delta.max * i as f32),
  };
  let previous_price = arr.last().unwrap();

  // rate = ??;
  // sellPrices[prev] = prevRate * basePrice = prevPrice
  // prevRate = prevPrice / basePrice
  // rate = prevRate + stepRate =>  prevPrice / basePrice + stepRate
  // sellPrices[curr] = rate * basePrice

  let min_prediction = |base_price| (previous_price.min / base_price + delta.min) * base_price;
  let max_prediction = |base_price| (previous_price.max / base_price + delta.max) * base_price;

  let min1 = min_prediction(base_price.min as f32);
  let min2 = min_prediction(base_price.max as f32);
  let max1 = max_prediction(base_price.min as f32);
  let max2 = max_prediction(base_price.max as f32);

  let min_value = verification.min.max(min1.min(min2));
  let max_value = verification.max.min(max1.max(max2));

  match filter {
    Some(&Some(i)) => {
      if i as f32 >= min_value && i as f32 <= max_value {
        // If the filter is in range, means that our prediction is healthy
        arr.push(MinMaxPoint {
          // sellPrice[curr] = intceil(price);
          // sellPrice[curr] = price + 0.99999;
          min: i as f32 - 0.99999,
          max: i as f32,
          plus_value,
        })
      } else {
        // If is not in range, maybe is not the right pattern.
        arr.push(MinMaxPoint {
          min: min_value,
          max: max_value,
          plus_value,
        })
      }
    }
    _ => {
      if min_value <= max_value {
        // This means our prediction is healthy
        arr.push(MinMaxPoint {
          min: min_value,
          max: max_value,
          plus_value,
        })
      } else {
        // If our prediction is not healty, use wide prediction
        arr.push(MinMaxPoint {
          min: verification.min,
          max: verification.max,
          plus_value,
        })
      }
    }
  };
}

// PATTERN 0: high, decreasing, high, decreasing, high
fn pattern_0(base_price: &MinMax<i32>, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let mut probabilties: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();
  let mut current: Vec<MinMaxPoint> = Vec::new();

  // PATTERN 0: high, decreasing, high, decreasing, high
  //  decPhaseLen1 = randbool() ? 3 : 2;
  for dec_phase_len1 in 2..=3 {
    //  decPhaseLen2 = 5 - decPhaseLen1;
    let dec_phase_len2 = 5 - dec_phase_len1;
    //  hiPhaseLen1 = randint(0, 6);
    for hi_phase_len1 in 0..=6 {
      //  hiPhaseLen2and3 = 7 - hiPhaseLen1;
      let hi_phase_len2and3 = 7 - hi_phase_len1;
      //  hiPhaseLen3 = randint(0, hiPhaseLen2and3 - 1);
      for hi_phase_len3 in 0..hi_phase_len2and3 {
        // high phase 1
        //  work = 2;
        //  for (int i = 0; i < hiPhaseLen1; i++)
        //  {
        //    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * base_price);
        //  }
        let mut work = 2;
        for _i in 0..hi_phase_len1 {
          rand_float(&mut current, 0.9, 1.4, &base_price, 0);
          work = work + 1
        }

        // decreasing phase 1
        //  rate = randfloat(0.8, 0.6);
        //  for (int i = 0; i < decPhaseLen1; i++)
        //  {
        //    sellPrices[work++] = intceil(rate * base_price);
        //    rate -= 0.04;
        //    rate -= randfloat(0, 0.06);
        //  }

        for i in 0..dec_phase_len1 {
          rand_float_relative(
            &mut current,
            MinMax::new(0.6, 0.8),
            MinMax::new(-0.1, -0.04),
            i,
            filters.get(work - 2),
            &base_price,
            0,
          );
          work += 1;
        }

        // high phase 2
        //  for (int i = 0; i < (hiPhaseLen2and3 - hiPhaseLen3); i++)
        //  {
        //    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * base_price);
        //  }
        for _ in 0..(hi_phase_len2and3 - hi_phase_len3) {
          rand_float(&mut current, 0.9, 1.4, base_price, 0);
          work += 1;
        }

        // decreasing phase 2
        //  rate = randfloat(0.8, 0.6);
        //  for (int i = 0; i < decPhaseLen2; i++)
        //  {
        //    sellPrices[work++] = intceil(rate * base_price);
        //    rate -= 0.04;
        //    rate -= randfloat(0, 0.06);
        //  }
        for i in 0..dec_phase_len2 {
          rand_float_relative(
            &mut current,
            MinMax { min: 0.6, max: 0.8 },
            MinMax {
              min: -0.1,
              max: -0.04,
            },
            i,
            filters.get(work - 2),
            base_price,
            0,
          );
          work += 1;
        }

        // high phase 3
        //  for (int i = 0; i < hiPhaseLen3; i++)
        //  {
        //    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * base_price);
        //  }
        //  break;
        for _ in 0..hi_phase_len3 {
          rand_float(&mut current, 0.9, 1.4, base_price, 0);
          work += 1;
        }

        probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 0));
        current.clear();
      }
    }
  }

  probabilties
}

// PATTERN 1: decreasing middle, high spike, random low
fn pattern_1(base_price: &MinMax<i32>, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let mut probabilties: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();
  let mut current: Vec<MinMaxPoint> = Vec::new();
  // peakStart = randint(3, 9);
  // rate = randfloat(0.9, 0.85);
  for peak_start in 3..=9 {
    // for (work = 2; work < peakStart; work++)
    // {
    //   sellPrices[work] = intceil(rate * basePrice);
    //   rate -= 0.03;
    //   rate -= randfloat(0, 0.02);
    // }
    let mut work = 2;
    for _i in work..peak_start {
      let i = work - 2;
      rand_float_relative(
        &mut current,
        MinMax::new(0.85, 0.9),
        MinMax::new(-0.05, -0.03),
        i,
        filters.get(work as usize - 2),
        base_price,
        0,
      );
      work += 1;
    }
    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(2.0, 6.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    rand_float(&mut current, 0.9, 1.4, &base_price, 0);
    rand_float(&mut current, 1.4, 2.0, &base_price, 0);
    rand_float(&mut current, 2.0, 6.0, &base_price, 0);
    rand_float(&mut current, 1.4, 2.0, &base_price, 0);
    rand_float(&mut current, 0.9, 1.4, &base_price, 0);
    work += 5;

    // for (; work < 14; work++)
    // {
    //   sellPrices[work] = intceil(randfloat(0.4, 0.9) * basePrice);
    // }
    for _ in work..14 {
      rand_float(&mut current, 0.4, 0.9, &base_price, 0);
    }

    probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 1));
    current.clear();
  }
  probabilties
}

// PATTERN 2: consistently decreasing
fn pattern_2(base_price: &MinMax<i32>, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let mut probabilties: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();
  let mut current: Vec<MinMaxPoint> = Vec::new();

  let mut work = 2;
  for _ in work..14 {
    let i = work - 2;
    rand_float_relative(
      &mut current,
      MinMax::new(0.85, 0.9),
      MinMax::new(-0.05, -0.03),
      i,
      filters.get(work as usize - 2),
      &base_price,
      0,
    );
    work += 1;
  }

  probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 2));
  probabilties
}

// PATTERN 3: decreasing, spike, decreasing
fn pattern_3(base_price: &MinMax<i32>, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let mut probabilties: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();
  let mut current: Vec<MinMaxPoint> = Vec::new();

  // peakStart = randint(2, 9);
  for peak_start in 2..=9 {
    // decreasing phase before the peak
    // rate = randfloat(0.9, 0.4);
    // for (work = 2; work < peakStart; work++)
    // {
    //   sellPrices[work] = intceil(rate * basePrice);
    //   rate -= 0.03;
    //   rate -= randfloat(0, 0.02);
    // }
    let mut work = 2;
    for _ in work..peak_start {
      let i = work - 2;
      rand_float_relative(
        &mut current,
        MinMax::new(0.4, 0.9),
        MinMax::new(-0.05, -0.03),
        i,
        filters.get(work as usize - 2),
        &base_price,
        0,
      );
      work += 1;
    }

    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * (float)basePrice);
    // sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    // rate = randfloat(1.4, 2.0);
    // sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    // sellPrices[work++] = intceil(rate * basePrice);
    // sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    rand_float(&mut current, 0.9, 1.4, &base_price, 0);
    rand_float(&mut current, 0.9, 1.4, &base_price, 0);
    if let Some(&Some(prev_price)) = filters.get(work as usize + 1) {
      // rate = ??;
      // sellPrices[prev] = prevRate * basePrice = prevPrice;
      // rate = prevrate = prevPrice / basePrice;
      let rate = MinMax::new(
        prev_price as f32 / base_price.min as f32,
        prev_price as f32 / base_price.max as f32,
      );
      let rate_min = rate.min.min(rate.max);
      let rate_max = rate.min.max(rate.max);
      if rate_min < 1.4 || rate_max > 2.0 {
        rand_float(&mut current, 1.4, 2.0, &base_price, -1);
        rand_float(&mut current, 1.4, 2.0, &base_price, 0);
        rand_float(&mut current, 1.4, 2.0, &base_price, -1);
      } else {
        rand_float(&mut current, 1.4, rate_max, &base_price, -1);
        rand_float(&mut current, rate_min, rate_max, &base_price, 0);
        rand_float(&mut current, 1.4, rate_max.max(1.4), &base_price, -1);
      }
    } else {
      rand_float(&mut current, 1.4, 2.0, &base_price, -1);
      rand_float(&mut current, 1.4, 2.0, &base_price, 0);
      rand_float(&mut current, 1.4, 2.0, &base_price, -1);
    }
    work += 5;

    // decreasing phase after the peak
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
    let mut i = 0;
    for _ in work..14 {
      rand_float_relative(
        &mut current,
        MinMax::new(0.4, 0.9),
        MinMax::new(-0.05, -0.03),
        i,
        filters.get(work as usize - 2),
        &base_price,
        0,
      );
      i += 1;
      work += 1;
    }

    probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 3));
    current.clear();
  }
  probabilties
}

pub fn calculate(filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let min_price: i32 = filters[0].unwrap_or(90);
  let max_price: i32 = filters[0].unwrap_or(110);
  let mut results: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();

  let base_price = MinMax {
    min: min_price.min(max_price),
    max: min_price.max(max_price),
  };

  let patterns = [pattern_0, pattern_1, pattern_2, pattern_3];

  for pattern_fn in patterns.iter() {
    results.append(&mut pattern_fn(
      &base_price,
      &match filters.len() {
        0 => Vec::new(),
        _ => filters[1..].to_vec(),
      },
    ));
  }

  results
}
