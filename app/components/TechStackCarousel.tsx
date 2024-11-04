"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const techStacks = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg" },
  { name: "Laravel", icon: "https://upload.wikimedia.org/wikipedia/commons/archive/9/9a/20190820171149%21Laravel.svg" },
  { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Vercel", icon: "https://cdn.worldvectorlogo.com/logos/vercel.svg" },
  { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
];

const TechStackCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const itemWidth = 120; // Adjusted item width for better responsiveness

  const startAutoScroll = () => {
    controls.start({
      x: [0, -itemWidth * techStacks.length],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: techStacks.length * 3, ease: "linear" },
      },
    });
  };

  useEffect(() => {
    startAutoScroll();
  }, []);

  const handleDragStart = () => {
    controls.stop();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(startAutoScroll, 1500); // Resume auto-scroll after a delay
  };

  const scrollLeft = () => {
    controls.start({
      x: "+=300",
      transition: {
        duration: 0.5,
      },
    });
  };

  const scrollRight = () => {
    controls.start({
      x: "-=300",
      transition: {
        duration: 0.5,
      },
    });
  };

  return (
    <div className="relative overflow-hidden py-4 w-full" ref={containerRef}>
      {/* Left Arrow */}
      <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
        <ChevronLeft size={24} />
      </button>

      <motion.div
        className="flex space-x-12 md:space-x-16 px-4"
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Infinite loop by duplicating techStacks array */}
        {[...techStacks, ...techStacks].map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={tech.icon} alt={tech.name} className="w-16 h-16 md:w-20 md:h-20 dark:invert" />
            <span className="mt-2 text-sm">{tech.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Right Arrow */}
      <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default TechStackCarousel;
