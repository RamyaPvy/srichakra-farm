import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/checkout",
  "/account",
  "/account/profile",
  "/account/addresses",
  "/account/orders",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCustomerRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !request.cookies.get("scf_admin_session")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isCustomerRoute && !request.cookies.get("scf_customer_session")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*", "/admin/:path*"],
};