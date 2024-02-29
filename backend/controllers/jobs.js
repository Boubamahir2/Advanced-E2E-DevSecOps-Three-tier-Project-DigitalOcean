const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const moment = require("moment");
const mongoose = require("mongoose");
const checkPermissions = require("../utils/checkPermissions.js");

//create job
const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//get all jobs 
//here we are getting all the jobs that arae associated with a specific user
const getALLJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;
  const queryObject = {
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  // NO AWAIT
  let result = Job.find(queryObject);
 

  // chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  // set pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  result = result.skip(startIndex).limit(limit);
  const jobs = await result;

  // get total count
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

// get all jobs by a single user
const getALLJobsBySingleUser = async (req, res) => {
  const { status, jobType, sort, search } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  // NO AWAIT
  let result = Job.find(queryObject);

  // chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  // set pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  result = result.skip(startIndex).limit(limit);
  const jobs = await result;

  // get total count
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};



//get a single job
const getJob = async (req, res) => {
  //lets use nested destructuring as well to get the job id from the params and give it an alias of jobId and the user id from the user and all are from the req
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with given id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

//update  job
const updateJob = async (req, res) => {
  //lets use nested destrucing as well
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError("company and position fields cannot be empty ");
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with given id ${jobId}`);
  }
// check if the user is the owner of the job
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId },
    req.body,
    { new: true,
      runValidators: true
    });
  res.status(StatusCodes.OK).json({ updatedJob });
};

// delete job
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with given id ${jobId}`);
  }
  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).send({ msg: "Success! Job removed" });
};

// showStats
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId)}},
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc,curr) => {
    const { _id:title, count } = curr;
    acc[title] = count;
    return acc;
  },{});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyStats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyStats = monthlyStats.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format("MMM Y");
    return { date, count };
   }).reverse(); // reverse the array to show the latest months first

  res.status(StatusCodes.OK).json({ defaultStats, monthlyStats });
}

module.exports = {
  getALLJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  getALLJobsBySingleUser,
};
