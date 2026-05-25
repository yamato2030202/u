import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<"shake" | "shrink" | "done">("shake");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shrink"), 2000);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-[14vw] font-heading font-black leading-none text-primary select-none"
            animate={
              phase === "shake"
                ? {
                    x: [0, -3, 4, -2, 3, -1, 0],
                    y: [0, 2, -3, 1, -2, 3, 0],
                  }
                : { scale: 0.15, y: -300, opacity: 0 }
            }
            transition={
              phase === "shake"
                ? { duration: 0.15, repeat: Infinity, ease: "linear" }
                : { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }
          >
            URBAN LEGENDS
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
