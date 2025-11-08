'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/lib/hooks/useSkills';
import { useLogger } from '@/lib/hooks/useLogger';

export default function AboutSection() {
  const { skills, loading } = useSkills();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const log = useLogger('AboutSection');

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categories = ['all', ...Object.keys(skillsByCategory)];
  const displayedSkills = selectedCategory === 'all' 
    ? skills 
    : skillsByCategory[selectedCategory] || [];

  const stats = {
    totalSkills: skills.length,
    avgProficiency: Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length) || 0,
    totalExperience: skills.length > 0 ? Math.max(...skills.map(s => s.yearsOfExperience)) : 0,
    categories: Object.keys(skillsByCategory).length,
  };

  return (
    <section id="about" className="relative min-h-screen py-20 px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-40 right-20 w-96 h-96 bg-cyber-purple rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-40 left-20 w-96 h-96 bg-cyber-blue-cyan rounded-full blur-[150px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-orbitron text-7xl font-black mb-4 relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-blue-cyan to-cyber-red animate-gradient">
                ABOUT
              </span>
            </h2>

            <p className="text-text-secondary text-lg font-rajdhani max-w-3xl leading-relaxed mb-8">
              Full-stack developer with a passion for creating{' '}
              <span className="text-cyber-purple font-semibold">immersive digital experiences</span>.
              Specializing in{' '}
              <span className="text-cyber-blue-cyan font-semibold">modern web technologies</span>{' '}
              and cyberpunk aesthetics.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Skills', value: stats.totalSkills, icon: '⚡', color: 'cyber-blue-cyan' },
              { label: 'Avg Proficiency', value: `${stats.avgProficiency}%`, icon: '📊', color: 'cyber-purple' },
              { label: 'Years Experience', value: `${stats.totalExperience}+`, icon: '🎯', color: 'cyber-red' },
              { label: 'Categories', value: stats.categories, icon: '🔧', color: 'cyber-blue-cyan' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="bg-background-surface/50 backdrop-blur-sm border border-cyber-blue-cyan/20 rounded-lg p-4 hover:border-cyber-blue-cyan/50 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`font-orbitron text-2xl font-bold text-${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-xs text-text-muted font-rajdhani uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bio section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="bg-background-surface/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-8 hover:border-cyber-purple/50 transition-all duration-300">
                <h3 className="font-orbitron text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-blue-cyan">
                  BACKGROUND
                </h3>
                <div className="space-y-4 text-text-secondary font-rajdhani text-base leading-relaxed">
                  <p>
                    I'm a <span className="text-cyber-blue-cyan font-semibold">creative developer</span> who bridges the gap between design and functionality,
                    crafting digital experiences that are both visually stunning and technically robust.
                  </p>
                  <p>
                    With expertise spanning <span className="text-cyber-purple font-semibold">frontend frameworks</span> like React and Next.js to backend
                    technologies like Node.js and Express, I build full-stack applications that scale.
                  </p>
                  <p>
                    My approach combines <span className="text-text-primary font-semibold">clean code</span>, performance optimization, and a keen eye for
                    futuristic design patterns inspired by cyberpunk aesthetics.
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-purple" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-blue-cyan" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Location', value: 'Remote / Global', icon: '🌍' },
                { label: 'Focus', value: 'Full-Stack Development', icon: '💻' },
                { label: 'Specialty', value: 'Modern Web Apps', icon: '⚡' },
                { label: 'Passion', value: 'Cyberpunk Aesthetics', icon: '🎨' },
              ].map((fact, index) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-background-surface/30 backdrop-blur-sm border border-cyber-blue-cyan/20 rounded-lg p-4 hover:border-cyber-blue-cyan/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">
                      {fact.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                        {fact.label}
                      </div>
                      <div className="text-text-primary font-rajdhani font-semibold">
                        {fact.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-orbitron text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue-cyan to-cyber-purple">
              SKILLS & EXPERTISE
            </h3>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    log.interaction('filter_skill_category', category);
                  }}
                  className={`relative px-5 py-2 rounded-lg font-rajdhani font-semibold transition-all duration-300 overflow-hidden group ${
                    isActive
                      ? 'bg-cyber-purple text-background-dark'
                      : 'bg-background-surface/50 text-text-secondary hover:text-text-primary border border-cyber-purple/20 hover:border-cyber-purple/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 + index * 0.05 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAboutSkillCategory"
                      className="absolute inset-0 bg-cyber-purple"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 uppercase text-sm">
                    {category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-text-muted font-mono text-sm">Loading skills...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.9 + index * 0.05, duration: 0.4 }}
                  className="group"
                >
                  <div className="relative h-full bg-background-surface/50 backdrop-blur-sm border border-cyber-blue-cyan/20 rounded-lg p-6 hover:border-cyber-blue-cyan/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-orbitron text-lg font-bold text-cyber-blue-cyan mb-1">
                          {skill.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <span className="font-mono">{skill.yearsOfExperience}y exp</span>
                          <span>•</span>
                          <span className="uppercase font-mono">{skill.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-orbitron text-2xl font-bold text-cyber-purple">
                          {skill.proficiency}%
                        </div>
                      </div>
                    </div>

                    <div className="relative h-2 bg-background-elevated rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 2 + index * 0.05, duration: 1, ease: 'easeOut' }}
                        className="absolute h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color || '#00BFFF'}, ${skill.color || '#00BFFF'}dd)`,
                          boxShadow: `0 0 10px ${skill.color || '#00BFFF'}`,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < Math.ceil(skill.proficiency / 20)
                              ? 'bg-cyber-blue-cyan'
                              : 'bg-background-elevated'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-purple opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
