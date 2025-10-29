'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import CyberCorner from '@/components/atoms/CyberCorner';
import DataStream from '@/components/atoms/DataStream';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import ScanLine from '@/components/atoms/ScanLine';
import StatusPanel from '@/components/molecules/StatusPanel';
import InfoCard from '@/components/molecules/InfoCard';

// Lazy load 3D component for better performance
const Face3D = dynamic(() => import('@/components/3d/Face3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-cyber-black border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-background-light overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <HexagonGrid />
      
      {/* Data streams */}
      <DataStream position="left" color="blue" />
      <DataStream position="right" color="purple" />
      
      {/* Scan lines */}
      <ScanLine direction="horizontal" color="blue" duration={4} />
      <ScanLine direction="vertical" color="red" duration={5} />

      {/* Corner decorations with margin */}
      <div className="absolute top-6 left-6 z-10">
        <CyberCorner position="top-left" size={60} color="black" />
      </div>
      <div className="absolute top-6 right-6 z-10">
        <CyberCorner position="top-right" size={60} color="black" />
      </div>
      <div className="absolute bottom-6 left-6 z-10">
        <CyberCorner position="bottom-left" size={60} color="black" />
      </div>
      <div className="absolute bottom-6 right-6 z-10">
        <CyberCorner position="bottom-right" size={60} color="black" />
      </div>
      
      {/* Status Panel */}
      <StatusPanel />
      
      {/* Floating Info Cards */}
      <InfoCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Status"
        value="ACTIVE"
        color="blue"
        position={{ top: '25%', left: '10%' }}
        delay={0.8}
      />
      
      <InfoCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
        title="Power"
        value="100%"
        color="red"
        position={{ top: '25%', right: '10%' }}
        delay={1}
      />
      
      <InfoCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
        title="Systems"
        value="ONLINE"
        color="purple"
        position={{ bottom: '25%', left: '10%' }}
        delay={1.2}
      />
      
      <InfoCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        title="Performance"
        value="98%"
        color="black"
        position={{ bottom: '25%', right: '10%' }}
        delay={1.4}
      />

      {/* Main content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Central circle with 3D face */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          {/* Outer ring - animated */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyber-black"
            style={{ width: '450px', height: '450px', left: '-50px', top: '-50px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle ring - animated opposite direction */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyber-blue-cyan opacity-50"
            style={{ width: '400px', height: '400px', left: '-25px', top: '-25px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner ring with dashes */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-purple opacity-30"
            style={{ width: '360px', height: '360px', left: '-5px', top: '-5px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner container for 3D face */}
          <div className="relative w-[350px] h-[350px] rounded-full bg-white border-4 border-cyber-black shadow-glow-black overflow-hidden">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-black border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Face3D />
            </Suspense>
          </div>

          {/* Decorative elements around circle - Top */}
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyber-red shadow-glow-red" />
              <div className="w-1 h-8 bg-gradient-to-b from-cyber-red to-transparent" />
            </div>
          </motion.div>

          {/* Bottom */}
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-8 bg-gradient-to-t from-cyber-red to-transparent" />
              <div className="w-3 h-3 rounded-full bg-cyber-red shadow-glow-red" />
            </div>
          </motion.div>

          {/* Left */}
          <motion.div
            className="absolute -left-6 top-1/2 transform -translate-y-1/2"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyber-blue-cyan shadow-glow-blue" />
              <div className="w-8 h-1 bg-gradient-to-r from-cyber-blue-cyan to-transparent" />
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="absolute -right-6 top-1/2 transform -translate-y-1/2"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center gap-1">
              <div className="w-8 h-1 bg-gradient-to-l from-cyber-blue-cyan to-transparent" />
              <div className="w-3 h-3 rounded-full bg-cyber-blue-cyan shadow-glow-blue" />
            </div>
          </motion.div>

          {/* Corner accents */}
          <motion.div
            className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-cyber-purple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-cyber-purple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-cyber-purple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-cyber-purple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
        </motion.div>
      </div>

      {/* Top text */}
      <motion.div
        className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-20 max-w-4xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1 
          className="font-orbitron text-4xl md:text-6xl font-black text-cyber-black tracking-wider relative"
          animate={{ 
            textShadow: [
              '0 0 10px rgba(0,0,0,0.3)',
              '0 0 20px rgba(0,0,0,0.5)',
              '0 0 10px rgba(0,0,0,0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SERGIO JÁUREGUI
          <motion.span
            className="absolute -top-2 -right-2 w-3 h-3 bg-cyber-red rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.h1>
        <div className="mt-3 h-1 w-full bg-gradient-to-r from-transparent via-cyber-black to-transparent" />
        <motion.div
          className="mt-2 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-2 h-2 bg-cyber-blue-cyan rounded-full animate-pulse" />
          <span className="font-mono text-xs text-text-muted tracking-widest">ID: SJ-2025-MAIN</span>
          <div className="w-2 h-2 bg-cyber-blue-cyan rounded-full animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Bottom text */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center z-20 max-w-4xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <p className="font-rajdhani text-xl md:text-2xl text-text-secondary tracking-wide font-bold">
          DESARROLLADOR FULL STACK
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <motion.div
            className="w-20 h-0.5 bg-cyber-blue-cyan"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          />
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, duration: 0.3 }}
          >
            <div className="w-4 h-4 rounded-full bg-cyber-red animate-pulse" />
            <motion.div
              className="absolute inset-0 w-4 h-4 rounded-full bg-cyber-red"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.div
            className="w-20 h-0.5 bg-cyber-blue-cyan"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          />
        </div>
        <motion.div
          className="mt-3 font-mono text-xs text-text-muted flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-cyber-blue-cyan rounded-full" />
            REACT
          </span>
          <span className="text-cyber-black">•</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full" />
            NODE.JS
          </span>
          <span className="text-cyber-black">•</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-cyber-red rounded-full" />
            TYPESCRIPT
          </span>
        </motion.div>
      </motion.div>

      {/* Floating particles effect - Enhanced */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#00BFFF' : i % 3 === 1 ? '#FF0000' : '#8B00FF',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none z-30" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)'
        }}
      />
    </div>
  );
}