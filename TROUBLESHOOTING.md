# Synapse Extension Troubleshooting Guide

## Issues and Solutions

### 1. YAML Extension Missing Error

**Error Message:**
```
Failed to register Synapse config.yaml schema, most likely, YAML extension is not installed
CodeExpectedError: Unable to write to User Settings because yaml.schemas is not a registered configuration.
```

**Solution:**
Install the YAML extension for VS Code:
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "YAML" by Red Hat
4. Install "YAML" extension
5. Reload VS Code

**Alternative Solution:**
The extension will now automatically detect if the YAML extension is missing and prompt you to install it.

### 2. JSON Syntax Error

**Error Message:**
```
SyntaxError: Unexpected token ']', ..."own",
			],
			"se"... is not valid JSON
```

**Solution:**
This error typically occurs in VS Code configuration files. To fix:

1. **Check VS Code Settings:**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Preferences: Open Settings (JSON)"
   - Look for any malformed JSON around the word "own"
   - Fix the syntax error

2. **Check Workspace Settings:**
   - Look for `.vscode/settings.json` in your project
   - Ensure all JSON is properly formatted

3. **Check Global VS Code Settings:**
   - On macOS: `~/Library/Application Support/Code/User/settings.json`
   - On Windows: `%APPDATA%\Code\User\settings.json`
   - On Linux: `~/.config/Code/User/settings.json`

4. **Common Fix for macOS:**
   ```bash
   # Remove trailing characters that cause JSON syntax errors
   sed -i '' 's/%$//' ~/Library/Application\ Support/Code/User/settings.json
   ```

### 3. LanceDB Native Library Missing

**Error Message:**
```
Failed to load LanceDB: Error: vectordb: failed to load native library.
You may need to run `npm install @lancedb/vectordb-darwin-arm64`
```

**Solution:**
Install the missing native library for your platform:

```bash
# For macOS ARM64 (Apple Silicon)
npm install @lancedb/vectordb-darwin-arm64

# For macOS Intel
npm install @lancedb/vectordb-darwin-x64

# For Linux ARM64
npm install @lancedb/vectordb-linux-arm64

# For Linux Intel
npm install @lancedb/vectordb-linux-x64

# For Windows ARM64
npm install @lancedb/vectordb-win32-arm64

# For Windows Intel
npm install @lancedb/vectordb-win32-x64
```

**Note:** Install this in both the root project directory and the extensions/vscode directory.

### 4. Build Dependencies Missing

**Error Message:**
```
Could not resolve "@huggingface/jinja"
```

**Solution:**
Install missing build dependencies:

```bash
npm install @huggingface/jinja
```

### 5. Extension Cycling (Deactivating/Activating)

**Symptoms:**
- Extension shows "deactivated" then "active" messages
- Commands not working consistently

**Solutions:**

1. **Reload VS Code Window:**
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Developer: Reload Window"
   - Press Enter

2. **Check Extension Dependencies:**
   - Ensure all required extensions are installed
   - Check for extension conflicts

