// js/main.js

document.addEventListener("DOMContentLoaded", () => {
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
  const intro = document.getElementById("intro-overlay");
  if (!intro) return;

  // 1. Check if user has already seen the intro this session
  if (sessionStorage.getItem("malwis_intro_seen")) {
    // If yes, hide it immediately without animation
    intro.style.display = "none";
    document.body.style.overflow = ""; // Ensure scroll is unlocked
    return;
  }

  // 2. If not seen, lock scroll and prepare to show it
  document.body.style.overflow = "hidden";

  const enterSite = () => {
    if (intro.classList.contains("hidden")) return;

    // Mark as seen in session storage
    sessionStorage.setItem("malwis_intro_seen", "true");

    intro.classList.add("hidden");
    document.body.style.overflow = ""; // Unlock scroll

    // Optional: removed the hero animation trigger here as it sometimes causes conflicts
    // if the user scrolls too fast. The IntersectionObserver handles it better.
  };

  // Event listeners
  window.addEventListener("wheel", enterSite, { once: true });
  window.addEventListener("touchmove", enterSite, { once: true });
  intro.addEventListener("click", enterSite);

  // Fallback auto-enter
  setTimeout(enterSite, 6000);
}

/**
 * 1. Navbar Scroll Effect
 */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      // Adjust scroll threshold as needed
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/**
 * 2. Mobile Menu Toggle
 */
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileToggle.classList.toggle("open");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileToggle.classList.remove("open");
      });
    });
  }
}

