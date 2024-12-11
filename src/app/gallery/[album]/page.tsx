import React from "react";

const Page = async (props) => {
  const params = await props.params;
  return (
    <>
      <h1>Gallery Here</h1>,{JSON.stringify(params)}
    </>
  );
};

export default Page;
