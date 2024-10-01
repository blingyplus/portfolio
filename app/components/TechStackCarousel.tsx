// app/components/TechStackCarousel.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const techStacks = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg" },
  { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
];

const TechStackCarousel: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  useEffect(() => {
    controls.start({
      x: [0, -1920],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        },
      },
    });
  }, [controls]);

  const handleDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (Math.abs(info.velocity.x) > 100) {
      controls.start({
        x: info.velocity.x < 0 ? "-100%" : "100%",
        transition: { type: "spring", damping: 30, stiffness: 200 },
      });
    } else {
      // Resume automatic movement
      controls.start({
        x: [0, -1920],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        },
      });
    }
  };

  const handlePrevious = () => {
    controls.stop();
    controls.start({ x: "+=240", transition: { duration: 0.5 } });
  };

  const handleNext = () => {
    controls.stop();
    controls.start({ x: "-=240", transition: { duration: 0.5 } });
  };

  return (
    <div className="relative overflow-hidden py-4 w-full" ref={constraintsRef}>
      <motion.div className="flex space-x-16" drag="x" dragConstraints={constraintsRef} onDragStart={handleDragStart} onDragEnd={handleDragEnd} animate={controls}>
        {[...techStacks, ...techStacks].map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={tech.icon} alt={tech.name} className="w-16 h-16 dark:invert" />
            <span className="mt-2 text-sm">{tech.name}</span>
          </div>
        ))}
      </motion.div>
      <button onClick={handlePrevious} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-background/80 p-2 rounded-full">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-background/80 p-2 rounded-full">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TechStackCarousel;
