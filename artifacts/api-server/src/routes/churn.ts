import { Router, type IRouter } from "express";
import {
  getChurnOverview,
  getChurnDistribution,
  getChurnFeatures,
  getModelResults,
  getFeatureImportance,
  getRecommendations,
} from "../lib/churn-analysis.js";

const router: IRouter = Router();

router.get("/churn/overview", async (_req, res): Promise<void> => {
  res.json(getChurnOverview());
});

router.get("/churn/distribution", async (_req, res): Promise<void> => {
  res.json(getChurnDistribution());
});

router.get("/churn/features", async (_req, res): Promise<void> => {
  res.json(getChurnFeatures());
});

router.get("/churn/model", async (_req, res): Promise<void> => {
  res.json(getModelResults());
});

router.get("/churn/feature-importance", async (_req, res): Promise<void> => {
  res.json(getFeatureImportance());
});

router.get("/churn/recommendations", async (_req, res): Promise<void> => {
  res.json(getRecommendations());
});

export default router;
