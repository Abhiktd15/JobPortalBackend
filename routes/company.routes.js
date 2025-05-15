import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controller.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router()

router.use(isAuthenticated)
router.route("/register").post(registerCompany)
router.route("/get").get(getCompany)
router.route("/get/:id").get(getCompanyById)
router.route("/update/:id").post(singleUpload,updateCompany)

export default router