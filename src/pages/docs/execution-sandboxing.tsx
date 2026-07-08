import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  onNavigate: (section: string) => void;
}

const ExecutionSandboxing: React.FC<Props> = ({ onNavigate }) => {
  const { themeColors } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>Execution Sandboxing</h1>
      <p style={{ color: themeColors.textSecondary }}>CodePark executes all user code inside strictly sandboxed environments to ensure security, isolation, and predictable behavior.</p>
      <p style={{ color: themeColors.textSecondary }}>Sandboxing is a foundational design principle in CodePark and applies to every execution, debug session, terminal command, and GUI application.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Overview</h2>
      <p style={{ color: themeColors.textSecondary }}>Execution sandboxing ensures that:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>your code cannot access the host system</li>
        <li>your code cannot interfere with other users</li>
        <li>execution remains predictable and reproducible</li>
        <li>malicious or runaway code is contained safely</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>CodePark uses multiple layers of isolation, depending on the selected runtime.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Isolation Layers in CodePark</h2>
      <p style={{ color: themeColors.textSecondary }}>CodePark supports two primary sandboxing mechanisms:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Docker-based container isolation</li>
        <li>WebAssembly (Wasm) browser sandboxing</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Both approaches are designed to prevent unauthorized access and contain execution safely.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Docker Isolation</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Container-per-execution model</h3>
      <p style={{ color: themeColors.textSecondary }}>For cloud runtimes, CodePark runs code inside dedicated Docker containers.</p>
      <p style={{ color: themeColors.textSecondary }}>Each execution:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>runs in its own container</li>
        <li>has an isolated filesystem</li>
        <li>has isolated process space</li>
        <li>has isolated networking rules</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Containers are not shared between users or projects.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Kernel-level isolation</h3>
      <p style={{ color: themeColors.textSecondary }}>Docker containers rely on kernel-level isolation features such as:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>namespaces</li>
        <li>cgroups</li>
        <li>capability restrictions</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This ensures:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>processes cannot escape the container</li>
        <li>resource usage is controlled</li>
        <li>system calls are restricted</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Your code cannot access:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the host filesystem</li>
        <li>other containers</li>
        <li>other users' data</li>
        <li>host network interfaces</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Resource limits</h3>
      <p style={{ color: themeColors.textSecondary }}>Each container is configured with strict limits, including:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CPU usage caps</li>
        <li>memory limits</li>
        <li>execution timeouts</li>
        <li>process count limits</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>These limits prevent:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>infinite loops from consuming resources</li>
        <li>denial-of-service behavior</li>
        <li>runaway memory usage</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>If limits are exceeded, execution is terminated safely.</p>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Ephemeral lifecycle</h3>
      <p style={{ color: themeColors.textSecondary }}>Docker containers are:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>created on demand</li>
        <li>short-lived</li>
        <li>destroyed after execution completes</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>No container state is reused across runs unless explicitly designed for that purpose.</p>
      <p style={{ color: themeColors.textSecondary }}>This guarantees a clean execution environment every time.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Wasm Security</h2>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Browser-level sandboxing</h3>
      <p style={{ color: themeColors.textSecondary }}>Wasm runtimes execute code entirely inside the browser's native sandbox.</p>
      <p style={{ color: themeColors.textSecondary }}>This provides an additional layer of isolation enforced by:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>the browser security model</li>
        <li>WebAssembly runtime constraints</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Wasm execution:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>cannot access the host OS</li>
        <li>cannot access local files</li>
        <li>cannot perform arbitrary system calls</li>
        <li>cannot escape the browser sandbox</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Memory safety</h3>
      <p style={{ color: themeColors.textSecondary }}>WebAssembly enforces:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>linear memory</li>
        <li>bounds-checked access</li>
        <li>no direct pointer manipulation</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This prevents:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>buffer overflows</li>
        <li>arbitrary memory access</li>
        <li>undefined behavior common in native execution</li>
      </ul>

      <h3 className="text-lg font-medium" style={{ color: themeColors.text }}>Use cases for Wasm runtimes</h3>
      <p style={{ color: themeColors.textSecondary }}>Wasm runtimes are ideal for:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>quick experiments</li>
        <li>teaching and demos</li>
        <li>lightweight scripting</li>
        <li>client-side execution</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>They trade system access for maximum isolation and fast startup.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Network Restrictions</h2>
      <p style={{ color: themeColors.textSecondary }}>Depending on the runtime and plan:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>outbound network access may be restricted</li>
        <li>inbound connections are blocked by default</li>
        <li>localhost access is container-scoped</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>This prevents:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>data exfiltration</li>
        <li>port scanning</li>
        <li>unauthorized service exposure</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Network behavior is intentionally conservative.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Filesystem Isolation</h2>
      <p style={{ color: themeColors.textSecondary }}>Within a sandboxed environment:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>only project files are accessible</li>
        <li>temporary files are session-scoped</li>
        <li>system directories are read-only or inaccessible</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>There is no access to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>host directories</li>
        <li>other projects</li>
        <li>system credentials</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Filesystem isolation applies equally to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>code execution</li>
        <li>debugging</li>
        <li>terminal usage</li>
        <li>GUI applications</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Sandboxing and Collaboration</h2>
      <p style={{ color: themeColors.textSecondary }}>Sandboxing is enforced per execution, not per user.</p>
      <p style={{ color: themeColors.textSecondary }}>In collaborative sessions:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>all collaborators share execution output</li>
        <li>sandbox boundaries remain unchanged</li>
        <li>no collaborator gains elevated privileges</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Permissions control who can run code, not how code runs.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>What Sandboxing Does NOT Do</h2>
      <p style={{ color: themeColors.textSecondary }}>Sandboxing does not:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>validate correctness of code</li>
        <li>prevent logical bugs</li>
        <li>guarantee secure application design</li>
        <li>replace code review or testing</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Sandboxing protects the platform and other users, not application-level logic.</p>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Threat Model (High-Level)</h2>
      <p style={{ color: themeColors.textSecondary }}>Sandboxing protects against:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>malicious code execution</li>
        <li>accidental system damage</li>
        <li>cross-user data access</li>
        <li>resource abuse</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>It is not designed to:</p>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>secure poorly written application logic</li>
        <li>protect secrets hardcoded into source code</li>
        <li>prevent user-intended destructive behavior within a project</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Best Practices for Secure Execution</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>Avoid hardcoding secrets in source files</li>
        <li>Use environment variables for sensitive data</li>
        <li>Treat execution output as untrusted</li>
        <li>Clean up unused runtime files</li>
        <li>Prefer Wasm runtimes for maximum isolation</li>
      </ul>

      <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: themeColors.textSecondary }}>
        <li>CodePark uses strong sandboxing by default</li>
        <li>Docker containers provide kernel-level isolation</li>
        <li>Wasm runtimes leverage browser sandboxing</li>
        <li>Resources and system access are strictly limited</li>
        <li>Sandboxes are ephemeral and project-scoped</li>
      </ul>
      <p style={{ color: themeColors.textSecondary }}>Execution sandboxing ensures that you can run code confidently—without risking your system or others.</p>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>Next Steps</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('resource-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Resource Limits →
          </button>
          <button
            onClick={() => onNavigate('data-privacy')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Data Privacy →
          </button>
          <button
            onClick={() => onNavigate('execution-limits')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Execution Limits →
          </button>
          <button
            onClick={() => onNavigate('free-vs-pro')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Free vs Pro →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionSandboxing;
