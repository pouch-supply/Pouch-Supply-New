import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, 
  INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './src/initialData';

import {
  ProductModel, CollectionModel, OrderModel, FileModel,
  CustomerModel, DiscountModel, CustomPageModel, BlogModel,
  UploadedImageModel, LayoutSettingsModel, connectMongoose, getMongooseStatus, resetConnection, DbStatus
} from './mongooseDb';

// Re-export type if needed
export type { DbStatus };

// In-Memory state fallback cache in case MongoDB is not connected
const memoryCache: Record<string, any[]> = {
  products: [...INITIAL_PRODUCTS],
  collections: [...INITIAL_COLLECTIONS],
  orders: [...INITIAL_ORDERS],
  files: [...INITIAL_FILES],
  customers: [...INITIAL_CUSTOMERS],
  discounts: [...INITIAL_DISCOUNTS],
  customPages: [...DEFAULT_PAGES],
  blogs: [...INITIAL_BLOGS],
};

const BACKUP_FILE_PATH = path.join(process.cwd(), 'local_store_data.json');

function loadMemoryCacheFromBackup() {
  try {
    if (fs.existsSync(BACKUP_FILE_PATH)) {
      const raw = fs.readFileSync(BACKUP_FILE_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            memoryCache[key] = data[key];
          }
        }
        console.log('[Local Backup] Successfully loaded memoryCache from local_store_data.json backup.');
      }
    }
  } catch (err) {
    console.warn('[Local Backup] Could not load local_store_data.json backup:', err);
  }
}

function persistMemoryCacheToBackup() {
  try {
    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(memoryCache, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Local Backup] Could not write to local_store_data.json backup:', err);
  }
}

// Load disk backup immediately on server startup
loadMemoryCacheFromBackup();

function normalizeResourceName(resource: string): string {
  if (!resource) return resource;
  const lower = resource.toLowerCase();
  if (lower === 'custompages') return 'customPages';
  return resource;
}

function getModelForResource(resource: string) {
  const norm = normalizeResourceName(resource);
  switch (norm) {
    case 'products': return ProductModel;
    case 'collections': return CollectionModel;
    case 'orders': return OrderModel;
    case 'files': return FileModel;
    case 'customers': return CustomerModel;
    case 'discounts': return DiscountModel;
    case 'customPages': return CustomPageModel;
    case 'blogs': return BlogModel;
    default: return null;
  }
}

async function seedIfEmpty() {
  const seedPairs = [
    { model: ProductModel, name: 'products', data: INITIAL_PRODUCTS },
    { model: CollectionModel, name: 'collections', data: INITIAL_COLLECTIONS },
    { model: OrderModel, name: 'orders', data: INITIAL_ORDERS },
    { model: FileModel, name: 'files', data: INITIAL_FILES },
    { model: CustomerModel, name: 'customers', data: INITIAL_CUSTOMERS },
    { model: DiscountModel, name: 'discounts', data: INITIAL_DISCOUNTS },
    { model: CustomPageModel, name: 'customPages', data: DEFAULT_PAGES },
    { model: BlogModel, name: 'blogs', data: INITIAL_BLOGS },
  ];

  for (const pair of seedPairs) {
    try {
      const model = pair.model as any;
      const count = await model.countDocuments();
      if (count === 0) {
        // Use locally cached data if available (user created items), otherwise default initial data
        const cached = memoryCache[pair.name] || [];
        const sourceData = cached.length > 0 ? cached : (pair.data || []);
        if (sourceData && sourceData.length > 0) {
          console.log(`[Mongoose Seeding] Collection "${pair.name}" is empty in MongoDB. Seeding with ${sourceData.length} items from cache/defaults...`);
          for (const item of sourceData) {
            if (!item.id) continue;
            const { _id, __v, ...cleanItem } = item;
            await model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
          }
        }
      }
    } catch (e) {
      console.error(`[Mongoose Seeding] Failed to seed ${pair.name}:`, e);
    }
  }
}

export function getConnectionStatus(): DbStatus {
  return getMongooseStatus();
}

