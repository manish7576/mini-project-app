import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shareRoutes from "./routes/sharingRoute.js";
import cookieParser from "cookie-parser";
import checkAuth from "./auth.js";

export  const cloudFlareUrl = "https://steve-copyrights-clinic-hierarchy.trycloudflare.com" 
  
const app = express(); 
app.use((req,res,next)=>{ 
   res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `connect-src 'self' http://localhost:1000 ${cloudFlareUrl}`,
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
    ].join("; ")
  );
  next();
})
app.use(cookieParser()) 
app.use(express.json());
app.use(cors({
  origin:true,           
  credentials: true,      // allow cookies/auth headers
  exposedHeaders: ['Content-Disposition'] // allow JS to read
}));

app.use("/api/directory",checkAuth, directoryRoutes);
app.use("/api/file",checkAuth, fileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sharing",shareRoutes);


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(1000, () => {
  console.log(`Server Started http://localhost:1000`);
});
