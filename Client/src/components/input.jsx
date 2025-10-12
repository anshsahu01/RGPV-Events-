import React, { useId, forwardRef } from 'react';

const Input = forwardRef(({ label, type = "text", className = "", ...props }, ref) => {
  const Id = useId();

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={Id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={Id}
        ref={ref}
        className={`w-full border border-blue-600 p-3 rounded-xl ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;

