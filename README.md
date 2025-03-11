# Todo MCP Server

A simple MCP (Model Context Protocol) server for managing todo items with SQLite database storage.

## Features

- Add new todo items
- List all todo items
- Remove todo items by ID

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Configure database location (optional):

   Open `src/database.ts` and modify the `DB_LOCATION` variable to your preferred location:

   ```typescript
   // Examples:
   // - Windows: "C:/todos"
   // - macOS: join(homedir(), "todos")
   // - Linux: "/home/username/todos" or join(homedir(), "todos")
   // - Current directory: join(process.cwd(), "data")
   const DB_LOCATION = "C:/todos";
   ```

3. Build the project:

   ```
   npm run build
   ```

   ```

   ```

## Database

The application uses SQLite for data storage. By default, the database file is created at `C:/todos/todos.db`. You can change this location by modifying the `DB_LOCATION` variable in `src/database.ts`.

The database and its directory will be automatically created if they don't exist.

## Available Tools

### add-todo

Adds a new todo item to the list.

Parameters:

- `text` (string): The text content of the todo item

Example:

```
add-todo(text: "Buy groceries")
```

### get-todos

Lists all todo items.

Example:

```
get-todos()
```

### remove-todo

Removes a todo item by its ID.

Parameters:

- `id` (number): The ID of the todo item to remove

Example:

```
remove-todo(id: 1)
```

## Development

This project is built with:

- TypeScript
- better-sqlite3 for database operations
- MCP SDK for the server implementation
