import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required").max(100),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
