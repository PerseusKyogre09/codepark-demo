// wasmUtils.ts
declare global {
  interface Window {
    Module: any;
  }
}

let Module: any = null;

export async function loadWasm(): Promise<any> {
  if (Module) return Module;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/wasm/fibonacci.js';
    script.onload = () => {
      window.Module.onRuntimeInitialized = () => {
        Module = window.Module;
        resolve(Module);
      };
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function fibonacci(n: number): Promise<number> {
  const module = await loadWasm();
  return module.ccall('fibonacci', 'number', ['number'], [n]);
}