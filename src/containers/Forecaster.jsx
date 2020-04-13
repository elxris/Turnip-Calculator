import React, { useState, useEffect, useCallback, useRef } from "react";
import { arrayOf, number } from "prop-types";

// Possible future feature WIP

const Forecaster = ({ filter }) => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([0, 0, [], []]);
  const worker = useRef(null);

  useEffect(() => {
    worker.current = new Worker("../experimental/worker.js");
    worker.current.onmessage = ({ data: { done, value } }) => {
      if (done === undefined) return;
      if (done) {
        setStarted(false);
      }
      setResults(value);
    };
    return () => {
      worker.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (started) {
      worker.current.postMessage(["start", ...filter]);
    } else {
      worker.current.postMessage(["stop"]);
    }
  }, [filter]);

  useEffect(() => {
    if (started) {
      worker.current.postMessage(["restart", ...filter]);
    } else {
      worker.current.postMessage(["pause"]);
    }
  }, [started]);
  const toggleStart = useCallback(() => {
    setStarted((v) => !v);
  }, []);
  return (
    <>
      <div>Results:</div>
      <div>{results[2].join(" ")}</div>
      <div>Found:</div>
      <div>{results[1]}</div>
      <div>Calculated:</div>
      <div>{`${((results[0] / 0xffffffff) * 100).toFixed(3)}%`}</div>
      <button type="button" onClick={toggleStart}>
        {started ? "Stop" : "Start!"}
      </button>
    </>
  );
};

Forecaster.propTypes = {
  filter: arrayOf(number).isRequired,
};

export default Forecaster;
