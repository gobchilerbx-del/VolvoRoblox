import { createServer } from 'http';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'storage');
const SRC_DATA_DIR = path.resolve(__dirname, '../src/data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const PORT = Number.parseInt(process.env.PORT ?? '3001', 10);
const HOST = process.env.HOST ?? '0.0.0.0';
const API_PREFIX = '/api';

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const withCreatedAt = (item) => ({
  ...item,
  createdAt: item.createdAt ?? new Date().toISOString()
});

const sortByNewest = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const readJsonFile = async (filePath) => {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
};

const seeds = await (async () => {
  try {
    const [productsSeed, affiliatesSeed] = await Promise.all([
      readJsonFile(path.join(SRC_DATA_DIR, 'products.json')),
      readJsonFile(path.join(SRC_DATA_DIR, 'affiliates.json'))
    ]);

    return {
      products: ensureArray(productsSeed).map(withCreatedAt),
      affiliates: ensureArray(affiliatesSeed).map(withCreatedAt)
    };
  } catch (error) {
    console.warn('[API] No fue posible cargar los seeds desde src/data. Se utilizará un estado vacío.', error);
    return { products: [], affiliates: [] };
  }
})();

const defaultDatabase = {
  products: sortByNewest(seeds.products),
  affiliates: sortByNewest(seeds.affiliates)
};

const applyCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const sendError = (res, statusCode, message) => {
  sendJson(res, statusCode, { message });
};

const sendNoContent = (res) => {
  res.writeHead(204);
  res.end();
};

const ensureDataFile = async () => {
  try {
    await access(DB_PATH, constants.F_OK);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
  }
};

const readDatabase = async () => {
  const raw = await readFile(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return {
    products: sortByNewest(ensureArray(parsed.products ?? defaultDatabase.products)),
    affiliates: sortByNewest(ensureArray(parsed.affiliates ?? defaultDatabase.affiliates))
  };
};

const persistDatabase = async (data) => {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

await ensureDataFile();
let database = await readDatabase();

const generateId = (prefix) =>
  `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9)}`;

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error('Payload demasiado grande.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('JSON inválido.'));
      }
    });
    req.on('error', reject);
  });

const validateProductPayload = (payload, { partial = false } = {}) => {
  const result = {};

  if ('name' in payload || !partial) {
    const value = String(payload.name ?? '').trim();
    if (!value && !partial) throw new Error('El nombre es obligatorio.');
    if (value) result.name = value;
  }

  if ('description' in payload || !partial) {
    const value = String(payload.description ?? '').trim();
    if (!value && !partial) throw new Error('La descripción es obligatoria.');
    if (value) result.description = value;
  }

  if ('image' in payload || !partial) {
    const value = String(payload.image ?? '').trim();
    if (!value && !partial) throw new Error('La imagen es obligatoria.');
    if (value) result.image = value;
  }

  if ('price' in payload || !partial) {
    const raw = payload.price ?? (partial ? undefined : 0);
    const value = Number.parseFloat(raw);
    if ((raw === undefined || Number.isNaN(value) || value < 0) && !partial) {
      throw new Error('El precio es inválido.');
    }
    if (raw !== undefined) result.price = value;
  }

  return result;
};

const validateAffiliatePayload = (payload, { partial = false } = {}) => {
  const result = {};

  if ('name' in payload || !partial) {
    const value = String(payload.name ?? '').trim();
    if (!value && !partial) throw new Error('El nombre es obligatorio.');
    if (value) result.name = value;
  }

  if ('description' in payload || !partial) {
    const value = String(payload.description ?? '').trim();
    if (!value && !partial) throw new Error('La descripción es obligatoria.');
    if (value) result.description = value;
  }

  if ('discordUrl' in payload || !partial) {
    const value = String(payload.discordUrl ?? '').trim();
    if (!value && !partial) throw new Error('El enlace de comunicaciones es obligatorio.');
    if (value) result.discordUrl = value;
  }

  if ('robloxUrl' in payload || !partial) {
    const value = String(payload.robloxUrl ?? '').trim();
    if (!value && !partial) throw new Error('El enlace de Roblox es obligatorio.');
    if (value) result.robloxUrl = value;
  }

  if ('image' in payload || !partial) {
    const value = String(payload.image ?? '').trim();
    if (!value && !partial) throw new Error('La imagen es obligatoria.');
    if (value) result.image = value;
  }

  return result;
};

