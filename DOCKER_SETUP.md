# Docker + npm Setup for Synapse

This document explains how to use Docker and npm for development and production deployment of the Synapse project.

## 🚀 Quick Start

### Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Node.js** 20.19.0+ (for local development)

### 1. Start Development Environment

```bash
# Using the convenience script
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh

# Or manually
docker-compose -f docker/docker-compose.dev.yml up --build
```

### 2. Access Services

- **UI**: http://localhost:3000
- **Core API**: http://localhost:3001
- **Documentation**: http://localhost:3002

## 🐳 Docker Commands

### Development

```bash
# Start development environment
npm run docker:dev

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.dev.yml down

# Restart services
docker-compose -f docker/docker-compose.dev.yml restart

# Enter container
docker exec -it synapse-development bash
```

### Production

```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Or manually
docker build -t synapse .
docker run -p 3000:3000 -p 3001:3001 -p 3002:3002 synapse
```

## 📦 npm Commands

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start all services
npm run dev

# Start specific service
npm run dev:ui      # UI only
npm run dev:core     # Core only
npm run dev:vscode   # VSCode extension
npm run dev:docs     # Documentation

# Build all packages
npm run build

# Test all packages
npm run test

# Lint all packages
npm run lint
```

### Package Management

```bash
# Add dependency to root
npm add <package>

# Add dependency to specific package
npm --workspace <package-name> add <dependency>

# Add dev dependency
npm add -D <package>

# Remove dependency
npm remove <package>

# Update dependencies
npm update
```

## 🔧 Migration from npm

If you're migrating from npm to npm:

```bash
# Run migration script
chmod +x scripts/migrate-to-npm.sh
./scripts/migrate-to-npm.sh
```

The script will:

1. Remove npm lock files
2. Clean node_modules
3. Install dependencies with npm
4. Update .gitignore

## 🏗️ Project Structure

```
synapse/
├── core/                 # Core library
├── extensions/           # IDE extensions
│   ├── vscode/          # VS Code extension
│   └── # IntelliJ plugin removed
├── ui/                  # Web UI
├── docs/                 # Documentation
├── packages/             # Shared packages
├── binary/               # Binary builds
├── scripts/              # Build scripts
├── docker/               # Docker configuration
│   ├── Dockerfile        # Production Dockerfile
│   ├── Dockerfile.dev    # Development Dockerfile
│   ├── docker-compose.dev.yml # Development compose
│   └── .dockerignore     # Docker ignore rules
├── package.json          # npm workspace config
```

## 🌟 Benefits of Docker + npm

### Docker Benefits

- **Consistent Environment**: Same setup across all machines
- **Isolation**: No conflicts with local Node.js versions
- **Easy Deployment**: Production-ready containers
- **Team Collaboration**: Everyone has the same setup

### npm Benefits

- **Faster**: Parallel installation and efficient disk usage
- **Monorepo Support**: Better workspace management
- **Strict Dependencies**: Prevents phantom dependencies
- **Disk Space**: Shared dependencies across packages

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
   docker build --no-cache -t synapse .
   ```

4. **npm Install Fails**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Reinstall
   rm -rf node_modules
   npm install
   ```

### Getting Help

- Check Docker logs: `docker-compose -f docker-compose.dev.yml logs`
- Enter container: `docker exec -it synapse-development bash`
- View running containers: `docker ps`

## 📚 Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Synapse Documentation](https://docs.synapse.dev/)

## 🤝 Contributing

When contributing to Synapse:

1. Use the Docker development environment
2. Follow the npm workspace structure
3. Test your changes in the containerized environment
4. Update this documentation if needed

Happy coding! 🎉