/**
 * 3. Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-fade-up");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * 4. Smooth Scroll for Anchors
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = document.getElementById("navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
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
  const track = document.getElementById("testimonial-track");
  const dotsNav = document.getElementById("carousel-dots");
  if (!track || !dotsNav) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-btn.next-btn");
  const prevButton = document.querySelector(".carousel-btn.prev-btn");

  // 1. Auto-generate dots
  // Clear existing dots first to prevent duplicates if re-initialized
  dotsNav.innerHTML = "";
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (index === 0) dot.classList.add("current-slide");
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    dotsNav.appendChild(dot);
  });

  const dots = Array.from(dotsNav.children);
  let currentIndex = 0;

  // 2. Main update function (Simplified: No track movement, just class toggling)
  const moveToSlide = (targetIndex) => {
    if (targetIndex < 0) targetIndex = slides.length - 1;
    if (targetIndex >= slides.length) targetIndex = 0;

    // Just toggle classes. CSS handles the rest (opacity/visibility).
    slides.forEach((slide) => slide.classList.remove("current-slide"));
    slides[targetIndex].classList.add("current-slide");

    dots.forEach((dot) => dot.classList.remove("current-slide"));
    dots[targetIndex].classList.add("current-slide");

    currentIndex = targetIndex;
  };

  // 3. Event Listeners
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveToSlide(currentIndex + 1);
      resetTimer();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      moveToSlide(currentIndex - 1);
      resetTimer();
    });
  }

  dotsNav.addEventListener("click", (e) => {
    const targetDot = e.target.closest("button");
    if (!targetDot) return;
    const targetIndex = dots.findIndex((dot) => dot === targetDot);
    moveToSlide(targetIndex);
    resetTimer();
  });

  // 4. Auto-play
  let timer;
  const startTimer = () => {
    timer = setInterval(() => moveToSlide(currentIndex + 1), 6000); // 6 seconds for better reading time
  };
  const resetTimer = () => {
    clearInterval(timer);
    startTimer();
  };

  startTimer();
}

/**
 * 6. FAQ Accordion
 * Handles expanding and collapsing FAQ items smoothly.
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQs first
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      // If it wasn't active before, open it now
      if (!isActive) {
        item.classList.add("active");
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
document.addEventListener("DOMContentLoaded", () => {
  initTeamModals();
});

function initTeamModals() {
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const modalCloses = document.querySelectorAll(".modal-close");
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  let lastFocusedElement;

  // Don't run this script if no modals are on the current page
  if (modalTriggers.length === 0) return;

  // --- Focus Trap ---
  function trapFocus(e, firstFocusableEl, lastFocusableEl) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      // Tab
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
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Find focusable elements
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];

    // Focus the first element (e.g., the close button)
    firstFocusableEl.focus();

    // Add focus trap
    modal.addEventListener("keydown", (e) => trapFocus(e, firstFocusableEl, lastFocusableEl));
  }

  // --- Close Modal ---
  function closeModal(modal) {
    if (modal == null) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling

    // Remove the focus trap listener (important!)
    // We can't remove the *exact* listener without storing it, so we'll just re-find
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];
    modal.removeEventListener("keydown", (e) => trapFocus(e, firstFocusableEl, lastFocusableEl));

    // Restore focus to the element that opened the modal
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // --- Event Listeners ---

  // Open modal on trigger click
  modalTriggers.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

  // Close modal on overlay click
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      // Only close if the click is on the overlay itself, not the content
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close modal on close button click
  modalCloses.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal-overlay");
      closeModal(modal);
    });
  });

  // Close modal on 'Escape' key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal-overlay.active");
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
if (typeof initModals !== "function") {
  // Generic modal initiator if not already defined elsewhere
  function initModals() {
    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modalCloses = document.querySelectorAll(".modal-close");
    const modalOverlays = document.querySelectorAll(".modal-overlay");

    if (modalTriggers.length === 0) return;

    function openModal(modal) {
      if (!modal) return;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modal = document.querySelector(trigger.dataset.modalTarget);
        openModal(modal);
      });
    });

    modalCloses.forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(button.closest(".modal-overlay"));
      });
    });

    modalOverlays.forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal-overlay.active");
        closeModal(activeModal);
      }
    });
  }
  // Run it
  document.addEventListener("DOMContentLoaded", initModals);
} else {
  // If it exists from About page, just run it again to be sure it catches new elements if needed
  // (Usually DOMContentLoaded handles this once globally, but safe to re-run if script loading varies)
  document.addEventListener("DOMContentLoaded", initModals);
}
// SERVICES PAGE — MODAL ACCESSIBILITY & CONTROLLER
window.MalwisModals = (function () {
  let activeModal = null;
  let lastFocusedElement = null;

  function init() {
    // Bind triggers and standard close actions
    document.querySelectorAll("[data-modal-target]").forEach((btn) => {
      btn.addEventListener("click", (e) => open(e.currentTarget.getAttribute("data-modal-target"), e.currentTarget));
    });
    document.querySelectorAll(".modal-close, .modal-overlay").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el || e.target.closest(".modal-close")) closeActive();
      });
    });
    // Global Keydown for Escape and Tab (trap)
    document.addEventListener("keydown", (e) => {
      if (!activeModal) return;
      if (e.key === "Escape") closeActive();
      if (e.key === "Tab") trapFocus(e);
    });
  }

  function open(modalId, trigger) {
    const modal = document.querySelector(modalId);
    if (!modal) return;

    // Save state & lock body
    lastFocusedElement = document.activeElement;
    activeModal = modal;
    document.body.style.overflow = "hidden";

    // Update ARIA & Classes
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.classList.add("active");

    // Set initial focus (prefer modal container or first focusable)
    modal.focus();
    const focusable = getFocusable(modal);
    if (focusable.length) focusable[0].focus();
  }

  function closeActive() {
    if (!activeModal) return;

    // Reset state & unlock body
    activeModal.setAttribute("aria-hidden", "true");
    activeModal.classList.remove("active");
    document.body.style.overflow = "";

    // Update trigger ARIA if it exists
    const trigger = document.querySelector(`[data-modal-target="#${activeModal.id}"]`);
    if (trigger) trigger.setAttribute("aria-expanded", "false");

    // Restore focus
    if (lastFocusedElement) lastFocusedElement.focus();
    activeModal = null;
  }

  function trapFocus(e) {
    const focusable = getFocusable(activeModal);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }

  function getFocusable(el) {
    return Array.from(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  }

  // Auto-init if DOM is ready, otherwise wait
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  return { init, open, closeActive };
})();
// main.js — APPEND ONLY
// GALLERY — APPEND

// Debug hook: window.GalleryLightbox.open(0)

(function () {
  // --- Helper: Focus Trap ---
  const trapFocus = (e, el) => {
    const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

  // --- Gallery Filters ---
  const initGalleryFilters = () => {
    const pills = document.querySelectorAll(".filter-pill");
    const items = document.querySelectorAll(".gallery-item");
    const emptyMsg = document.getElementById("gallery-empty-msg");
    if (!pills.length || !items.length) return;

    pills.forEach((pill) =>
      pill.addEventListener("click", () => {
        // Update active state
        pills.forEach((p) => {
          p.classList.remove("active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");

        // Filter items
        const filter = pill.dataset.filter;
        let visibleCount = 0;
        items.forEach((item) => {
          const isMatch = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hidden", !isMatch);
          item.setAttribute("aria-hidden", !isMatch);
          if (isMatch) visibleCount++;
        });

        // Show/hide empty state
        if (emptyMsg) {
          emptyMsg.classList.toggle("hidden", visibleCount > 0);
          emptyMsg.setAttribute("aria-hidden", visibleCount > 0);
        }

        // Update Lightbox list
        if (window.GalleryLightbox) window.GalleryLightbox.updateItems();
      })
    );
  };

  // --- Gallery Lightbox ---
  window.GalleryLightbox = (function () {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");
    let items = [],
      currentIndex = 0,
      lastFocus = null;

    const updateItems = () => {
      // Only include currently visible items in lightbox navigation
      items = Array.from(document.querySelectorAll(".gallery-item:not(.hidden) .gallery-thumb"));
    };

    const open = (index) => {
      updateItems(); // ensure list is current
      // Find the true index in the *visible* list based on the data-index of clicked item
      const clickedIndexStr = index.toString();
      currentIndex = items.findIndex((item) => item.dataset.index === clickedIndexStr);
      if (currentIndex === -1) currentIndex = 0; // fallback

      lastFocus = document.activeElement;
      updateView();
      lb.classList.add("active");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lb.focus(); // focus the container or first button
    };

    const close = () => {
      lb.classList.remove("active");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    const updateView = () => {
      if (!items.length) return;
      const currentItem = items[currentIndex];
      const src = currentItem.querySelector("img").getAttribute("src"); // or data-full-src if you have it
      const alt = currentItem.querySelector("img").getAttribute("alt");
      const captionText = currentItem.querySelector(".gallery-caption").textContent;

      img.src = src;
      img.alt = alt;
      cap.textContent = captionText;
      if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
    };

    const next = () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateView();
    };
    const prev = () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateView();
    };

    // Binds
    const init = () => {
      updateItems();
      // Bind triggers
      document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
        thumb.addEventListener("click", (e) => {
          open(e.currentTarget.dataset.index);
        });
      });
      // Bind controls
      lb.querySelector(".lightbox-close").addEventListener("click", close);
      lb.querySelector(".next").addEventListener("click", next);
      lb.querySelector(".prev").addEventListener("click", prev);
      // Bind keyboard/overlay
      lb.addEventListener("click", (e) => {
        if (e.target === lb || e.target.classList.contains("lightbox-container")) close();
      });
      document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("active")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "Tab") trapFocus(e, lb);
      });
    };

    return { init, open, close, next, prev, updateItems };
  })();

  // Auto-init on load
  document.addEventListener("DOMContentLoaded", () => {
    initGalleryFilters();
    if (window.GalleryLightbox) window.GalleryLightbox.init();
  });
})();
// BOOKING — APPEND

(function () {
  // --- CONFIG & STATE ---
  const STORAGE_KEY = "malwis_bookings_v1";
  const TOTAL_DAYS = 30;
  const SLOTS = { A: "6:00 PM – 8:00 PM", B: "8:30 PM – 10:30 PM" };
  let state = { bookings: [], selectedDate: null, selectedSlot: null };

  // --- DOM ELEMENTS ---
  const calendarGrid = document.getElementById("calendar-grid");
  const bookingModal = document.getElementById("booking-modal");
  const modalTitle = document.getElementById("modal-date-title");
  const slotBtns = document.querySelectorAll(".slot-btn");
  const bookingForm = document.getElementById("booking-form");
  const bookingsListEl = document.getElementById("recent-bookings-list");
  const toggleBookingsBtn = document.getElementById("toggle-bookings-btn");

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
      if (Math.random() < 0.2) {
        // ~20% chance per day
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const slot = Math.random() > 0.5 ? "A" : "B";
        state.bookings.push({
          id: "SIM-" + Math.random().toString(36).substr(2, 5),
          date: dateStr,
          slotId: slot,
          name: "Reserved",
          phone: "N/A",
          timestamp: Date.now(),
          isSimulated: true,
        });
        // Occasionally book both slots
        if (Math.random() > 0.7) {
          state.bookings.push({
            id: "SIM-" + Math.random().toString(36).substr(2, 5),
            date: dateStr,
            slotId: slot === "A" ? "B" : "A",
            name: "Reserved",
            phone: "N/A",
            timestamp: Date.now(),
            isSimulated: true,
          });
        }
      }
    }
    saveBookings();
  }

  function isSlotBooked(date, slotId) {
    return state.bookings.some((b) => b.date === date && b.slotId === slotId);
  }

  function getDayStatus(dateStr) {
    const bookedA = isSlotBooked(dateStr, "A");
    const bookedB = isSlotBooked(dateStr, "B");
    if (bookedA && bookedB) return "booked";
    if (bookedA || bookedB) return "partial";
    return "available";
  }

  // --- RENDERING ---
  function renderCalendar() {
    calendarGrid.innerHTML = "";
    const today = new Date();
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const status = getDayStatus(dateStr);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate();
      const isToday = i === 0;

      const cell = document.createElement("button");
      cell.className = `calendar-day ${isToday ? "today" : ""} ${status === "booked" ? "disabled" : ""}`;
      cell.setAttribute("data-date", dateStr);
      cell.setAttribute("data-status", status);
      cell.disabled = status === "booked";
      cell.innerHTML = `
                <span class="day-label">${isToday ? "Today" : dayName}</span>
                <span class="date-label">${dayNum}</span>
                <div class="day-status">
                    <span class="status-dot"></span><span class="status-dot"></span>
                </div>
            `;
      cell.addEventListener("click", () => openModal(date));
      calendarGrid.appendChild(cell);
    }
  }

  function renderBookingsList() {
    // Filter only user bookings (not simulated ones) for the list
    const userBookings = state.bookings.filter((b) => !b.isSimulated).sort((a, b) => b.timestamp - a.timestamp);
    bookingsListEl.innerHTML = "";

    if (userBookings.length === 0) {
      bookingsListEl.innerHTML =
        '<p class="no-bookings-msg" style="color: var(--color-slate); padding: 1rem 0;">No active bookings found on this device.</p>';
      return;
    }

    userBookings.forEach((booking) => {
      const el = document.createElement("div");
      el.className = "booking-item";
      el.innerHTML = `
                <div class="booking-info">
                    <h4>${new Date(booking.date).toLocaleDateString()} @ ${SLOTS[booking.slotId]}</h4>
                    <div class="booking-meta">Ref: ${booking.id} • ${booking.name}</div>
                </div>
                <button class="cancel-btn" data-id="${booking.id}" aria-label="Cancel booking ${booking.id}">Cancel</button>
            `;
      el.querySelector(".cancel-btn").addEventListener("click", () => cancelBooking(booking.id));
      bookingsListEl.appendChild(el);
    });
  }

  // --- MODAL & FORM ---
  function openModal(date) {
    state.selectedDate = date.toISOString().split("T")[0];
    state.selectedSlot = null;
    modalTitle.textContent = `Booking for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;

    // Update slot availability
    slotBtns.forEach((btn) => {
      const slotId = btn.dataset.slot;
      const isBooked = isSlotBooked(state.selectedDate, slotId);
      btn.disabled = isBooked;
      btn.classList.remove("selected");
      btn.querySelector(".slot-status").textContent = isBooked ? "Booked" : "Available";
      btn.setAttribute("aria-checked", "false");
    });

    bookingForm.classList.add("hidden");
    bookingForm.reset();

    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    bookingModal.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // --- ACTIONS ---
  function handleSlotSelect(e) {
    const btn = e.currentTarget;
    if (btn.disabled) return;

    slotBtns.forEach((b) => {
      b.classList.remove("selected");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("selected");
    btn.setAttribute("aria-checked", "true");
    state.selectedSlot = btn.dataset.slot;
    bookingForm.classList.remove("hidden");
    // Smooth scroll to form on mobile if needed
    if (window.innerWidth < 768) {
      bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (!state.selectedDate || !state.selectedSlot) return;

    // Double-check availability (race condition prevention)
    loadBookings(); // Refresh latest state
    if (isSlotBooked(state.selectedDate, state.selectedSlot)) {
      showToast("Slot was just booked by someone else! Please choose another.", "error");
      openModal(new Date(state.selectedDate)); // Re-render modal with updated slots
      return;
    }

    const name = document.getElementById("book-name").value.trim();
    const phone = document.getElementById("book-phone").value.trim();
    const email = document.getElementById("book-email").value.trim();

    const newBooking = {
      id: "BK-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: state.selectedDate,
      slotId: state.selectedSlot,
      name,
      phone,
      email,
      timestamp: Date.now(),
      isSimulated: false,
    };

    state.bookings.push(newBooking);
    saveBookings();
    closeModal();
    showToast(`Booked! 🎉 Your slot is confirmed — Ref: ${newBooking.id}`, "success");
    triggerConfetti();
  }

  function cancelBooking(id) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      state.bookings = state.bookings.filter((b) => b.id !== id);
      saveBookings();
      showToast("Booking cancelled successfully.", "success");
    }
  }

  // --- UTILS ---
  function showToast(msg, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.getElementById("toast-container").appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  function triggerConfetti() {
    // Simple CSS-based fallback confetti or minimal JS implementation
    // For brevity and no-deps, we'll just use a console log here,
    // but in a real app you'd likely use canvas-confetti or similar lightweight lib.
    // Since "no external libs" is a rule, we can skip complex visual confetti for now.
    console.log("🎉 Confetti! 🎉");
  }

  function bindEvents() {
    slotBtns.forEach((btn) => btn.addEventListener("click", handleSlotSelect));
    bookingForm.addEventListener("submit", handleBookingSubmit);
    toggleBookingsBtn.addEventListener("click", () => {
      const isExpanded = toggleBookingsBtn.getAttribute("aria-expanded") === "true";
      toggleBookingsBtn.setAttribute("aria-expanded", !isExpanded);
      bookingsListEl.hidden = isExpanded;
    });
    // Modal close handlers reusing existing logic if available, else:
    document.querySelector(".modal-close").addEventListener("click", closeModal);
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  // Expose debug helper
  window.clearBookings = () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };

  init();
})();
// main.js — APPEND ONLY
// CONTACT — APPEND

(function () {
  // --- CONFIG ---
  const STORAGE_KEY_CONTACT = "malwis_contact_submissions_v1";
  let isSubmitting = false;

  // --- DOM ELEMENTS ---
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return; // Exit if not on contact page

  const inquiriesListEl = document.getElementById("inquiries-list");
  const toggleInquiriesBtn = document.getElementById("toggle-inquiries-btn");
  const submitBtn = document.getElementById("contact-submit");

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
    contactForm.addEventListener("submit", handleSubmit);
    // Real-time validation on blur
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form-group").classList.contains("error")) validateField(input);
      });
    });
  };

  const validateField = (input) => {
    const group = input.closest(".form-group");
    const errorSpan = group.querySelector(".error-msg");
    let isValid = true,
      msg = "";

    if (input.required && !input.value.trim() && input.type !== "checkbox") {
      isValid = false;
      msg = "This field is required.";
    } else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      isValid = false;
      msg = "Please enter a valid email address.";
    } else if (input.type === "tel" && input.value && !/^[0-9+\-\s()]{7,}$/.test(input.value)) {
      isValid = false;
      msg = "Please enter a valid phone number (min 7 digits).";
    } else if (input.id === "contact-name" && input.value && input.value.trim().length < 2) {
      isValid = false;
      msg = "Name must be at least 2 characters.";
    } else if (input.id === "contact-message" && input.value && input.value.trim().length < 20) {
      isValid = false;
      msg = "Message must be at least 20 characters.";
    } else if (input.type === "checkbox" && input.required && !input.checked) {
      isValid = false;
      msg = "You must agree to continue.";
    }

    group.classList.toggle("error", !isValid);
    if (errorSpan) errorSpan.textContent = msg;
    return isValid;
  };

  const validateForm = () => {
    let isFormValid = true;
    contactForm.querySelectorAll('input:not([type="hidden"]), textarea').forEach((input) => {
      if (!validateField(input)) isFormValid = false;
    });
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Honeypot check
    if (document.getElementById("contact-url").value) {
      console.log("Spam detected");
      return; // Silent fail
    }

    if (!validateForm()) {
      showToast("Please correct errors in the form.", "error");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const formData = {
      id: "CT-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      phone: document.getElementById("contact-phone").value.trim(),
      date: document.getElementById("contact-date").value,
      message: document.getElementById("contact-message").value.trim(),
      timestamp: Date.now(),
    };

    saveInquiry(formData);
    contactForm.reset();
    showToast(`Message sent! Ref: ${formData.id}`, "success");
    renderInquiries();
    // Optional: triggerConfetti() if available globally

    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  };

  // --- STORAGE ---
  const getInquiries = () => JSON.parse(localStorage.getItem(STORAGE_KEY_CONTACT) || "[]");
  const saveInquiry = (data) => {
    const inquiries = getInquiries();
    inquiries.push(data);
    localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(inquiries));
  };
  const deleteInquiry = (id) => {
    if (!confirm("Delete this inquiry record?")) return;
    const inquiries = getInquiries().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(inquiries));
    renderInquiries();
    showToast("Record deleted.", "success");
  };

  // --- RENDERING ---
  const renderInquiries = () => {
    const inquiries = getInquiries().sort((a, b) => b.timestamp - a.timestamp);
    inquiriesListEl.innerHTML = "";
    if (inquiries.length === 0) {
      inquiriesListEl.innerHTML =
        '<p class="no-inquiries-msg" style="color: var(--color-slate); padding: 1rem 0;">No recent inquiries found on this device.</p>';
      return;
    }
    inquiries.forEach((inq) => {
      const el = document.createElement("div");
      el.className = "inquiry-item";
      const maskedPhone = inq.phone.replace(/.(?=.{4})/g, "*");
      el.innerHTML = `
                <div class="inquiry-info">
                    <h4>${new Date(inq.timestamp).toLocaleDateString()} - ${escapeHtml(inq.name)}</h4>
                    <div class="inquiry-meta">Ref: ${inq.id} • Phone: ${maskedPhone}</div>
                    <div class="inquiry-meta" style="font-style: italic; margin-top: 0.25rem;">"${escapeHtml(inq.message.substring(0, 30))}..."</div>
                </div>
                <button class="delete-btn" data-id="${inq.id}" aria-label="Delete inquiry ${inq.id}">Delete</button>
            `;
      el.querySelector(".delete-btn").addEventListener("click", () => deleteInquiry(inq.id));
      inquiriesListEl.appendChild(el);
    });
  };

  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  // --- UTILS ---
  const bindInquiriesToggle = () => {
    toggleInquiriesBtn.addEventListener("click", () => {
      const isExpanded = toggleInquiriesBtn.getAttribute("aria-expanded") === "true";
      toggleInquiriesBtn.setAttribute("aria-expanded", !isExpanded);
      inquiriesListEl.hidden = isExpanded;
    });
  };

  // Fallback modal init if generic one isn't present
  const initGenericModals = () => {
    const triggers = document.querySelectorAll("[data-modal-target]");
    triggers.forEach((t) =>
      t.addEventListener("click", () => {
        const modal = document.querySelector(t.dataset.modalTarget);
        if (modal) {
          modal.classList.add("active");
          modal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          const close = () => {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
          };
          modal.querySelector(".modal-close").onclick = close;
          modal.onclick = (e) => {
            if (e.target === modal) close();
          };
          document.addEventListener(
            "keydown",
            (e) => {
              if (e.key === "Escape" && modal.classList.contains("active")) close();
            },
            { once: true }
          );
        }
      })
    );
  };

  // Shared toast helper (if not already global, define locally)
  const showToast =
    window.showToast ||
    ((msg, type = "success") => {
      const container = document.getElementById("toast-container");
      if (!container) return;
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.textContent = msg;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    });

  // Expose debug helpers
  window.clearContacts = () => {
    localStorage.removeItem(STORAGE_KEY_CONTACT);
    location.reload();
  };
  window.ContactPage = { init };

  init();
})();
/* ===============================================
   LANGUAGE ENGINE (EN / NL)
   Works on Live Server & File System
===============================================
*/

