import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import groupRoutes from "./routes/group.routes.js";
import taskRoutes from "./routes/task.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import chatBotRoutes from "./routes/chatBot.routes.js";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5000",
  "http://localhost:5173",
].filter(Boolean);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Running at Port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !", err);
  });

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Origin",
      "Accept",
    ],
 }));

app.get("/", (req, res) => {
  res.send("API working");
});

// API Endpoints
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/group", groupRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api", chatBotRoutes);
