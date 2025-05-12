import express from 'express'
import { isAuthorized, login, logout, register, updateProfile } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router()

router.route("/register").post(singleUpload,register)
router.route("/login").post(login)
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated,isAuthorized)

export default router