export async function getDatabaseDetails(): Promise<any> {
  try {
    const status = getMongooseStatus();
    
    if (status.status !== 'connected') {
      try {
        await connectMongoose();
      } catch (e) {}
    }
    
    const currentStatus = getMongooseStatus();
    const readyState = mongoose.connection.readyState;
    
    const details: any = {
      status: currentStatus.status,
      uriHost: currentStatus.uriHost || 'N/A',
      error: currentStatus.error || null,
      readyState,
      readyStateLabel: getReadyStateLabel(readyState),
      dbName: mongoose.connection.name || 'N/A',
      collections: [],
      models: Object.keys(mongoose.models),
    };

    if (readyState === 1 && mongoose.connection.db && typeof mongoose.connection.db.listCollections === 'function') {
      try {
        const db = mongoose.connection.db;
        const collectionsList = await db.listCollections().toArray();
        const collectionsInfo = [];
        for (const col of collectionsList) {
          if (col && col.name) {
            const count = await db.collection(col.name).countDocuments();
            collectionsInfo.push({
              name: col.name,
              count
            });
          }
        }
        details.collections = collectionsInfo;
      } catch (err: any) {
        details.collectionError = err.message || String(err);
      }
    }

    return details;
  } catch (err: any) {
    console.error("[Database Info] Error inside getDatabaseDetails:", err);
    return {
      status: 'error',
      uriHost: 'N/A',
      error: err.message || String(err),
      readyState: mongoose.connection.readyState,
      readyStateLabel: getReadyStateLabel(mongoose.connection.readyState),
      dbName: 'N/A',
      collections: [],
      models: []
    };
  }
}

function getReadyStateLabel(state: number): string {
  switch (state) {
    case 0: return 'Disconnected';
    case 1: return 'Connected';
    case 2: return 'Connecting';
    case 3: return 'Disconnecting';
    default: return 'Unknown';
  }
}

export function updateMongoUri(newUri: string): DbStatus {
  const trimmedUri = newUri.trim();
  process.env.MONGODB_URI = trimmedUri;

  // Persist the new connection string in the local .env file
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const regex = /^MONGODB_URI\s*=\s*.*$/m;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `MONGODB_URI="${trimmedUri}"`);
    } else {
      envContent = `${envContent.trim()}\nMONGODB_URI="${trimmedUri}"\n`;
    }
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('[Database Info] Successfully persisted MONGODB_URI configuration to /.env file');
  } catch (err) {
    console.warn("[Database Info] Failed to save MONGODB_URI to /.env configuration file:", err);
  }

  // Reset existing connections to force reconnect upon the next db call
  resetConnection();
  return getMongooseStatus();
}

export async function getDb(): Promise<any | null> {
  const conn = await connectMongoose();
  if (conn) {
    await seedIfEmpty();
    return conn.connection.db;
  }
  return null;
}

function checkAndResetOnNetworkError(error: any) {
  if (!error) return;
  const errorStr = String(error?.stack || error?.message || error || "");
  if (
    errorStr.includes("MongoNetworkError") ||
    errorStr.includes("SSL") ||
    errorStr.includes("ssl") ||
    errorStr.includes("tls") ||
    errorStr.includes("alert number 80") ||
    errorStr.includes("ECONNRESET") ||
    errorStr.includes("ETIMEDOUT") ||
    errorStr.includes("Topology")
  ) {
    console.warn(`[Mongoose Engine] Transient network event detected (${error?.name || 'Error'}): ${error?.message || 'Reconnecting'}`);
  }
}

