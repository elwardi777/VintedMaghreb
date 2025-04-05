
/**
 * Animation utility for revealing elements on scroll
 */

export const setupScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal-section');
  
  const reveal = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('revealed');
      } else {
        element.classList.remove('revealed');
      }
    });
  };
  
  // Initial check
  reveal();
  
  // Add event listener
  window.addEventListener('scroll', reveal);
  
  // Clean up function
  return () => {
    window.removeEventListener('scroll', reveal);
  };
};

/**
 * Animation utility for staggered list items
 */
export const setupStaggeredItems = () => {
  const staggerItems = document.querySelectorAll('.stagger-item');
  
  const animateStaggeredItems = () => {
    staggerItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('appear');
      }, 100 * index);
    });
  };
  
  // Add intersection observer
  const observer = new IntersectionObserver((entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      animateStaggeredItems();
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  // If there are stagger items, observe the first one
  if (staggerItems.length > 0) {
    observer.observe(staggerItems[0]);
  }
  
  // Clean up function
  return () => {
    observer.disconnect();
  };
};

/**
 * Animation utility to initialize all animations
 */
export const initAnimations = () => {
  const cleanupScrollReveal = setupScrollReveal();
  const cleanupStaggeredItems = setupStaggeredItems();
  
  // Return cleanup function
  return () => {
    cleanupScrollReveal();
    cleanupStaggeredItems();
  };
};
