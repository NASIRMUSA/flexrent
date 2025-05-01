 // Mobile menu toggle functionality
 document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
  });

  // Mobile dropdown toggle functionality
  const aboutLink = document.querySelector('#mobile-menu li.relative a');
  aboutLink.addEventListener('click', function(e) {
    e.preventDefault();
    const dropdown = document.getElementById('mobile-dropdown');
    dropdown.classList.toggle('hidden');
    
    // Toggle the current page if needed
    if (e.target.getAttribute('href')) {
      window.location.href = e.target.getAttribute('href');
    }
  });