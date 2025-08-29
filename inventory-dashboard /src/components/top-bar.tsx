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
    <div className="flex items-center justify-between p-4 bg-red w-[100%] shadow-sm">
      <h1 className="text-2xl font-bold text-black">SupplySight</h1>
      <div className="flex space-x-2">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              ${dateRange === range.value ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}
            `}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopBar;