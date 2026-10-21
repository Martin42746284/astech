// Offline SQLite database (sql.js / WebAssembly) persisted in the browser's IndexedDB.
// Everything runs on this PC: no internet or server needed.
import type { Database, SqlValue } from "sql.js";
import { seedSql } from "./seed";

const IDB_NAME = "astech";
const IDB_STORE = "files";
const IDB_KEY = "astech.sqlite";

let dbPromise: Promise<Database> | null = null;

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(): Promise<Uint8Array | undefined> {
  const d = await idb();
  return new Promise((resolve, reject) => {
    const r = d.transaction(IDB_STORE).objectStore(IDB_STORE).get(IDB_KEY);
    r.onsuccess = () => resolve(r.result as Uint8Array | undefined);
    r.onerror = () => reject(r.error);
  });
}
async function idbSet(bytes: Uint8Array) {
  const d = await idb();
  return new Promise<void>((resolve, reject) => {
    const tx = d.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL,
  title_fr TEXT, title_mg TEXT, summary_fr TEXT, summary_mg TEXT,
  description_fr TEXT, description_mg TEXT, steps_fr TEXT, steps_mg TEXT,
  deliverables_fr TEXT, deliverables_mg TEXT, icon TEXT, ord INTEGER DEFAULT 0, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL,
  title_fr TEXT, title_mg TEXT, category TEXT, location TEXT, year INTEGER,
  description_fr TEXT, description_mg TEXT, image TEXT, featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, q_fr TEXT, q_mg TEXT, a_fr TEXT, a_mg TEXT, ord INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT, text_fr TEXT, text_mg TEXT, rating INTEGER DEFAULT 5, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now','localtime')),
  status TEXT DEFAULT 'new', name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
  project_type TEXT NOT NULL, location TEXT, budget TEXT, surface TEXT, message TEXT NOT NULL,
  attachment TEXT, attachment_name TEXT, consent INTEGER DEFAULT 0, notes TEXT);
CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, created_at TEXT DEFAULT (datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS whatsapp_clicks (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now','localtime')));
`;

async function open(bytes?: Uint8Array): Promise<Database> {
  const initSqlJs = (await import("sql.js")).default;
  const wasmUrl = (await import("sql.js/dist/sql-wasm.wasm?url")).default;
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const db = bytes ? new SQL.Database(bytes) : new SQL.Database();
  db.exec(SCHEMA);
  const count = db.exec("SELECT COUNT(*) FROM settings")[0]?.values[0]?.[0] as number;
  if (!count) {
    db.exec(seedSql());
    await idbSet(db.export());
  }
  return db;
}

export function getDb(): Promise<Database> {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (!dbPromise) dbPromise = idbGet().then((b) => open(b));
  return dbPromise;
}

export type Row = Record<string, SqlValue>;

export async function all<T = Row>(sql: string, params: SqlValue[] = []): Promise<T[]> {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out: T[] = [];
  while (stmt.step()) out.push(stmt.getAsObject() as T);
  stmt.free();
  return out;
}

export async function one<T = Row>(sql: string, params: SqlValue[] = []): Promise<T | null> {
  return (await all<T>(sql, params))[0] ?? null;
}

export async function run(sql: string, params: SqlValue[] = []): Promise<number> {
  const db = await getDb();
  db.run(sql, params);
  const id = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number;
  await idbSet(db.export());
  return id;
}

export async function exportDb(): Promise<Uint8Array> {
  return (await getDb()).export();
}

export async function importDb(bytes: Uint8Array) {
  const db = await open(bytes);
  await idbSet(db.export());
  dbPromise = Promise.resolve(db);
}

export async function resetDb() {
  const db = await open();
  dbPromise = Promise.resolve(db);
}
