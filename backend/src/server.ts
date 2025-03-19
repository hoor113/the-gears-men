import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import testRoutes from "./routes/routes";
import authenticationRoutes from "./routes/authenticationRoutes"
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api", testRoutes);
app.use("/api/authentication", authenticationRoutes);

setupSwagger(app);

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("MongoDB connection error:", err));



