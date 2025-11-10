// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initTestimonialCarousel();
    initFAQAccordion();
});
/**
 * 0. Intro Overlay
 * Handles the initial landing screen and scroll-to-enter.
 */
function initIntro() {
    const intro = document.getElementById('intro-overlay');
    if (!intro) return;

    // 1. Check if user has already seen the intro this session
    if (sessionStorage.getItem('malwis_intro_seen')) {
        // If yes, hide it immediately without animation
        intro.style.display = 'none';
        document.body.style.overflow = ''; // Ensure scroll is unlocked
        return;
    }

    // 2. If not seen, lock scroll and prepare to show it
    document.body.style.overflow = 'hidden';

    const enterSite = () => {
        if (intro.classList.contains('hidden')) return;
        
        // Mark as seen in session storage
        sessionStorage.setItem('malwis_intro_seen', 'true');
        
        intro.classList.add('hidden');
        document.body.style.overflow = ''; // Unlock scroll
        
        // Optional: removed the hero animation trigger here as it sometimes causes conflicts
        // if the user scrolls too fast. The IntersectionObserver handles it better.
    };

    // Event listeners
    window.addEventListener('wheel', enterSite, { once: true });
    window.addEventListener('touchmove', enterSite, { once: true });
    intro.addEventListener('click', enterSite);
    
    // Fallback auto-enter
    setTimeout(enterSite, 6000);
}


/**
 * 1. Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
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
/**
 * 5. Testimonial Carousel (Robust Version)
 */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const dotsNav = document.getElementById('carousel-dots');
    if (!track || !dotsNav) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next-btn');
    const prevButton = document.querySelector('.carousel-btn.prev-btn');
    
    // 1. Auto-generate dots
    // Clear existing dots first to prevent duplicates if re-initialized
    dotsNav.innerHTML = ''; 
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('current-slide');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dotsNav.appendChild(dot);
    });
    
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    // 2. Main update function (Simplified: No track movement, just class toggling)
    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) targetIndex = slides.length - 1;
        if (targetIndex >= slides.length) targetIndex = 0;

        // Just toggle classes. CSS handles the rest (opacity/visibility).
        slides.forEach(slide => slide.classList.remove('current-slide'));
        slides[targetIndex].classList.add('current-slide');
        
        dots.forEach(dot => dot.classList.remove('current-slide'));
        dots[targetIndex].classList.add('current-slide');
        
        currentIndex = targetIndex;
    };

    // 3. Event Listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            moveToSlide(currentIndex + 1);
            resetTimer();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            moveToSlide(currentIndex - 1);
            resetTimer();
        });
    }

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        moveToSlide(targetIndex);
        resetTimer();
    });

    // 4. Auto-play
    let timer;
    const startTimer = () => {
        timer = setInterval(() => moveToSlide(currentIndex + 1), 6000); // 6 seconds for better reading time
    }
    const resetTimer = () => {
        clearInterval(timer);
        startTimer();
    }

    startTimer();
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
/* ===============================================
 ABOUT PAGE - TEAM MODAL LOGIC
===============================================
*/

/**
 * 7. Team Modals (About Page)
 * Handles opening/closing team modals and trapping focus for accessibility.
 * Note: This runs on DOMContentLoaded, so it's safe to append.
 * The global functions (FAQ, Scroll, Nav) will run from their
 * existing definitions.
 */
document.addEventListener('DOMContentLoaded', () => {
    initTeamModals();
});

function initTeamModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    let lastFocusedElement;

    // Don't run this script if no modals are on the current page
    if (modalTriggers.length === 0) return;

    // --- Focus Trap ---
    function trapFocus(e, firstFocusableEl, lastFocusableEl) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    }

    // --- Open Modal ---
    function openModal(modal) {
        if (modal == null) return;
        
        lastFocusedElement = document.activeElement; // Save current focus
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Find focusable elements
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        // Focus the first element (e.g., the close button)
        firstFocusableEl.focus();

        // Add focus trap
        modal.addEventListener('keydown', (e) => trapFocus(e, firstFocusableEl, lastFocusableEl));
    }

    // --- Close Modal ---
    function closeModal(modal) {
        if (modal == null) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Remove the focus trap listener (important!)
        // We can't remove the *exact* listener without storing it, so we'll just re-find
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];
        modal.removeEventListener('keydown', (e) => trapFocus(e, firstFocusableEl, lastFocusableEl));

        // Restore focus to the element that opened the modal
        if(lastFocusedElement) lastFocusedElement.focus();
    }

    // --- Event Listeners ---
    
    // Open modal on trigger click
    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    // Close modal on overlay click
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            // Only close if the click is on the overlay itself, not the content
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Close modal on close button click
    modalCloses.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close modal on 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}
