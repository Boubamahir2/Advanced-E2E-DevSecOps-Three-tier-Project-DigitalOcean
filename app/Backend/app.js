require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const Job = require('./models/Job');
const jsonData= require('./mock-data.json');
const path = require('path');
const url = require('url');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');// limit the number of requests from the same IP
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

//protect our user infos
const authenticateUser = require('./middleware/authentication');

//copnnect db 
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// 
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


// only when ready to deploy
// app.use(express.static(path.resolve(__dirname, './client/build')))

// extra  security packages
app.set('trust proxy',1)

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
  );
  app.use(express.json());
app.use(helmet())//protect our user infos
app.use(cors())//allow our api access from different domains(cors: cross-origin resource sharing) 
app.use(xss())//prevent xss attack on our server 
app.use(mongoSanitize())//prevent mongo injection attack on our server

  //documentation
  app.get('/api/v1', (req, res) => {
    res.send(
      "<h1>Welcome to Job Finder API</h1><br><a href='/api-docs'>Documetation</a>"
    );
  });

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs', authenticateUser,jobRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;


const start = async () => {
  try {
    await connectDB('mongodb://mongodb:27017/docker-db');
    // await Job.deleteMany();
    await Job.create(jsonData);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
