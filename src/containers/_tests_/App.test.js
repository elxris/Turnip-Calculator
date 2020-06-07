import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import Providers from "../Providers";

describe("<App />", () => {
  it("Should render", () => {
    render(
      <Providers>
        <App />
      </Providers>
    );
  });
});
