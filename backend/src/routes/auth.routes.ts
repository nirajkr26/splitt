import { Router } from "express";
import { syncCurrentUser } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/sync", requireAuth, syncCurrentUser);

export { authRouter };
