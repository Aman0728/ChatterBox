import express from 'express'
import { signup, login, logout } from '../controller/auth.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(protectedRoute, logout)

export default router