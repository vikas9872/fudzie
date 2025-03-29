import React from "react";
import { useState } from "react";
const ToggleBtn = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleAvailability = () => {
    setIsAvailable((prev) => !prev);
  };
  return (
    <div className="flex flex-col items-center md:w-8">
      <button
        className="h-3 md:h-4"
        title={isAvailable ? "Available" : "Unavailable"}
      >
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={toggleAvailability}
            className="sr-only peer"
          />
          <div
            className="w-5 h-3 md:w-8 md:h-4 bg-gray-200 rounded-full peer-focus:ring-1 peer-focus:ring-green-500
            peer-checked:bg-green-500 peer-checked:after:translate-x-2  md:peer-checked:after:translate-x-5 after:content-[''] 
            after:absolute after:top-0  after:left-[2px] after:bg-white after:rounded-full 
            after:h-3 md:after:h-4 after:w-3 md:after:w-4 after:transition-all"
          ></div>
        </label>
      </button>
    </div>
  );
};

export default ToggleBtn;
