alert("The Website is partially developed")

const sections = document.querySelectorAll('.section');
const cartIcon = document.getElementById('Cart'); 

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