const server = createServer(async (req, res) => {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const { pathname } = requestUrl;

  try {
    // --- Respuesta raíz para evitar timeout en Render ---
    if (req.method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Volvo Mobility Systems backend en línea ✅');
      return;
    }

    if (req.method === 'GET' && pathname === `${API_PREFIX}/products`) {
      sendJson(res, 200, sortByNewest(database.products));
      return;
    }

    if (req.method === 'POST' && pathname === `${API_PREFIX}/products`) {
      const payload = validateProductPayload(await readBody(req));
      const newProduct = {
        id: generateId('prd'),
        createdAt: new Date().toISOString(),
        ...payload
      };
      database = {
        ...database,
        products: sortByNewest([newProduct, ...database.products])
      };
      await persistDatabase(database);
      sendJson(res, 201, newProduct);
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith(`${API_PREFIX}/products/`)) {
      const id = pathname.replace(`${API_PREFIX}/products/`, '');
      const product = database.products.find((item) => item.id === id);
      if (!product) {
        sendError(res, 404, 'Producto no encontrado.');
        return;
      }
      const payload = validateProductPayload(await readBody(req), { partial: true });
      const updated = { ...product, ...payload };
      database = {
        ...database,
        products: sortByNewest(
          database.products.map((item) => (item.id === id ? updated : item))
        )
      };
      await persistDatabase(database);
      sendJson(res, 200, updated);
      return;
    }

    if (req.method === 'DELETE' && pathname.startsWith(`${API_PREFIX}/products/`)) {
      const id = pathname.replace(`${API_PREFIX}/products/`, '');
      const exists = database.products.some((item) => item.id === id);
      if (!exists) {
        sendError(res, 404, 'Producto no encontrado.');
        return;
      }
      database = {
        ...database,
        products: database.products.filter((item) => item.id !== id)
      };
      await persistDatabase(database);
      sendNoContent(res);
      return;
    }

    if (req.method === 'GET' && pathname === `${API_PREFIX}/affiliates`) {
      sendJson(res, 200, sortByNewest(database.affiliates));
      return;
    }

    if (req.method === 'POST' && pathname === `${API_PREFIX}/affiliates`) {
      const payload = validateAffiliatePayload(await readBody(req));
      const newAffiliate = {
        id: generateId('aff'),
        createdAt: new Date().toISOString(),
        ...payload
      };
      database = {
        ...database,
        affiliates: sortByNewest([newAffiliate, ...database.affiliates])
      };
      await persistDatabase(database);
      sendJson(res, 201, newAffiliate);
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith(`${API_PREFIX}/affiliates/`)) {
      const id = pathname.replace(`${API_PREFIX}/affiliates/`, '');
      const affiliate = database.affiliates.find((item) => item.id === id);
      if (!affiliate) {
        sendError(res, 404, 'Afiliado no encontrado.');
        return;
      }
      const payload = validateAffiliatePayload(await readBody(req), { partial: true });
      const updated = { ...affiliate, ...payload };
      database = {
        ...database,
        affiliates: sortByNewest(
          database.affiliates.map((item) => (item.id === id ? updated : item))
        )
      };
      await persistDatabase(database);
      sendJson(res, 200, updated);
      return;
    }

    if (req.method === 'DELETE' && pathname.startsWith(`${API_PREFIX}/affiliates/`)) {
      const id = pathname.replace(`${API_PREFIX}/affiliates/`, '');
      const exists = database.affiliates.some((item) => item.id === id);
      if (!exists) {
        sendError(res, 404, 'Afiliado no encontrado.');
        return;
      }
      database = {
        ...database,
        affiliates: database.affiliates.filter((item) => item.id !== id)
      };
      await persistDatabase(database);
      sendNoContent(res);
      return;
    }

    sendError(res, 404, 'Ruta no encontrada.');
  } catch (error) {
    console.error('[API ERROR]', error);
    sendError(res, 500, error instanceof Error ? error.message : 'Error interno del servidor.');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚗  Volvo Mobility API escuchando en http://${HOST}:${PORT}${API_PREFIX}`);
});
