import type { Group } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import type { CreateGroupInput } from "../dto/groups.dto";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export async function createGroup(
  ownerId: string,
  input: CreateGroupInput,
): Promise<Group> {
  return prisma.group.create({
    data: {
      name: input.name,
      ownerId,
    },
  });
}

export async function listGroupsForUser(ownerId: string): Promise<Group[]> {
  return prisma.group.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGroupForUser(
  groupId: string,
  ownerId: string,
): Promise<Group> {
  const group = await prisma.group.findFirst({
    where: { id: groupId, ownerId },
    include: {
      participants: {
        orderBy: { name: "asc" },
      },
      _count: {
        select: {
          expenses: true,
          settlements: true,
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  return group;
}

export async function assertGroupOwner(
  groupId: string,
  ownerId: string,
): Promise<void> {
  const group = await prisma.group.findFirst({
    where: { id: groupId, ownerId },
    select: { id: true },
  });

  if (!group) {
    throw new ForbiddenError("You do not have access to this group");
  }
}
