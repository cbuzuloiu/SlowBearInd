// Mobile Menu Toggle
const toggleBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  if (navLinks.classList.contains("active")) {
    navLinks.style.display = "block";
  } else {
    navLinks.style.display = "none";
  }
});

// Sticky Navbar Shadow
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shadow");
  } else {
    navbar.classList.remove("shadow");
  }
});

// Simple Form Validation
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const message = e.target.message.value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  alert("Message sent successfully!");
  e.target.reset();
});