const LanguageEngine = (function () {
  // 1. Translation Database
  const translations = {
    en: {
      "intro-text": "Experience the unforgettable.",
      "scroll-text": "Scroll to Enter",
      "nav-home": "Home",
      "nav-about": "About",
      "nav-services": "Services",
      "nav-gallery": "Gallery",
      "nav-book": "Book Now",
      "nav-contact": "Contact",
      "hero-tagline": "Your Vision, Our Stage.<br>Unforgettable Events Begin Here.",
      "hero-desc": "Crafting bespoke experiences in stunning venues. Let us bring your dream event to life.",
      "hero-cta-quote": "Get a Quote",
      "hero-cta-gallery": "View Gallery",
      "about-title": "More Than Just a Venue.",
      "about-p1":
        "Founded in 2023, Malwis Party was built on a simple premise: celebrations deserve a space that is as energetic and bright as the people hosting them.",
      "about-p2": "We ditched the stuffy ballrooms for modern design, adaptable lighting, and a premium support team dedicated to your vision.",
      "about-link": "Meet the Team →",
      "services-title": "Crafted for Every Occasion",
      "services-subtitle": "We blend versatile spaces with premium service to make your event flawless.",
      "serv-1-title": "Corporate Events",
      "serv-1-desc": "Host impressive product launches, team galas, and network mixers with state-of-the-art AV and polished setups.",
      "serv-2-title": "Private Parties",
      "serv-2-desc": "From milestone birthdays to elegant receptions. We provide the vibrant atmosphere, you bring the guests.",
      "serv-3-title": "Full-Service Catering",
      "serv-3-desc": "Curated menus, premium bar service, and experienced waitstaff to elevate your guest experience.",
      "learn-more": "Learn More →",
      "venue-title": "Our Unique Spaces",
      "venue-subtitle": "Diverse settings for every style of celebration.",
      "venue-1-name": "GRAND BALLROOM",
      "venue-1-type": "Classic Elegance",
      "venue-1-desc": "Spacious and sophisticated, perfect for large receptions and galas.",
      "venue-2-name": "ROOFTOP LOUNGE",
      "venue-2-type": "Modern & Airy",
      "venue-2-desc": "Stunning city views with a chic, open-air atmosphere for cocktails.",
      "venue-3-name": "THE GARDEN",
      "venue-3-type": "Outdoor Romance",
      "venue-3-desc": "Lush greenery and intimate lighting for ceremonies and garden parties.",
      "btn-explore": "EXPLORE",
      "testi-title": "What Our Clients Say",
      "testi-subtitle": "Real stories from our successful partnerships.",
      "testi-1-text":
        "MALWIS.PARTY exceeded expectations for our wedding reception. Every detail was perfect, and the atmosphere was magical. We wouldn't change a single thing about our experience!",
      "testi-1-role": "Bride & Groom",
      "testi-2-text":
        "Professional, punctual, and incredibly creative. Our annual corporate gala has never looked this good. The team handled everything so we could actually enjoy the night.",
      "testi-2-role": "TechCorp CEO",
      "testi-3-text":
        "Unreal energy! They took my 40th birthday vision and completely 10x'd it. The lighting setup was incredible and the vibe was exactly what I wanted.",
      "testi-3-role": "Private Client",
      "faq-title": "Frequently Asked Questions",
      "faq-subtitle": "Everything you need to know before booking your date.",
      "faq-1-q": "What is the venue capacity?",
      "faq-1-a":
        "Our main hall can comfortably accommodate up to 350 guests for a standing reception, or 250 for a seated dinner. We also have smaller, intimate lounge areas perfect for groups of 20-50.",
      "faq-2-q": "Do you provide catering services?",
      "faq-2-a":
        "Yes! We offer full-service in-house premium catering with customizable menus. You are also welcome to use one of our approved external catering partners if you have specific culinary requirements.",
      "faq-3-q": "Can we bring our own DJ or band?",
      "faq-3-a":
        "Absolutely. We have a dedicated stage and state-of-the-art AV system ready for your performers. We can also provide a list of our resident DJs and artists if you need recommendations.",
      "faq-4-q": "Is parking available on-site?",
      "faq-4-a":
        "We have a small private lot for VIPs and vendors (approx. 20 spots). For guests, we offer a managed valet service, and there is a large secure public garage located just one block away.",
      "insta-title": "Follow Our Journey",
      "insta-subtitle": 'Real-time updates and inspiration <a href="#" class="text-link">@malwis.party</a> on Instagram',
      "footer-tagline": "Bringing bright energy to every celebration since 2023.",
      "footer-links": "Quick Links",
      "footer-faq": "FAQs",
      "footer-touch": "Get in Touch",
      "footer-email-btn": "Email Us",
      "about-hero-title": 'Crafting <span class="gradient-text">Unforgettable</span> Moments.',
      "about-hero-subtitle": "Meet the passionate team and discover the story behind Malwis Party.",
      "journey-eyebrow": "OUR JOURNEY",
      "journey-title": "More Than Just a Venue.",
      "journey-p1":
        "Founded in 2023, Malwis Party began with a simple but ambitious idea: that modern celebrations deserved a space as vibrant and energetic as the people hosting them. We saw a gap between stiff, traditional banquet halls and chaotic, impersonal party spaces.",
      "journey-p2":
        "We set out to build a hybrid venue—one flexible enough for a high-stakes product launch by day and an energetic private gala by night. Our focus has always been on blending premium hospitality with a creative, energetic atmosphere that sparks connection.",
      "journey-p3":
        "Today, we are proud to be the top choice for forward-thinking companies and individuals who want their events to make a real statement.",
      "stat-events": "Events Hosted",
      "stat-satisfaction": "Client Satisfaction",
      "values-title": "Our Core Values",
      "values-subtitle": "The principles that guide every event we host.",
      "val-1-title": "Excellence",
      "val-1-desc": "We bring precision and detail to every single event, ensuring flawless execution from start to finish.",
      "val-2-title": "Vibrance",
      "val-2-desc": "Bright design, joyful energy. We believe celebrations should look as exciting as they feel.",
      "val-3-title": "Trust",
      "val-3-desc": "Professional service that clients can rely on. Transparency and clear communication are our foundation.",
      "history-title": "Our Story",
      "history-p1":
        "Founded in 2020, Malwis Party began with a simple idea: that modern celebrations deserved a venue that was both professionally managed and vibrantly designed. We saw a gap between stiff corporate halls and chaotic party spaces.",
      "history-p2":
        "We set out to build a hybrid venue—one flexible enough for a high-stakes product launch by day and an energetic private gala by night. Our focus has always been on blending premium hospitality with a creative, energetic atmosphere.",
      "history-p3":
        "Today, we are proud to be the top choice for forward-thinking companies and individuals who want their events to make a statement.",
      "timeline-2020": "Founded with the goal of making celebrations effortless.",
      "timeline-2021": "Hosted first major tech clients, proving our hybrid model.",
      "timeline-2023": "Venue expansion: new rooftop lounge and private dining.",
      "team-eyebrow": "THE CREATORS",
      "team-title": "Meet the Minds Behind the Magic",
      "role-founder": "Founder & CEO",
      "role-events": "Head of Events",
      "role-clients": "Client Relations",
      "about-cta-title": "Ready to plan your experience?",
      "about-cta-text": "Let's talk about your vision. Our team is ready to build a custom quote just for you.",
      "about-cta-btn": "Start Planning Now",
      "bio-alex":
        "Alex founded Malwis Party with a vision to merge luxury hospitality with dynamic event design. With over 15 years in the industry, his focus is on creating spaces that foster connection.",
      "bio-jenna":
        "Jenna is the logistical genius behind every event. Her meticulous planning ensures every detail, from vendor coordination to run-of-show, is executed flawlessly.",
      "bio-david": "David excels at translating a client's core vision into a tangible plan, making the booking process transparent and exciting.",
      "serv-hero-title": 'Our <span class="gradient-text">Services</span>',
      "serv-hero-subtitle": "Comprehensive event solutions — tailored packages, expert operations, flawless delivery.",
      "s-item-1-title": "Venue Rental",
      "s-item-1-desc": "Flexible spaces for 50-350 guests. Includes main hall, rooftop lounge, and private suites.",
      "s-item-2-title": "Corporate Events",
      "s-item-2-desc": "Turnkey solutions for conferences, product launches, and team galas with full AV support.",
      "s-item-3-title": "Private Parties",
      "s-item-3-desc": "Milestone birthdays, engagements, and receptions. We bring the energy, you bring the guests.",
      "s-item-4-title": "Catering & Bar",
      "s-item-4-desc": "Curated in-house menus, premium open bar packages, and experienced service staff.",
      "s-item-5-title": "AV & Production",
      "s-item-5-desc": "State-of-the-art sound, intelligent lighting rigs, and projection mapping capabilities.",
      "s-item-6-title": "Event Management",
      "s-item-6-desc": "Dedicated coordinators to handle timelines, vendors, and day-of logistics.",
      "btn-view-details": "View Details →",
      "pkg-title": "Curated Packages",
      "pkg-subtitle": "Simple starting points for your perfect event.",
      "pkg-1-name": "Starter",
      "pkg-1-price": "From $2,500",
      "pkg-1-li-1": "4-hour Venue Rental",
      "pkg-1-li-2": "Basic AV Setup",
      "pkg-1-li-3": "On-site Manager",
      "pkg-pop-tag": "Most Popular",
      "pkg-2-name": "Signature",
      "pkg-2-price": "From $5,500",
      "pkg-2-li-1": "8-hour Venue Rental",
      "pkg-2-li-2": "Full AV & Lighting Package",
      "pkg-2-li-3": "Open Bar (3 Hours)",
      "pkg-2-li-4": "Dedicated Event Coordinator",
      "pkg-3-name": "Premium",
      "pkg-3-price": "Custom Quote",
      "pkg-3-li-1": "Full-Day Exclusive Access",
      "pkg-3-li-2": "Premium Catering & Top-Shelf Bar",
      "pkg-3-li-3": "Custom Decor & Branding",
      "pkg-3-li-4": "Full Production Team",
      "btn-req-quote": "Request Quote",
      "feat-1": "Flexible Layouts",
      "feat-2": "In-house Catering",
      "feat-3": "Safety & Insurance",
      "feat-4": "Dedicated Manager",
      "case-eyebrow": "Case Study",
      "case-title": "TechCorp Annual Gala",
      "case-desc":
        "We transformed our main hall into a futuristic neon landscape for 300 guests. Featuring custom projection mapping, a curated cocktail menu, and seamless end-to-end management.",
      "case-link": "See Gallery →",
      "serv-faq-title": "Service FAQs",
      "s-faq-1-q": "What is included in the venue rental fee?",
      "s-faq-1-a":
        "Our base fee includes exclusive use of the booked space, standard tables and chairs, basic house lighting, and an on-site venue manager. Additional services like AV, catering, and decor are customized add-ons.",
      "s-faq-2-q": "Can we bring outside vendors?",
      "s-faq-2-a":
        "We have a preferred list of trusted vendors for catering and AV. Outside vendors for specialized services (like photographers or specific decor) are welcome upon approval and must provide proof of insurance.",
      "s-faq-3-q": "Is a deposit required to book?",
      "s-faq-3-a": "Yes, a 50% non-refundable deposit is required to secure your date. The remaining balance is due 30 days prior to the event.",
      "serv-cta-title": "Ready to plan your event?",
      "serv-cta-text": "Let's talk about your vision. Our team is ready to build a custom quote just for you.",
      "serv-cta-btn": "Get a Custom Quote",
      // Modals
      "m-1-title": "Venue Rental Details",
      "m-1-li-1": "<strong>Main Hall:</strong> 3,500 sq ft, up to 350 standing / 250 seated.",
      "m-1-li-2": "<strong>Rooftop Lounge:</strong> 1,200 sq ft, perfect for cocktail hour (80 guests).",
      "m-1-li-3": "<strong>Amenities:</strong> Private bridal/VIP suites, dedicated load-in area, high-speed WiFi.",
      "m-1-li-4": '<strong>Includes:</strong> 60" round tables, banquet chairs, house sound system.',
      "m-1-btn": "Request Quote for Venue",
      "m-2-title": "Corporate Event Services",
      "m-2-li-1": "<strong>Turnkey Production:</strong> We handle stage design, AV, and run-of-show.",
      "m-2-li-2": "<strong>Branding:</strong> Custom lighting colors, projection mapping, and signage placement.",
      "m-2-li-3": "<strong>Catering:</strong> Breakfast, lunch, and all-day beverage packages available.",
      "m-2-li-4": "<strong>Breakouts:</strong> Modular wall systems to create smaller workshop areas.",
      "m-2-btn": "Plan Corporate Event",
      "m-3-title": "Private Parties",
      "m-3-li-1": "Perfect for birthdays, anniversaries, and engagement parties.",
      "m-3-li-2": "Access to our vetted DJ and live entertainment roster.",
      "m-3-li-3": "Flexible bar packages (beer/wine, premium open bar).",
      "m-3-li-4": "Customizable mood lighting included.",
      "m-3-btn": "Start Planning",
      "m-4-title": "Catering & Bar",
      "m-4-li-1": "In-house culinary team specializing in modern, seasonal cuisine.",
      "m-4-li-2": "Plated dinners, heavy hors d'oeuvres, or chef stations.",
      "m-4-li-3": "Custom cocktail design by our lead mixologist.",
      "m-4-li-4": "Dietary accommodations (GF, Vegan, Kosher style) readily available.",
      "m-4-btn": "See Sample Menus",
      "m-5-title": "AV & Production",
      "m-5-li-1": "Concert-grade sound system tailored to the room acoustics.",
      "m-5-li-2": "Intelligent lighting rig with programmable scenes.",
      "m-5-li-3": "LED video walls and high-lumen projectors.",
      "m-5-li-4": "On-site AV technician included with all production packages.",
      "m-5-btn": "Request AV Quote",
      "m-6-title": "Event Management",
      "m-6-li-1": "Month-of coordination to finalize all vendor details.",
      "m-6-li-2": "Day-of on-site manager to execute the run-of-show.",
      "m-6-li-3": "Management of load-in, setup, and strike.",
      "m-6-li-4": "Guest list management and check-in support available.",
      "m-6-btn": "Meet Our Team",
      "gal-hero-title": 'Our <span class="gradient-text">Gallery</span>',
      "gal-hero-subtitle": "Real events, real energy. See how we bring visions to life.",
      "gal-hero-btn": "Follow on Instagram",
      "filter-all": "All",
      "filter-corp": "Corporate",
      "filter-wed": "Weddings",
      "filter-priv": "Private Parties",
      "img-1-title": "TechCorp Annual Gala",
      "img-2-title": "Elegant Reception Details",
      "img-3-title": "Rooftop Sunset Soiree",
      "img-4-title": "FutureTech Conference",
      "img-5-title": "First Dance Moment",
      "img-6-title": "Neon Birthday Bash",
      "img-7-title": "Annual Networking Mixer",
      "gal-cta-title": "Inspired by what you see?",
      "gal-cta-text": "Let's create something even better for your next event.",
      "gal-cta-btn": "Get a Custom Quote",
      "book-hero-title": 'Book Your <span class="gradient-text">Celebration</span>',
      "book-hero-subtitle": "Check availability and secure your date instantly. Two premium evening slots available daily.",
      "cal-title": "Select a Date",
      "leg-avail": "Available",
      "leg-fast": "Selling Fast",
      "leg-full": "Fully Booked",
      "rec-book-title": "Your Recent Bookings",
      "no-book-msg": "No active bookings found on this device.",
      "why-title": "Why Book Direct?",
      "ben-1-title": "Instant Confirmation",
      "ben-1-desc": "Secure your date immediately. No waiting for callbacks.",
      "ben-2-title": "Best Rate Guarantee",
      "ben-2-desc": "Direct bookings get our lowest venue rates, guaranteed.",
      "ben-3-title": "Dedicated Support",
      "ben-3-desc": "Direct line to our event planning team after booking.",
      "how-title": "How It Works",
      "step-1": "Select your preferred date from the calendar.",
      "step-2": "Choose an available evening time slot.",
      "step-3": "Enter your details to instantly reserve.",
      "help-text": "Need help with a custom date?",
      "help-link": "Contact our team →",
      "modal-instr": "Select an available time slot below.",
      "status-avail": "Available",
      "lbl-name": "Full Name *",
      "lbl-phone": "Phone Number *",
      "lbl-email": "Email (Optional)",
      "btn-confirm": "Confirm Booking",
      "contact-hero-title": 'Contact <span class="gradient-text">Us</span>',
      "contact-hero-subtitle": "Questions? Quotes? Let’s plan something memorable.",
      "info-visit-title": "Visit Us",
      "info-visit-hours": "Mon-Fri: 9am - 6pm<br>Sat: 10am - 4pm",
      "btn-view-map": "View on Map →",
      "info-email-title": "Email Us",
      "info-email-note": "We typically reply within 24 hours.",
      "info-call-title": "Call Us",
      "info-call-note": "Available during business hours.",
      "form-title": "Send a Message",
      "lbl-name": "Name *",
      "lbl-phone": "Phone *",
      "lbl-email": "Email *",
      "lbl-date": "Event Date (Optional)",
      "help-date": "Preferred date for your event if known.",
      "lbl-message": "Message *",
      "lbl-agree": "I agree to be contacted about my request. *",
      "btn-send": "Send Message",
      "rec-inq-title": "Your Recent Inquiries",
      "no-inq-msg": "No recent inquiries found on this device.",
    },
    nl: {
      "intro-text": "Beleef het onvergetelijke.",
      "scroll-text": "Scroll om binnen te gaan",
      "nav-home": "Thuis",
      "nav-about": "Over Ons",
      "nav-services": "Diensten",
      "nav-gallery": "Galerij",
      "nav-book": "Nu Boeken",
      "nav-contact": "Contact",
      "hero-tagline": "Jouw Visie, Ons Podium.<br>Onvergetelijke Evenementen Beginnen Hier.",
      "hero-desc": "Op maat gemaakte ervaringen op prachtige locaties. Laat ons jouw droomevenement tot leven brengen.",
      "hero-cta-quote": "Offerte Aanvragen",
      "hero-cta-gallery": "Bekijk Galerij",
      "about-title": "Meer Dan Alleen Een Locatie.",
      "about-p1":
        "Malwis Party, opgericht in 2023, is gebouwd op een eenvoudig principe: vieringen verdienen een ruimte die net zo energiek en helder is als de mensen die ze organiseren.",
      "about-p2":
        "We hebben de stijve balzalen ingeruild voor modern design, aanpasbare verlichting en een premium team dat toegewijd is aan jouw visie.",
      "about-link": "Ontmoet het Team →",
      "services-title": "Gemaakt voor Elke Gelegenheid",
      "services-subtitle": "Wij combineren veelzijdige ruimtes met premium service voor een vlekkeloos evenement.",
      "serv-1-title": "Zakelijke Evenementen",
      "serv-1-desc": "Organiseer indrukwekkende productlanceringen, teamgala's en netwerkborrels met geavanceerde AV en strakke opstellingen.",
      "serv-2-title": "Privéfeesten",
      "serv-2-desc": "Van mijlpaalverjaardagen tot elegante recepties. Wij zorgen voor de levendige sfeer, jij neemt de gasten mee.",
      "serv-3-title": "Full-Service Catering",
      "serv-3-desc": "Samengestelde menu's, premium barservice en ervaren bediening om de ervaring van je gasten naar een hoger niveau te tillen.",
      "learn-more": "Meer Lezen →",
      "venue-title": "Onze Unieke Ruimtes",
      "venue-subtitle": "Diverse settings voor elke stijl van vieren.",
      "venue-1-name": "GROTE BALZAAL",
      "venue-1-type": "Klassieke Elegantie",
      "venue-1-desc": "Ruim en verfijnd, perfect voor grote recepties en gala's.",
      "venue-2-name": "DAKTERRAS LOUNGE",
      "venue-2-type": "Modern & Luchtig",
      "venue-2-desc": "Prachtig uitzicht over de stad met een chique openluchtsfeer voor cocktails.",
      "venue-3-name": "DE TUIN",
      "venue-3-type": "Buiten Romantiek",
      "venue-3-desc": "Weelderig groen en intieme verlichting voor ceremonies en tuinfeesten.",
      "btn-explore": "ONTDEKKEN",
      "testi-title": "Wat Onze Klanten Zeggen",
      "testi-subtitle": "Echte verhalen van onze succesvolle partnerschappen.",
      "testi-1-text":
        "MALWIS.PARTY overtrof de verwachtingen voor onze bruiloftsreceptie. Elk detail was perfect en de sfeer was magisch. We zouden niets veranderen aan onze ervaring!",
      "testi-1-role": "Bruid & Bruidegom",
      "testi-2-text":
        "Professioneel, punctueel en ongelooflijk creatief. Ons jaarlijkse bedrijfsgala heeft er nog nooit zo goed uitgezien. Het team regelde alles zodat wij van de avond konden genieten.",
      "testi-2-role": "CEO TechCorp",
      "testi-3-text":
        "Onwerkelijke energie! Ze namen mijn visie voor mijn 40e verjaardag en deden er een schepje bovenop. De verlichting was ongelooflijk en de sfeer was precies wat ik wilde.",
      "testi-3-role": "Particuliere Klant",
      "faq-title": "Veelgestelde Vragen",
      "faq-subtitle": "Alles wat je moet weten voordat je je datum boekt.",
      "faq-1-q": "Wat is de capaciteit van de locatie?",
      "faq-1-a":
        "Onze grote zaal biedt comfortabel plaats aan maximaal 350 gasten voor een staande receptie, of 250 voor een zittend diner. We hebben ook kleinere, intieme lounges voor groepen van 20-50.",
      "faq-2-q": "Bieden jullie cateringdiensten aan?",
      "faq-2-a":
        "Ja! We bieden full-service interne premium catering met aanpasbare menu's. U bent ook welkom om een van onze goedgekeurde externe cateringpartners te gebruiken.",
      "faq-3-q": "Mogen we onze eigen DJ of band meenemen?",
      "faq-3-a":
        "Absoluut. We hebben een speciaal podium en een geavanceerd AV-systeem klaarstaan voor uw artiesten. We kunnen ook aanbevelingen doen uit onze lijst van vaste DJ's.",
      "faq-4-q": "Is er parkeergelegenheid op locatie?",
      "faq-4-a":
        "We hebben een klein privéterrein voor VIP's en leveranciers (ong. 20 plekken). Voor gasten bieden we een valet-service en er is een grote openbare garage op één blok afstand.",
      "insta-title": "Volg Onze Reis",
      "insta-subtitle": 'Real-time updates en inspiratie <a href="#" class="text-link">@malwis.party</a> op Instagram',
      "footer-tagline": "Brengt heldere energie naar elke viering sinds 2023.",
      "footer-links": "Snelle Links",
      "footer-faq": "Veelgestelde vragen",
      "footer-touch": "Neem Contact Op",
      "footer-email-btn": "Mail Ons",

      "about-hero-title": '<span class="gradient-text">Onvergetelijke</span> Momenten Creëren.',
      "about-hero-subtitle": "Ontmoet het gepassioneerde team en ontdek het verhaal achter Malwis Party.",
      "journey-eyebrow": "ONZE REIS",
      "journey-title": "Meer Dan Alleen Een Locatie.",
      "journey-p1":
        "Malwis Party, opgericht in 2023, begon met een eenvoudig maar ambitieus idee: moderne vieringen verdienden een ruimte die net zo levendig en energiek is als de mensen die ze organiseren. We zagen een kloof tussen stijve, traditionele feestzalen en chaotische feestruimtes.",
      "journey-p2":
        "We wilden een hybride locatie bouwen—flexibel genoeg voor een belangrijke productlancering overdag en een energiek privégala in de avond. Onze focus heeft altijd gelegen op het combineren van premium gastvrijheid met een creatieve sfeer die verbinding stimuleert.",
      "journey-p3":
        "Vandaag zijn we er trots op de eerste keuze te zijn voor vooruitstrevende bedrijven en individuen die een statement willen maken met hun evenement.",
      "stat-events": "Evenementen Gehost",
      "stat-satisfaction": "Klanttevredenheid",
      "values-title": "Onze Kernwaarden",
      "values-subtitle": "De principes die elk evenement dat we organiseren leiden.",
      "val-1-title": "Uitmuntendheid",
      "val-1-desc": "We brengen precisie en detail in elk evenement en zorgen voor een vlekkeloze uitvoering van begin tot eind.",
      "val-2-title": "Levendigheid",
      "val-2-desc": "Helder ontwerp, vreugdevolle energie. Wij geloven dat vieringen er net zo spannend uit moeten zien als ze voelen.",
      "val-3-title": "Vertrouwen",
      "val-3-desc": "Professionele service waar klanten op kunnen bouwen. Transparantie en heldere communicatie zijn onze basis.",
      "history-title": "Ons Verhaal",
      "history-p1":
        "Opgericht in 2020, begon Malwis Party met een eenvoudig idee: dat moderne vieringen een locatie verdienden die zowel professioneel beheerd als levendig ontworpen was.",
      "history-p2":
        "We wilden een hybride locatie bouwen—flexibel genoeg voor productlanceringen en privégala's. Onze focus ligt altijd op premium gastvrijheid en creatieve energie.",
      "history-p3": "Vandaag de dag zijn we trots om de topkeuze te zijn voor bedrijven en personen die indruk willen maken.",
      "timeline-2020": "Opgericht met als doel vieringen moeiteloos te maken.",
      "timeline-2021": "Eerste grote tech-klanten gehost, hybride model bewezen.",
      "timeline-2023": "Locatie-uitbreiding: nieuwe dakterraslounge en privé-diner.",
      "team-eyebrow": "DE MAKERS",
      "team-title": "Ontmoet de Geesten Achter de Magie",
      "role-founder": "Oprichter & CEO",
      "role-events": "Hoofd Evenementen",
      "role-clients": "Klantrelaties",
      "about-cta-title": "Klaar om je ervaring te plannen?",
      "about-cta-text": "Laten we praten over jouw visie. Ons team staat klaar om een offerte op maat voor je te maken.",
      "about-cta-btn": "Begin Nu Met Plannen",
      "bio-alex":
        "Alex richtte Malwis Party op met een visie om luxe gastvrijheid te combineren met dynamisch eventdesign. Met meer dan 15 jaar ervaring ligt zijn focus op het creëren van ruimtes die verbinding stimuleren.",
      "bio-jenna":
        "Jenna is het logistieke genie achter elk evenement. Haar nauwgezette planning zorgt ervoor dat elk detail, van leverancierscoördinatie tot draaiboek, vlekkeloos wordt uitgevoerd.",
      "bio-david":
        "David blinkt uit in het vertalen van de kernvisie van een klant naar een tastbaar plan, waardoor het boekingsproces transparant en opwindend wordt.",
      "serv-hero-title": 'Onze <span class="gradient-text">Diensten</span>',
      "serv-hero-subtitle": "Complete evenementoplossingen — op maat gemaakte pakketten, deskundige uitvoering, vlekkeloze levering.",
      "s-item-1-title": "Locatieverhuur",
      "s-item-1-desc": "Flexibele ruimtes voor 50-350 gasten. Inclusief grote zaal, dakterraslounge en privésuites.",
      "s-item-2-title": "Zakelijke Evenementen",
      "s-item-2-desc": "Kant-en-klare oplossingen voor conferenties, productlanceringen en teamgala's met volledige AV-ondersteuning.",
      "s-item-3-title": "Privéfeesten",
      "s-item-3-desc": "Mijlpaalverjaardagen, verlovingen en recepties. Wij zorgen voor de energie, jij neemt de gasten mee.",
      "s-item-4-title": "Catering & Bar",
      "s-item-4-desc": "Samengestelde interne menu's, premium open bar-pakketten en ervaren bediening.",
      "s-item-5-title": "AV & Productie",
      "s-item-5-desc": "State-of-the-art geluid, intelligente lichtinstallaties en projectiemogelijkheden.",
      "s-item-6-title": "Evenementenbeheer",
      "s-item-6-desc": "Toegewijde coördinatoren voor planning, leveranciers en logistiek op de dag zelf.",
      "btn-view-details": "Bekijk Details →",
      "pkg-title": "Samengestelde Pakketten",
      "pkg-subtitle": "Eenvoudige startpunten voor jouw perfecte evenement.",
      "pkg-1-name": "Starter",
      "pkg-1-price": "Vanaf $2.500",
      "pkg-1-li-1": "4 uur Locatiehuur",
      "pkg-1-li-2": "Basis AV-opstelling",
      "pkg-1-li-3": "Locatiemanager op locatie",
      "pkg-pop-tag": "Meest Populair",
      "pkg-2-name": "Signatuur",
      "pkg-2-price": "Vanaf $5.500",
      "pkg-2-li-1": "8 uur Locatiehuur",
      "pkg-2-li-2": "Volledig AV & Licht Pakket",
      "pkg-2-li-3": "Open Bar (3 Uur)",
      "pkg-2-li-4": "Toegewijde Event Coördinator",
      "pkg-3-name": "Premium",
      "pkg-3-price": "Offerte op Maat",
      "pkg-3-li-1": "Hele Dag Exclusieve Toegang",
      "pkg-3-li-2": "Premium Catering & Top-Shelf Bar",
      "pkg-3-li-3": "Aangepast Decor & Branding",
      "pkg-3-li-4": "Volledig Productieteam",
      "btn-req-quote": "Offerte Aanvragen",
      "feat-1": "Flexibele Indelingen",
      "feat-2": "Interne Catering",
      "feat-3": "Veiligheid & Verzekering",
      "feat-4": "Toegewijde Manager",
      "case-eyebrow": "Casestudy",
      "case-title": "TechCorp Jaarlijks Gala",
      "case-desc":
        "We transformeerden onze grote zaal in een futuristisch neonlandschap voor 300 gasten. Met custom projectiemapping, een samengesteld cocktailmenu en naadloos beheer van begin tot eind.",
      "case-link": "Bekijk Galerij →",
      "serv-faq-title": "Veelgestelde Vragen Diensten",
      "s-faq-1-q": "Wat is inbegrepen in de huurprijs?",
      "s-faq-1-a":
        "Onze basisprijs is inclusief exclusief gebruik van de geboekte ruimte, standaard tafels en stoelen, basisverlichting en een locatiemanager. Extra diensten zoals AV, catering en decor zijn optionele extra's.",
      "s-faq-2-q": "Mogen we externe leveranciers meenemen?",
      "s-faq-2-a":
        "We hebben een voorkeurslijst van vertrouwde leveranciers voor catering en AV. Externe leveranciers voor gespecialiseerde diensten (zoals fotografen of specifiek decor) zijn welkom na goedkeuring en bewijs van verzekering.",
      "s-faq-3-q": "Is een aanbetaling vereist om te boeken?",
      "s-faq-3-a":
        "Ja, een niet-restitueerbare aanbetaling van 50% is vereist om uw datum vast te leggen. Het resterende saldo moet 30 dagen voor het evenement worden voldaan.",
      "serv-cta-title": "Klaar om je evenement te plannen?",
      "serv-cta-text": "Laten we praten over jouw visie. Ons team staat klaar om een offerte op maat voor je te maken.",
      "serv-cta-btn": "Krijg een Offerte op Maat",
      // Modals
      "m-1-title": "Locatieverhuur Details",
      "m-1-li-1": "<strong>Grote Zaal:</strong> 325 m², tot 350 staand / 250 zittend.",
      "m-1-li-2": "<strong>Dakterras Lounge:</strong> 110 m², perfect voor borrels (80 gasten).",
      "m-1-li-3": "<strong>Voorzieningen:</strong> Privé bruids/VIP-suites, toegewijde laadzone, snelle WiFi.",
      "m-1-li-4": '<strong>Inclusief:</strong> 60" ronde tafels, banketstoelen, huisgeluidssysteem.',
      "m-1-btn": "Vraag Locatie Offerte",
      "m-2-title": "Zakelijke Evenementendiensten",
      "m-2-li-1": "<strong>Kant-en-klare Productie:</strong> Wij regelen podiumontwerp, AV en draaiboek.",
      "m-2-li-2": "<strong>Branding:</strong> Aangepaste lichtkleuren, projectiemapping en plaatsing van bewegwijzering.",
      "m-2-li-3": "<strong>Catering:</strong> Ontbijt, lunch en drankenpakketten voor de hele dag beschikbaar.",
      "m-2-li-4": "<strong>Breakouts:</strong> Modulaire wandsystemen om kleinere workshopruimtes te creëren.",
      "m-2-btn": "Plan Zakelijk Evenement",
      "m-3-title": "Privéfeesten",
      "m-3-li-1": "Perfect voor verjaardagen, jubilea en verlovingsfeesten.",
      "m-3-li-2": "Toegang tot onze gescreende DJ en live entertainment selectie.",
      "m-3-li-3": "Flexibele barpakketten (bier/wijn, premium open bar).",
      "m-3-li-4": "Aanpasbare sfeerverlichting inbegrepen.",
      "m-3-btn": "Begin met Plannen",
      "m-4-title": "Catering & Bar",
      "m-4-li-1": "Intern culinair team gespecialiseerd in moderne, seizoensgebonden keuken.",
      "m-4-li-2": "Uitgeserveerde diners, luxe hapjes of chef-stations.",
      "m-4-li-3": "Op maat gemaakt cocktailontwerp door onze hoofd-mixoloog.",
      "m-4-li-4": "Dieetwensen (GV, Vegan, Kosjer-stijl) direct beschikbaar.",
      "m-4-btn": "Bekijk Voorbeeldmenu's",
      "m-5-title": "AV & Productie",
      "m-5-li-1": "Concertkwaliteit geluidssysteem afgestemd op de akoestiek van de ruimte.",
      "m-5-li-2": "Intelligente lichtinstallatie met programmeerbare scènes.",
      "m-5-li-3": "LED-videowanden en projectoren met hoge lichtopbrengst.",
      "m-5-li-4": "AV-technicus op locatie inbegrepen bij alle productie-pakketten.",
      "m-5-btn": "Vraag AV Offerte",
      "m-6-title": "Evenementenbeheer",
      "m-6-li-1": "Coördinatie in de maand voorafgaand om alle leveranciersdetails af te ronden.",
      "m-6-li-2": "Manager op de dag zelf om het draaiboek uit te voeren.",
      "m-6-li-3": "Beheer van opbouw, inrichting en afbouw.",
      "m-6-li-4": "Gastenlijstbeheer en incheckondersteuning beschikbaar.",
      "m-6-btn": "Ontmoet Ons Team",
      "gal-hero-title": 'Onze <span class="gradient-text">Galerij</span>',
      "gal-hero-subtitle": "Echte evenementen, echte energie. Zie hoe we visies tot leven brengen.",
      "gal-hero-btn": "Volg op Instagram",
      "filter-all": "Alles",
      "filter-corp": "Zakelijk",
      "filter-wed": "Bruiloften",
      "filter-priv": "Privéfeesten",
      "img-1-title": "TechCorp Jaarlijks Gala",
      "img-2-title": "Elegante Receptiedetails",
      "img-3-title": "Dakterras Zonsondergang Soiree",
      "img-4-title": "FutureTech Conferentie",
      "img-5-title": "Eerste Dans Moment",
      "img-6-title": "Neon Verjaardagsbash",
      "img-7-title": "Jaarlijkse Netwerkborrel",
      "gal-cta-title": "Geïnspireerd door wat je ziet?",
      "gal-cta-text": "Laten we iets nog beters creëren voor je volgende evenement.",
      "gal-cta-btn": "Krijg een Offerte op Maat",
      "book-hero-title": 'Boek Je <span class="gradient-text">Viering</span>',
      "book-hero-subtitle": "Controleer beschikbaarheid en leg je datum direct vast. Twee premium avondsloten dagelijks beschikbaar.",
      "cal-title": "Kies een Datum",
      "leg-avail": "Beschikbaar",
      "leg-fast": "Gaat Snel",
      "leg-full": "Volgeboekt",
      "rec-book-title": "Jouw Recente Boekingen",
      "no-book-msg": "Geen actieve boekingen gevonden op dit apparaat.",
      "why-title": "Waarom Direct Boeken?",
      "ben-1-title": "Directe Bevestiging",
      "ben-1-desc": "Leg je datum meteen vast. Geen wachttijden.",
      "ben-2-title": "Beste Prijs Garantie",
      "ben-2-desc": "Directe boekingen krijgen gegarandeerd onze laagste locatietarieven.",
      "ben-3-title": "Toegewijde Ondersteuning",
      "ben-3-desc": "Directe lijn naar ons planningsteam na boeking.",
      "how-title": "Hoe Het Werkt",
      "step-1": "Selecteer je voorkeursdatum in de kalender.",
      "step-2": "Kies een beschikbaar avondtijdslot.",
      "step-3": "Voer je gegevens in om direct te reserveren.",
      "help-text": "Hulp nodig bij een datum op maat?",
      "help-link": "Neem contact op →",
      "modal-instr": "Kies hieronder een beschikbaar tijdslot.",
      "status-avail": "Beschikbaar",
      "lbl-name": "Volledige Naam *",
      "lbl-phone": "Telefoonnummer *",
      "lbl-email": "E-mail (Optioneel)",
      "btn-confirm": "Bevestig Boeking",
      "contact-hero-title": 'Neem <span class="gradient-text">Contact</span> Op',
      "contact-hero-subtitle": "Vragen? Offertes? Laten we iets onvergetelijks plannen.",
      "info-visit-title": "Bezoek Ons",
      "info-visit-hours": "Ma-Vr: 9:00 - 18:00<br>Za: 10:00 - 16:00",
      "btn-view-map": "Bekijk op Kaart →",
      "info-email-title": "Mail Ons",
      "info-email-note": "We antwoorden doorgaans binnen 24 uur.",
      "info-call-title": "Bel Ons",
      "info-call-note": "Bereikbaar tijdens kantooruren.",
      "form-title": "Stuur een Bericht",
      "lbl-name": "Naam *",
      "lbl-phone": "Telefoon *",
      "lbl-email": "E-mail *",
      "lbl-date": "Evenementdatum (Optioneel)",
      "help-date": "Voorkeursdatum voor uw evenement indien bekend.",
      "lbl-message": "Bericht *",
      "lbl-agree": "Ik ga ermee akkoord dat er contact met mij wordt opgenomen. *",
      "btn-send": "Verstuur Bericht",
      "rec-inq-title": "Uw Recente Aanvragen",
      "no-inq-msg": "Geen recente aanvragen gevonden op dit apparaat.",
    },
  };

  // 2. State Management
  let currentLang = "en";

  // 3. Init Function
  function init() {
    // Try to get language from storage, safe for file:// protocol
    try {
      const savedLang = localStorage.getItem("malwis_lang");
      if (savedLang && (savedLang === "en" || savedLang === "nl")) {
        currentLang = savedLang;
      }
    } catch (e) {
      console.warn("LocalStorage not available (likely file:// protocol strict mode). Defaulting to EN.");
    }

    applyLanguage(currentLang);
    bindEvents();
  }

  // 4. Apply Language to DOM
  function applyLanguage(lang) {
    const data = translations[lang];
    if (!data) return;

    // Update all text elements with data-lang attribute
    document.querySelectorAll("[data-lang]").forEach((el) => {
      const key = el.getAttribute("data-lang");
      if (data[key]) {
        // Handle HTML content (like <br>) vs Text content
        if (data[key].includes("<")) {
          el.innerHTML = data[key];
        } else {
          el.textContent = data[key];
        }
      }
    });

    // Update Buttons Text to show the *other* language option or current?
    // Standard UI: Show the language you are switching TO or the current active one.
    // Let's show the Current active one, or toggle.
    // Request: "EN and NL". Let's make the button toggle.
    const nextLang = lang === "en" ? "NL" : "EN";
    const btns = document.querySelectorAll(".lang-toggle");
    btns.forEach((btn) => {
      // Update text to show what clicking will do (Switch to...)
      btn.textContent = nextLang;
      // Optional: Add active class if you want to style it differently
    });

    // Persist
    try {
      localStorage.setItem("malwis_lang", lang);
    } catch (e) {
      /* Ignore file:// errors */
    }
  }

  // 5. Toggle Logic
  function toggleLanguage() {
    currentLang = currentLang === "en" ? "nl" : "en";
    applyLanguage(currentLang);
  }

  // 6. Bind Events
  function bindEvents() {
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent link behavior if it were an anchor
        toggleLanguage();
      });
    });
  }

  // Auto-run
  document.addEventListener("DOMContentLoaded", init);

  return {
    set: applyLanguage,
    toggle: toggleLanguage,
  };
})();
