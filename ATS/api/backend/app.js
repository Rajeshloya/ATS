// app.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from'./routes/userRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import contactRoutes from './routes/userRoutes.js';

dotenv.config()

const app = express();
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


//CORS Policy
/*app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}))*/

//CORS Policy
app.use(cors({
    credentials:true,
    origin:['http://localhost:3000']
}))

 // Database connection
  connectDB(DATABASE_URL)


//app.use(cookieParser())

//JSON
app.use(express.json());

// Load Routes

app.use("/api/user", userRoutes);
app.use('/', candidateRoutes);
app.use('/contact', contactRoutes);

    // Start the server

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port} `);
    })
