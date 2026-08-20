import { Router } from "express";
import * as searchController from "../controllers/search.controller";
import { optionalAuthenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", optionalAuthenticate, searchController.search);

export default router;
