import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { filterData, getAdminJob, getAllJobs, getJobsById, postJob } from '../controllers/job.controller.js'

const router = express.Router()

router.use(isAuthenticated)
router.route("/post").post(postJob)
router.route("/get").get(getAllJobs)
router.route("/filter").get(filterData)
router.route("/get/:id").get(getJobsById)
router.route('/getAdminJobs').get(getAdminJob)
export default router