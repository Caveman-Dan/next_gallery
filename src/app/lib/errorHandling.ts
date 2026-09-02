type errorProps = {
  message: string;
};

export const handleServerError = async (err: errorProps) => {
  console.log("THE ERROR: ", JSON.stringify(err));
  console.error(err.message);
};

export const handleClientError = (err: errorProps) => {
  console.log("THE ERROR: ", JSON.stringify(err));
  console.error(err.message);
};