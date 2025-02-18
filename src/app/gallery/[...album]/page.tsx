import React from "react";

import type { NextPage } from "next";

type AlbumPageParams = {
  album: string;
};

type AlbumPageProps = {
  params: Promise<AlbumPageParams>;
};

const Page: NextPage<AlbumPageProps> = async (props) => {
  const params = await props.params;
  return (
    <>
      <h1>Gallery Here</h1>,{JSON.stringify(params)}
    </>
  );
};

export default Page;
