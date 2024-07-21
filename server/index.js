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
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// API Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
