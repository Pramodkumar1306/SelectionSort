import React from 'react';
import SelectionSort from './components/SelectionSort';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sorting Algorithm Visualizer
        </h1>
        <SelectionSort />
      </div>
    </div>
  );
}

export default App;