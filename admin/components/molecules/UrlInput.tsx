'use client';

import { useState, useEffect } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function UrlInput({
  value,
  onChange,
  label = 'URL',
  placeholder = 'ejemplo.com',
  required = false,
}: UrlInputProps) {
  const [protocol, setProtocol] = useState<'http://' | 'https://'>('https://');

  // Detect protocol from value
  useEffect(() => {
    if (value) {
      if (value.startsWith('https://')) {
        setProtocol('https://');
      } else if (value.startsWith('http://')) {
        setProtocol('http://');
      }
    } else {
      // Resetear a https:// cuando value está vacío
      setProtocol('https://');
    }
  }, [value]);

  const handleProtocolToggle = () => {
    const newProtocol = protocol === 'https://' ? 'http://' : 'https://';
    setProtocol(newProtocol);
    
    // Update value with new protocol
    const domainPart = value?.replace(/^https?:\/\//, '') || '';
    onChange(newProtocol + domainPart);
  };

  const handleDomainChange = (domain: string) => {
    onChange(protocol + domain);
  };

  return (
    <div>
      <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
        {label} {required && '*'}
      </label>
      <div className="flex" style={{ gap: fluidSizing.space.sm }}>
        <button
          type="button"
          onClick={handleProtocolToggle}
          className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-admin-primary hover:bg-admin-primary/10 transition-all duration-200 font-mono flex-shrink-0"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm, minWidth: '90px' }}
        >
          {protocol}
        </button>
        <input
          type="text"
          value={value?.replace(/^https?:\/\//, '') || ''}
          onChange={(e) => handleDomainChange(e.target.value)}
          className="flex-1 bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}
