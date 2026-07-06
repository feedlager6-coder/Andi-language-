/**
 * Session user shape — matches the AuthUser OpenAPI schema but is defined
 * locally so the server does not depend on the frontend client package.
 */
export interface SessionUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

declare global {
  namespace Express {
    // Extend Express.Request so req.user is typed everywhere
    interface User extends SessionUser {}

    interface Request {
      isAuthenticated(): this is AuthedRequest;
      user?: User | undefined;
    }

    interface AuthedRequest extends Request {
      user: User;
    }
  }
}
