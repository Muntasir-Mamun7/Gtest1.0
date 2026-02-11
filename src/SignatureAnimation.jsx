import { motion } from 'framer-motion';
import './SignatureAnimation.css';

const SignatureAnimation = () => {
  const name = "Muntasir Al Mamun";
  const title = "Computer Science Student";
  
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  // Animation variants for each letter
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  // Animation for underline
  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        delay: 1.5
      }
    }
  };

  // Animation for subtitle
  const subtitleVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 2,
        ease: "easeOut"
      }
    }
  };

  // Animation for the glow effect
  const glowVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.8, 1.2, 1],
      opacity: [0, 0.5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  return (
    <div className="signature-container">
      {/* Animated background glow */}
      <motion.div 
        className="glow-orb glow-orb-1"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="glow-orb glow-orb-2"
        variants={glowVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
      />
      
      <div className="signature-content">
        {/* Animated name */}
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
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated underline */}
        <motion.div
          className="underline"
          variants={underlineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Animated subtitle */}
        <motion.div
          className="subtitle"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          {title}
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="decorative-line left-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 2.5, ease: "easeInOut" }}
        />
        <motion.div
          className="decorative-line right-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 2.5, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignatureAnimation;
