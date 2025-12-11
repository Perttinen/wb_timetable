import Router from "express"

import userlevels from "../controllers/userlevelController"
import { authorizer } from "../util/middleware"

const router = Router()

router.route("/").get(authorizer("admin"), userlevels.getUserlevels)

export default router
