import express from "express";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { fetchResource, saveResource, saveUploadedImage, getUploadedImage, getConnectionStatus, updateMongoUri, getDb, getDatabaseDetails, fetchLayoutSettings, saveLayoutSettings } from "./serverDb";

// Import modular routers for products, collections, customers, orders, files, discounts, custom pages, and blogs
import productsRouter from "./backend/routes/products";
import collectionsRouter from "./backend/routes/collections";
import ordersRouter from "./backend/routes/orders";
import filesRouter from "./backend/routes/files";
import customersRouter from "./backend/routes/customers";
import discountsRouter from "./backend/routes/discounts";
import customPagesRouter from "./backend/routes/customPages";
import blogsRouter from "./backend/routes/blogs";
import worldpayRouter from "./backend/routes/worldpay";
import agecheckedRouter from "./backend/routes/agechecked";

export async function createExpressApp() {
  const app = express();

  // Set limits for payload uploads since products or media arrays can be large
  // Vercel serverless functions pre-parse req.body. To prevent hanging on the streams,
  // we check if req.body is already parsed, and if so, skip express.json() / express.urlencoded()
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.json({ limit: "50mb" })(req, res, next);
  });

  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });



  // Serves /uploads with lazy loading fallback from MongoDB Atlas!
  let uploadsPath = path.join(process.cwd(), "uploads");
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      uploadsPath = "/tmp/uploads";
    }
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
  } catch (err) {
    console.warn("[Uploads Setup] Failed to create uploads directory at", uploadsPath, ". Falling back to /tmp/uploads", err);
    uploadsPath = "/tmp/uploads";
    try {
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
      }
    } catch (tmpErr) {
      console.error("[Uploads Setup] Fatal: failed to create /tmp/uploads:", tmpErr);
    }
  }

  app.get("/uploads/:filename", async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsPath, filename);
      
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      
      // If the file is missing from disk, try lazy-loading it from MongoDB Atlas!
      const dotIndex = filename.lastIndexOf(".");
      const id = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
      
      console.log(`[Uploads Restore] File ${filename} missing from local disk. Restoring from MongoDB...`);
      const imgDoc = await getUploadedImage(id);
      if (imgDoc && imgDoc.base64Data) {
        fs.writeFileSync(filePath, Buffer.from(imgDoc.base64Data, "base64"));
        console.log(`[Uploads Restore] Restored successfully: ${filename}`);
        return res.sendFile(filePath);
      }
    } catch (err) {
      console.error("[Uploads Restore] Failed during lazy load restoration:", err);
    }
    next();
  });

  // Serve static uploaded files locally from disk as a fallback for standard directory requests
  app.use("/uploads", express.static(uploadsPath));

  // API Route: Secure binary/base64 Image Storage
  app.post("/api/upload", async (req, res) => {
    try {
      const { data, filename } = req.body;
      if (!data) {
        return res.status(400).json({ error: "Missing data payload for upload." });
      }

      // Check if it's already a clean base64 dataURI
      let base64String = data;
      let mimeType = "image/png";

      if (typeof data === "string" && data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
        }
      }

      if (typeof base64String === "string" && base64String.includes(";base64,")) {
        base64String = base64String.split(";base64,").pop() || base64String;
      }
      base64String = (base64String || "").trim();

      // Optional Cloudinary Upload proxy
      let cloudinaryUrl: string | null = null;
      try {
        const layoutSettings = await fetchLayoutSettings();
        const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || layoutSettings?.cloudinaryCloudName || "").trim();
        const apiKey = (process.env.CLOUDINARY_API_KEY || layoutSettings?.cloudinaryApiKey || "").trim();
        const apiSecret = (process.env.CLOUDINARY_API_SECRET || layoutSettings?.cloudinaryApiSecret || "").trim();

        if (cloudName && apiKey && apiSecret && cloudName.toLowerCase() !== 'pouch' && cloudName.toLowerCase() !== 'pouch supply') {
          console.log(`[Cloudinary Proxy] Configuring Cloudinary connection for Cloud Name: ${cloudName}...`);
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
          });

          const uploadStr = data.startsWith("data:") ? data : `data:${mimeType};base64,${base64String}`;
          console.log(`[Cloudinary Proxy] Uploading ${mimeType} asset directly to Cloudinary edge servers...`);
          
          const cloudinaryResponse = await cloudinary.uploader.upload(uploadStr, {
            resource_type: "auto",
            folder: "pouch_supply"
          });

          if (cloudinaryResponse && cloudinaryResponse.secure_url) {
            cloudinaryUrl = cloudinaryResponse.secure_url;
            console.log("[Cloudinary Proxy] Success! Uploaded to Cloudinary CDN URL:", cloudinaryUrl);

            // Register in files collection in MongoDB
            try {
              const currentFiles = await fetchResource("files") || [];
              const calculatedSize = `${Math.round((base64String.length * 0.75) / 1024)} KB`;
              const filenameFromMime = `cloudinary_${Date.now()}.${mimeType.split("/")[1] || "png"}`;
              const newFileEntry = {
                id: `cloud-${Date.now()}`,
                fileName: filenameFromMime,
                url: cloudinaryUrl,
                altText: "Cloudinary CDN hosted media asset",
                mimeType: mimeType,
                fileSize: calculatedSize
              };
              currentFiles.push(newFileEntry);
              await saveResource("files", currentFiles);
              console.log("[Cloudinary DB Sync] Saved new Cloudinary media record to MongoDB 'files' collection.");
            } catch (dbErr) {
              console.error("[Cloudinary DB Sync] Failed to register file record in 'files' collection:", dbErr);
            }
          }
        }
      } catch (err: any) {
        console.log(`[Cloudinary Proxy] Cloudinary upload bypassed (${err?.message || 'fallback'}), saving directly to MongoDB Atlas & local media storage.`);
      }

      if (cloudinaryUrl) {
        return res.json({ url: cloudinaryUrl, id: `cloud-${Date.now()}` });
      }

      const id = `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      
      // Determine correct file extension from mimeType
      let extension = "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
        extension = "jpg";
      } else if (mimeType.includes("gif")) {
        extension = "gif";
      } else if (mimeType.includes("webp")) {
        extension = "webp";
      } else if (mimeType.includes("mp4")) {
        extension = "mp4";
      } else if (mimeType.includes("webm")) {
        extension = "webm";
      } else if (mimeType.includes("ogg")) {
        extension = "ogg";
      } else if (mimeType.includes("svg")) {
        extension = "svg";
      }

      // Save locally to disk for instant static serving (which natively supports HTTP Range Requests / video seeking)
      const filenameOnDisk = `${id}.${extension}`;
      const filePath = path.join(uploadsPath, filenameOnDisk);
      try {
        fs.writeFileSync(filePath, Buffer.from(base64String, "base64"));
        console.log(`[API Upload] Successfully saved file to disk: ${filePath}`);
      } catch (fsErr) {
        console.error("[API Upload] Failed to write file to local disk:", fsErr);
      }

      // Sync to MongoDB Atlas for persistence
      await saveUploadedImage(id, base64String, mimeType);
      
      // Return the static uploads url which supports byte ranges for videos
      const imageUrl = `/uploads/${filenameOnDisk}`;
      
      // Always return relative URL so the browser loads directly from current origin without domain mismatch
      console.log(`[API Upload] Successfully persisted ${mimeType} media. Final URL: ${imageUrl}`);
      res.json({ url: imageUrl, id });
    } catch (err: any) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload database insertion" });
    }
  });

  // API Route: Test Cloudinary Connection & Credentials
  app.post("/api/test-cloudinary", async (req, res) => {
    try {
      const layoutSettings = await fetchLayoutSettings();
      const cloudName = (req.body?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || layoutSettings?.cloudinaryCloudName || "").trim();
      const apiKey = (req.body?.apiKey || process.env.CLOUDINARY_API_KEY || layoutSettings?.cloudinaryApiKey || "").trim();
      const apiSecret = (req.body?.apiSecret || process.env.CLOUDINARY_API_SECRET || layoutSettings?.cloudinaryApiSecret || "").trim();

      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(400).json({
          success: false,
          error: "Missing Cloudinary credentials. Please enter Cloud Name, API Key, and API Secret."
        });
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });

      const testPixel = "data:image/png;base64,iVBORw0KGgoAAAANSU5EUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const uploadRes = await cloudinary.uploader.upload(testPixel, {
        folder: "pouch_supply_test",
        public_id: `test_ping_${Date.now()}`
      });

      if (uploadRes && uploadRes.secure_url) {
        return res.json({
          success: true,
          message: `Cloudinary active & connected successfully! Hosted test image: ${uploadRes.secure_url}`,
          url: uploadRes.secure_url
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Cloudinary did not return a valid secure_url."
        });
      }
    } catch (err: any) {
      console.log("[Test Cloudinary] Validation failed:", err?.message || err);
      return res.status(500).json({
        success: false,
        error: err?.message || "Failed to authenticate or upload to Cloudinary."
      });
    }
  });

  // API Route: Image Provider / Streamer
  app.get("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const imgDoc = await getUploadedImage(id);
      if (!imgDoc) {
        return res.status(404).send("Image not found");
      }

      const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": imgDoc.mimeType,
        "Content-Length": imgBuffer.length,
        "Cache-Control": "public, max-age=31536000" // Persistent browser caching
      });
      res.end(imgBuffer);
    } catch (err: any) {
      console.error("[API Images] Server error serving asset document:", err);
      res.status(500).send("Internal server error serving media");
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/db-status", async (req, res) => {
    try {
      await getDb();
    } catch (e) {}
    res.json(getConnectionStatus());
  });

  app.get("/api/db-details", async (req, res) => {
    try {
      const details = await getDatabaseDetails();
      res.json(details);
    } catch (err: any) {
      console.error("[API db-details] Error fetching DB details:", err);
      res.status(500).json({ error: err.message || "Failed to fetch database details" });
    }
  });

  app.post("/api/update-db-uri", async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri) {
        return res.status(400).json({ error: "No connection string was provided." });
      }
      // Re-initialize with new Mongo URI
      updateMongoUri(uri);
      
      // Attempt immediate connection check
      await getDb();
      
      res.json(getConnectionStatus());
    } catch (err: any) {
      console.error("[API update-db-uri] Error saving and testing URI:", err);
      res.status(500).json({ error: err.message || "Failed to update connection string" });
    }
  });

  // API Route: GET /api/layoutsettings
  app.get("/api/layoutsettings", async (req, res) => {
    try {
      const data = await fetchLayoutSettings();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to load layout settings" });
    }
  });

  // API Route: POST /api/layoutsettings
  app.post("/api/layoutsettings", async (req, res) => {
    try {
      const saved = await saveLayoutSettings(req.body);
      res.json({ status: "success", data: saved });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save layout settings" });
    }
  });

  // Mount modular backend routers to handle storefront and admin entities properly
  app.use("/api/products", productsRouter);
  app.use("/api/collections", collectionsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/files", filesRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/discounts", discountsRouter);
  app.use("/api/custompages", customPagesRouter);
  app.use("/api/blogs", blogsRouter);
  app.use("/api/worldpay", worldpayRouter);
  app.use("/api/agechecked", agecheckedRouter);

  // Fallback endpoint for legacy image requests
  app.get("/placeholder.png", (req, res) => {
    res.redirect("https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80");
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    // Using "custom" appType so we can explicitly handle SPA fallback ourselves without Vite intercepting and returning 404s
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Fallback all other requests during development to index.html to support SPA routes
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Skip api paths and files with extensions (e.g. .js, .css, .png, etc.)
      const lastSegment = url.split('/').pop() || '';
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return next();
      }
      try {
        const fs = await import("fs");
        let html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`[Production Setup] Static directory: ${distPath}`);
    app.use(express.static(distPath));
    
    // Fallback all other production requests to index.html to support SPA routing
    app.get('*', (req, res) => {
      const url = req.originalUrl;
      const lastSegment = url.split('/').pop() || '';
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return res.status(404).send("API or File Asset Not Found");
      }
      
      const indexPath = path.join(distPath, 'index.html');
      console.log(`[Production Fallback] Sending index.html for request: ${req.url}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Production Fallback] Error sending index.html:`, err);
          res.status(500).send("Internal Server Error: Missing compiled static resources.");
        }
      });
    });
  }

  return app;
}
