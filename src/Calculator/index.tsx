import React, { useState } from "react";
import { Button, Input } from 'antd';

const { TextArea } = Input;
const Calculator : React.FC = () => {

    const [calcInput, setCalcInput] = useState("");
    const [calcResult, setCalcResult] = useState("");

    const handleCalculate = () => {
      try {
        const expression = calcInput.replace(/(\d+(\.\d+)?)%/g, (_, num) => `${num}/100`);

        // eslint-disable-next-line no-eval
        const result = eval(expression);

        setCalcResult(result?.toLocaleString() ?? "");
      } catch {
        setCalcResult("Lỗi biểu thức");
      }
    };

    const clear = () => {
        setCalcInput("");
        setCalcResult("");
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Máy tính nè</h2>
            <span className="text-sm text-gray-500">Ví dụ: 50000*1 - (50000*20%) / 100</span>
            <TextArea
              rows={4}
              
              placeholder="nhập"
              className="p-3 border rounded w-full"
              value={calcInput}
              onChange={(e) => {
                const value = e.target.value;
                const allowed = /^[0-9+\-*/%(). ]*$/;
                if (allowed.test(value)) setCalcInput(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCalculate();
              }}
            />
        
            <Button
              onClick={handleCalculate}
              color="cyan" variant="filled"
              className="mt-3 justify-center w-xs bg-green-600 text-white py-2 rounded"
            >
              Tính
            </Button>            
            
            <Button
              onClick={clear}
              type="primary" danger
              className="mt-3 justify-center w-xs text-white py-2 rounded"
            >
              Clear
            </Button>
          
            <div className="mt-4">
              <p className="font-medium">Kết quả:</p>
              <p className="text-2xl font-bold mt-1">{calcResult.toLocaleString()}</p>
            </div>
        </div>
    );
}

export default Calculator;