require('dotenv').config();
require('express-async-errors');

//Security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// ConnectDB
const coonectDB= require('./db/connect')
const authenticateUser= require('./middleware/authentication')
// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs'); 


// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({windowMs:  60 * 1000, max: 60 })
);

app.get('/', (req, res) => {
  res.send('<h1>JOBS-API</h1>');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs',authenticateUser, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await coonectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
