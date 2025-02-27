import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

interface BarProps {
  height: number;
  width: number;
  color: string;
  value: number;
  index: number;
  isCurrentIndex: boolean;
  isMinIndex: boolean;
  isComparingIndex: boolean;
}

const Bar: React.FC<BarProps> = ({ 
  height, 
  width, 
  color, 
  value, 
  index, 
  isCurrentIndex, 
  isMinIndex, 
  isComparingIndex 
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Pointer indicators */}
      <div className="h-8 flex items-end justify-center">
        {isCurrentIndex && (
          <div className="text-blue-500 font-bold text-xs">
            i
            <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-blue-500"></div>
          </div>
        )}
        {isMinIndex && !isCurrentIndex && (
          <div className="text-red-500 font-bold text-xs">
            min
            <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-red-500"></div>
          </div>
        )}
        {isComparingIndex && (
          <div className="text-yellow-500 font-bold text-xs">
            j
            <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-yellow-500"></div>
          </div>
        )}
      </div>
      
      {/* Bar */}
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
          backgroundColor: color,
          transition: 'height 0.3s ease, background-color 0.3s ease',
        }}
        className="rounded-t-md"
      ></div>
      
      {/* Value and index */}
      <div className="flex flex-col items-center mt-1">
        <span className="text-xs font-medium">{value}</span>
        <span className="text-xs text-gray-500">[{index}]</span>
      </div>
    </div>
  );
};

const SelectionSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [comparingIndex, setComparingIndex] = useState<number>(-1);
  const [minIndex, setMinIndex] = useState<number>(-1);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(500); // milliseconds
  const [arraySize, setArraySize] = useState<number>(10);
  const sortingTimeoutRef = useRef<number | null>(null);

  // Generate a new random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    setArray(newArray);
    setSortedIndices([]);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setMinIndex(-1);
    setIterations(0);
    setComparisons(0);
    setSwaps(0);
  };

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (sortingTimeoutRef.current !== null) {
        window.clearTimeout(sortingTimeoutRef.current);
      }
    };
  }, []);

  // Selection sort algorithm with animation
  const selectionSort = () => {
    if (!isSorting) return;
    
    const n = array.length;
    let i = sortedIndices.length;
    
    if (i >= n) {
      // Sorting is complete
      setIsSorting(false);
      setSortedIndices([...Array(n).keys()]);
      setCurrentIndex(-1);
      setComparingIndex(-1);
      setMinIndex(-1);
      return;
    }

    // Start a new iteration
    if (comparingIndex === -1) {
      setCurrentIndex(i);
      setComparingIndex(i + 1);
      setMinIndex(i);
      setIterations(prev => prev + 1);
      return;
    }

    // Compare current minimum with the next element
    if (comparingIndex < n) {
      setComparisons(prev => prev + 1);
      
      // If current element is smaller than the minimum, update minimum
      if (array[comparingIndex] < array[minIndex]) {
        setMinIndex(comparingIndex);
      }
      
      // Move to next element
      setComparingIndex(comparingIndex + 1);
    } else {
      // Swap if needed
      if (minIndex !== currentIndex) {
        setSwaps(prev => prev + 1);
        const newArray = [...array];
        [newArray[currentIndex], newArray[minIndex]] = [newArray[minIndex], newArray[currentIndex]];
        setArray(newArray);
      }
      
      // Mark current index as sorted
      setSortedIndices([...sortedIndices, currentIndex]);
      
      // Reset for next iteration
      setCurrentIndex(-1);
      setComparingIndex(-1);
      setMinIndex(-1);
    }
  };

  // Effect for animation timing
  useEffect(() => {
    if (isSorting) {
      sortingTimeoutRef.current = window.setTimeout(selectionSort, speed);
    }
    return () => {
      if (sortingTimeoutRef.current !== null) {
        window.clearTimeout(sortingTimeoutRef.current);
      }
    };
  }, [isSorting, array, currentIndex, comparingIndex, minIndex, sortedIndices]);

  // Toggle sorting state
  const toggleSorting = () => {
    setIsSorting(!isSorting);
  };

  // Reset the sorting process
  const resetSort = () => {
    if (sortingTimeoutRef.current !== null) {
      window.clearTimeout(sortingTimeoutRef.current);
    }
    setIsSorting(false);
    generateArray();
  };

  // Get color for a bar based on its state
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return '#4ade80'; // Sorted (green)
    if (index === minIndex) return '#f87171'; // Current minimum (red)
    if (index === currentIndex) return '#60a5fa'; // Current position being sorted (blue)
    if (index === comparingIndex) return '#fbbf24'; // Currently comparing (yellow)
    return '#94a3b8'; // Default (gray)
  };

  // Adjust speed
  const increaseSpeed = () => {
    setSpeed(prev => Math.max(100, prev - 100));
  };

  const decreaseSpeed = () => {
    setSpeed(prev => Math.min(1000, prev + 100));
  };

  // Adjust array size
  const increaseSize = () => {
    setArraySize(prev => Math.min(50, prev + 5));
  };

  const decreaseSize = () => {
    setArraySize(prev => Math.max(5, prev - 5));
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Selection Sort Visualization</h2>
      
      <div className="w-full mb-8">
        <div className="flex flex-col mb-6">
          {/* Legend */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
              <span className="text-xs">Current (i)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-xs">Minimum (min)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
              <span className="text-xs">Comparing (j)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-xs">Sorted</span>
            </div>
          </div>
          
          {/* Visualization area */}
          <div className="flex justify-center items-end space-x-2 h-64 border-b border-gray-200 pb-4">
            {array.map((value, index) => (
              <Bar
                key={index}
                height={value * 2}
                width={Math.max(20, 500 / array.length - 4)}
                color={getBarColor(index)}
                value={value}
                index={index}
                isCurrentIndex={index === currentIndex}
                isMinIndex={index === minIndex}
                isComparingIndex={index === comparingIndex}
              />
            ))}
          </div>
        </div>
        
        {/* Current operation description */}
        <div className="bg-blue-50 p-3 rounded-md mb-6 text-center">
          <p className="text-sm text-blue-800">
            {isSorting ? (
              comparingIndex === -1 ? (
                "Starting new iteration..."
              ) : comparingIndex >= array.length ? (
                minIndex !== currentIndex ? 
                  `Swapping elements at positions [${currentIndex}] and [${minIndex}]` : 
                  `Element at position [${currentIndex}] is already in the correct position`
              ) : (
                `Comparing elements at positions [${minIndex}] and [${comparingIndex}]`
              )
            ) : (
              sortedIndices.length === array.length ? 
                "Array is fully sorted!" : 
                "Press Start to begin sorting"
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-sm text-gray-600">Iterations</p>
            <p className="text-xl font-semibold">{iterations}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-sm text-gray-600">Comparisons</p>
            <p className="text-xl font-semibold">{comparisons}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-sm text-gray-600">Swaps</p>
            <p className="text-xl font-semibold">{swaps}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-sm text-gray-600">Speed</p>
            <p className="text-xl font-semibold">{speed}ms</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={toggleSorting}
            className={`flex items-center px-4 py-2 rounded-md ${
              isSorting ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            {isSorting ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
            {isSorting ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={resetSort}
            className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            <RotateCcw size={18} className="mr-2" />
            Reset
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Speed:</span>
            <button
              onClick={increaseSpeed}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
              title="Faster"
            >
              <ChevronUp size={18} />
            </button>
            <button
              onClick={decreaseSpeed}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-1"
              title="Slower"
            >
              <ChevronDown size={18} />
            </button>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Size:</span>
            <button
              onClick={increaseSize}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
              title="Increase size"
            >
              <ChevronUp size={18} />
            </button>
            <button
              onClick={decreaseSize}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-1"
              title="Decrease size"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md w-full">
        <h3 className="text-lg font-semibold mb-2">How Selection Sort Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Find the smallest element in the unsorted part of the array</li>
          <li>Swap it with the element at the beginning of the unsorted part</li>
          <li>Move the boundary between sorted and unsorted parts one element to the right</li>
          <li>Repeat until the entire array is sorted</li>
        </ol>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Variables:</strong></p>
          <ul className="list-disc list-inside ml-4 mt-1">
            <p><span className="text-blue-600 font-medium">i</span> - Current position being sorted</p>
            <p><span className="text-red-600 font-medium">min</span> - Position of the minimum value found</p>
            <p><span className="text-yellow-600 font-medium">j</span> - Position being compared</p>
          </ul>
          <p className="mt-2"><strong>Time Complexity:</strong> O(n²) in all cases (best, average, worst)</p>
        </div>
      </div>
    </div>
  );
};

export default SelectionSort;