# IntelliJ Extension Removal Notes

## 📋 **Overview**

The IntelliJ extension has been temporarily removed from the Synapse project to simplify the codebase and focus development efforts. This document outlines what was removed and how to restore it in the future.

## 🗓️ **Removal Date**

**Removed**: December 2024  
**Planned Restoration**: June 2025 (6 months from removal)

## 🗂️ **What Was Removed**

### **Directories**

- `extensions/intellij/` - Complete IntelliJ extension source code
- `.github/actions/run-jetbrains-tests/` - JetBrains testing actions
- `.idea/` - IntelliJ project configuration

### **Files**

- `.github/workflows/jetbrains-release.yaml` - JetBrains release workflow
- `.github/workflows/submit-github-dependency-graph.yml` - Gradle dependency analysis
- `.synapse/rules/intellij-test-standards.yaml` - IntelliJ testing standards
- `.synapse/rules/intellij-plugin-test-execution.yaml` - IntelliJ test execution rules

### **Code References**

- `postIntellijMessage` function in core types
- JetBrains IDE detection and handling
- IntelliJ-specific message passing
- Gradle build configurations

### **Build Scripts**

- IntelliJ webview copying in VS Code build scripts
- Config schema copying to IntelliJ
- JetBrains extension packaging

### **Documentation**

- IntelliJ setup instructions
- JetBrains extension documentation
- IntelliJ debugging guides

## 🔧 **What Was Modified**

### **Core Protocol**

- Removed IntelliJ message handling
- Updated IDE detection logic
- Simplified message passing

### **VS Code Extension**

- Removed IntelliJ webview copying
- Updated build scripts
- Removed IntelliJ config schema generation

### **Configuration Files**

- Updated `.gitignore` to exclude IntelliJ patterns
- Modified `.prettierignore` for IntelliJ files
- Updated `.synapseignore` for IntelliJ directories

### **Docker Configuration**

- Removed IntelliJ package.json copying
- Updated docker-compose for IntelliJ volumes

## 📚 **What Remains (For Future Restoration)**

### **Core Infrastructure**

- VS Code extension (fully functional)
- Core library and protocols
- GUI components
- Model providers and LLM integration

### **Documentation References**

- Architecture descriptions mentioning JetBrains
- Contributing guidelines with IntelliJ references
- Configuration examples for multiple IDEs

## 🚀 **How to Restore (Future Implementation)**

### **Phase 1: Restore Core Infrastructure**

1. **Recreate IntelliJ Extension Directory**

   ```bash
   mkdir -p extensions/intellij
   ```

2. **Restore Gradle Configuration**
   - Copy from backup or recreate `build.gradle.kts`
   - Restore `gradle.properties`
   - Recreate `gradle/wrapper/` directory

3. **Restore Source Structure**
   ```
   extensions/intellij/
   ├── src/main/kotlin/     # Kotlin source code
   ├── src/main/resources/  # Resources and configs
   ├── src/test/            # Test files
   └── build.gradle.kts     # Build configuration
   ```

### **Phase 2: Restore Build System**

1. **Update VS Code Build Scripts**
   - Restore IntelliJ webview copying in `prepackage.js`
   - Restore config schema copying
   - Update cross-platform packaging

2. **Restore GitHub Actions**
   - Recreate `jetbrains-release.yaml`
   - Restore `run-jetbrains-tests` action
   - Update `auto-release.yml` for JetBrains

3. **Restore Docker Configuration**
   - Add IntelliJ package.json copying
   - Restore IntelliJ volume mounts

### **Phase 3: Restore Core Integration**

1. **Update Core Types**

   ```typescript
   // Restore in core/index.d.ts
   postIntellijMessage?: (
     messageType: string,
     data: any,
     messageIde: string,
   ) => void;
   ```

2. **Restore IDE Detection**
   - Update `isJetBrains()` function
   - Restore IntelliJ message handling
   - Update protocol pass-through

3. **Restore Configuration Loading**
   - Update YAML loading for IntelliJ
   - Restore IDE-specific configurations

### **Phase 4: Restore Documentation**

1. **Update Contributing Guide**
   - Restore IntelliJ setup instructions
   - Update IDE comparison tables
   - Restore JetBrains debugging guides

2. **Restore Configuration Examples**
   - IntelliJ-specific config examples
   - JetBrains extension setup
   - IntelliJ debugging workflows

## 🔍 **Testing After Restoration**

### **Unit Tests**

- IntelliJ extension unit tests
- Core protocol IntelliJ message tests
- Configuration loading tests

### **Integration Tests**

- IntelliJ extension integration
- Cross-IDE communication tests
- Build system validation

### **End-to-End Tests**

- IntelliJ extension functionality
- VS Code + IntelliJ coexistence
- Multi-IDE workflows

## 📝 **Notes for Developers**

### **During Removal Period**

- Avoid adding IntelliJ-specific code
- Keep VS Code extension as primary focus
- Maintain core protocols for future extension

### **Before Restoration**

- Review current VS Code implementation
- Identify improvements for IntelliJ version
- Plan for unified codebase structure

### **After Restoration**

- Ensure feature parity between extensions
- Maintain consistent user experience
- Coordinate releases between extensions

## 🔗 **Related Resources**

### **Backup Locations**

- **Git History**: All removed code preserved in git history
- **Branch**: `remove-intellij-extension` contains removal changes
- **Tags**: Previous releases contain full IntelliJ support

### **Documentation**

- [JetBrains Plugin Development](https://plugins.jetbrains.com/docs/intellij/)
- [IntelliJ Platform SDK](https://jetbrains.org/intellij/sdk/)
- [Gradle Plugin Development](https://docs.gradle.org/current/userguide/java_gradle_plugin.html)

### **Community**

- [Synapse Discord](https://discord.gg/NWtdYexhMs)
- [GitHub Issues](https://github.com/synapsedev/synapse/issues)
- [JetBrains Plugin Marketplace](https://plugins.jetbrains.com/)

## 📋 **Checklist for Restoration**

- [ ] Restore IntelliJ extension directory structure
- [ ] Recreate Gradle build configuration
- [ ] Restore source code and resources
- [ ] Update VS Code build scripts
- [ ] Restore GitHub Actions workflows
- [ ] Update Docker configuration
- [ ] Restore core protocol integration
- [ ] Update configuration loading
- [ ] Restore documentation
- [ ] Run comprehensive tests
- [ ] Update release workflows
- [ ] Coordinate with VS Code extension

---

_This document should be updated as the restoration progresses and any new considerations arise._
