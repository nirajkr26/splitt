import type { Request, Response } from "express";
import { createGroupSchema } from "../dto/groups.dto";
import {
  createGroup,
  getGroupForUser,
  listGroupsForUser,
} from "../services/group.service.js";

export async function createGroupHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const input = createGroupSchema.parse(req.body);
  const group = await createGroup(req.dbUser!.id, input);
  res.status(201).json({ group });
}

export async function listGroupsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const groups = await listGroupsForUser(req.dbUser!.id);
  res.json({ groups });
}

export async function getGroupHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const groupId = req.params.id;
  if (!groupId || Array.isArray(groupId)) {
    res.status(400).json({ error: "Invalid group id" });
    return;
  }

  const group = await getGroupForUser(groupId, req.dbUser!.id);
  res.json({ group });
}
