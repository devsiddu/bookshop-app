import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoute.js";
import connectDB from "./configs/db.js";
import bookRouter from "./routes/bookRoute.js";

const app = express();

await connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => res.send("Server is running"));

//auth routes
app.use("/api/auth", authRouter);
//book routes
app.use("/api/books", bookRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
