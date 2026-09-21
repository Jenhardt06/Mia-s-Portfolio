/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});


/* Close mobile menu after clicking a link */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

    });

});


/* =====================================================
   HEADER SCROLL EFFECT
===================================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =====================================================
   PORTFOLIO CAROUSEL
===================================================== */

const carousel = document.getElementById("portfolioCarousel");

if (carousel) {

    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    const dotsWrap = document.getElementById("carouselDots");
    const viewport = carousel.querySelector(".carousel-viewport");

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let pointerActive = false;
    let dragging = false;
    let suppressClick = false;

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to project ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, di) => {
            dot.classList.toggle("active", di === index);
        });
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    viewport.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        pointerActive = true;
        dragging = false;
        suppressClick = false;
        startX = event.clientX;
        deltaX = 0;
    });

    viewport.addEventListener("pointermove", event => {
        if (!pointerActive) return;

        deltaX = event.clientX - startX;

        if (!dragging && Math.abs(deltaX) > 14) {
            dragging = true;
            suppressClick = true;
            track.style.transition = "none";
            viewport.setPointerCapture(event.pointerId);
        }

        if (!dragging) return;

        const offset = (-index * 100) + (deltaX / viewport.offsetWidth) * 100;
        track.style.transform = `translateX(${offset}%)`;
    });

    function endPointer(event) {
        if (!pointerActive) return;

        pointerActive = false;
        track.style.transition = "";

        if (dragging) {
            if (Math.abs(deltaX) > 60) {
                goTo(deltaX < 0 ? index + 1 : index - 1);
            } else {
                goTo(index);
            }

            if (viewport.hasPointerCapture?.(event.pointerId)) {
                viewport.releasePointerCapture(event.pointerId);
            }
        }

        dragging = false;
        deltaX = 0;
    }

    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);

    /* After a swipe, block the accidental link click */
    viewport.addEventListener("click", event => {
        if (suppressClick) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick = false;
        }
    }, true);

    goTo(0);

}