/* ===============================================
 SERVICES PAGE SCRIPTS
===============================================
*/

// Note: The existing scroll animation and navbar scripts will automatically
// work on this page as long as the classes (animate-fade-up, navbar, etc.) remain consistent.

/**
 * Service Modals
 * Re-initializes or ensures modal logic is active for service cards.
 * Checks if initTeamModals exists (from About page), if not, defines a generic one.
 */
if (typeof initModals !== 'function') {
    // Generic modal initiator if not already defined elsewhere
    function initModals() {
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        const modalCloses = document.querySelectorAll('.modal-close');
        const modalOverlays = document.querySelectorAll('.modal-overlay');

        if (modalTriggers.length === 0) return;

        function openModal(modal) {
            if (!modal) return;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modal = document.querySelector(trigger.dataset.modalTarget);
                openModal(modal);
            });
        });

        modalCloses.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(button.closest('.modal-overlay'));
            });
        });

        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(overlay);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                closeModal(activeModal);
            }
        });
    }
    // Run it
    document.addEventListener('DOMContentLoaded', initModals);
} else {
    // If it exists from About page, just run it again to be sure it catches new elements if needed
    // (Usually DOMContentLoaded handles this once globally, but safe to re-run if script loading varies)
     document.addEventListener('DOMContentLoaded', initModals);
}
// SERVICES PAGE — MODAL ACCESSIBILITY & CONTROLLER
window.MalwisModals = (function() {
    let activeModal = null;
    let lastFocusedElement = null;

    function init() {
        // Bind triggers and standard close actions
        document.querySelectorAll('[data-modal-target]').forEach(btn => {
            btn.addEventListener('click', (e) => open(e.currentTarget.getAttribute('data-modal-target'), e.currentTarget));
        });
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || e.target.closest('.modal-close')) closeActive();
            });
        });
        // Global Keydown for Escape and Tab (trap)
        document.addEventListener('keydown', (e) => {
            if (!activeModal) return;
            if (e.key === 'Escape') closeActive();
            if (e.key === 'Tab') trapFocus(e);
        });
    }

    function open(modalId, trigger) {
        const modal = document.querySelector(modalId);
        if (!modal) return;

        // Save state & lock body
        lastFocusedElement = document.activeElement;
        activeModal = modal;
        document.body.style.overflow = 'hidden';

        // Update ARIA & Classes
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        modal.classList.add('active');

        // Set initial focus (prefer modal container or first focusable)
        modal.focus();
        const focusable = getFocusable(modal);
        if (focusable.length) focusable[0].focus();
    }

    function closeActive() {
        if (!activeModal) return;

        // Reset state & unlock body
        activeModal.setAttribute('aria-hidden', 'true');
        activeModal.classList.remove('active');
        document.body.style.overflow = '';

        // Update trigger ARIA if it exists
        const trigger = document.querySelector(`[data-modal-target="#${activeModal.id}"]`);
        if (trigger) trigger.setAttribute('aria-expanded', 'false');

        // Restore focus
        if (lastFocusedElement) lastFocusedElement.focus();
        activeModal = null;
    }

    function trapFocus(e) {
        const focusable = getFocusable(activeModal);
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            last.focus(); e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus(); e.preventDefault();
        }
    }

    function getFocusable(el) {
        return Array.from(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    }

    // Auto-init if DOM is ready, otherwise wait
    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

    return { init, open, closeActive };
})();
// main.js — APPEND ONLY
// GALLERY — APPEND

// Debug hook: window.GalleryLightbox.open(0)

