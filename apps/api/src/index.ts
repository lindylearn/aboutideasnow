import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import { router } from "./routes/index.js";

// Setup express server
const app: Application = express();

// Process middleware
app.use(cors());
app.use(express.json());

// Handle requests
app.use(router);

// Start server
const PORT: number = parseInt(process.env.PORT as string, 10) || 7101;
app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
