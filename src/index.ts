import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import dotenv from "dotenv";

const app = express();
dotenv.config({ path: "./src/.env" });

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server running...`);
});

const MONGO_URL = process.env.MongoDB_URL as string;

mongoose.Promise;
mongoose.connect(MONGO_URL).then((con) => {
  console.log("MongoDB connected successfully...");
});
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
