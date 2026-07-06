import express from 'express'
import { getAllGroups, 
    getAllMembers, 
    addMember, 
    createGroup, 
    getGroupMessages, 
    sendGroupMessage,
    kickUser
 } from '../controller/group.controller.js' 
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()
router.use(protectedRoute)

router.route("/create").post(createGroup)
router.route("/members/:id").get(getAllMembers)
router.route("/add/:id").get(addMember)
router.route("/delete/:id").get(getAllMembers)
router.route("/allgroups").get(getAllGroups)
router.route("/send/:id").post(sendGroupMessage)
router.route("/:id").get(getGroupMessages)
router.route("/kick/:groupId/:userId").patch(kickUser)

export default router
