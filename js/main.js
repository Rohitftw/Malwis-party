// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initTestimonialCarousel();
    initFAQAccordion();
});

/**
 * 1. Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * 2. Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('open');
            });
        });
    }
}

/**
 * 3. Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-up');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * 4. Smooth Scroll for Anchors
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 5. Testimonial Carousel
 * Handles sliding track, updating dots, and auto-rotation.
 */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next-btn');
    const prevButton = document.querySelector('.carousel-btn.prev-btn');
    const dotsNav = document.getElementById('carousel-dots');
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active states for slides and dots
        slides.forEach(slide => slide.classList.remove('current-slide'));
        slides[index].classList.add('current-slide');
        
        dots.forEach(dot => dot.classList.remove('current-dot'));
        dots[index].classList.add('current-dot');

        currentIndex = index;
    };

    // Event Listeners for controls
    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(prevIndex);
        resetAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
            resetAutoPlay();
        });
    });

    // Auto-play functionality
    let autoPlayInterval;
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000); // Change every 5 seconds
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    startAutoPlay();
}

/**
 * 6. FAQ Accordion
 * Handles expanding and collapsing FAQ items smoothly.
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQs first
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't active before, open it now
            if (!isActive) {
                item.classList.add('active');
                // Set max-height to the scrollHeight to animate to exact needed height
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}