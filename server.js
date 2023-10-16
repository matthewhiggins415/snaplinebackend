const express = require('express');
const mongoose = require('mongoose');
const color = require('colors');
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const cors = require('cors');
const auth = require('./lib/auth.js');
const bodyParser = require('body-parser');

// routes 
const userRoutes = require('./routes/userRoutes');
const s3Router = require('./routes/s3Upload');
const stripeRoutes = require('./routes/stripeRoutes');

// connect to db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGO_URI_USERNAME}:${process.env.MONGO_URI_PW}@snapline.20yggtd.mongodb.net/`, {
      useNewUrlParser: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch(error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
}
  
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: `here's process.env.NODE_ENV: ${process.env.NODE_ENV}` });
})

app.use(auth);
app.use(userRoutes);
app.use(s3Router)
app.use(stripeRoutes);

const port = process.env.PORT || 5000

app.listen(port, console.log(`server running in ${process.env.NODE_ENV} mode on port ${port}`.blue.bold))


