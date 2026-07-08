import { BaseRuntime } from './BaseRuntime';
import type { RuntimeCallbacks } from './BaseRuntime';

export class JavaScriptRuntime extends BaseRuntime {
    constructor(callbacks: RuntimeCallbacks) {
        super(callbacks);
    }

    async run(code: string): Promise<void> {
        const start = performance.now();
        try {
            // Create a virtual console to capture output
            const virtualConsole = {
                log: (...args: any[]) => this.callbacks.onOutput({
                    stream: 'stdout',
                    chunk: args.map(arg => String(arg)).join(' ') + '\n'
                }),
                error: (...args: any[]) => this.callbacks.onOutput({
                    stream: 'stderr',
                    chunk: args.map(arg => String(arg)).join(' ') + '\n'
                }),
                warn: (...args: any[]) => this.callbacks.onOutput({
                    stream: 'stdout',
                    chunk: '[WARN] ' + args.map(arg => String(arg)).join(' ') + '\n'
                }),
                info: (...args: any[]) => this.callbacks.onOutput({
                    stream: 'stdout',
                    chunk: args.map(arg => String(arg)).join(' ') + '\n'
                }),
            };

            // Wrap code in an async function to support await top-level (simulated)
            // and inject virtual console
            const execute = new Function('console', `
        return (async () => {
          ${code}
        })();
      `);

            await execute(virtualConsole);

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
        // For simple JS eval, we can't easily stop it once started
        // unless we use Web Workers.
    }
}
