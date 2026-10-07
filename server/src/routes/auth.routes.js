import express from "express";
import { registerUser , welcome } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", registerUser);
router.get("/",welcome);

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;