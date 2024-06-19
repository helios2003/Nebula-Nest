# Nebula-Nest

This project provides a simple way to deploy the frontend of the applications. 

## Getting Started
- Clone the project into your local system using the comand:
```
git clone https://github.com/<your-username>/Nebula-Nest.git
```
- Change the directory to `Nebula Nest`.
- Rename ``.env.example`` to ``.env`` and fill the required details.
- Navigate to ``prisma/`` and rename ``.env.local.example`` to ``.env`` and fill the database URL.
- Run the command `./start.sh` to install the dependencies and start the server.

## Tech Stack
### Frontend
- React as the web framework.
- Tailwind CSS and ShadCN UI for styling.
### Backend
- NodeJS + Express as the primary stack.
- AWS / Cloudflare for cloud infrastructure.
- PostgreSQL as the database.
- RabbitMQ for message queueing.
- Docker for sandboxing.

## License
The project is licensed under MIT License.