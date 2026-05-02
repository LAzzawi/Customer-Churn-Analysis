import { Router, type IRouter } from "express";
import healthRouter from "./health";
import churnRouter from "./churn";

const router: IRouter = Router();

router.use(healthRouter);
router.use(churnRouter);

export default router;
