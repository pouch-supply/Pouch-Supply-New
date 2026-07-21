import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export interface DbStatus {
  status: 'connected' | 'error' | 'not-configured' | 'pending';
  error?: string;
  isSslAlert?: boolean;
  isDnsError?: boolean;
  uriHost?: string;
}

export function cleanUri(uri: string): string {
  if (!uri) return '';
  let cleaned = uri.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

// Escapes credentials with characters like '#' in the URI
export function escapeMongoUri(uri: string): string {
  try {
    uri = cleanUri(uri);
    const schemeIndex = uri.indexOf('://');
    if (schemeIndex === -1) return uri;
    
    const credentialsAndHost = uri.substring(schemeIndex + 3);
    const atIndex = credentialsAndHost.lastIndexOf('@');
    if (atIndex === -1) return uri;
    
    const credentials = credentialsAndHost.substring(0, atIndex);
    const hostAndRest = credentialsAndHost.substring(atIndex + 1);
    
    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) return uri;
    
    const username = credentials.substring(0, colonIndex);
    const password = credentials.substring(colonIndex + 1);
    
    let decodedUsername = username;
    try {
      decodedUsername = decodeURIComponent(username);
    } catch (e) {}
    const encodedUsername = encodeURIComponent(decodedUsername);

    let decodedPassword = password;
    try {
      decodedPassword = decodeURIComponent(password);
    } catch (e) {}
    const encodedPassword = encodeURIComponent(decodedPassword);
    
    const scheme = uri.substring(0, schemeIndex + 3);
    return `${scheme}${encodedUsername}:${encodedPassword}@${hostAndRest}`;
  } catch (err) {
    console.error("[Mongoose Configuration] Failed to auto-escape URI:", err);
    return uri;
  }
}

export function getHostFromUri(uri: string): string {
  try {
    uri = cleanUri(uri);
    const sIndex = uri.indexOf('://');
    if (sIndex === -1) return '';
    const part = uri.substring(sIndex + 3);
    const atIndex = part.lastIndexOf('@');
    const hostWithQuery = atIndex !== -1 ? part.substring(atIndex + 1) : part;
    const slashIndex = hostWithQuery.indexOf('/');
    const hostPlusPort = slashIndex !== -1 ? hostWithQuery.substring(0, slashIndex) : hostWithQuery;
    const quesIndex = hostPlusPort.indexOf('?');
    return quesIndex !== -1 ? hostPlusPort.substring(0, quesIndex) : hostPlusPort;
  } catch (e) {
    return '';
  }
}

// Schemes mapped with strict: false so dynamic properties stored via standard dashboard
// do not get stripped, giving us high compatibility with the raw driver's structure.
const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  price: { type: Number },
  description: { type: String }
}, { strict: false, timestamps: true });

const CollectionSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const FileSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const CustomerSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const DiscountSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const CustomPageSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const BlogSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

const UploadedImageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  base64Data: { type: String, required: true },
  mimeType: { type: String, required: true }
}, { strict: false });

const LayoutSettingsSchema = new Schema({
  id: { type: String, required: true, unique: true },
  headerLogoText: { type: String },
  headerLogoSubtext: { type: String },
  headerLogoImage: { type: String },
  footerLogoText: { type: String },
  footerLogoDescription: { type: String },
  footerLogoImage: { type: String },
  klaviyoPublicKey: { type: String },
  imgbbApiKey: { type: String },
  menuItems: { type: Array }
}, { strict: false, timestamps: true });

export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
export const CollectionModel = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema, 'collections');
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
export const FileModel = mongoose.models.File || mongoose.model('File', FileSchema, 'files');
export const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema, 'customers');
export const DiscountModel = mongoose.models.Discount || mongoose.model('Discount', DiscountSchema, 'discounts');
export const CustomPageModel = mongoose.models.CustomPage || mongoose.model('CustomPage', CustomPageSchema, 'custompages');
export const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema, 'blogs');
export const UploadedImageModel = mongoose.models.UploadedImage || mongoose.model('UploadedImage', UploadedImageSchema, 'uploaded_images');
export const LayoutSettingsModel = mongoose.models.LayoutSettings || mongoose.model('LayoutSettings', LayoutSettingsSchema, 'layout_settings');

// Connection status cache
let lastConnectionStatus: DbStatus = { status: 'pending' };
let connectPromise: Promise<typeof mongoose | null> | null = null;
let lastConnectErrorTime = 0;
const CONNECT_COOLDOWN = 15000; // 15 seconds cool down

export function getMongooseStatus(): DbStatus {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return { status: 'not-configured' };
  }
  const host = getHostFromUri(uri);
  return {
    ...lastConnectionStatus,
    uriHost: host || undefined
  };
}

export function resetConnection() {
  if (mongoose.connection.readyState !== 0) {
    mongoose.disconnect().catch(() => {});
  }
  connectPromise = null;
  lastConnectionStatus = { status: 'pending' };
}

export async function connectMongoose(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    lastConnectionStatus = { status: 'not-configured' };
    return null;
  }

  // Already connected or connecting?
  if (mongoose.connection.readyState === 1) {
    lastConnectionStatus = { status: 'connected' };
    return mongoose;
  }

  if (Date.now() - lastConnectErrorTime < CONNECT_COOLDOWN) {
    // Under connection cooldown to prevent blocking the Node.js event loop
    return null;
  }

  if (connectPromise) {
    return connectPromise;
  }

  const escapedUri = escapeMongoUri(uri);

  connectPromise = (async () => {
    try {
      const conn = await mongoose.connect(escapedUri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 4000,
      });

      lastConnectionStatus = { status: 'connected' };
      return conn;
    } catch (error: any) {
      const errorStr = String(error?.stack || error?.message || error || "");

      const isSslAlert = errorStr.includes("ssl3_read_bytes") || 
                         errorStr.includes("alert number 80") || 
                         errorStr.includes("alert(80)") ||
                         errorStr.includes("SSL alert number 80") ||
                         errorStr.includes("ERR_SSL_") || 
                         (errorStr.includes("MongoServerSelectionError") && (
                           errorStr.includes("alert") || 
                           errorStr.includes("SSL") || 
                           errorStr.includes("tls") || 
                           errorStr.includes("handshake")
                         ));
      
      const isDnsError = errorStr.includes("ENOTFOUND") || 
                         errorStr.includes("EAI_AGAIN") || 
                         errorStr.includes("dns") || 
                         errorStr.includes("getaddrinfo");

      lastConnectionStatus = {
        status: 'error',
        error: errorStr,
        isSslAlert,
        isDnsError
      };

      lastConnectErrorTime = Date.now();
      connectPromise = null; // enable retry
      return null;
    }
  })();

  return connectPromise;
}

export async function connectDB() {
  if (mongoose.connection?.readyState) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }
  const cleanedUri = cleanUri(uri);
  const escapedUri = escapeMongoUri(cleanedUri);
  await mongoose.connect(escapedUri);
}
