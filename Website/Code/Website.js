const typingElement = document.querySelector(".highlight");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");

const phrases = [
    "AI products",
    "data dashboards",
    "full-stack tools",
    "research software"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];
    typingElement.textContent = currentPhrase.slice(0, charIndex);

    if (!isDeleting && charIndex < currentPhrase.length) {
        charIndex += 1;
        setTimeout(typeText, 85);
        return;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeText, 1200);
        return;
    }

    if (isDeleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeText, 42);
        return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeText, 250);
}

function setNavOpen(isOpen) {
    document.body.classList.toggle("nav-open", isOpen);
    navToggle?.setAttribute("aria-expanded", String(isOpen));
}

navToggle?.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

if (window.emailjs) {
    emailjs.init("C08pkjRS-b9pL3pX0");
}

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = {
        from_name: document.getElementById("from_name").value,
        from_email: document.getElementById("from_email").value,
        from_subject: document.getElementById("from_subject").value,
        message: document.getElementById("message").value
    };

    if (!window.emailjs) {
        formStatus.textContent = "Email service is still loading. Please try again in a moment.";
        return;
    }

    submitButton.disabled = true;
    formStatus.textContent = "Sending...";

    try {
        await emailjs.send("service_uznlkvf", "template_0ppj8hp", formData);
        contactForm.reset();
        formStatus.textContent = "Message sent. Thanks for reaching out.";
    } catch (error) {
        formStatus.textContent = "Message failed to send. Please email me directly.";
        console.error("EmailJS failed", error);
    } finally {
        submitButton.disabled = false;
    }
});

typeText();
