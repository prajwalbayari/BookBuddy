import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb is connected successfully!!"))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`Server is now running on the port ${PORT}`);
});
