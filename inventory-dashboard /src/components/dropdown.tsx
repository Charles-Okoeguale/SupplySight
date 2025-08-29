import React, { useState } from "react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || placeholder || "Select"}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
