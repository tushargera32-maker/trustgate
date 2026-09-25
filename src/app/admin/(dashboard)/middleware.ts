import { withAuth } from "next-auth/middleware";

/**
 * Server-side route guards.
 *  - /admin/**       → staff only (any non-CLIENT role)
 *  - /client/(** except /client/login) → CLIENT role required
 */
export default withAuth(
  function middleware() {
    // Authorization is also enforced inside each route via `requireRole`.
    // This middleware just bounces unauthenticated traffic to the login page.
  },
  {
    pages: { signIn: "/client/login" },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin")) {
          return Boolean(token && token.role !== "CLIENT");
        }
        if (path.startsWith("/client")) {
          if (path === "/client/login") return true;
          return Boolean(token);
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"]
};