import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shareRoutes from "./routes/sharingRoute.js";
import cookieParser from "cookie-parser";
import checkAuth from "./auth.js";

const app = express(); 
app.use(cookieParser())
app.use(express.json());
app.use(cors({
  origin: true,           
  credentials: true,      // allow cookies/auth headers
  exposedHeaders: ['Content-Disposition'] // allow JS to read
}));

app.use("/directory",checkAuth, directoryRoutes);
app.use("/file",checkAuth, fileRoutes);
app.use("/user", userRoutes);
app.use("/sharing",shareRoutes);


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(4000, () => {
  console.log(`Server Started http://localhost:4000`);
});