(function() {
    // --- Helper: Focus Trap ---
    const trapFocus = (e, el) => {
        const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    };

    // --- Gallery Filters ---
    const initGalleryFilters = () => {
        const pills = document.querySelectorAll('.filter-pill');
        const items = document.querySelectorAll('.gallery-item');
        const emptyMsg = document.getElementById('gallery-empty-msg');
        if (!pills.length || !items.length) return;

        pills.forEach(pill => pill.addEventListener('click', () => {
            // Update active state
            pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
            pill.classList.add('active'); pill.setAttribute('aria-selected', 'true');

            // Filter items
            const filter = pill.dataset.filter;
            let visibleCount = 0;
            items.forEach(item => {
                const isMatch = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('hidden', !isMatch);
                item.setAttribute('aria-hidden', !isMatch);
                if (isMatch) visibleCount++;
            });

            // Show/hide empty state
            if (emptyMsg) {
                emptyMsg.classList.toggle('hidden', visibleCount > 0);
                emptyMsg.setAttribute('aria-hidden', visibleCount > 0);
            }

            // Update Lightbox list
            if (window.GalleryLightbox) window.GalleryLightbox.updateItems();
        }));
    };

    // --- Gallery Lightbox ---
    window.GalleryLightbox = (function() {
        const lb = document.getElementById('lightbox');
        if (!lb) return;
        const img = document.getElementById('lightbox-img');
        const cap = document.getElementById('lightbox-caption');
        const counter = document.getElementById('lightbox-counter');
        let items = [], currentIndex = 0, lastFocus = null;

        const updateItems = () => {
            // Only include currently visible items in lightbox navigation
            items = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) .gallery-thumb'));
        };

        const open = (index) => {
            updateItems(); // ensure list is current
            // Find the true index in the *visible* list based on the data-index of clicked item
            const clickedIndexStr = index.toString();
            currentIndex = items.findIndex(item => item.dataset.index === clickedIndexStr);
            if (currentIndex === -1) currentIndex = 0; // fallback

            lastFocus = document.activeElement;
            updateView();
            lb.classList.add('active');
            lb.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lb.focus(); // focus the container or first button
        };

        const close = () => {
            lb.classList.remove('active');
            lb.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocus) lastFocus.focus();
        };

        const updateView = () => {
            if (!items.length) return;
            const currentItem = items[currentIndex];
            const src = currentItem.querySelector('img').getAttribute('src'); // or data-full-src if you have it
            const alt = currentItem.querySelector('img').getAttribute('alt');
            const captionText = currentItem.querySelector('.gallery-caption').textContent;

            img.src = src; img.alt = alt;
            cap.textContent = captionText;
            if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
        };

        const next = () => { currentIndex = (currentIndex + 1) % items.length; updateView(); };
        const prev = () => { currentIndex = (currentIndex - 1 + items.length) % items.length; updateView(); };

        // Binds
        const init = () => {
            updateItems();
            // Bind triggers
            document.querySelectorAll('.gallery-thumb').forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    open(e.currentTarget.dataset.index);
                });
            });
            // Bind controls
            lb.querySelector('.lightbox-close').addEventListener('click', close);
            lb.querySelector('.next').addEventListener('click', next);
            lb.querySelector('.prev').addEventListener('click', prev);
            // Bind keyboard/overlay
            lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lightbox-container')) close(); });
            document.addEventListener('keydown', e => {
                if (!lb.classList.contains('active')) return;
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'Tab') trapFocus(e, lb);
            });
        };

        return { init, open, close, next, prev, updateItems };
    })();

    // Auto-init on load
    document.addEventListener('DOMContentLoaded', () => {
        initGalleryFilters();
        if (window.GalleryLightbox) window.GalleryLightbox.init();
    });
})();
// BOOKING — APPEND

