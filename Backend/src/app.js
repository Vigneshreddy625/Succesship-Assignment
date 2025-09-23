import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import configurePassport from './config/passport.js'
import dotenv from "dotenv"
import passport from "passport";
import helmet from "helmet"
import sheetsRoutes from './routes/sheets.routes.js'
import authRoutes from './routes/auth.routes.js'
import formRoutes from './routes/form.routes.js'

dotenv.config({ path: './.env' });

const app = express();
app.set('trust proxy', true);
app.use(passport.initialize());

configurePassport();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/sheets', sheetsRoutes)
app.use('/api/forms', formRoutes)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export { app }