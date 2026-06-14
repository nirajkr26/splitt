import { Router } from "express";
import {
  createGroupHandler,
  getGroupHandler,
  listGroupsHandler,
} from "../controllers/groups.controller";
import {
  addParticipantHandler,
  deleteParticipantHandler,
  listParticipantsHandler,
  updateParticipantHandler,
} from "../controllers/participants.controller";
import { attachDbUser, requireAuth } from "../middleware/auth";

const groupsRouter = Router();

groupsRouter.use(requireAuth, attachDbUser);

groupsRouter.post("/", createGroupHandler);
groupsRouter.get("/", listGroupsHandler);
groupsRouter.get("/:id", getGroupHandler);

// Participant routes
groupsRouter.post("/:groupId/participants", addParticipantHandler);
groupsRouter.get("/:groupId/participants", listParticipantsHandler);
groupsRouter.patch("/:groupId/participants/:participantId", updateParticipantHandler);
groupsRouter.delete("/:groupId/participants/:participantId", deleteParticipantHandler);

export { groupsRouter };
