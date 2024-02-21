const tasks = require('./routes/tasks');
const connectDB = require('./db');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/ok', (req, res) => {
  res.status(200).send('ok');
});

app.use('/api/tasks', tasks);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();