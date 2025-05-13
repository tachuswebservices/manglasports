
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({ 
  children, 
  className = "",
  delay = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div className={`overflow-hidden ${className}`} ref={ref}>
      <motion.div
        variants={{
          hidden: { y: 75, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
              duration: 0.7, 
              ease: [0.33, 1, 0.68, 1],
              delay 
            }
          }
        }}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface WordByWordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  staggerDelay?: number;
}

export const WordByWordReveal: React.FC<WordByWordRevealProps> = ({ 
  text,
  className = "",
  wordClassName = "",
  staggerDelay = 0.05
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: 0.1 * i }
    })
  };
  
  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`mr-1.5 inline-block ${wordClassName}`}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
