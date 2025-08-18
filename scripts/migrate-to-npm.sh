#!/bin/bash

# migrate-to-npm.sh
# Convert Synapse project from npm to npm

set -e

echo "🚀 Starting migration from npm to npm..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

print_status "Checking npm version..."
npm --version

# Step 1: Remove npm-specific files
print_status "Removing npm-specific files..."

if [ -f "npm-workspace.yaml" ]; then
    rm -f npm-workspace.yaml
    print_success "Removed npm-workspace.yaml"
fi

if [ -f "npm-lock.yaml" ]; then
    rm -f npm-lock.yaml
    print_success "Removed npm-lock.yaml"
fi

# Step 2: Clean all node_modules
print_status "Cleaning all node_modules directories..."

find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
print_success "Cleaned all node_modules directories"

# Step 3: Clean npm cache
print_status "Cleaning npm cache..."
npm cache clean --force
print_success "Cleaned npm cache"

# Step 4: Update package.json scripts
print_status "Checking package.json for npm references..."

if grep -q "npm" package.json; then
    print_warning "Found npm references in package.json. Please update them manually."
    echo "Look for and replace:"
    echo "  - 'npm run' → 'npm run'"
    echo "  - 'npm --parallel' → 'npm run --parallel'"
    echo "  - 'npm --recursive' → 'npm run --recursive'"
    echo "  - 'npm --filter' → 'npm --workspace'"
else
    print_success "No npm references found in package.json"
fi

# Step 5: Install dependencies with npm
print_status "Installing dependencies with npm..."

# Install root dependencies first
npm install

# Install workspace dependencies
if [ -d "core" ]; then
    print_status "Installing core dependencies..."
    cd core && npm install && cd ..
fi

if [ -d "ui" ]; then
    print_status "Installing UI dependencies..."
    cd ui && npm install && cd ..
fi

if [ -d "extensions/vscode" ]; then
    print_status "Installing VS Code extension dependencies..."
    cd extensions/vscode && npm install && cd ../..
fi

if [ -d "docs" ]; then
    print_status "Installing documentation dependencies..."
    cd docs && npm install && cd ..
fi

# Install package dependencies
if [ -d "packages" ]; then
    print_status "Installing package dependencies..."
    for package in packages/*/; do
        if [ -f "$package/package.json" ]; then
            print_status "Installing dependencies for $(basename "$package")..."
            cd "$package" && npm install && cd ../..
        fi
    done
fi

print_success "All dependencies installed with npm"

# Step 6: Update .gitignore
print_status "Updating .gitignore..."

# Remove npm entries and add npm entries
if grep -q "npm" .gitignore; then
    sed -i.bak '/# npm/,/npm-lock.yaml/d' .gitignore
    sed -i.bak '/\.npm-store/d' .gitignore
    print_success "Removed npm entries from .gitignore"
fi

# Add npm entries if not present
if ! grep -q "# npm" .gitignore; then
    echo "" >> .gitignore
    echo "# npm" >> .gitignore
    echo "package-lock.json" >> .gitignore
    echo ".npm" >> .gitignore
    print_success "Added npm entries to .gitignore"
fi

# Step 7: Test the setup
print_status "Testing npm setup..."

# Test root package.json
if npm run --silent; then
    print_success "Root package.json scripts are working"
else
    print_warning "Some scripts may need updating from npm to npm syntax"
fi

# Step 8: Final cleanup
print_status "Performing final cleanup..."

# Remove any remaining npm-related files
find . -name "*.npm*" -type f -delete 2>/dev/null || true
find . -name ".npm*" -type d -exec rm -rf {} + 2>/dev/null || true

print_success "Final cleanup completed"

# Step 9: Summary
echo ""
echo "🎉 Migration from npm to npm completed successfully!"
echo ""
echo "📋 Summary of changes:"
echo "  ✅ Removed npm-workspace.yaml"
echo "  ✅ Removed npm-lock.yaml"
echo "  ✅ Cleaned all node_modules"
echo "  ✅ Installed dependencies with npm"
echo "  ✅ Updated .gitignore"
echo "  ✅ Performed final cleanup"
echo ""
echo "🚀 Next steps:"
echo "  1. Test your development environment: npm run dev"
echo "  2. Test building: npm run build"
echo "  3. Test testing: npm run test"
echo "  4. Update any remaining npm references in your code"
echo ""
echo "📚 Important notes:"
echo "  - Use 'npm run' instead of 'npm run'"
echo "  - Use 'npm --workspace <package>' instead of 'npm --filter <package>'"
echo "  - Use 'npm run --parallel' instead of 'npm --parallel'"
echo "  - Use 'npm run --recursive' instead of 'npm --recursive'"
echo ""
echo "🔧 If you encounter issues:"
echo "  - Check that all npm references have been updated"
echo "  - Verify npm workspace configuration in package.json"
echo "  - Run 'npm install' in individual packages if needed"
echo "  - Check the project documentation for npm-specific instructions"
echo ""

print_success "Migration completed! Happy coding with npm! 🎉"
