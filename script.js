// Modern JavaScript for CI&T Style Website
class ModernWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initScrollEffects();
        this.initTechCards();
        this.initAnimations();
        this.initParallax();
        this.initContactForm();
        this.initPerformance();
    }

    // Navigation functionality
    initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const header = document.querySelector('.header');

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            });
        });

        // Header scroll effects
        this.handleHeaderScroll();
    }

    handleHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.classList.add('scrolled');
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }

            // Hide/show header on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Tech cards interaction
    initTechCards() {
        const techCards = document.querySelectorAll('.tech-card');
        let activeIndex = 0;

        // Auto-rotate tech cards
        const rotateCards = () => {
            techCards.forEach((card, index) => {
                card.classList.toggle('active', index === activeIndex);
            });
            activeIndex = (activeIndex + 1) % techCards.length;
        };

        if (techCards.length > 0) {
            // Initial active card
            techCards[0].classList.add('active');
            
            // Auto-rotate every 3 seconds
            setInterval(rotateCards, 3000);

            // Manual interaction
            techCards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    techCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    activeIndex = index;
                });
            });
        }
    }

    // Scroll-based animations
    initScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                    
                    // Special handling for solution cards
                    if (entry.target.classList.contains('solution-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.solution-card, .metric, .section-header');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            animateOnScroll.observe(el);
        });

        // Progress bar on scroll
        this.initScrollProgress();
    }

    initScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #FF6B35, #4A90E2, #00C896);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // Parallax effects
    initParallax() {
        const floatingElements = document.querySelectorAll('.float-element');
        
        const handleParallax = () => {
            const scrollY = window.scrollY;
            
            floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        };

        let ticking = false;
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Modern animations
    initAnimations() {
        // Stagger animation for solution cards
        const solutionCards = document.querySelectorAll('.solution-card');
        solutionCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Hover effects for interactive elements
        this.initHoverEffects();
    }

    initHoverEffects() {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn-primary-large, .btn-secondary-outline, .btn-contact');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Solution card hover effects
        const solutionCards = document.querySelectorAll('.solution-card');
        solutionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px)';
                card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    // Contact form functionality
    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type=\"submit\"]');
            const originalText = submitBtn.textContent;
            
            // Validation
            const name = contactForm.querySelector('input[type=\"text\"]')?.value;
            const email = contactForm.querySelector('input[type=\"email\"]')?.value;
            const message = contactForm.querySelector('textarea')?.value;
            
            if (!this.validateForm(name, email, message)) return;
            
            // Simulate form submission with modern loading state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="animate-spin">
                    <path d="M10 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M10 14V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12.24 12.24L15.07 15.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.67 6L8.33 14.33L3.33 9.33" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Message Sent!
            `;
            
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
            
            // Show success notification
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        });
    }

    validateForm(name, email, message) {
        if (!name || !email || !message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00C896' : type === 'error' ? '#FF6B35' : '#4A90E2'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Performance optimizations
    initPerformance() {
        // Lazy load images when implemented
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
        
        // Optimize scroll listeners
        this.optimizeScrollListeners();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    preloadResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    optimizeScrollListeners() {
        // Use passive listeners for better performance
        let scrollTimer = null;
        const scrollStart = () => {
            document.body.classList.add('scrolling');
        };
        
        const scrollEnd = () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        };
        
        window.addEventListener('scroll', scrollStart, { passive: true });
        window.addEventListener('scroll', scrollEnd, { passive: true });
    }
}

// CSS animations for loading states
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 80px;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            width: 100%;
            text-align: center;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            padding: 2rem 0;
            border-bottom: 1px solid var(--neutral-200);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-item {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(6px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-6px) rotate(-45deg);
        }
        
        .menu-open {
            overflow: hidden;
        }
    }
    
    /* Scrolling optimizations */
    .scrolling * {
        pointer-events: none !important;
    }
`;
document.head.appendChild(style);

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernWebsite();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});