import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js"  
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AbsenRoute from "./routes/AbsenRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import multer from 'multer';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db,
    expiration: 120 * 60 * 1000,
    checkExpirationInterval: 120 * 60 * 1000
})

const storage = multer.memoryStorage(); // Menggunakan memory storage untuk menyimpan file di buffer
const upload = multer({ storage: storage });

/* (async () => {
    await db.sync();
})();   */

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
app.post('/tapin', upload.single('photo'), (req, res) => {
    createAbsenTapin(req, res);
});

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});