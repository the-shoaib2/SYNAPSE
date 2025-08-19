# Docker Development Environment

This directory contains Docker configuration files for the Synapse project development environment.

## 🚀 Quick Start

### Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Node.js** 20.19.0+ (for local development)

### Start Development Environment

```bash
# From project root
npm run docker:dev

# Or manually
docker-compose -f docker/docker-compose.dev.yml up --build
```

## 🐳 Docker Services

### Development Environment (`docker-compose.dev.yml`)

- **UI Service**: React development server with hot reload
- **Core Service**: Node.js backend with auto-restart
- **Documentation**: Docusaurus development server
- **VS Code Extension**: Development build with watch mode

### Production Build (`Dockerfile`)

- **Multi-stage build** for optimized production image
- **Node.js runtime** with minimal dependencies
- **Static file serving** for UI and documentation
- **Process management** with PM2

## 🔧 Development Commands

### Start Services

```bash
# Start all services
npm run docker:dev

# Start specific service
docker-compose -f docker/docker-compose.dev.yml up <service-name>

# Start in background
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Stop Services

```bash
# Stop all services
docker-compose -f docker/docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker/docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker-compose -f docker/docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker/docker-compose.dev.yml logs -f <service-name>
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose -f docker/docker-compose.dev.yml up --build

# Rebuild specific service
docker-compose -f docker/docker-compose.dev.yml up --build <service-name>
```

## 🏗️ Build Commands

### Production Build

```bash
# Build production image
npm run docker:build

# Or manually
docker build -t synapse -f docker/Dockerfile .
```

### Run Production Container

```bash
# Run production container
npm run docker:run

# Or manually
docker run -p 3000:3000 -p 3001:3001 -p 3002:3002 synapse
```

## 📁 File Structure

```
docker/
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.dev.yml  # Development services
├── .dockerignore           # Docker ignore rules
└── README.md               # This file
```

## 🔍 Service Details

### UI Service

- **Port**: 3000
- **Hot Reload**: Enabled
- **Source Mount**: `./ui` → `/app/ui`
- **Dependencies**: Auto-installed on startup

### Core Service

- **Port**: 3001
- **Auto-restart**: Enabled
- **Source Mount**: `./core` → `/app/core`
- **Environment**: Development mode

### Documentation Service

- **Port**: 3002
- **Hot Reload**: Enabled
- **Source Mount**: `./docs` → `/app/docs`
- **Build**: Automatic on file changes

### VS Code Extension

- **Build Mode**: Development with watch
- **Source Mount**: `./extensions/vscode` → `/app/extensions/vscode`
- **Output**: `./extensions/vscode/out`

## 🌐 Access URLs

Once services are running:

- **UI**: http://localhost:3000
- **Core API**: http://localhost:3001
- **Documentation**: http://localhost:3002
- **VS Code Extension**: Built to `./extensions/vscode/out`

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   lsof -i :3000

   # Kill the process or change ports in docker-compose.dev.yml
   ```

2. **Permission Denied**

   ```bash
   # Make scripts executable
   chmod +x scripts/*.sh
   ```

3. **Docker Build Fails**

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Rebuild without cache
   docker build --no-cache -t synapse -f docker/Dockerfile .
   ```

4. **Services Won't Start**

   ```bash
   # Check Docker status
   docker info

   # Check service logs
   docker-compose -f docker/docker-compose.dev.yml logs
   ```

### Getting Help

- **Check logs**: `docker-compose -f docker/docker-compose.dev.yml logs`
- **Enter container**: `docker exec -it <container-name> bash`
- **View running containers**: `docker ps`
- **Check service status**: `docker-compose -f docker/docker-compose.dev.yml ps`

## 🔧 Customization

### Environment Variables

Create `.env` file in project root:

```bash
# Development environment
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# Service ports
UI_PORT=3000
CORE_PORT=3001
DOCS_PORT=3002
```

### Service Configuration

Modify `docker-compose.dev.yml`:

```yaml
services:
  ui:
    environment:
      - NODE_ENV=development
      - DEBUG=true
    volumes:
      - ./ui:/app/ui
      - /app/ui/node_modules
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Project Docker Setup](../DOCKER_SETUP.md)
- [Contributing Guide](../CONTRIBUTING.md)

## 🤝 Contributing

When contributing to Docker configuration:

1. **Test changes** in development environment
2. **Update documentation** if needed
3. **Follow conventions** established by existing files
4. **Test in different environments** (Linux, macOS, Windows)

## 🎯 Best Practices

1. **Use multi-stage builds** for production images
2. **Minimize layer count** in Dockerfiles
3. **Use .dockerignore** to exclude unnecessary files
4. **Mount source code** for development
5. **Use health checks** for production services
6. **Optimize for caching** in build process

---

## 🚀 Quick Commands

```bash
# Start development
npm run docker:dev

# Build production
npm run docker:build

# Run production
npm run docker:run

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.dev.yml down
```

**Happy Docker development! 🐳**
