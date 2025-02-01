import { MiddlewareConfig, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api/auth|favicon.ico|_next).*)", // ログインを必要としないエンドポイント
  ],
};
