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
router.route("/contacts").get(getAllContacts)
router.route("/chats").get(getChatPatners)
router.route("/:id").get(getMessagesByUserId)
router.route("/send/:id").post(sendMessage)

export default router