import { BaseRuntime } from './runtimes/BaseRuntime';
import type { RuntimeCallbacks } from './runtimes/BaseRuntime';
import { PythonRuntime } from './runtimes/PythonRuntime';
import { JavaScriptRuntime } from './runtimes/JavaScriptRuntime';

export class WasmManager {
    private runtimes: Map<string, BaseRuntime> = new Map();
    private activeRuntime: BaseRuntime | null = null;

    private callbacks: RuntimeCallbacks;
    constructor(callbacks: RuntimeCallbacks) {
        this.callbacks = callbacks;
    }

    private getRuntime(language: string): BaseRuntime | null {
        const lang = language.toLowerCase();

        if (this.runtimes.has(lang)) {
            return this.runtimes.get(lang)!;
        }

        let runtime: BaseRuntime | null = null;
        switch (lang) {
            case 'python':
                runtime = new PythonRuntime(this.callbacks);
                break;
            case 'javascript':
                runtime = new JavaScriptRuntime(this.callbacks);
                break;
            default:
                return null;
        }

        if (runtime) {
            this.runtimes.set(lang, runtime);
        }
        return runtime;
    }

    public isLanguageSupported(language: string): boolean {
        // Temporarily disabled Wasm execution to use Docker terminal for all languages
        // This provides consistent PTY-based execution across Python, JavaScript, C, C++, Java, etc.
        // const supported = ['python', 'javascript'];
        const supported: string[] = [];
        return supported.includes(language.toLowerCase());
    }

    public async run(code: string, language: string): Promise<void> {
        const runtime = this.getRuntime(language);
        if (!runtime) {
            this.callbacks.onError(`Language ${language} is not supported by Wasm engine.`);
            return;
        }

        this.activeRuntime = runtime;
        await runtime.run(code);
        this.activeRuntime = null;
    }

    public stop(): void {
        if (this.activeRuntime) {
            this.activeRuntime.stop();
            this.activeRuntime = null;
        }
    }
}
