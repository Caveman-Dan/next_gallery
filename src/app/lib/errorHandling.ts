import chalk from "chalk";

type errorProps = {
  message: string;
};

export const handleServerError = async (err: errorProps) => {
  console.log("THE ERROR: ", JSON.stringify(err));
  console.error(chalk.redBright(err.message));
};

export const handleClientError = (err: errorProps) => {
  console.log("THE ERROR: ", JSON.stringify(err));
  console.error(chalk.redBright(err.message));
};
