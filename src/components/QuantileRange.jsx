import React, { createContext, useContext } from "react";
import { useLocalStorage } from "react-use";
import { Button } from "./Button";

const ranges = [50, 75, 90];
const QuantileContext = createContext([]);

const QuantileRange = () => {
  const [quantileRange = 75, setQuantileRange] = useContext(QuantileContext);

  return ranges.map((value) => (
    <Button
      key={`quaintile-range-${value}`}
      {...(value === quantileRange ? { bgcolor: "yellow" } : {})}
      onClick={() => setQuantileRange(value)}
    >
      {value}%
    </Button>
  ));
};

const QuantileProvider = (props) => {
  const [range, setRange] = useLocalStorage("quantile-range", 75);

  return <QuantileContext.Provider {...props} value={[range, setRange]} />;
};

export default QuantileRange;
export { QuantileContext, QuantileProvider };
