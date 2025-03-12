import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
import { NextResponse } from "next/server";

export function withCheckDatabaseMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    try {
      const dbCheckResponse = await fetch(`${request.nextUrl.origin}/api/checkDatabase`);
      const data = await dbCheckResponse.json();

      if (dbCheckResponse.status !== 200 || data.status !== "ok") {
        return NextResponse.redirect(new URL('/fixDatabase', request.url))
      }
    } catch (error) {
      console.error("Database check middleware error:", error);
      return NextResponse.redirect(new URL('/fixDatabase', request.url))
    }

    return middleware(request, event, response);
  };
}
