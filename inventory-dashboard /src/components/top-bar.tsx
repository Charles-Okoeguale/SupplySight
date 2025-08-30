import { BarChart3 } from "lucide-react";

interface RangeOption {
  label: string;
  value: string;
}

interface TopBarProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  ranges: RangeOption[];
}

const TopBar = ({dateRange, setDateRange, ranges} : TopBarProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold text-gray-900">SupplySight</h1>
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${dateRange === range.value 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;