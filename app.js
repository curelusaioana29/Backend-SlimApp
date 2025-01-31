const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
mongoose.set('strictQuery', false);

const authRouter = require('./routes/api/authRouter');
const productsRouter = require('./routes/api/productsRouter');
const myProductsRouter = require('./routes/api/myProductsRouter');
const googleAuthRouter = require('./routes/api/authGoogleRouter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies) for (let cookie in req.cookies) res.clearCookie(cookie);

  next();
});

console.log('Cookies are clear. 🍪');

app.use('/api/users', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/myProducts', myProductsRouter);
app.use('/api/auth', googleAuthRouter);

app.use((_, res) => res.status(404).json({ message: 'Not Found' }));

app.use((err, _, res, __) => {
  const { status = 500, message = 'Server internal error' } = err;

  res.status(status).json({ message });
});

module.exports = app;
