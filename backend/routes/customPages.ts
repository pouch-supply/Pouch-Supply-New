import { Router } from "express";
import { fetchResource, saveResource, getDb } from "../../serverDb";

const router = Router();

// GET all custom pages
router.get("/", async (req, res) => {
  try {
    const data = await fetchResource("customPages");
    res.json(data);
  } catch (err: any) {
    console.error("[CustomPages Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch custom pages" });
  }
});

// POST update/sync custom pages
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "CustomPages API expects an array of documents" });
    }

    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }

    const updated = await saveResource("customPages", payload);
    res.json(updated);
  } catch (err: any) {
    console.error("[CustomPages Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist custom pages" });
  }
});

export default router;
