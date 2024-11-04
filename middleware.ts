import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/_lib/auth";

// export function middleware(request: NextRequest) {
//   console.log(request);
//   return NextResponse.redirect(new URL("/about", request.url));
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Redirect authenticated users from /login to homepage
//   if (pathname === "/login") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Continue with NextAuth's auth checks
//   return NextResponse.next();
// }

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users to /login
  // Exclude /login path to avoid infinite loop
  if (!request.auth && pathname !== "/login") {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  }

  // Redirect authenticated users from /login to homepage
  if (request.auth && pathname === "/login") {
    return Response.redirect(new URL("/", request.nextUrl.origin));
  }
});

// Protected routes
// If user is not authenticated, they are not authorized to access this route(s)
export const config = {
  matcher: ["/login", "/account/:path*"],
};