// Global resource controllers that fetch from Mongoose DB or fallback to memory
export async function fetchResource(resource: string): Promise<any[]> {
  const normResource = normalizeResourceName(resource);
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(normResource) as any;
    if (conn && Model) {
      await seedIfEmpty();
      let docs = await Model.find({}).lean().exec();
      
      let cleanDocs = (docs || []).map((doc: any) => {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      });

      // Merge with locally cached backup items so user-created items are NEVER lost
      const cached = memoryCache[normResource] || memoryCache[resource] || [];
      if (cached.length > 0) {
        const dbIds = new Set(cleanDocs.map((d: any) => d.id));
        let mergedCount = 0;
        for (const item of cached) {
          if (item && item.id && !dbIds.has(item.id)) {
            cleanDocs.push(item);
            dbIds.add(item.id);
            mergedCount++;
            // Upsert missing local item into MongoDB background
            const { _id, __v, ...cleanItem } = item;
            Model.replaceOne({ id: item.id }, cleanItem, { upsert: true }).catch(() => {});
          }
        }
        if (mergedCount > 0) {
          console.log(`[fetchResource] Seamlessly merged ${mergedCount} local items into DB response for "${normResource}".`);
        }
      }

      memoryCache[normResource] = cleanDocs;
      if (normResource !== resource) memoryCache[resource] = cleanDocs;
      persistMemoryCacheToBackup();

      return cleanDocs;
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
  }
  return memoryCache[normResource] || memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  const normResource = normalizeResourceName(resource);
  
  // Guard against accidental empty payload overwrites for essential collections
  if (!Array.isArray(list)) {
    console.warn(`[saveResource] Invalid payload received for "${normResource}". Expected array.`);
    return memoryCache[normResource] || [];
  }

  if (list.length === 0 && (normResource === 'customPages' || normResource === 'custompages')) {
    console.warn(`[saveResource] Refusing to overwrite "${normResource}" with empty array to protect page builder data.`);
    return memoryCache[normResource] || [];
  }

  // Synchronously update local fallback cache and persist backup
  memoryCache[normResource] = [...list];
  if (normResource !== resource) {
    memoryCache[resource] = memoryCache[normResource];
  }
  persistMemoryCacheToBackup();

  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(normResource) as any;
    if (conn && Model) {
      const currentIds = list.map(item => item.id).filter(Boolean);
      console.log(`[saveResource] Syncing ${normResource} collection. Total items in payload: ${list.length}. Active IDs:`, currentIds);
      
      // Delete items no longer in client list
      const deleteResult = await Model.deleteMany({ id: { $nin: currentIds } });
      if (deleteResult.deletedCount > 0) {
        console.log(`[saveResource] Permanently deleted ${deleteResult.deletedCount} items from ${normResource} not in active client list.`);
      }
      
      // Upsert current items using replaceOne to avoid duplicate or outdated structures
      for (const item of list) {
        if (!item.id) continue;
        const { _id, __v, ...cleanItem } = item;
        await Model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      }
      console.log(`[saveResource] Successfully upserted and synchronized all ${list.length} items to ${normResource} collection.`);
      return list;
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
  }
  return memoryCache[normResource];
}

export async function fetchSingleItem(resource: string, id: string): Promise<any | null> {
  const normResource = normalizeResourceName(resource);
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(normResource) as any;
    if (conn && Model) {
      const doc = await Model.findOne({ id }).lean().exec();
      if (doc) {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      }
      return null;
    }
  } catch (err) {
    checkAndResetOnNetworkError(err);
    console.warn(`[fetchSingleItem] Error fetching "${normResource}" item ${id}:`, err?.message || err);
  }
  const items = memoryCache[normResource] || memoryCache[resource] || [];
  return items.find((i: any) => i.id === id) || null;
}

export async function saveSingleItem(resource: string, item: any): Promise<any> {
  if (!item || !item.id) {
    throw new Error("Item must have a valid 'id' field");
  }
  const normResource = normalizeResourceName(resource);
  
  // Update memory cache
  const items = memoryCache[normResource] || memoryCache[resource] || [];
  const existingIdx = items.findIndex((i: any) => i.id === item.id);
  if (existingIdx !== -1) {
    items[existingIdx] = { ...item };
  } else {
    items.push({ ...item });
  }
  memoryCache[normResource] = items;
  if (normResource !== resource) {
    memoryCache[resource] = items;
  }
  persistMemoryCacheToBackup();

  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(normResource) as any;
    if (conn && Model) {
      const { _id, __v, ...cleanItem } = item;
      await Model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      console.log(`[saveSingleItem] Upserted item ${item.id} into "${normResource}" collection.`);
    }
  } catch (err) {
    checkAndResetOnNetworkError(err);
    console.warn(`[saveSingleItem] Error saving item ${item.id} to "${normResource}":`, err?.message || err);
  }
  return item;
}

export async function deleteSingleItem(resource: string, id: string): Promise<boolean> {
  if (!id) return false;
  const normResource = normalizeResourceName(resource);

  // Update memory cache
  if (memoryCache[normResource]) {
    memoryCache[normResource] = memoryCache[normResource].filter((i: any) => i.id !== id);
  }
  if (normResource !== resource && memoryCache[resource]) {
    memoryCache[resource] = memoryCache[resource].filter((i: any) => i.id !== id);
  }
  persistMemoryCacheToBackup();

  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(normResource) as any;
    if (conn && Model) {
      const res = await Model.deleteOne({ id });
      console.log(`[deleteSingleItem] Deleted item ${id} from "${normResource}" collection. Deleted count: ${res.deletedCount}`);
      return res.deletedCount > 0;
    }
  } catch (err) {
    checkAndResetOnNetworkError(err);
    console.warn(`[deleteSingleItem] Error deleting item ${id} from "${normResource}":`, err?.message || err);
  }
  return true;
}

