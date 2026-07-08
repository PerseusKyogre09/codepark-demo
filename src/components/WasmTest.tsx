import { useState } from 'react';
import { fibonacci } from '../utils/wasmUtils';

const WasmTest = () => {
  const [input, setInput] = useState(10);
  const [result, setResult] = useState<number | null>(null);

  const calculate = async () => {
    const res = await fibonacci(input);
    setResult(res);
  };

  return (
    <div>
      <h2>WASM Fibonacci Calculator</h2>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(parseInt(e.target.value))}
      />
      <button onClick={calculate}>Calculate</button>
      {result !== null && <p>Fibonacci({input}) = {result}</p>}
    </div>
  );
};

export default WasmTest;