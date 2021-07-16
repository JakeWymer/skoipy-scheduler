const chalk = require("chalk");

const logger = {
  success: (msg) => {
    console.log(chalk.green(msg));
  },
  warning: (msg) => {
    console.log(chalk.yellow(msg));
  },
  error: (msg) => {
    console.log(chalk.red(msg));
  },
};

module.exports = logger;
