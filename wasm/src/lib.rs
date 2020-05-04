mod patterns;
mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn calculate(filters: String) -> String {
    utils::set_panic_hook();
    let mut parsed_filters: Vec<Option<i32>> = Vec::new();
    for filter in filters.split("-") {
        if let Ok(number) = filter.parse() {
            parsed_filters.push(Some(number));
        } else {
            parsed_filters.push(None);
        }
    }
    parse(&patterns::calculate(&parsed_filters))
}

fn parse(patterns: &Vec<(Vec<patterns::MinMax<i32>>, i32)>) -> String {
    let mut result: Vec<String> = Vec::new();

    for (pattern, pattern_number) in patterns {
        let stringified = format!(
            "[{},{}]",
            pattern_number,
            pattern
                .into_iter()
                .map(|value| value.to_string())
                .collect::<Vec<String>>()
                .join(",")
        );
        result.push(stringified);
    }

    format!("[{}]", result.join(","))
}
