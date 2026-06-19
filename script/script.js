//alert("The Website is partially developed")

const sections = document.querySelectorAll('.section');
const cartIcon = document.getElementById('Cart'); 
// NEW: Get the Hamburger Icon and Navigation Bar
const hamburgerIcon = document.getElementById('HamburgerIcon');
const navigationBar = document.getElementById('NavigationBar');

// NEW: Select all main and sub dropdown toggles (the <a> tags)
const dropdownToggles = document.querySelectorAll('.dropdown > a, .dropdown-sub > a');

const totalSections = sections.length;
const animationDuration = 800;
const threshold = 30;
const swipeThreshold = 60;

let currentSection = 0;
let isAnimating = false;
let scrollLocked = false;

const updateCartIconColor = () => {
    if (cartIcon) {
        if (currentSection === 2) {
            cartIcon.classList.add('cart-black');
        } else {
            cartIcon.classList.remove('cart-black');
        }
    }
};

const updateSections = () => {
    sections.forEach((sec, i) => {
        const y = i < currentSection ? -100 : 0;
        sec.style.transform = `translateY(${y}%)`;
    });
};

const scrollPage = (dir) => {
    if (isAnimating || scrollLocked) return;

    let nextSection = currentSection;

    if (dir === 'down' && currentSection < totalSections - 1) {
        nextSection++;
    } else if (dir === 'up' && currentSection > 0) {
        nextSection--;
    } else {
        return;
    }

    currentSection = nextSection;
    isAnimating = true;
    scrollLocked = true;
    
    updateCartIconColor(); 
    updateSections();

    setTimeout(() => {
        isAnimating = false;
        scrollLocked = false;
    }, animationDuration + 50);
};

updateSections();
updateCartIconColor();

// NEW: Event listener for the Hamburger Icon to slide the menu
if (hamburgerIcon && navigationBar) {
    hamburgerIcon.addEventListener('click', () => {
        navigationBar.classList.toggle('mobile-menu-active');
        // Optional: Add a class to the body to prevent scrolling the background when the menu is open
        document.body.classList.toggle('no-scroll');
    });
}

// NEW: Event listeners for Mobile Dropdown Menu Toggles (to expand/collapse)
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        // Only run this menu logic on mobile screens (below or equal to 1000px)
        if (window.innerWidth <= 1000) {
            
            // Prevent default navigation for dropdown links
            e.preventDefault(); 
            
            // Get the immediate parent list item (either .dropdown or .dropdown-sub)
            const parentItem = this.closest('.dropdown, .dropdown-sub');
            
            // Check if the current item is already expanded
            const isExpanded = parentItem.classList.contains('nav-link-expanded');

            // Find all other open menus at the same level and close them (accordion effect)
            parentItem.parentElement.querySelectorAll('.nav-link-expanded').forEach(item => {
                 // Check if the item has the class and is NOT the current item
                if (item.classList.contains('dropdown') || item.classList.contains('dropdown-sub')) {
                    item.classList.remove('nav-link-expanded');
                }
            });
            
            // If the item was not already expanded, expand it now
            if (!isExpanded) {
                 parentItem.classList.add('nav-link-expanded');
            }
        }
    });
});


sections.forEach((sec, index) => {
    const content = sec.querySelector('.content');
    let extraScroll = 0;
    let startY = 0;

    content.addEventListener(
        'wheel',
        (e) => {
            if (isAnimating || index !== currentSection) return;

            const scrollTop = content.scrollTop;
            const scrollHeight = content.scrollHeight;
            const clientHeight = content.clientHeight;

            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
            const atTop = scrollTop <= 1;

            if ((atBottom && e.deltaY > 0) || (atTop && e.deltaY < 0)) {
                e.preventDefault();
                extraScroll += Math.abs(e.deltaY);

                if (extraScroll >= threshold) {
                    scrollPage(e.deltaY > 0 ? 'down' : 'up');
                    extraScroll = 0;
                }
            } else {
                extraScroll = 0;
            }
        },
        { passive: false }
    );

    content.addEventListener(
        'touchstart',
        (e) => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
                extraScroll = 0;
            }
        },
        { passive: true }
    );

    content.addEventListener(
        'touchmove',
        (e) => {
            if (isAnimating || index !== currentSection) return;

            const currentY = e.touches[0].clientY;
            const delta = startY - currentY;

            const scrollTop = content.scrollTop;
            const scrollHeight = content.scrollHeight;
            const clientHeight = content.clientHeight;

            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
            const atTop = scrollTop <= 1;

            if ((atBottom && delta > 0) || (atTop && delta < 0)) {
                e.preventDefault();
                extraScroll += Math.abs(delta);

                if (extraScroll >= swipeThreshold) {
                    scrollPage(delta > 0 ? 'down' : 'up');
                    extraScroll = 0;
                }
            } else {
                extraScroll = 0;
            }

            startY = currentY;
        },
        { passive: false }
    );
});