// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileDropdownToggle = mobileMenu.querySelector('a[href="about.html"]');
  const mobileDropdown = document.getElementById("mobile-dropdown");

  // Toggle mobile menu
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  // Toggle mobile dropdown
  mobileDropdownToggle.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent link redirect
    mobileDropdown.classList.toggle("hidden");
  });
});
