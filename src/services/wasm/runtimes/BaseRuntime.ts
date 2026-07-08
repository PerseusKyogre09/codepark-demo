export type ExecutionOutput = {
    stream: 'stdout' | 'stderr';
    chunk: string;
};

export type ExecutionResult = {
    exitCode: number;
    duration: number;
};

export interface RuntimeCallbacks {
    onOutput: (output: ExecutionOutput) => void;
    onComplete: (result: ExecutionResult) => void;
    onError: (error: string) => void;
}

export abstract class BaseRuntime {
    protected callbacks: RuntimeCallbacks;
    constructor(callbacks: RuntimeCallbacks) {
        this.callbacks = callbacks;
    }
    abstract run(code: string): Promise<void>;
    abstract stop(): void;
}
