import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4"
    >
      <div className="flex flex-col items-center gap-5 sm:gap-6">

        {/* 🔥 Logo Section */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>

          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border border-indigo-400/40 border-t-indigo-400 rounded-full"
          />

          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 sm:w-20 sm:h-20 relative z-10"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        {/* 🔥 Text */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-sm sm:text-lg font-medium tracking-wide text-center"
        >
          Authenticating your workspace
        </motion.p>

        {/* 🔥 Dots */}
        <div className="flex gap-2">
          <motion.span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
          <motion.span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
          />
          <motion.span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default Loader;