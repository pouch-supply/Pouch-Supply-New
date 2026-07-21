import { Router } from "express";
import { fetchResource, saveResource, getDb } from "../../serverDb";

const router = Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const data = await fetchResource("products");
    res.json(data);
  } catch (err: any) {
    console.error("[Products Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});

// POST update/sync products
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Products API expects an array of documents" });
    }

    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }

    const updated = await saveResource("products", payload);
    res.json(updated);
  } catch (err: any) {
    console.error("[Products Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist products" });
  }
});

export default router;
