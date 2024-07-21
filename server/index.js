import express from "express";
import cors from "cors";

import connection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
connection();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

// API Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
