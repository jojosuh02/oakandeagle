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
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Move overlay up as user scrolls (parallax effect)
        const translateY = -scrollTop;
        marketingOverlay.style.transform = `translateY(${translateY}px)`;
        marketingOverlay.style.opacity = 1; // Keep opacity at 1, no fading
        
        // Update header on scroll
        if (scrollTop > 100) {
            fixedHeader.classList.add('scrolled');
        } else {
            fixedHeader.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll to content when clicking scroll prompt
    scrollPrompt.addEventListener('click', function() {
        scrollContent.scrollIntoView({ behavior: 'smooth' });
    });
    
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
    
    // Hamburger menu toggle - moved outside DOMContentLoaded check
    function initHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (!hamburgerBtn || !hamburgerMenu) {
            console.log('Hamburger menu elements not found');
            return;
        }
        
        console.log('Hamburger menu initialized');
        
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger button clicked');
            hamburgerBtn.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            console.log('Menu active:', hamburgerMenu.classList.contains('active'));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (hamburgerBtn && hamburgerMenu && 
                !hamburgerBtn.contains(e.target) && 
                !hamburgerMenu.contains(e.target) &&
                hamburgerMenu.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking a menu item
        const menuItems = hamburgerMenu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (hamburgerBtn && hamburgerMenu) {
                    hamburgerBtn.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                }
            });
        });
    }
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
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
});

