
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedHeadingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'section-title';
}

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  type = 'h2'
}) => {
  const variants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }
    }
  };
  
  let combinedClassName = className;
  
  if (type === 'section-title') {
    combinedClassName = `section-title ${className}`;
  }
  
  return (
    <motion.div
      className={combinedClassName}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className = "", 
  delay = 0.2 
}) => {
  const variants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }
    }
  };
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedDivider: React.FC<{className?: string, delay?: number}> = ({ 
  className = "w-20 h-1 bg-mangla-gold mx-auto mb-8", 
  delay = 0.2 
}) => {
  const variants = {
    hidden: { 
      width: 0, 
      opacity: 0 
    },
    visible: { 
      width: 80, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay,
        ease: "easeOut" 
      }
    }
  };
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    />
  );
};
