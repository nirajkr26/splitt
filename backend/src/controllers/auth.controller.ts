import type { Request, Response } from "express";
import { syncUserFromClerk } from "../services/user.service";

export async function syncCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const user = await syncUserFromClerk(req.clerkUserId!);
  res.json({ user });
}
