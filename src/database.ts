import Database from "better-sqlite3";
import { join, resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";

// Define the Todo type
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

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
const dataDir = resolve(DB_LOCATION);
console.error(`Database directory: ${dataDir}`);

if (!existsSync(dataDir)) {
  console.error(`Creating database directory...`);
  mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const dbPath = join(dataDir, "todos.db");
console.error(`Database file: ${dbPath}`);

// Connect to the database (creates it if it doesn't exist)
const db = new Database(dbPath);

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
export const dbOperations = {
  // Add a new todo
  addTodo: (text: string): Todo => {
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO todos (text, completed, createdAt) VALUES (?, 0, ?)"
    );
    const info = stmt.run(text, createdAt);

    return {
      id: info.lastInsertRowid as number,
      text,
      completed: false,
      createdAt,
    };
  },

  // Get all todos
  getTodos: (): Todo[] => {
    const stmt = db.prepare("SELECT * FROM todos ORDER BY id DESC");
    return stmt.all() as Todo[];
  },

  // Remove a todo by id
  removeTodo: (id: number): boolean => {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  },

  // Get a todo by id
  getTodoById: (id: number): Todo | undefined => {
    const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
    return stmt.get(id) as Todo | undefined;
  },
};
