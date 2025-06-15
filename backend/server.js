import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import productRoutes from "./routes/product.routes.js";
import { sql } from "./config/db.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

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
