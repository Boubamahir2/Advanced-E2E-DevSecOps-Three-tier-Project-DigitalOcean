const express = require("express");
const router = express.Router();

const {
  getALLJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  getALLJobsBySingleUser,
} = require("../controllers/jobs");

router.route("/").post(createJob).get(getALLJobs);
router.route("/allJobsByUser").get(getALLJobsBySingleUser);
router.route("/stats").get(showStats);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
