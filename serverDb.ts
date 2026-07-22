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

function getModelForResource(resource: string) {
  switch (resource) {
    case 'products': return ProductModel;
    case 'collections': return CollectionModel;
    case 'orders': return OrderModel;
    case 'files': return FileModel;
    case 'customers': return CustomerModel;
    case 'discounts': return DiscountModel;
    case 'customPages':
    case 'custompages': return CustomPageModel;
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
      if (count === 0 && pair.data && pair.data.length > 0) {
        console.log(`[Mongoose Seeding] Collection "${pair.name}" is empty. Seeding with ${pair.data.length} default items...`);
        // We clean documents from _id and other Mongoose-specific things to perform a clean insertMany
        await model.insertMany(pair.data.map(item => ({ ...item })));
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

// Global resource controllers that fetch from Mongoose DB or fallback to memory
export async function fetchResource(resource: string): Promise<any[]> {
  const mongoUri = process.env.MONGODB_URI;
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource) as any;
    if (conn && Model) {
      const docs = await Model.find({}).lean().exec();
      // Remove Mongoose/Mongo specific identifiers to map clean object models for the front-end
      return docs.map((doc: any) => {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      });
    } else if (mongoUri) {
      console.warn(`[fetchResource] MongoDB connection failed despite being configured. Falling back to local memoryCache for "${resource}".`);
    }
  } catch (error: any) {
    console.error(`[fetchResource] Error fetching "${resource}", falling back to memoryCache:`, error);
  }
  return memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  // Synchronously update local fallback cache
  memoryCache[resource] = [...list];

  const mongoUri = process.env.MONGODB_URI;
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource) as any;
    if (conn && Model) {
      const currentIds = list.map(item => item.id).filter(Boolean);
      console.log(`[saveResource] Syncing ${resource} collection. Total items in payload: ${list.length}. Active IDs:`, currentIds);
      
      // Delete items no longer in client list
      const deleteResult = await Model.deleteMany({ id: { $nin: currentIds } });
      if (deleteResult.deletedCount > 0) {
        console.log(`[saveResource] Permanently deleted ${deleteResult.deletedCount} items from ${resource} not in active client list.`);
      }
      
      // Upsert current items using replaceOne to avoid duplicate or outdated structures
      for (const item of list) {
        if (!item.id) continue;
        // Strip out any _id or __v fields to prevent "Performing an update on the path '_id' would modify the immutable field '_id'" error
        const { _id, __v, ...cleanItem } = item;
        await Model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      }
      console.log(`[saveResource] Successfully upserted and synchronized all ${list.length} items to ${resource} collection.`);
      return list;
    } else if (mongoUri) {
      console.warn(`[saveResource] MongoDB connection failed despite being configured during save. Saved to memoryCache fallback for "${resource}".`);
    }
  } catch (error: any) {
    console.error(`[saveResource] Error during database synchronization for "${resource}", saved to memoryCache fallback:`, error);
  }
  return memoryCache[resource];
}

// Memory cache buffer for uploaded files when MongoDB is offline
const memoryImages: Record<string, { base64Data: string; mimeType: string }> = {};

export async function saveUploadedImage(id: string, base64Data: string, mimeType: string): Promise<string> {
  // Store in memory cache fallback
  memoryImages[id] = { base64Data, mimeType };

  // Sync to Mongoose MongoDB Atlas if connected
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel as any;
      await UploadedModel.replaceOne(
        { id },
        { id, base64Data, mimeType },
        { upsert: true }
      );
      console.log(`[MongoDB Sync] Successfully saved image to Atlas database for ID: ${id}`);
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to save uploaded image in DB:", error);
  }

  // Return the direct MongoDB streaming API URL
  return `/api/images/${id}`;
}

export async function getUploadedImage(id: string): Promise<{ base64Data: string; mimeType: string } | null> {
  // 1. Check local in-memory cache first
  if (memoryImages[id]) {
    return memoryImages[id];
  }

  // 2. Check local uploads folder on disk as a tertiary fallback for older local images
  try {
    let uploadsDir = path.join(process.cwd(), 'uploads');
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      uploadsDir = '/tmp/uploads';
    }
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const matchedFile = files.find(f => f.startsWith(id + '.'));
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

        return { base64Data, mimeType };
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
      const doc = await UploadedModel.findOne({ id }).lean().exec();
      if (doc) {
        // Cache in memory for subsequent requests
        memoryImages[id] = { base64Data: doc.base64Data, mimeType: doc.mimeType };
        return {
          base64Data: doc.base64Data,
          mimeType: doc.mimeType
        };
      }
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to load image from DB:", error);
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
  } catch (error) {
    console.error("[serverDb] Failed to fetch layout settings from DB, falling back to local file:", error);
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
  const payload = { ...settings, id: "layout_settings" };
  
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
  } catch (error) {
    console.error("[serverDb] Failed to save layout settings to DB:", error);
  }

  return payload;
}
