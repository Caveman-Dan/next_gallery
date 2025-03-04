/**
 * I have left this here because I suspect that I will want to
 * return the error message from the API in the future
 * I was rather hoping that I could put it in a snackbar
 */

import "dotenv/config";
import { NextResponse } from "next/server";
import chalk from "chalk";

export const GET = async (request: Request, { params }: { params: Promise<{ location: string[] }> }) => {
  const location = (await params).location.join("/");
  console.log("LOCATION: ", location);
  const requestUrl = new URL(`${process.env.API}${process.env.API_GET_IMAGE}/${location}`);

  const response = await fetch(requestUrl.href).then((res) => {
    if (res.status === 200) return res.blob();
    else return res.json();
  });

  console.log("RESPONSE: ", response);

  if (response.error) {
    console.error(chalk.redBright(`Status: ${response.status} - ${response.message}`)); // Snackbar handling here
    return new NextResponse(response.message, { status: response.status });
  } else return new NextResponse(response);
};
