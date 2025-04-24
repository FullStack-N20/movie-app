import express from "express"
import { config } from "dotenv"
import { connectDB } from "./db/index.js"
import adminRoutes from './routes/admin.routes.js'


config();

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
await connectDB()

app.use('/admin' ,adminRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

