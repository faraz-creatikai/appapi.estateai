import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getRedditPosts } from "../controllers/controller.socialContent.js";

const socialContentRoutes = express.Router();

socialContentRoutes.use(protectRoute);

// Placeholder route for social content management
socialContentRoutes.get("/reddit/:query", getRedditPosts);

export default socialContentRoutes;