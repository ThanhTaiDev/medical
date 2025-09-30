# Medical Management System - Docker Setup

This project includes Docker configuration for running the medical management system with the following services:

## Services

- **Backend API**: Port 9900 (NestJS/Fastify)
- **Frontend**: Port 9901 (React + Vite)
- **PostgreSQL**: Port 5432 (Database)
- **Redis**: Port 6379 (Cache)

## Quick Start

1. **Clone the repository** (if not already done)
   ```bash
   git clone <your-repo-url>
   cd medical_management
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:9901
   - Backend API: http://localhost:9900
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Environment Variables

The following environment variables are configured in the docker-compose.yml:

### Database
- `DATABASE_URL`: PostgreSQL connection string
- Database: `medical_management`
- Username: `postgres`
- Password: `postgres123`

### Redis
- `REDIS_HOST`: redis
- `REDIS_PORT`: 6379
- `REDIS_PASSWORD`: redis123

### JWT Configuration
- `JWT_ACCESS_TOKEN_SECRET_KEY`: Secret for access tokens
- `JWT_REFRESH_TOKEN_SECRET_KEY`: Secret for refresh tokens
- `JWT_VERIFY_TOKEN_SECRET_KEY`: Secret for verification tokens

### Frontend
- `VITE_API_URL`: Backend API URL (http://localhost:9900)

## Development Commands

### Start services
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Stop services
```bash
docker-compose down
```

### Rebuild and restart
```bash
docker-compose down
docker-compose up -d --build
```

### Database operations
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d medical_management

# Run Prisma migrations (if needed)
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate
```

## Production Considerations

Before deploying to production, make sure to:

1. **Change all secret keys** in docker-compose.yml:
   - JWT secrets
   - Cookie secret
   - Database password
   - Redis password

2. **Use environment files** instead of hardcoded values:
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Configure proper networking** and security settings

4. **Set up SSL/TLS** certificates for HTTPS

5. **Configure backup strategies** for PostgreSQL data

## Troubleshooting

### Port conflicts
If ports 9900, 9901, 5432, or 6379 are already in use, modify the port mappings in docker-compose.yml:
```yaml
ports:
  - "9900:9900"  # Change first number to available port
```

### Database connection issues
- Ensure PostgreSQL container is healthy before backend starts
- Check DATABASE_URL format
- Verify network connectivity between containers

### Frontend build issues
- Check if all dependencies are installed
- Verify Vite configuration
- Check nginx configuration for routing

### Memory issues
- Adjust memory limits in docker-compose.yml
- Monitor container resource usage: `docker stats`
