<div align="center">

![Synapse logo](media/readme.gif)

</div>

<h1 align="center">Synapse VS Code Extension</h1>

<div align="center">

**The leading open-source AI code assistant for VS Code. Create, share, and use custom AI assistants with powerful autocomplete, chat, edit, and agent capabilities.**

</div>

<div align="center">

<a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=Synapse.synapse" style="background:none">
    <img src="https://img.shields.io/visual-studio-marketplace/v/Synapse.synapse.svg?style=flat&colorA=0066CC&colorB=007ACC&label=VS%20Code%20Marketplace" style="height: 22px;" />
</a>
<a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=Synapse.synapse" style="background:none">
    <img src="https://img.shields.io/visual-studio-marketplace/d/Synapse.synapse.svg?style=flat&colorA=0066CC&colorB=007ACC&label=Downloads" style="height: 22px;" />
</a>
<a target="_blank" href="https://opensource.org/licenses/Apache-2.0" style="background:none">
    <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" style="height: 22px;" />
</a>
<a target="_blank" href="https://docs.synapse.dev" style="background:none">
    <img src="https://img.shields.io/badge/docs-synapse.dev-blue.svg" style="height: 22px;" />
</a>
<a target="_blank" href="https://discord.gg/vapESyrFmJ" style="background:none">
    <img src="https://img.shields.io/badge/discord-join-synapse.svg?labelColor=191937&color=6F6FF7&logo=discord" style="height: 22px;" />
</a>

</div>

## ✨ Features

### 🤖 **Agent Mode**
Make substantial changes to your entire codebase with AI assistance. The agent can understand your project structure and make coordinated changes across multiple files.

**Key Commands:**
- `Cmd/Ctrl + L` - Add highlighted code to context and clear chat
- `Cmd/Ctrl + Shift + L` - Add highlighted code to context

### 💬 **AI Chat**
Get help from LLMs without leaving your IDE. Ask questions, get explanations, and receive coding assistance in real-time.

**Features:**
- Context-aware conversations
- File and code selection integration
- Multiple model support
- Session management with history

### ✏️ **Inline Edit**
Modify code directly in your editor using natural language instructions. Perfect for quick fixes and improvements.

**Key Commands:**
- `Cmd/Ctrl + I` - Edit highlighted code with natural language
- `Shift + Cmd/Ctrl + Enter` - Accept diff
- `Shift + Cmd/Ctrl + Backspace` - Reject diff
- `Escape` - Exit edit mode

### 🔄 **Tab Autocomplete**
Get intelligent code suggestions as you type, powered by AI models that understand your codebase context.

**Key Commands:**
- `Cmd/Ctrl + K, Cmd/Ctrl + A` - Toggle autocomplete enabled/disabled
- `Cmd/Ctrl + Alt + Space` - Force autocomplete
- `Tab` - Accept suggestion
- `Escape` - Reject suggestion

### ⚡ **Quick Actions**
Right-click context menu actions for common coding tasks:

- **Write Comments** - Generate comments for selected code
- **Write Docstrings** - Create documentation for functions/classes
- **Fix Code** - Automatically fix bugs and issues
- **Optimize Code** - Improve performance and readability
- **Fix Grammar/Spelling** - Correct text in markdown files

### 🛠️ **Advanced Features**

#### **Codebase Indexing**
- Intelligent codebase understanding and search
- Automatic indexing with manual re-index options
- Context-aware suggestions based on your project

#### **Terminal Integration**
- `Cmd/Ctrl + Shift + R` - Debug terminal with AI assistance
- Terminal context understanding for better suggestions

#### **Configuration Management**
- JSON and YAML configuration support with validation
- Schema-based autocompletion for config files
- Remote configuration syncing for teams

#### **Custom Prompt Language**
- `.prompt` file support with syntax highlighting
- File completion with `@` symbol
- YAML header support for prompt metadata

#### **Multi-Model Support**
- Support for various AI models (GPT, Claude, Mistral, etc.)
- Custom model configuration
- Enterprise license key support

## 🚀 Getting Started

### Installation
1. Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Synapse.synapse)
2. Open VS Code and look for the Synapse icon in the activity bar
3. Configure your preferred AI model in settings

### Quick Start
1. **Select code** and press `Cmd/Ctrl + L` to start a chat
2. **Highlight code** and press `Cmd/Ctrl + I` to edit inline
3. **Start typing** to get autocomplete suggestions
4. **Right-click** on code for quick actions

## ⌨️ Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Focus Chat | `Cmd + L` | `Ctrl + L` |
| Add to Context | `Cmd + Shift + L` | `Ctrl + Shift + L` |
| Inline Edit | `Cmd + I` | `Ctrl + I` |
| Accept Diff | `Shift + Cmd + Enter` | `Shift + Ctrl + Enter` |
| Reject Diff | `Shift + Cmd + Backspace` | `Shift + Ctrl + Backspace` |
| Toggle Autocomplete | `Cmd + K, Cmd + A` | `Ctrl + K, Ctrl + A` |
| Force Autocomplete | `Cmd + Alt + Space` | `Ctrl + Alt + Space` |
| Debug Terminal | `Cmd + Shift + R` | `Ctrl + Shift + R` |
| Open in New Window | `Cmd + K, Cmd + M` | `Ctrl + K, Ctrl + M` |

## 🔧 Configuration

The extension supports extensive configuration through:
- **VS Code Settings** - Basic preferences and feature toggles
- **`.synapserc.json`** - Project-specific configuration
- **`config.yaml`** - Advanced configuration with YAML support
- **Remote Config** - Team-wide configuration syncing

### Key Settings
- `synapse.enableTabAutocomplete` - Enable/disable autocomplete
- `synapse.enableQuickActions` - Enable experimental quick actions
- `synapse.telemetryEnabled` - Control telemetry collection
- `synapse.enableConsole` - Enable debug console

## 🏗️ Development

### Building the Extension
```bash
npm install
npm run esbuild
```

### Running Tests
```bash
npm test
npm run e2e:all  # End-to-end tests
```

### Packaging
```bash
npm run package
```

## 📚 Documentation

- [Official Documentation](https://docs.synapse.dev)
- [Getting Started Guide](https://docs.synapse.dev/getting-started/install)
- [Feature Walkthroughs](https://docs.synapse.dev/features/)
- [Configuration Guide](https://docs.synapse.dev/customize/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) and join the [#contribute channel on Discord](https://discord.gg/vapESyrFmJ).

## 📄 License

[Apache 2.0 © 2023-2025 Synapse Dev, Inc.](../../LICENSE)
