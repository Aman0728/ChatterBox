import express from 'express'
import {
    getAllContacts, 
    sendMessage, 
    getChatPatners, 
    getMessagesByUserId 
} from '../controller/message.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protectedRoute)
router.route("/contacts").post(getAllContacts)
router.route("/chats").post(getChatPatners)
router.route("/:id").post(getMessagesByUserId)
router.route("/send/:id").post(sendMessage)

export default router