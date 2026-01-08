// Hamburger menu initialization function (available globally)
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (!hamburgerBtn || !hamburgerMenu) {
        return;
    }
    
    // Check if already initialized
    if (hamburgerBtn.dataset.initialized === 'true') {
        return;
    }
    
    hamburgerBtn.dataset.initialized = 'true';
    
    // Simple toggle function
    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        hamburgerBtn.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    }
    
    // Use a single event handler that works for both touch and click
    let touchStartTime = 0;
    let touchStartY = 0;
    
    hamburgerBtn.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
        e.stopPropagation();
    }, { passive: true });
    
    hamburgerBtn.addEventListener('touchend', function(e) {
        const touchEndTime = Date.now();
        const touchEndY = e.changedTouches[0].clientY;
        const timeDiff = touchEndTime - touchStartTime;
        const yDiff = Math.abs(touchEndY - touchStartY);
        
        // Only trigger if it was a quick tap (not a swipe)
        if (timeDiff < 300 && yDiff < 10) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        }
    });
    
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(e);
    });
    
    // Close menu when clicking outside
    function closeMenuIfOutside(e) {
        if (hamburgerMenu.classList.contains('active')) {
            const target = e.target;
            if (!hamburgerBtn.contains(target) && !hamburgerMenu.contains(target)) {
                hamburgerBtn.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        }
    }
    
    document.addEventListener('click', closeMenuIfOutside);
    document.addEventListener('touchend', closeMenuIfOutside);
    
    // Close menu when clicking a menu item
    const menuItems = hamburgerMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            hamburgerBtn.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
        item.addEventListener('touchend', function(e) {
            hamburgerBtn.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });
}

// Initialize hamburger menu when DOM is ready
function setupHamburgerMenu() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHamburgerMenu);
    } else {
        initHamburgerMenu();
    }
}
setupHamburgerMenu();

// Smooth scroll behavior and fade effects
document.addEventListener('DOMContentLoaded', function() {
    // Logo link - navigate to homepage or scroll to top if already on homepage
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            const currentPage = window.location.pathname;
            const isHomePage = currentPage.endsWith('index.html') || currentPage.endsWith('/') || currentPage === '';
            
            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Otherwise, let the link navigate normally to index.html
        });
    }
    const marketingOverlay = document.querySelector('.marketing-overlay');
    const scrollContent = document.querySelector('.scroll-content');
    const scrollPrompt = document.querySelector('.scroll-prompt');
    const fixedHeader = document.querySelector('.fixed-header');
    
    // Scroll overlay up as user scrolls down (no fading)
    if (marketingOverlay) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Move overlay up as user scrolls (parallax effect)
            const translateY = -scrollTop;
            marketingOverlay.style.transform = `translateY(${translateY}px)`;
            marketingOverlay.style.opacity = 1; // Keep opacity at 1, no fading
        });
    }
    
    // Update header on scroll
    if (fixedHeader) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                fixedHeader.classList.add('scrolled');
            } else {
                fixedHeader.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scroll to content when clicking scroll prompt
    if (scrollPrompt && scrollContent) {
        scrollPrompt.addEventListener('click', function() {
            scrollContent.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Remove parallax effect to prevent glitching
    // The marketing overlay is now fixed and should not move
    
    // Animate content sections on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // Add hover effects to category items
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Toggle category headers
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const chevron = this.querySelector('.chevron');
            const nextItem = this.nextElementSibling;
            
            if (nextItem && nextItem.classList.contains('category-item')) {
                // Find all items in this category
                let items = [];
                let current = nextItem;
                while (current && current.classList.contains('category-item')) {
                    items.push(current);
                    current = current.nextElementSibling;
                }
                
                // Toggle visibility
                const isVisible = items[0].style.display !== 'none';
                items.forEach(item => {
                    item.style.display = isVisible ? 'none' : 'flex';
                    item.style.transition = 'opacity 0.3s ease';
                });
                
                chevron.textContent = isVisible ? '▶' : '▼';
            }
        });
    });
    
    // Initialize hamburger menu (works on all pages)
    initHamburgerMenu();
    
    // Carousel functionality (only on homepage)
    // Carousel functionality
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    let currentIndex = 0;
    let autoScrollInterval;
    const totalSlides = 5;
    
    // Function to move carousel to specific slide
    function goToSlide(index) {
        currentIndex = index;
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active button
        carouselButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Button click handlers
    carouselButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            goToSlide(index);
            // Reset auto-scroll timer
            clearInterval(autoScrollInterval);
            startAutoScroll();
        });
    });
    
    // Auto-scroll function
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        }, 4000); // Change slide every 4 seconds
    }
    
    // Start auto-scroll when page loads
    if (carouselTrack) {
        startAutoScroll();
        
        // Pause auto-scroll on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoScrollInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoScroll();
            });
        }
    }
    
    // Vertical carousel for "What We Do" section
    const whatWeDoCarousel = document.getElementById('whatWeDoCarousel');
    const whatWeDoTrack = document.getElementById('whatWeDoTrack');
    const arrowUp = document.getElementById('carouselArrowUp');
    const arrowDown = document.getElementById('carouselArrowDown');
    
    if (whatWeDoCarousel && whatWeDoTrack && arrowUp && arrowDown) {
        let currentSlide = 0;
        const slides = whatWeDoTrack.querySelectorAll('.carousel-slide-vertical');
        const totalSlides = slides.length;
        
        // Function to move to specific slide
        function goToSlideVertical(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            
            currentSlide = index;
            whatWeDoTrack.style.transform = `translateY(-${currentSlide * 500}px)`;
            
            // Update arrow states
            arrowUp.disabled = currentSlide === 0;
            arrowDown.disabled = currentSlide === totalSlides - 1;
        }
        
        // Arrow button handlers
        arrowUp.addEventListener('click', () => {
            if (currentSlide > 0) {
                goToSlideVertical(currentSlide - 1);
            }
        });
        
        arrowDown.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                goToSlideVertical(currentSlide + 1);
            }
        });
        
        // Initialize arrow states
        arrowUp.disabled = currentSlide === 0;
        arrowDown.disabled = currentSlide === totalSlides - 1;
    }
    
    // Fade-in animation for sections on scroll (services page)
    // Only target sections with the fade-section class
    const articleSections = document.querySelectorAll('.article-section.fade-section');
    const ctaSection = document.querySelector('.cta-section');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    articleSections.forEach(section => {
        fadeInObserver.observe(section);
    });
    
    if (ctaSection) {
        fadeInObserver.observe(ctaSection);
    }
});

