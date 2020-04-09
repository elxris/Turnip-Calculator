const { yieldCalculateByTime } = require("./calculator");

let paused;
let instance;
let result;

const workUnit = () => {
  if (!instance) return;
  result = instance.next();
  if (!result.done && !paused) {
    setTimeout(workUnit, 0);
  }
  postMessage(result);
};

onmessage = ({ data: [action, ...args] }) => {
  console.log("worker message received", action);
  switch (action) {
    case "start":
      paused = false;
      instance = yieldCalculateByTime(args, 1000);
      workUnit();
      break;
    case "pause":
      paused = true;
      break;
    case "stop":
      paused = true;
      instance = null;
      break;
    case "restart":
      paused = false;
      if (!instance) instance = yieldCalculateByTime(args, 1000);
      workUnit();
      break;
    default:
      break;
  }
};
