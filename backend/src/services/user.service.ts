import { clerkClient } from "@clerk/express";
import type { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../utils/errors";

export async function syncUserFromClerk(clerkUserId: string): Promise<User> {
  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const email = clerkUser.emailAddresses.find(
    (entry) => entry.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;

  if (!email) {
    throw new BadRequestError("Clerk user has no primary email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    null;

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    create: {
      clerkId: clerkUserId,
      email,
      name,
    },
    update: {
      email,
      name,
    },
  });
}

export async function getUserByClerkId(clerkUserId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
}
