function toggleCategories(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById("categoriesDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

// Mobile Navigation Toggle
function toggleMobileNav() {
    const nav = document.querySelector('.inline-nav');
    if(nav) {
        nav.classList.toggle('active');
    }
}