// Memory cache buffer for uploaded files when MongoDB is offline
const memoryImages: Record<string, { base64Data: string; mimeType: string }> = {};

function sanitizeBase64(raw: string): string {
  if (!raw) return '';
  if (raw.includes(';base64,')) {
    return raw.split(';base64,').pop() || raw;
  }
  return raw.replace(/^data:[^;]+;base64,/, '').trim();
}

export async function saveUploadedImage(id: string, base64Data: string, mimeType: string): Promise<string> {
  const cleanData = sanitizeBase64(base64Data);
  // Store in memory cache fallback
  memoryImages[id] = { base64Data: cleanData, mimeType };

  const dotIdx = id.lastIndexOf('.');
  const bareId = dotIdx !== -1 ? id.substring(0, dotIdx) : id;
  if (bareId !== id) {
    memoryImages[bareId] = { base64Data: cleanData, mimeType };
  }

  // Sync to Mongoose MongoDB Atlas if connected
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel as any;
      await UploadedModel.replaceOne(
        { id },
        { id, base64Data: cleanData, mimeType },
        { upsert: true }
      );
      if (bareId !== id) {
        await UploadedModel.replaceOne(
          { id: bareId },
          { id: bareId, base64Data: cleanData, mimeType },
          { upsert: true }
        );
      }
      console.log(`[MongoDB Sync] Successfully saved image to Atlas database for ID: ${id}`);
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
    console.warn(`[Mongoose Engine] Failed to save uploaded image in DB (${error?.message || 'Network/SSL error'}), stored in memory fallback.`);
  }

  // Return the direct MongoDB streaming API URL
  return `/api/images/${id}`;
}

export async function getUploadedImage(id: string): Promise<{ base64Data: string; mimeType: string } | null> {
  const dotIdx = id.lastIndexOf('.');
  const bareId = dotIdx !== -1 ? id.substring(0, dotIdx) : id;

  // 1. Check local in-memory cache first
  if (memoryImages[id]) {
    return memoryImages[id];
  }
  if (memoryImages[bareId]) {
    return memoryImages[bareId];
  }

  // 2. Check local uploads folder on disk as a tertiary fallback for older local images
  try {
    let uploadsDir = path.join(process.cwd(), 'uploads');
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      uploadsDir = '/tmp/uploads';
    }
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const matchedFile = files.find(f => f.startsWith(id + '.') || f.startsWith(bareId + '.'));
      if (matchedFile) {
        const filePath = path.join(uploadsDir, matchedFile);
        const buffer = fs.readFileSync(filePath);
        const base64Data = buffer.toString('base64');
        
        let mimeType = 'image/png';
        if (matchedFile.endsWith('.jpg') || matchedFile.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (matchedFile.endsWith('.webp')) mimeType = 'image/webp';
        else if (matchedFile.endsWith('.svg')) mimeType = 'image/svg+xml';
        else if (matchedFile.endsWith('.gif')) mimeType = 'image/gif';
        else if (matchedFile.endsWith('.mp4')) mimeType = 'video/mp4';
        else if (matchedFile.endsWith('.webm')) mimeType = 'video/webm';

        const result = { base64Data, mimeType };
        memoryImages[id] = result;
        memoryImages[bareId] = result;
        return result;
      }
    }
  } catch (err) {
    console.error("[Local Storage] Error reading file from disk fallback:", err);
  }

  // 3. Check Mongoose/MongoDB Atlas database (Primary durable source)
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel as any;
      const escapedBare = bareId.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const doc = await UploadedModel.findOne({
        $or: [
          { id },
          { id: bareId },
          { id: { $regex: new RegExp(`^${escapedBare}`, 'i') } }
        ]
      }).lean().exec();
      if (doc) {
        const cleanData = sanitizeBase64(doc.base64Data);
        const result = {
          base64Data: cleanData,
          mimeType: doc.mimeType || 'image/png'
        };
        // Cache in memory for subsequent requests
        memoryImages[id] = result;
        memoryImages[bareId] = result;
        return result;
      }
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
    console.warn(`[Mongoose Engine] Failed to load image from DB (${error?.message || 'Network/SSL error'}), checking local cache.`);
  }

  return null;
}