(function() {
    // --- CONFIG & STATE ---
    const STORAGE_KEY = 'malwis_bookings_v1';
    const TOTAL_DAYS = 30;
    const SLOTS = { 'A': '6:00 PM – 8:00 PM', 'B': '8:30 PM – 10:30 PM' };
    let state = { bookings: [], selectedDate: null, selectedSlot: null };

    // --- DOM ELEMENTS ---
    const calendarGrid = document.getElementById('calendar-grid');
    const bookingModal = document.getElementById('booking-modal');
    const modalTitle = document.getElementById('modal-date-title');
    const slotBtns = document.querySelectorAll('.slot-btn');
    const bookingForm = document.getElementById('booking-form');
    const bookingsListEl = document.getElementById('recent-bookings-list');
    const toggleBookingsBtn = document.getElementById('toggle-bookings-btn');

    // Only run if on booking page
    if (!calendarGrid) return;

    // --- INIT ---
    function init() {
        loadBookings();
        if (state.bookings.length === 0) simulateInitialBookings(); // Simulate ~20% booked on first load
        renderCalendar();
        renderBookingsList();
        bindEvents();
    }

    // --- DATA MANAGEMENT ---
    function loadBookings() {
        const stored = localStorage.getItem(STORAGE_KEY);
        state.bookings = stored ? JSON.parse(stored) : [];
    }

    function saveBookings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
        renderCalendar();
        renderBookingsList();
    }

    function simulateInitialBookings() {
        // Add some dummy bookings if none exist for demo purposes
        const today = new Date();
        for (let i = 0; i < TOTAL_DAYS; i++) {
            if (Math.random() < 0.2) { // ~20% chance per day
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const slot = Math.random() > 0.5 ? 'A' : 'B';
                state.bookings.push({
                    id: 'SIM-' + Math.random().toString(36).substr(2, 5),
                    date: dateStr,
                    slotId: slot,
                    name: 'Reserved',
                    phone: 'N/A',
                    timestamp: Date.now(),
                    isSimulated: true
                });
                // Occasionally book both slots
                if (Math.random() > 0.7) {
                     state.bookings.push({
                        id: 'SIM-' + Math.random().toString(36).substr(2, 5),
                        date: dateStr,
                        slotId: slot === 'A' ? 'B' : 'A',
                        name: 'Reserved',
                        phone: 'N/A',
                        timestamp: Date.now(),
                        isSimulated: true
                    });
                }
            }
        }
        saveBookings();
    }

    function isSlotBooked(date, slotId) {
        return state.bookings.some(b => b.date === date && b.slotId === slotId);
    }

    function getDayStatus(dateStr) {
        const bookedA = isSlotBooked(dateStr, 'A');
        const bookedB = isSlotBooked(dateStr, 'B');
        if (bookedA && bookedB) return 'booked';
        if (bookedA || bookedB) return 'partial';
        return 'available';
    }

    // --- RENDERING ---
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const today = new Date();
        for (let i = 0; i < TOTAL_DAYS; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const status = getDayStatus(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const isToday = i === 0;

            const cell = document.createElement('button');
            cell.className = `calendar-day ${isToday ? 'today' : ''} ${status === 'booked' ? 'disabled' : ''}`;
            cell.setAttribute('data-date', dateStr);
            cell.setAttribute('data-status', status);
            cell.disabled = status === 'booked';
            cell.innerHTML = `
                <span class="day-label">${isToday ? 'Today' : dayName}</span>
                <span class="date-label">${dayNum}</span>
                <div class="day-status">
                    <span class="status-dot"></span><span class="status-dot"></span>
                </div>
            `;
            cell.addEventListener('click', () => openModal(date));
            calendarGrid.appendChild(cell);
        }
    }

    function renderBookingsList() {
        // Filter only user bookings (not simulated ones) for the list
        const userBookings = state.bookings.filter(b => !b.isSimulated).sort((a, b) => b.timestamp - a.timestamp);
        bookingsListEl.innerHTML = '';

        if (userBookings.length === 0) {
            bookingsListEl.innerHTML = '<p class="no-bookings-msg" style="color: var(--color-slate); padding: 1rem 0;">No active bookings found on this device.</p>';
            return;
        }

        userBookings.forEach(booking => {
            const el = document.createElement('div');
            el.className = 'booking-item';
            el.innerHTML = `
                <div class="booking-info">
                    <h4>${new Date(booking.date).toLocaleDateString()} @ ${SLOTS[booking.slotId]}</h4>
                    <div class="booking-meta">Ref: ${booking.id} • ${booking.name}</div>
                </div>
                <button class="cancel-btn" data-id="${booking.id}" aria-label="Cancel booking ${booking.id}">Cancel</button>
            `;
            el.querySelector('.cancel-btn').addEventListener('click', () => cancelBooking(booking.id));
            bookingsListEl.appendChild(el);
        });
    }

    // --- MODAL & FORM ---
    function openModal(date) {
        state.selectedDate = date.toISOString().split('T')[0];
        state.selectedSlot = null;
        modalTitle.textContent = `Booking for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;

        // Update slot availability
        slotBtns.forEach(btn => {
            const slotId = btn.dataset.slot;
            const isBooked = isSlotBooked(state.selectedDate, slotId);
            btn.disabled = isBooked;
            btn.classList.remove('selected');
            btn.querySelector('.slot-status').textContent = isBooked ? 'Booked' : 'Available';
            btn.setAttribute('aria-checked', 'false');
        });

        bookingForm.classList.add('hidden');
        bookingForm.reset();

        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        bookingModal.classList.remove('active');
        bookingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // --- ACTIONS ---
    function handleSlotSelect(e) {
        const btn = e.currentTarget;
        if (btn.disabled) return;

        slotBtns.forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        state.selectedSlot = btn.dataset.slot;
        bookingForm.classList.remove('hidden');
        // Smooth scroll to form on mobile if needed
        if (window.innerWidth < 768) {
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleBookingSubmit(e) {
        e.preventDefault();
        if (!state.selectedDate || !state.selectedSlot) return;

        // Double-check availability (race condition prevention)
        loadBookings(); // Refresh latest state
        if (isSlotBooked(state.selectedDate, state.selectedSlot)) {
            showToast('Slot was just booked by someone else! Please choose another.', 'error');
            openModal(new Date(state.selectedDate)); // Re-render modal with updated slots
            return;
        }

        const name = document.getElementById('book-name').value.trim();
        const phone = document.getElementById('book-phone').value.trim();
        const email = document.getElementById('book-email').value.trim();

        const newBooking = {
            id: 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            date: state.selectedDate,
            slotId: state.selectedSlot,
            name, phone, email,
            timestamp: Date.now(),
            isSimulated: false
        };

        state.bookings.push(newBooking);
        saveBookings();
        closeModal();
        showToast(`Booked! 🎉 Your slot is confirmed — Ref: ${newBooking.id}`, 'success');
        triggerConfetti();
    }

    function cancelBooking(id) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            state.bookings = state.bookings.filter(b => b.id !== id);
            saveBookings();
            showToast('Booking cancelled successfully.', 'success');
        }
    }

    // --- UTILS ---
    function showToast(msg, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function triggerConfetti() {
        // Simple CSS-based fallback confetti or minimal JS implementation
        // For brevity and no-deps, we'll just use a console log here,
        // but in a real app you'd likely use canvas-confetti or similar lightweight lib.
        // Since "no external libs" is a rule, we can skip complex visual confetti for now.
        console.log('🎉 Confetti! 🎉');
    }

    function bindEvents() {
        slotBtns.forEach(btn => btn.addEventListener('click', handleSlotSelect));
        bookingForm.addEventListener('submit', handleBookingSubmit);
        toggleBookingsBtn.addEventListener('click', () => {
            const isExpanded = toggleBookingsBtn.getAttribute('aria-expanded') === 'true';
            toggleBookingsBtn.setAttribute('aria-expanded', !isExpanded);
            bookingsListEl.hidden = isExpanded;
        });
        // Modal close handlers reusing existing logic if available, else:
        document.querySelector('.modal-close').addEventListener('click', closeModal);
        bookingModal.addEventListener('click', e => { if (e.target === bookingModal) closeModal(); });
    }

    // Expose debug helper
    window.clearBookings = () => { localStorage.removeItem(STORAGE_KEY); location.reload(); };

    init();
})();
// main.js — APPEND ONLY
// CONTACT — APPEND

(function() {
    // --- CONFIG ---
    const STORAGE_KEY_CONTACT = 'malwis_contact_submissions_v1';
    let isSubmitting = false;

    // --- DOM ELEMENTS ---
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return; // Exit if not on contact page

    const inquiriesListEl = document.getElementById('inquiries-list');
    const toggleInquiriesBtn = document.getElementById('toggle-inquiries-btn');
    const submitBtn = document.getElementById('contact-submit');

    // --- INIT ---
    const init = () => {
        bindFormEvents();
        bindInquiriesToggle();
        renderInquiries();
        // Re-use existing modal logic if available, else generic init for map
        if (window.ServiceModals && window.ServiceModals.init) {
             // Rely on generic modal init if it exists and handles data-modal-target
        } else {
             initGenericModals(); // Fallback if ServiceModals not present
        }
    };

    // --- FORM HANDLING ---
    const bindFormEvents = () => {
        contactForm.addEventListener('submit', handleSubmit);
        // Real-time validation on blur
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) validateField(input);
            });
        });
    };

    const validateField = (input) => {
        const group = input.closest('.form-group');
        const errorSpan = group.querySelector('.error-msg');
        let isValid = true, msg = '';

        if (input.required && !input.value.trim() && input.type !== 'checkbox') {
            isValid = false; msg = 'This field is required.';
        } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            isValid = false; msg = 'Please enter a valid email address.';
        } else if (input.type === 'tel' && input.value && !/^[0-9+\-\s()]{7,}$/.test(input.value)) {
            isValid = false; msg = 'Please enter a valid phone number (min 7 digits).';
        } else if (input.id === 'contact-name' && input.value && input.value.trim().length < 2) {
            isValid = false; msg = 'Name must be at least 2 characters.';
        } else if (input.id === 'contact-message' && input.value && input.value.trim().length < 20) {
            isValid = false; msg = 'Message must be at least 20 characters.';
        } else if (input.type === 'checkbox' && input.required && !input.checked) {
             isValid = false; msg = 'You must agree to continue.';
        }

        group.classList.toggle('error', !isValid);
        if (errorSpan) errorSpan.textContent = msg;
        return isValid;
    };

    const validateForm = () => {
        let isFormValid = true;
        contactForm.querySelectorAll('input:not([type="hidden"]), textarea').forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });
        return isFormValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Honeypot check
        if (document.getElementById('contact-url').value) {
            console.log('Spam detected'); return; // Silent fail
        }

        if (!validateForm()) {
            showToast('Please correct errors in the form.', 'error'); return;
        }

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const formData = {
            id: 'CT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            date: document.getElementById('contact-date').value,
            message: document.getElementById('contact-message').value.trim(),
            timestamp: Date.now()
        };

        saveInquiry(formData);
        contactForm.reset();
        showToast(`Message sent! Ref: ${formData.id}`, 'success');
        renderInquiries();
        // Optional: triggerConfetti() if available globally

        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    };

    // --- STORAGE ---
    const getInquiries = () => JSON.parse(localStorage.getItem(STORAGE_KEY_CONTACT) || '[]');
    const saveInquiry = (data) => {
        const inquiries = getInquiries();
        inquiries.push(data);
        localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(inquiries));
    };
    const deleteInquiry = (id) => {
        if (!confirm('Delete this inquiry record?')) return;
        const inquiries = getInquiries().filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(inquiries));
        renderInquiries();
        showToast('Record deleted.', 'success');
    };

    // --- RENDERING ---
    const renderInquiries = () => {
        const inquiries = getInquiries().sort((a, b) => b.timestamp - a.timestamp);
        inquiriesListEl.innerHTML = '';
        if (inquiries.length === 0) {
            inquiriesListEl.innerHTML = '<p class="no-inquiries-msg" style="color: var(--color-slate); padding: 1rem 0;">No recent inquiries found on this device.</p>';
            return;
        }
        inquiries.forEach(inq => {
            const el = document.createElement('div');
            el.className = 'inquiry-item';
            const maskedPhone = inq.phone.replace(/.(?=.{4})/g, '*');
            el.innerHTML = `
                <div class="inquiry-info">
                    <h4>${new Date(inq.timestamp).toLocaleDateString()} - ${escapeHtml(inq.name)}</h4>
                    <div class="inquiry-meta">Ref: ${inq.id} • Phone: ${maskedPhone}</div>
                    <div class="inquiry-meta" style="font-style: italic; margin-top: 0.25rem;">"${escapeHtml(inq.message.substring(0, 30))}..."</div>
                </div>
                <button class="delete-btn" data-id="${inq.id}" aria-label="Delete inquiry ${inq.id}">Delete</button>
            `;
            el.querySelector('.delete-btn').addEventListener('click', () => deleteInquiry(inq.id));
            inquiriesListEl.appendChild(el);
        });
    };

    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // --- UTILS ---
    const bindInquiriesToggle = () => {
        toggleInquiriesBtn.addEventListener('click', () => {
            const isExpanded = toggleInquiriesBtn.getAttribute('aria-expanded') === 'true';
            toggleInquiriesBtn.setAttribute('aria-expanded', !isExpanded);
            inquiriesListEl.hidden = isExpanded;
        });
    };

    // Fallback modal init if generic one isn't present
    const initGenericModals = () => {
        const triggers = document.querySelectorAll('[data-modal-target]');
        triggers.forEach(t => t.addEventListener('click', () => {
             const modal = document.querySelector(t.dataset.modalTarget);
             if(modal) {
                 modal.classList.add('active');
                 modal.setAttribute('aria-hidden', 'false');
                 document.body.style.overflow = 'hidden';
                 const close = () => {
                     modal.classList.remove('active');
                     modal.setAttribute('aria-hidden', 'true');
                     document.body.style.overflow = '';
                 };
                 modal.querySelector('.modal-close').onclick = close;
                 modal.onclick = (e) => { if(e.target === modal) close(); };
                 document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('active')) close(); }, {once:true});
             }
        }));
    };

    // Shared toast helper (if not already global, define locally)
    const showToast = window.showToast || ((msg, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    });

    // Expose debug helpers
    window.clearContacts = () => { localStorage.removeItem(STORAGE_KEY_CONTACT); location.reload(); };
    window.ContactPage = { init };

    init();
})();