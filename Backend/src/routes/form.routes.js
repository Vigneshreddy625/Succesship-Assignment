import { Router } from "express";
import { addForm, getUserForms } from "../controllers/form.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, addForm);
router.get("/", verifyJWT, getUserForms);

export default router;