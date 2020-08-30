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
  fn newf(a: f32, b: f32) -> MinMax<f32> {
    let l = left_float(a, b);
    let r = right_float(a, b);
    MinMax {
      min: l.min(r),
      max: l.max(r),
    }
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

// right-handed randfloat-generated values need special treatment (issue #134, #152)
// Function partially extracted from: https://github.com/chengluyu/turnip-price
fn left_float(a: f32, b: f32) -> f32 {
  let val: u32 = 0x3F800000 | (std::u32::MIN >> 9);
  let pval: *const u32 = &val;
  unsafe {
    let fval: f32 = *(pval as *const f32);
    a + ((fval - 1.0f32) * (b - a))
  }
}

fn right_float(a: f32, b: f32) -> f32 {
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
  filter: Option<&Option<i32>>,
  base_price: i32,
  plus_value: i32,
) {
  let _min = min * base_price as f32;
  let _max = max * base_price as f32;

  match filter {
    Some(&Some(i)) => {
      if _min <= i as f32 && _max >= i as f32 {
        // Filter is healthy, use the provided filter value.
        current.push(MinMaxPoint {
          min: i as f32 - 0.99999,
          max: i as f32,
          plus_value,
        });
      } else {
        current.push(MinMaxPoint {
          min: _min,
          max: _max,
          plus_value,
        });
      }
    }
    _ => {
      current.push(MinMaxPoint {
        min: _min,
        max: _max,
        plus_value,
      });
    }
  }
}

fn delta_sum(start: f32, delta: &Vec<f32>, i: i32) -> f32 {
  let mut result = start;
  for _ in 1..=i {
    for d in delta {
      result += d;
    }
  }
  result
}

fn rand_float_relative(
  arr: &mut Vec<MinMaxPoint>,
  start: MinMax<f32>,
  delta: MinMax<Vec<f32>>,
  i: i32,
  filter: Option<&Option<i32>>,
  base_price: i32,
  plus_value: i32,
) {
  if i == 0 {
    return rand_float(arr, start.min, start.max, filter, base_price, plus_value);
  }

  let verification: MinMax<f32> = MinMax {
    min: base_price as f32 * delta_sum(start.min, &delta.min, i),
    max: base_price as f32 * delta_sum(start.max, &delta.max, i),
  };

  let previous_price = arr.last().unwrap();

  // rate = ??;
  // sellPrices[prev] = prevRate * basePrice = prevPrice
  // prevRate = prevPrice / basePrice
  // rate = prevRate + stepRate =>  prevPrice / basePrice + stepRate
  // sellPrices[curr] = rate * basePrice => prevPrice + stepRate * basePrice
  let min = previous_price.min + delta_sum(0f32, &delta.min, 1) * base_price as f32;
  let max = previous_price.max + delta_sum(0f32, &delta.max, 1) * base_price as f32;
  let mut min_value = verification.min;
  let mut max_value = verification.max;

  if min >= verification.min && max <= verification.max {
    // Our prediction is healthy
    min_value = min;
    max_value = max;
  }

  match filter {
    Some(&Some(i)) => {
      let in_valid_range = i as f32 >= min_value && i as f32 <= max_value;
      if in_valid_range {
        // If the filter is in range, using filter.
        arr.push(MinMaxPoint {
          // sellPrice[curr] = intceil(price);
          // sellPrice[curr] = price + 0.99999;
          min: min_value.max(i as f32 - 0.99999),
          max: i as f32,
          plus_value,
        });
      } else {
        // If is not in range, using prediction
        arr.push(MinMaxPoint {
          min: min_value,
          max: max_value,
          plus_value,
        });
      }
    }
    _ => arr.push(MinMaxPoint {
      min: min_value,
      max: max_value,
      plus_value,
    }),
  };
}

// PATTERN 0: high, decreasing, high, decreasing, high
fn pattern_0(base_price: i32, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
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
          rand_float(
            &mut current,
            left_float(0.9, 1.4),
            right_float(0.9, 1.4),
            filters.get(work - 2),
            base_price,
            0,
          );
          work += 1;
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
            MinMax::<f32>::newf(0.8, 0.6),
            MinMax::new(
              vec![-0.04, -right_float(0.0, 0.06)],
              vec![-0.04, -left_float(0.0, 0.06)],
            ),
            i,
            filters.get(work - 2),
            base_price,
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
          rand_float(
            &mut current,
            left_float(0.9, 1.4),
            right_float(0.9, 1.4),
            filters.get(work - 2),
            base_price,
            0,
          );
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
            MinMax::<f32>::newf(0.8, 0.6),
            MinMax::new(
              vec![-0.04, -right_float(0.0, 0.06)],
              vec![-0.04, -left_float(0.0, 0.06)],
            ),
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
          rand_float(
            &mut current,
            left_float(0.9, 1.4),
            right_float(0.9, 1.4),
            filters.get(work - 2),
            base_price,
            0,
          );
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
fn pattern_1(base_price: i32, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
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
    let mut work: usize = 2;
    for _i in work..peak_start {
      let i = work as i32 - 2;
      rand_float_relative(
        &mut current,
        MinMax::<f32>::newf(0.9, 0.85),
        MinMax::new(
          vec![-0.03, -right_float(0.0, 0.02)],
          vec![-0.03, -left_float(0.0, 0.02)],
        ),
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
    rand_float(
      &mut current,
      left_float(0.9, 1.4),
      right_float(0.9, 1.4),
      filters.get(work - 2),
      base_price,
      0,
    );
    rand_float(
      &mut current,
      left_float(1.4, 2.0),
      right_float(1.4, 2.0),
      filters.get(work - 1),
      base_price,
      0,
    );
    rand_float(
      &mut current,
      left_float(2.0, 6.0),
      right_float(2.0, 6.0),
      filters.get(work + 0),
      base_price,
      0,
    );
    rand_float(
      &mut current,
      left_float(1.4, 2.0),
      right_float(1.4, 2.0),
      filters.get(work + 1),
      base_price,
      0,
    );
    rand_float(
      &mut current,
      left_float(0.9, 1.4),
      right_float(0.9, 1.4),
      filters.get(work + 2),
      base_price,
      0,
    );
    work += 5;

    // for (; work < 14; work++)
    // {
    //   sellPrices[work] = intceil(randfloat(0.4, 0.9) * basePrice);
    // }
    for _ in work..14 {
      rand_float(
        &mut current,
        left_float(0.4, 0.9),
        right_float(0.4, 0.9),
        filters.get(work - 2),
        base_price,
        0,
      );
      work += 1;
    }

    probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 1));
    current.clear();
  }
  probabilties
}

// PATTERN 2: consistently decreasing
fn pattern_2(base_price: i32, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
  let mut probabilties: Vec<(Vec<MinMax<i32>>, i32)> = Vec::new();
  let mut current: Vec<MinMaxPoint> = Vec::new();

  // rate = 0.9;
  // rate -= randfloat(0, 0.05);
  // for (work = 2; work < 14; work++)
  // {
  //   sellPrices[work] = intceil(rate * basePrice);
  //   rate -= 0.03;
  //   rate -= randfloat(0, 0.02);
  // }
  let mut work = 2;
  for _ in work..14 {
    let i = work - 2;
    rand_float_relative(
      &mut current,
      MinMax::new(0.9 - right_float(0.0, 0.05), 0.9 - left_float(0.0, 0.05)),
      MinMax::new(
        vec![-0.03, -right_float(0.0, 0.02)],
        vec![-0.03, -left_float(0.0, 0.02)],
      ),
      i,
      filters.get(work as usize - 2),
      base_price,
      0,
    );
    work += 1;
  }

  probabilties.push((current.iter().map(|x| x.to_min_max()).collect(), 2));
  probabilties
}

// PATTERN 3: decreasing, spike, decreasing
fn pattern_3(base_price: i32, filters: &Vec<Option<i32>>) -> Vec<(Vec<MinMax<i32>>, i32)> {
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
    let mut work: usize = 2;
    for _ in work..peak_start {
      let i = work as i32 - 2;
      rand_float_relative(
        &mut current,
        MinMax::<f32>::newf(0.9, 0.4),
        MinMax::new(
          vec![-0.03, -right_float(0.0, 0.02)],
          vec![-0.03, -left_float(0.0, 0.02)],
        ),
        i,
        filters.get(work as usize - 2),
        base_price,
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
    rand_float(
      &mut current,
      left_float(0.9, 1.4),
      right_float(0.9, 1.4),
      filters.get(work - 2),
      base_price,
      0,
    );
    rand_float(
      &mut current,
      left_float(0.9, 1.4),
      right_float(0.9, 1.4),
      filters.get(work - 1),
      base_price,
      0,
    );
    work += 2;
    if let Some(&Some(prev_price)) = filters.get(work - 1) {
      // rate = ??;
      // sellPrices[prev] = prevRate * basePrice = prevPrice;
      // rate = prevrate = prevPrice / basePrice;
      let rate = MinMax::new(
        prev_price as f32 / base_price as f32,
        prev_price as f32 / base_price as f32,
      );
      let rate_min = rate.min.min(rate.max);
      let rate_max = rate.min.max(rate.max);
      if rate_min < 1.4 || rate_max > 2.0 {
        rand_float(
          &mut current,
          left_float(1.4, 2.0),
          right_float(1.4, 2.0),
          filters.get(work - 2),
          base_price,
          -1,
        );
        rand_float(
          &mut current,
          left_float(1.4, 2.0),
          right_float(1.4, 2.0),
          filters.get(work - 1),
          base_price,
          0,
        );
        rand_float(
          &mut current,
          left_float(1.4, 2.0),
          right_float(1.4, 2.0),
          filters.get(work + 0),
          base_price,
          -1,
        );
      } else {
        rand_float(
          &mut current,
          left_float(1.4, 2.0),
          rate_max.max(1.4),
          filters.get(work - 2),
          base_price,
          -1,
        );
        rand_float(
          &mut current,
          rate_min,
          rate_max,
          filters.get(work - 1),
          base_price,
          0,
        );
        rand_float(
          &mut current,
          left_float(1.4, 2.0),
          rate_max.max(1.4),
          filters.get(work + 0),
          base_price,
          -1,
        );
      }
    } else {
      rand_float(
        &mut current,
        left_float(1.4, 2.0),
        right_float(1.4, 2.0),
        filters.get(work - 2),
        base_price,
        -1,
      );
      rand_float(
        &mut current,
        left_float(1.4, 2.0),
        right_float(1.4, 2.0),
        filters.get(work - 1),
        base_price,
        0,
      );
      rand_float(
        &mut current,
        left_float(1.4, 2.0),
        right_float(1.4, 2.0),
        filters.get(work + 0),
        base_price,
        -1,
      );
    }
    work += 3;

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
        MinMax::<f32>::newf(0.9, 0.4),
        MinMax::new(
          vec![-0.03, -right_float(0.0, 0.02)],
          vec![-0.03, -left_float(0.0, 0.02)],
        ),
        i,
        filters.get(work as usize - 2),
        base_price,
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

  let patterns = [pattern_0, pattern_1, pattern_2, pattern_3];

  for base_price in min_price..=max_price {
    for pattern_fn in patterns.iter() {
      results.append(&mut pattern_fn(
        base_price,
        &match filters.len() {
          0 => Vec::new(),
          _ => filters[1..].to_vec(),
        },
      ));
    }
  }

  results
}
