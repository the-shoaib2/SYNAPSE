#!/bin/bash

# Synapse npm workspace management script
echo "🔧 Synapse npm Workspace Manager"

# Function to show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install    - Install all workspace dependencies"
    echo "  dev        - Start development mode"
    echo "  build      - Build all workspace packages"
    echo "  test       - Run tests"
    echo "  lint       - Run linting"
    echo "  clean      - Clean build artifacts"
    echo "  update     - Update dependencies"
    echo "  outdated   - Check outdated packages"
    echo "  audit      - Security audit"
    echo "  status     - Show workspace status"
    echo "  help       - Show this help message"
    echo ""
}

# Function to install dependencies
install_deps() {
    echo "📦 Installing all workspace dependencies..."
    npm install
    echo "✅ Dependencies installed successfully"
}

# Function to start development
start_dev() {
    echo "🚀 Starting development mode..."
    npm run dev
}

# Function to build packages
build_packages() {
    echo "🏗️ Building all workspace packages..."
    npm run build
    echo "✅ Build completed successfully"
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    npm run test
    echo "✅ Tests completed"
}

# Function to run linting
run_lint() {
    echo "🔍 Running linting..."
    npm run lint
    echo "✅ Linting completed"
}

# Function to clean build artifacts
clean_build() {
    echo "🧹 Cleaning build artifacts..."
    npm run clean
    echo "✅ Cleanup completed"
}

# Function to update dependencies
update_deps() {
    echo "⬆️ Updating dependencies..."
    npm update
    echo "✅ Dependencies updated"
}

# Function to check outdated packages
check_outdated() {
    echo "📊 Checking for outdated packages..."
    npm outdated
}

# Function to run security audit
run_audit() {
    echo "🔒 Running security audit..."
    npm audit
    echo "✅ Security audit completed"
}

# Function to show workspace status
show_status() {
    echo "📋 Workspace Status:"
    echo "Root packages:"
    npm list --depth=0
    echo ""
    echo "All workspace packages:"
    npm list --recursive --depth=0
}

# Main script logic
case "${1:-help}" in
    install)
        install_deps
        ;;
    dev)
        start_dev
        ;;
    build)
        build_packages
        ;;
    test)
        run_tests
        ;;
    lint)
        run_lint
        ;;
    clean)
        clean_build
        ;;
    update)
        update_deps
        ;;
    outdated)
        check_outdated
        ;;
    audit)
        run_audit
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
