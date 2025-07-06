# Deno API Project

This project is a Deno-based API build to be as simple as possible, using Docker for containerization and Taskfile for task management.\
It includes a MariaDB database and provides basic database operations such as migrations and seeding.

## Requirements

This project uses Docker for containerization. Make sure you have Docker and Docker Compose installed on your machine (`brew install docker`).\
It also uses Taskfile for task management, so ensure you have Task installed (`brew install go-task`).

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MaelBriantin/deno-api
   ````

2. **Navigate to the project directory**:
   ```bash
   cd deno-api
   ```

3. **Create a `.env` file**:\
   Copy the `.env.example` file to `.env` and update the environment variables as needed.
   ```bash
   cp .env.example .env
   ```

4. **Start the Docker containers**:
   ```bash
   task init
   ```

The `task init` command will build the Docker images and start the containers defined in the `docker-compose.yml` file.\
It will also run the database migrations and seed the database with initial data.

## Tasks

There are several tasks defined in the `Taskfile.yml` that you can use to manage the project:

- **`task init`**: Initializes the project by building Docker images, starting containers, running migrations, and seeding the database.
- **`task dc:start`**: Starts the Docker containers without rebuilding them.
- **`task dc:stop`**: Stops the Docker containers.
- **`task dc:restart`**: Restarts the Docker containers.
- **`task db:migration:create`**: Creates a new migration file in the `migrations` directory. You need to provide a name for the migration and the table.
- **`task db:migration:migrate`**: Applies all pending migrations to the database.
- **`task db:migration:rollback`**: Rolls back the last applied migration or the specified migration.
- **`task db:seed`**: Seeds the database with initial data defined in the `scripts/database/seeder.ts` file.
- **`task deno`**: Runs the Deno command with the specified arguments.
- **`task deno:fmt`**: Formats the Deno codebase using `deno fmt`.
- **`task deno:lint`**: Lints the Deno codebase using `deno lint`.
- **`task deno:add`**: Adds the specified dependency to the `deno.json` file.

You can list all available tasks by running `task` in the terminal.