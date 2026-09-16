type errorProps = {
  message: string;
};

export const handleServerError = (err: errorProps): never => {
  console.error(err.message);
  throw new Error(err.message);
};

export const handleClientError = (err: errorProps) => {
  console.log("THE ERROR: ", JSON.stringify(err));
  console.error(err.message);
};
