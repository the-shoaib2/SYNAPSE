import React, { useState } from "react";
import "./ProjectAnalyzer.css";

interface ProjectFile {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number;
  language?: string;
  dependencies?: string[];
  lastModified: string;
}

interface ProjectDependency {
  name: string;
  version: string;
  type: "production" | "development" | "peer";
  description: string;
  size: number;
}

interface ProjectTechnology {
  name: string;
  category:
    | "language"
    | "framework"
    | "database"
    | "tool"
    | "service"
    | "runtime";
  version: string;
  usage: number;
  description: string;
}

interface ProjectData {
  name: string;
  path: string;
  totalFiles: number;
  totalSize: number;
  languages: string[];
  files: ProjectFile[];
  dependencies: ProjectDependency[];
  technologies: ProjectTechnology[];
  structure: any;
}

interface ProjectAnalyzerProps {
  data?: ProjectData;
}

export const ProjectAnalyzer: React.FC<ProjectAnalyzerProps> = ({ data }) => {
  const [selectedView, setSelectedView] = useState<
    "structure" | "dependencies" | "technologies" | "files"
  >("structure");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Default project data for demonstration
  const defaultData: ProjectData = {
    name: "Synapse",
    path: "/Users/ratulhasan/Desktop/synapse",
    totalFiles: 1250,
    totalSize: 156.7,
    languages: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Rust",
      "C++",
      "Java",
      "Kotlin",
    ],
    files: [
      {
        name: "package.json",
        path: "/package.json",
        type: "file",
        size: 2.1,
        language: "JSON",
        dependencies: ["@types/node", "typescript", "vite"],
        lastModified: "2024-01-15",
      },
      {
        name: "tsconfig.json",
        path: "/tsconfig.json",
        type: "file",
        size: 0.8,
        language: "JSON",
        lastModified: "2024-01-15",
      },
      {
        name: "src",
        path: "/src",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
      {
        name: "components",
        path: "/src/components",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
      {
        name: "Canvas",
        path: "/src/components/Canvas",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
      {
        name: "Chat.tsx",
        path: "/src/components/Canvas/Chat.tsx",
        type: "file",
        size: 45.2,
        language: "TypeScript",
        dependencies: ["react", "redux", "mermaid"],
        lastModified: "2024-01-15",
      },
      {
        name: "Canvas.tsx",
        path: "/src/components/Canvas/Canvas.tsx",
        type: "file",
        size: 38.7,
        language: "TypeScript",
        dependencies: ["react", "mermaid"],
        lastModified: "2024-01-15",
      },
      {
        name: "core",
        path: "/core",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
      {
        name: "llm",
        path: "/core/llm",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
      {
        name: "extensions",
        path: "/extensions",
        type: "directory",
        size: 0,
        lastModified: "2024-01-15",
      },
    ],
    dependencies: [
      {
        name: "react",
        version: "^18.2.0",
        type: "production",
        description: "A JavaScript library for building user interfaces",
        size: 42.5,
      },
      {
        name: "typescript",
        version: "^5.0.0",
        type: "development",
        description: "TypeScript is a superset of JavaScript",
        size: 15.2,
      },
      {
        name: "vite",
        version: "^4.0.0",
        type: "development",
        description: "Next generation frontend tooling",
        size: 28.7,
      },
      {
        name: "mermaid",
        version: "^10.0.0",
        type: "production",
        description: "Generation of diagram and flowchart from text",
        size: 8.9,
      },
      {
        name: "redux",
        version: "^4.2.0",
        type: "production",
        description: "Predictable state container for JavaScript apps",
        size: 12.3,
      },
    ],
    technologies: [
      {
        name: "TypeScript",
        category: "language",
        version: "5.0.0",
        usage: 45,
        description: "Primary development language",
      },
      {
        name: "React",
        category: "framework",
        version: "18.2.0",
        usage: 35,
        description: "Frontend UI framework",
      },
      {
        name: "Vite",
        category: "tool",
        version: "4.0.0",
        usage: 15,
        description: "Build tool and dev server",
      },
      {
        name: "Node.js",
        category: "runtime",
        version: "20.19.0",
        usage: 25,
        description: "JavaScript runtime environment",
      },
      {
        name: "Python",
        category: "language",
        version: "3.11.0",
        usage: 20,
        description: "Backend services and ML",
      },
      {
        name: "Rust",
        category: "language",
        version: "1.75.0",
        usage: 15,
        description: "Performance-critical components",
      },
    ],
    structure: {
      root: {
        name: "synapse",
        type: "directory",
        children: {
          "package.json": { type: "file", language: "JSON" },
          "tsconfig.json": { type: "file", language: "JSON" },
          src: {
            type: "directory",
            children: {
              components: {
                type: "directory",
                children: {
                  Canvas: {
                    type: "directory",
                    children: {
                      "Chat.tsx": { type: "file", language: "TypeScript" },
                      "Canvas.tsx": { type: "file", language: "TypeScript" },
                      "MermaidRenderer.tsx": {
                        type: "file",
                        language: "TypeScript",
                      },
                    },
                  },
                },
              },
            },
          },
          core: {
            type: "directory",
            children: {
              llm: { type: "directory" },
              data: { type: "directory" },
            },
          },
          extensions: {
            type: "directory",
            children: {
              vscode: { type: "directory" },
            },
          },
        },
      },
    },
  };

  const projectData = data || defaultData;

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (files: ProjectFile[], level: number = 0) => {
    return files.map((file) => (
      <div
        key={file.path}
        className="file-item"
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <div className="file-content">
          <span
            className={`file-icon ${file.type === "directory" ? "folder" : "file"}`}
            onClick={() => file.type === "directory" && toggleFolder(file.path)}
          >
            {file.type === "directory" ? "📁" : "📄"}
          </span>
          <span className="file-name">{file.name}</span>
          {file.language && (
            <span className="file-language">{file.language}</span>
          )}
          {file.type === "file" && (
            <span className="file-size">{file.size}KB</span>
          )}
        </div>
        {file.type === "directory" && expandedFolders.has(file.path) && (
          <div className="folder-contents">
            {renderFileTree(
              projectData.files.filter(
                (f) =>
                  f.path.startsWith(file.path + "/") &&
                  f.path.split("/").length === file.path.split("/").length + 1,
              ),
              level + 1,
            )}
          </div>
        )}
      </div>
    ));
  };

  const filteredDependencies = projectData.dependencies.filter(
    (dep) =>
      dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTechnologies = projectData.technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTechnologyIcon = (category: string) => {
    switch (category) {
      case "language":
        return "💻";
      case "framework":
        return "🏗️";
      case "database":
        return "🗄️";
      case "tool":
        return "🔧";
      case "service":
        return "☁️";
      case "runtime":
        return "⚡";
      default:
        return "🔍";
    }
  };

  return (
    <div className="project-analyzer">
      <div className="project-header">
        <h3>📁 Project Analysis: {projectData.name}</h3>
        <div className="project-stats">
          <span>
            <strong>Files:</strong> {projectData.totalFiles}
          </span>
          <span>
            <strong>Size:</strong> {projectData.totalSize}MB
          </span>
          <span>
            <strong>Languages:</strong> {projectData.languages.length}
          </span>
          <span>
            <strong>Path:</strong> {projectData.path}
          </span>
        </div>
      </div>

      <div className="view-selector">
        <button
          className={`view-btn ${selectedView === "structure" ? "active" : ""}`}
          onClick={() => setSelectedView("structure")}
        >
          📂 Structure
        </button>
        <button
          className={`view-btn ${selectedView === "dependencies" ? "active" : ""}`}
          onClick={() => setSelectedView("dependencies")}
        >
          📦 Dependencies
        </button>
        <button
          className={`view-btn ${selectedView === "technologies" ? "active" : ""}`}
          onClick={() => setSelectedView("technologies")}
        >
          🛠️ Technologies
        </button>
        <button
          className={`view-btn ${selectedView === "files" ? "active" : ""}`}
          onClick={() => setSelectedView("files")}
        >
          📋 Files
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search dependencies, technologies, or files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="view-content">
        {selectedView === "structure" && (
          <div className="structure-view">
            <h4>📂 Project Structure</h4>
            <div className="file-tree">
              {renderFileTree(
                projectData.files.filter((f) => f.path.split("/").length === 2),
              )}
            </div>
          </div>
        )}

        {selectedView === "dependencies" && (
          <div className="dependencies-view">
            <h4>📦 Project Dependencies</h4>
            <div className="dependencies-grid">
              {filteredDependencies.map((dep, index) => (
                <div key={dep.name} className="dependency-card">
                  <div className="dep-header">
                    <span className="dep-name">{dep.name}</span>
                    <span className={`dep-type ${dep.type}`}>{dep.type}</span>
                  </div>
                  <div className="dep-version">{dep.version}</div>
                  <div className="dep-description">{dep.description}</div>
                  <div className="dep-size">{dep.size}KB</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === "technologies" && (
          <div className="technologies-view">
            <h4>🛠️ Technology Stack</h4>
            <div className="technologies-grid">
              {filteredTechnologies.map((tech, index) => (
                <div key={tech.name} className="technology-card">
                  <div className="tech-header">
                    <span className="tech-icon">
                      {getTechnologyIcon(tech.category)}
                    </span>
                    <span className="tech-name">{tech.name}</span>
                  </div>
                  <div className="tech-category">{tech.category}</div>
                  <div className="tech-version">{tech.version}</div>
                  <div className="tech-usage">Usage: {tech.usage}%</div>
                  <div className="tech-description">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === "files" && (
          <div className="files-view">
            <h4>📋 All Files</h4>
            <div className="files-table">
              <div className="table-header">
                <span>Name</span>
                <span>Type</span>
                <span>Language</span>
                <span>Size</span>
                <span>Modified</span>
              </div>
              {projectData.files
                .filter(
                  (file) =>
                    file.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (file.language &&
                      file.language
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())),
                )
                .map((file, index) => (
                  <div key={file.path} className="table-row">
                    <span className="file-name-cell">{file.name}</span>
                    <span className="file-type-cell">{file.type}</span>
                    <span className="file-language-cell">
                      {file.language || "-"}
                    </span>
                    <span className="file-size-cell">{file.size}KB</span>
                    <span className="file-modified-cell">
                      {file.lastModified}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="project-overview">
        <h4>📊 Project Overview</h4>
        <div className="overview-grid">
          <div className="overview-item">
            <strong>Languages Used:</strong>
            <div className="language-tags">
              {projectData.languages.map((lang) => (
                <span key={lang} className="language-tag">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="overview-item">
            <strong>Total Dependencies:</strong>
            <span>{projectData.dependencies.length}</span>
          </div>
          <div className="overview-item">
            <strong>Technologies:</strong>
            <span>{projectData.technologies.length}</span>
          </div>
          <div className="overview-item">
            <strong>Project Size:</strong>
            <span>{projectData.totalSize}MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
