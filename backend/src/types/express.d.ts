import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
      dbUser?: User;
    }
  }
}

export {};
