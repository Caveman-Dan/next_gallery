import { NextRequest, NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const forwarded = request.headers.get("x-forwarded-proto");
  const proto = forwarded?.split(",")[0]?.trim() ?? request.nextUrl.protocol.replace(":", "");
  if (proto === "https") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  return NextResponse.redirect(url, 308);
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
