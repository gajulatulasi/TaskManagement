export const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
};

export const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -2,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.1 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

export const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, type: "spring", bounce: 0.25 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 }
  }
};

export const notificationVariants = {
  hidden: { opacity: 0, x: 50, y: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { duration: 0.3, type: "spring", bounce: 0.3 }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.2 }
  }
};

export const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.2, ease: "easeIn" }
  }
};
