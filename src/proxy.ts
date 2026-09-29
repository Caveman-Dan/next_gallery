import { NextRequest, NextResponse } from "next/server";

const PUBLIC_HOSTS = new Set(["www.waxworlds.org", "waxworlds.org"]);

export const proxy = (request: NextRequest) => {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const forwarded = request.headers.get("x-forwarded-proto");
  const proto = forwarded?.split(",")[0]?.trim() ?? request.nextUrl.protocol.replace(":", "");
  if (proto === "https") return NextResponse.next();

  const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = hostHeader.split(",")[0].trim().split(":")[0];
  if (!PUBLIC_HOSTS.has(host)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = host;
  return NextResponse.redirect(url, 307);
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
