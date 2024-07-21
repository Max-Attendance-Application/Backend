import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js"  
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AbsenRoute from "./routes/AbsenRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import { uploadSingle } from "./middleware/uploadMiddleware.js";
import { createAbsenTapin } from "./controllers/absen.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db,
    expiration: 120 * 60 * 1000,
    checkExpirationInterval: 120 * 60 * 1000
});

/* // IIFE untuk memeriksa koneksi database dan sinkronisasi model
(async function() {
    try {
        await db.authenticate();  // Cek koneksi ke database
        console.log('Database connected...');
        await db.sync();  // Sinkronisasi model dengan database
        console.log('Database synced...');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})(); */

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 120 * 60 * 1000,
        secure: 'auto',
    }
}))

//middleware
app.use(cors({
    credentials: true,
        //untuk frontend akses
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(UserRoute);
app.use(AbsenRoute);
app.use(AuthRoute);

/*  store.sync();  */

// Gunakan multer sebagai middleware untuk rute yang memerlukan unggahan file
app.post('/tapin', uploadSingle, (req, res) => {
    createAbsenTapin(req, res);
  });

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});