import { Router } from "express";
import { authRouter } from "./auth.routes";
import { groupsRouter } from "./groups.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/groups", groupsRouter);

export { apiRouter };
