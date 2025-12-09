'use client';

import Icon from '../atoms/Icon';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Seleccionar...',
  className = '',
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-4 py-3 pr-10
            bg-admin-dark-elevated 
            border border-admin-primary/20 
            rounded-lg 
            text-text-primary
            appearance-none
            cursor-pointer
            transition-all duration-200
            focus:outline-none 
            focus:border-admin-primary/50 
            focus:ring-2 
            focus:ring-admin-primary/20
            hover:border-admin-primary/40
          "
        >
          {!selectedOption && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted flex items-center">
          <Icon name="chevronDown" size={16} />
        </div>
      </div>
    </div>
  );
}
