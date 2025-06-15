import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import productRoutes from "./routes/product.routes.js";
import { sql } from "./config/db.config.js";
import { arcjetMiddleware } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//apply Arcjet middleware for all routes
app.use(async (req, res, next) => {
  try {
    const decision = await arcjetMiddleware.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Access Denied - Bot Detected" });
      } else {
        res.status(403).json({ error: "Forbidden - Access Denied" });
      }
      return;
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Access Denied - Spoofed Bot Detected" });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next(error);
  }
});

app.use("/api/products", productRoutes);
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => res.send("API server checked!"));

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database initialized");
  } catch (error) {
    console.log("Error init DB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost: " + PORT);
  });
});
