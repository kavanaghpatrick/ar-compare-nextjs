// Logger utility that conditionally outputs based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isServer = typeof window === 'undefined';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always log errors, but in production, you might want to send to an error tracking service
    if (isDevelopment) {
      console.error(...args);
    } else if (isServer) {
      // In production on server, you might want to log to a file or service
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // Special method for performance tracking
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

// Export a default logger instance
export default logger;