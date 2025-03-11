"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbOperations = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = require("path");
const fs_1 = require("fs");
// ===== DATABASE CONFIGURATION =====
// Change this to your preferred database location
// Examples:
// - Windows: "C:/todos"
// - macOS: join(homedir(), "todos")
// - Linux: "/home/username/todos" or join(homedir(), "todos")
// - Current directory: join(process.cwd(), "data")
const DB_LOCATION = "C:/todos";
// ==================================
// Ensure the data directory exists
const dataDir = (0, path_1.resolve)(DB_LOCATION);
console.error(`Database directory: ${dataDir}`);
if (!(0, fs_1.existsSync)(dataDir)) {
    console.error(`Creating database directory...`);
    (0, fs_1.mkdirSync)(dataDir, { recursive: true });
}
// Initialize the database
const dbPath = (0, path_1.join)(dataDir, "todos.db");
console.error(`Database file: ${dbPath}`);
// Connect to the database (creates it if it doesn't exist)
const db = new better_sqlite3_1.default(dbPath);
// Create the todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);
// Database operations
exports.dbOperations = {
    // Add a new todo
    addTodo: (text) => {
        const createdAt = new Date().toISOString();
        const stmt = db.prepare("INSERT INTO todos (text, completed, createdAt) VALUES (?, 0, ?)");
        const info = stmt.run(text, createdAt);
        return {
            id: info.lastInsertRowid,
            text,
            completed: false,
            createdAt,
        };
    },
    // Get all todos
    getTodos: () => {
        const stmt = db.prepare("SELECT * FROM todos ORDER BY id DESC");
        return stmt.all();
    },
    // Remove a todo by id
    removeTodo: (id) => {
        const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
        const info = stmt.run(id);
        return info.changes > 0;
    },
    // Get a todo by id
    getTodoById: (id) => {
        const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
        return stmt.get(id);
    },
};
