import { BaseRuntime } from './BaseRuntime';
import type { RuntimeCallbacks } from './BaseRuntime';
import { loadPyodide, type PyodideInterface } from 'pyodide';

export class PythonRuntime extends BaseRuntime {
    private pyodide: PyodideInterface | null = null;
    private isLoading = false;

    constructor(callbacks: RuntimeCallbacks) {
        super(callbacks);
    }

    private async initialize(): Promise<PyodideInterface> {
        if (this.pyodide) return this.pyodide;
        if (this.isLoading) {
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (this.pyodide) return this.pyodide;
        }

        this.isLoading = true;
        try {
            this.pyodide = await loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
            });

            // Override stdout and stderr
            this.pyodide.setStdout({
                batched: (text: string) => {
                    this.callbacks.onOutput({ stream: 'stdout', chunk: text + '\n' });
                }
            });
            this.pyodide.setStderr({
                batched: (text: string) => {
                    this.callbacks.onOutput({ stream: 'stderr', chunk: text + '\n' });
                }
            });

            this.isLoading = false;
            return this.pyodide;
        } catch (error) {
            this.isLoading = false;
            throw error;
        }
    }

    async run(code: string): Promise<void> {
        const start = performance.now();
        try {
            const py = await this.initialize();

            // Clear persistent state if needed or handle as a session
            await py.runPythonAsync(code);

            const duration = (performance.now() - start) / 1000;
            this.callbacks.onComplete({
                exitCode: 0,
                duration,
            });
        } catch (error: any) {
            this.callbacks.onError(error.message || String(error));
        }
    }

    stop(): void {
        // Pyodide doesn't easily support stopping a running script in the same thread.
        // In a production environment, we'd run this in a Web Worker.
    }
}
