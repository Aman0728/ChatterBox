import express from 'express'
import { signup, login, logout, block, unblock, checkBlock } from '../controller/auth.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(protectedRoute, logout)
router.get("/check", protectedRoute, (req, res) => res.status(200).json(req.user));
router.route("/block/:id").post(protectedRoute, block)
router.route("/block/:id").delete(protectedRoute, unblock)
router.route("/block/:id").get(protectedRoute, checkBlock)

export default router