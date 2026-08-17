const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/auth');
const habitsRouter = require('./routers/habits');
const connectDB = require('./db');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const { requireJwt } = require('./middlewares/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4001;

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/habits', requireJwt, habitsRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`habit-tracker-api listening at http://localhost:${port}`);
});
