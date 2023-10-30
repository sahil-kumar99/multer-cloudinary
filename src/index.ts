import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "routes/user";
import { MONGO_URI } from "config";

const app: Express = express();
const PORT = 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect(MONGO_URI || "");
mongoose.connection.on("connected", () => {
  app.listen(PORT, () => {
    console.log(`server running at: ${PORT}`);
  });
});
mongoose.connection.on("error", () => {
  console.log("error connecting to mongo ");
});
