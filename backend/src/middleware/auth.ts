import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { getUserByClerkId } from "../services/user.service";
import { UnauthorizedError } from "../utils/errors";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);

  if (!auth.userId) {
    next(new UnauthorizedError());
    return;
  }

  req.clerkUserId = auth.userId;
  next();
}

export async function attachDbUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.clerkUserId) {
      next(new UnauthorizedError());
      return;
    }

    const user = await getUserByClerkId(req.clerkUserId);

    if (!user) {
      next(new UnauthorizedError("User not synced. Call POST /api/auth/sync first."));
      return;
    }

    req.dbUser = user;
    next();
  } catch (error) {
    next(error);
  }
}
