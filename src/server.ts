import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import "dotenv/config";
let server: Server;
const port = process.env.PORT || 5000;
async function bootstrap() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.whnyl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  );
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
