'use client';

import { useState } from 'react';
import MultiImageUploader from './MultiImageUploader';
import { fluidSizing } from '@/lib/fluidSizing';

interface ImageUploadTabsProps {
  desktopImages: string[];
  mobileImages: string[];
  onDesktopChange: (images: string[]) => void;
  onMobileChange: (images: string[]) => void;
}

export default function ImageUploadTabs({
  desktopImages,
  mobileImages,
  onDesktopChange,
  onMobileChange,
}: ImageUploadTabsProps) {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div>
      {/* Tabs Header */}
      <div 
        className="flex border-b border-admin-primary/20" 
        style={{ marginBottom: fluidSizing.space.lg, gap: fluidSizing.space.sm }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('desktop')}
          className={`font-medium uppercase tracking-wider transition-all duration-200 relative ${
            activeTab === 'desktop'
              ? 'text-admin-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
          style={{ 
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            fontSize: fluidSizing.text.sm,
          }}
        >
          Desktop
          {activeTab === 'desktop' && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-admin-primary"
              style={{ height: '2px' }}
            />
          )}
          {desktopImages.length > 0 && (
            <span 
              className="ml-2 bg-admin-primary/20 text-admin-primary rounded-full px-2 py-0.5"
              style={{ fontSize: fluidSizing.text.xs }}
            >
              {desktopImages.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mobile')}
          className={`font-medium uppercase tracking-wider transition-all duration-200 relative ${
            activeTab === 'mobile'
              ? 'text-admin-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
          style={{ 
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            fontSize: fluidSizing.text.sm,
          }}
        >
          Mobile
          {activeTab === 'mobile' && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-admin-primary"
              style={{ height: '2px' }}
            />
          )}
          {mobileImages.length > 0 && (
            <span 
              className="ml-2 bg-admin-primary/20 text-admin-primary rounded-full px-2 py-0.5"
              style={{ fontSize: fluidSizing.text.xs }}
            >
              {mobileImages.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'desktop' ? (
          <MultiImageUploader
            images={desktopImages}
            onChange={onDesktopChange}
            maxImages={5}
            variant="desktop"
          />
        ) : (
          <MultiImageUploader
            images={mobileImages}
            onChange={onMobileChange}
            maxImages={10}
            variant="mobile"
          />
        )}
      </div>
    </div>
  );
}
