/* =========================================================
   Minahil Jamshaid - Portfolio Scripts
   1 Mobile menu · 2 Navbar scroll · 3 Active link · 4 Typing effect
   5 Reveal on scroll · 6 Skill bars · 7 Back to top · 8 Contact form
   9 Download CV check · 10 Footer year
   ========================================================= */

window.portfolioReady = true;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* ---------- Toast helper ---------- */
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ---------- 1. Mobile menu ---------- */
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close menu when a link is clicked
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 2, 3, 7. Scroll effects ---------- */
const navbar = $("#navbar");
const progressBar = $("#progressBar");
const toTop = $("#toTop");
const sections = $$("main section[id]");
const navItems = $$(".nav-link");

function onScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // Sticky navbar style
  navbar.classList.toggle("scrolled", scrollY > 40);

  // Progress bar
  progressBar.style.width = (scrollY / docHeight) * 100 + "%";

  // Back-to-top button
  toTop.classList.toggle("show", scrollY > 500);

  // Highlight the active nav link
  let current = "home";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 140) current = section.id;
  });
  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 4. Typing effect ---------- */
const roles = [
  "Computer Science Student",
  "Full Stack Developer",
  "Business Development Professional",
];
const typedEl = $("#typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = roles[roleIndex];
  typedEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 80);
  } else if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(type, 1600);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 40);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

/* ---------- 5. Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

$$(".reveal").forEach((el, i) => {
  // Small stagger for cards in the same grid
  el.style.transitionDelay = (i % 4) * 0.08 + "s";
  revealObserver.observe(el);
});

/* ---------- 6. Skill bars (animate when visible) ---------- */
function animateSkill(bar) {
  const level = parseInt(bar.dataset.level, 10);
  const pct = bar.closest(".skill").querySelector(".pct");
  bar.style.width = level + "%";

  // Count-up number
  let n = 0;
  const step = Math.max(1, Math.round(level / 50));
  const counter = setInterval(() => {
    n = Math.min(n + step, level);
    pct.textContent = n + "%";
    if (n >= level) clearInterval(counter);
  }, 28);
}

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkill(entry.target);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
$$(".fill").forEach((bar) => skillObserver.observe(bar));

/* ---------- 8. Contact form (Web3Forms) ---------- */
// Messages go straight to your inbox through Web3Forms (no email app needed).
const WEB3FORMS_KEY = "5e308fbd-e275-4153-af3f-56da476a51d6";

const form = $("#contactForm");
const statusEl = $("#formStatus");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Reset error styles
  [form.name, form.email, form.message].forEach((f) => f.classList.remove("invalid"));
  statusEl.className = "form-status";

  if (!name || !emailOk || !message) {
    if (!name) form.name.classList.add("invalid");
    if (!emailOk) form.email.classList.add("invalid");
    if (!message) form.message.classList.add("invalid");
    statusEl.textContent = "Please fill in all fields with a valid email.";
    statusEl.classList.add("error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: "Portfolio message from " + name,
        name: name,
        email: email,
        message: message,
      }),
    });
    const data = await res.json();

    if (data.success) {
      statusEl.textContent = "Thank you! Your message has been sent.";
      statusEl.classList.add("ok");
      form.reset();
    } else {
      throw new Error(data.message || "Failed");
    }
  } catch (err) {
    statusEl.textContent = "Sorry, the message could not be sent. Please try again later.";
    statusEl.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});

/* ---------- 9. Download CV ---------- */
// Put your CV in the same folder and name it: Minahil_Jamshaid_CV.pdf.pdf
$("#downloadCv").addEventListener("click", async (e) => {
  try {
    const res = await fetch(e.currentTarget.getAttribute("href"), { method: "HEAD" });
    if (!res.ok) throw new Error("missing");
  } catch (err) {
    // Only runs if the file can't be checked or found
    if (location.protocol !== "file:") {
      e.preventDefault();
      showToast("CV file not found. Check the CV file name in the site folder.");
    } else {
      // Opened from a folder: browser can't check, so show a hint
      showToast("If the CV does not download, put your CV file in the same folder.");
    }
  }
});

/* ---------- 10. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