export async function fetchLayoutSettings(): Promise<any> {
  const defaultSettings = {
    id: "layout_settings",
    headerLogoText: 'POUCH SUPPLY',
    headerLogoSubtext: 'Premium Nicotine',
    headerLogoImage: '',
    footerLogoText: 'POUCH SUPPLY',
    footerLogoDescription: 'Leading premium directory for tobacco-free nicotine slim white canisters. Sourced directly from partners across Sweden, Poland, and Germany.',
    footerLogoImage: '',
    klaviyoPublicKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    menuItems: [
      { id: '1', label: 'Home', tab: 'frontend-home', type: 'tab' },
      { id: '2', label: 'Subscribe', tab: 'frontend-subscribe', type: 'tab' },
      { id: '3', label: 'Shop Now', tab: 'frontend-shop', type: 'tab' },
      { id: '4', label: 'All Brands', tab: 'frontend-brands', type: 'tab' },
      { id: '5', label: 'About', tab: 'about', type: 'tab' }
    ]
  };

  try {
    const conn = await connectMongoose();
    if (conn) {
      const Model = LayoutSettingsModel as any;
      const doc = await Model.findOne({ id: "layout_settings" }).lean().exec();
      if (doc) {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      }

      // If database is connected but no document, let's try to seed from layout_settings.json
      const filePath = path.join(process.cwd(), "layout_settings.json");
      let seedSettings = { ...defaultSettings };
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, "utf-8");
          seedSettings = { ...JSON.parse(content), id: "layout_settings" };
        } catch (e) {
          console.warn("[serverDb] Failed to parse local layout_settings.json:", e);
        }
      }
      // Save it to MongoDB
      await Model.replaceOne({ id: "layout_settings" }, seedSettings, { upsert: true });
      return seedSettings;
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
    console.warn(`[serverDb] Failed to fetch layout settings from DB (${error?.message || 'Network/SSL error'}), falling back to local file.`);
  }

  // Fallback to reading file
  const filePath = path.join(process.cwd(), "layout_settings.json");
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.warn("[serverDb] Failed fallback load of layout_settings.json:", e);
    }
  }

  return defaultSettings;
}

export async function saveLayoutSettings(settings: any): Promise<any> {
  let existing: any = {};
  try {
    existing = await fetchLayoutSettings();
  } catch (e) {}

  const payload = {
    headerLogoText: 'POUCH SUPPLY',
    headerLogoSubtext: 'Premium Nicotine',
    ...existing,
    ...settings,
    klaviyoPublicKey: (settings && settings.klaviyoPublicKey !== undefined ? settings.klaviyoPublicKey : existing?.klaviyoPublicKey) || '',
    cloudinaryCloudName: (settings && settings.cloudinaryCloudName !== undefined ? settings.cloudinaryCloudName : existing?.cloudinaryCloudName) || '',
    cloudinaryApiKey: (settings && settings.cloudinaryApiKey !== undefined ? settings.cloudinaryApiKey : existing?.cloudinaryApiKey) || '',
    cloudinaryApiSecret: (settings && settings.cloudinaryApiSecret !== undefined ? settings.cloudinaryApiSecret : existing?.cloudinaryApiSecret) || '',
    id: "layout_settings"
  };
  
  // Write to local file as fallback/concurrency
  try {
    const filePath = path.join(process.cwd(), "layout_settings.json");
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  } catch (e) {
    console.warn("[serverDb] Failed writing to layout_settings.json:", e);
  }

  try {
    const conn = await connectMongoose();
    if (conn) {
      const Model = LayoutSettingsModel as any;
      const { _id, __v, ...cleanItem } = payload;
      await Model.replaceOne({ id: "layout_settings" }, cleanItem, { upsert: true });
      console.log("[serverDb] Successfully saved layout settings to MongoDB.");
    }
  } catch (error: any) {
    checkAndResetOnNetworkError(error);
    console.warn(`[serverDb] Failed to save layout settings to DB (${error?.message || 'Network/SSL error'}), saved to local file fallback.`);
  }

  return payload;
}
