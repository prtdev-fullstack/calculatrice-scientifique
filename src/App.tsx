import React, { useState, useEffect } from 'react';
import { Moon, Sun, History } from 'lucide-react';

type Operation = {
  expression: string;
  result: string;
};

function App() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<Operation[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRadians, setIsRadians] = useState(true);

  const scientificFunctions = {
    sin: (x: number) => Math.sin(isRadians ? x : (x * Math.PI) / 180),
    cos: (x: number) => Math.cos(isRadians ? x : (x * Math.PI) / 180),
    tan: (x: number) => Math.tan(isRadians ? x : (x * Math.PI) / 180),
    log: (x: number) => Math.log10(x),
    ln: (x: number) => Math.log(x),
    sqrt: (x: number) => Math.sqrt(x),
    factorial: (x: number) => {
      if (x < 0) return NaN;
      if (x === 0) return 1;
      let result = 1;
      for (let i = 1; i <= x; i++) result *= i;
      return result;
    }
  };

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(prev => prev + op);
  };

  const handleScientific = (func: keyof typeof scientificFunctions) => {
    try {
      const value = parseFloat(display);
      const result = scientificFunctions[func](value);
      setDisplay(result.toString());
      addToHistory(`${func}(${display})`, result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const calculate = () => {
    try {
      // Using Function constructor for evaluation (safer than eval)
      const result = new Function('return ' + display)();
      addToHistory(display, result.toString());
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const addToHistory = (expression: string, result: string) => {
    setHistory(prev => [...prev, { expression, result }]);
  };

  const clear = () => {
    setDisplay('0');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const buttonClass = `
    px-4 py-3 text-lg font-medium rounded-lg
    transition-colors duration-200
    ${isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
  `;

  const scientificButtonClass = `
    px-3 py-2 text-sm font-medium rounded-lg
    transition-colors duration-200
    ${isDarkMode
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
      : 'bg-indigo-500 hover:bg-indigo-400 text-white'}
  `;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className={`
            p-6 rounded-2xl shadow-2xl
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          `}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Scientific Calculator
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  <History size={20} />
                </button>
              </div>
            </div>

            {/* Display */}
            <div className={`
              w-full p-4 mb-4 text-right text-2xl font-mono rounded-lg
              ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}
            `}>
              {display}
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsRadians(!isRadians)}
                className={`text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                {isRadians ? 'RAD' : 'DEG'}
              </button>
            </div>

            {/* Scientific Functions */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button onClick={() => handleScientific('sin')} className={scientificButtonClass}>sin</button>
              <button onClick={() => handleScientific('cos')} className={scientificButtonClass}>cos</button>
              <button onClick={() => handleScientific('tan')} className={scientificButtonClass}>tan</button>
              <button onClick={() => handleScientific('log')} className={scientificButtonClass}>log</button>
              <button onClick={() => handleScientific('ln')} className={scientificButtonClass}>ln</button>
              <button onClick={() => handleScientific('sqrt')} className={scientificButtonClass}>√</button>
              <button onClick={() => handleScientific('factorial')} className={scientificButtonClass}>n!</button>
              <button onClick={() => handleOperator('**')} className={scientificButtonClass}>x^y</button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={clear} className={`${buttonClass} col-span-2 bg-red-500 hover:bg-red-400 text-white`}>C</button>
              <button onClick={() => handleOperator('/')} className={buttonClass}>÷</button>
              <button onClick={() => handleOperator('*')} className={buttonClass}>×</button>
              
              <button onClick={() => handleNumber('7')} className={buttonClass}>7</button>
              <button onClick={() => handleNumber('8')} className={buttonClass}>8</button>
              <button onClick={() => handleNumber('9')} className={buttonClass}>9</button>
              <button onClick={() => handleOperator('-')} className={buttonClass}>-</button>
              
              <button onClick={() => handleNumber('4')} className={buttonClass}>4</button>
              <button onClick={() => handleNumber('5')} className={buttonClass}>5</button>
              <button onClick={() => handleNumber('6')} className={buttonClass}>6</button>
              <button onClick={() => handleOperator('+')} className={buttonClass}>+</button>
              
              <button onClick={() => handleNumber('1')} className={buttonClass}>1</button>
              <button onClick={() => handleNumber('2')} className={buttonClass}>2</button>
              <button onClick={() => handleNumber('3')} className={buttonClass}>3</button>
              <button onClick={calculate} className={`${buttonClass} bg-green-500 hover:bg-green-400 text-white row-span-2`}>=</button>
              
              <button onClick={() => handleNumber('0')} className={`${buttonClass} col-span-2`}>0</button>
              <button onClick={() => handleNumber('.')} className={buttonClass}>.</button>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className={`
                mt-4 p-4 rounded-lg
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>History</h2>
                <div className="max-h-40 overflow-y-auto">
                  {history.map((entry, index) => (
                    <div key={index} className={`py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>{entry.expression}</div>
                      <div className="font-bold">{entry.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;