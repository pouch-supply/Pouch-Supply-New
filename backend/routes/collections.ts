import { Router } from "express";
import { fetchResource, saveResource, getDb } from "../../serverDb";

const router = Router();

// GET all collections
router.get("/", async (req, res) => {
  try {
    const data = await fetchResource("collections");
    res.json(data);
  } catch (err: any) {
    console.error("[Collections Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch collections" });
  }
});

// POST update/sync collections
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Collections API expects an array of documents" });
    }

    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }

    const updated = await saveResource("collections", payload);
    res.json(updated);
  } catch (err: any) {
    console.error("[Collections Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist collections" });
  }
});

export default router;