3. **Clear Extension Cache:**
   - Close VS Code
   - Delete the extension cache folder:
     - macOS: `~/Library/Application Support/Code/User/workspaceStorage/`
     - Windows: `%APPDATA%\Code\User\workspaceStorage\`
     - Linux: `~/.config/Code/User/workspaceStorage/`

### 6. NODE_ENV Undefined Warning

**Warning:**
```
NODE_ENV undefined
```

**Solution:**
This is a warning, not an error. The extension will work normally. If you want to suppress it:

1. Add to your VS Code settings:
```json
{
  "terminal.integrated.env.osx": {
    "NODE_ENV": "development"
  }
}
```

### 7. Punycode Deprecation Warning

**Warning:**
```
(node:5067) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.
```

**Solution:**
This is a Node.js deprecation warning from dependencies. It doesn't affect functionality and will be resolved in future updates.

### 8. Theme Parsing Errors

**Error Message:**
```
Error loading color theme: SyntaxError: Unexpected token ']', ..."own", ], "se"... is not valid JSON
```

**Solution:**
This error occurs when the extension tries to parse malformed JSON from theme files or other extension files. The issue has been fixed by:

1. **Improved Theme Detection**: The extension now only processes actual theme files
2. **Better Error Handling**: Graceful fallback when theme parsing fails
3. **File Validation**: Checks if files contain theme-specific properties before parsing

**Note:** This fix is included in the latest version of the extension. If you're still seeing this error, rebuild the extension:

```bash
cd extensions/vscode && npm run esbuild
```

### 9. Extension API Proposal Warnings

**Warning Messages:**
```
WARN Via 'product.json#extensionEnabledApiProposals' extension 'ms-vsliveshare.vsliveshare' wants API proposal 'notebookCellExecutionState' but that proposal DOES NOT EXIST.
```

**Solution:**
These are warnings from other extensions trying to use experimental VS Code APIs that may have been finalized or abandoned. They don't affect Synapse functionality and can be safely ignored. These warnings will be resolved when the other extensions update their API usage.

### 10. Duplicate Extension Registration Warnings

**Warning Messages:**
```
WARN [Prisma.prisma]: Cannot register 'prisma.fileWatcher'. This property is already registered.
```

**Solution:**
These warnings occur when multiple versions of the same extension are installed (e.g., Prisma and Prisma Insider). They don't affect Synapse functionality. To resolve:

1. **Check for Duplicate Extensions**: Look for multiple versions of the same extension
2. **Disable One Version**: Keep only the version you need
3. **Update Extensions**: Ensure all extensions are up to date

## Prevention Steps

1. **Keep Extensions Updated:**
   - Regularly update VS Code and all extensions
   - Check for extension compatibility

2. **Use Stable Versions:**
   - Avoid using pre-release versions unless necessary
   - Test new extensions in a separate workspace first

3. **Monitor Extension Logs:**
   - Open Command Palette
   - Type "Developer: Show Logs"
   - Select "Extension Host" to see detailed logs

4. **Regular Maintenance:**
   - Clean up VS Code workspace storage periodically
   - Check for JSON syntax errors in settings files
   - Keep native dependencies updated

5. **Extension Conflict Management:**
   - Avoid installing multiple versions of the same extension
   - Check for extension conflicts before installing new ones
   - Use the extension pack when available instead of individual extensions

## Getting Help

If issues persist:

1. **Check the Logs:**
   - Use "Developer: Show Logs" in VS Code
   - Look for Synapse-related errors

2. **Report Issues:**
   - Create an issue on the Synapse GitHub repository
   - Include error messages and logs

3. **Community Support:**
   - Check the Synapse Discord/community channels
   - Search existing issues for similar problems

## Quick Fix Commands

```bash
# Reload VS Code window
Cmd+Shift+P → "Developer: Reload Window"

# Clear extension cache (macOS)
rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage/*

# Install YAML extension
Cmd+Shift+X → Search "YAML" → Install Red Hat YAML extension

# Check extension status
Cmd+Shift+P → "Extensions: Show Installed Extensions"

# Fix JSON syntax errors in VS Code settings (macOS)
sed -i '' 's/%$//' ~/Library/Application\ Support/Code/User/settings.json

# Install LanceDB native library
npm install @lancedb/vectordb-darwin-arm64

# Install missing build dependencies
npm install @huggingface/jinja
```

## Extension Status Check

After applying fixes, verify the extension is working:

1. **Check Extension Status:**
   - Look for Synapse icon in the sidebar
   - Verify commands are available in Command Palette

2. **Test Basic Functionality:**
   - Try opening Synapse chat (Cmd+L / Ctrl+L)
   - Check if autocomplete works
   - Verify configuration files are recognized

3. **Monitor Console:**
   - Open Developer Console (Help → Toggle Developer Tools)
   - Look for any remaining error messages

4. **Verify Dependencies:**
   - Check that YAML extension is installed
   - Ensure LanceDB native library is available
   - Confirm all build dependencies are installed

## Complete Fix Checklist

- [ ] Install YAML extension (redhat.vscode-yaml)
- [ ] Fix JSON syntax errors in VS Code settings
- [ ] Install LanceDB native library for your platform
- [ ] Install missing build dependencies (@huggingface/jinja)
- [ ] Rebuild the extension (npm run esbuild)
- [ ] Reload VS Code window
- [ ] Test Synapse functionality
- [ ] Check console for remaining errors
- [ ] Verify theme parsing works without errors
- [ ] Check for extension conflicts and duplicates
- [ ] Ensure all warnings are informational only
