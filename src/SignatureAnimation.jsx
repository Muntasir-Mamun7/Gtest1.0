import { motion } from 'framer-motion';
import './SignatureAnimation.css';

const SignatureAnimation = () => {
  const name = "Muntasir Al Mamun";
  const title = "";
  
  // Animation variants for the container - blocky motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Animation variants for each letter - pixel-style bounce
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 100,
        bounce: 0.6
      }
    }
  };

  // Animation for underline - builds like placing blocks
  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "linear",
        delay: 1.5
      }
    }
  };

  // Animation for subtitle
  const subtitleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 2,
        ease: "easeOut"
      }
    }
  };

  // Animation for the pixel clouds
  const cloudVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 20, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="signature-container">
      {/* Animated pixel clouds */}
      <motion.div 
        className="glow-orb glow-orb-1"
        variants={cloudVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="glow-orb glow-orb-2"
        variants={cloudVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 2, duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="signature-content">
        {/* Animated name with blocky letters */}
        <motion.div
          className="name-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {name.split('').map((char, index) => (
            <motion.span
              key={index}
              className="letter"
              variants={letterVariants}
              whileHover={{
                scale: 1.15,
                rotate: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated underline - grass blocks */}
        <motion.div
          className="underline"
          variants={underlineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Animated subtitle */}
        {title && (
          <motion.div
            className="subtitle"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            {title}
          </motion.div>
        )}

        {/* Decorative stone lines */}
        <motion.div
          className="decorative-line left-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 2.5, ease: "linear" }}
        />
        <motion.div
          className="decorative-line right-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 2.5, ease: "linear" }}
        />

        {/* Floating golden nuggets (particles) */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + (i % 3) * 25}%`
            }}
            animate={window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {} : {
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignatureAnimation;
