import React from "react";
import { render } from "react-dom";
import App from "./App";
import i18n from "./i18n";

// allows title to be localised
document.title = i18n.t("Turnip Calculator");

render(<App />, document.getElementById("root"));
