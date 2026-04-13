/**
 * Visvesvaraya Bhawan (Hostel 10) - NIT Kurukshetra
 * Core Website Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 800);
    });

    // --- 2. Animations (AOS) ---
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // --- 3. Navbar Effects ---
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            scrollBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            scrollBtn.classList.remove('show');
        }

        // Active Link Highlight
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- 4. Dark Mode ---
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // --- 5. Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const count = +entry.target.innerText;
                const speed = 100; // lower is slower

                const updateCount = () => {
                    const current = +entry.target.innerText;
                    const increment = target / speed;

                    if (current < target) {
                        entry.target.innerText = Math.ceil(current + increment);
                        setTimeout(updateCount, 1);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- 6. Modal Logic ---
    const loginModal = document.getElementById('login-modal');
    const loginTrigger = document.getElementById('login-trigger');
    const closeModal = document.querySelector('.close-modal');

    loginTrigger.addEventListener('click', () => loginModal.style.display = 'flex');
    closeModal.addEventListener('click', () => loginModal.style.display = 'none');
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    // --- 7. Dummy Login Persistence ---
    const loginForm = document.getElementById('login-form');
    const mainContent = document.getElementById('main-content');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameDisplay = document.getElementById('user-display-name');

    const checkLoginStatus = () => {
        const user = localStorage.getItem('hostelUser');
        if (user) {
            mainContent.style.display = 'none';
            dashboard.style.display = 'block';
            loginTrigger.innerText = 'Go to Dashboard';
            userNameDisplay.innerText = user;
        } else {
            mainContent.style.display = 'block';
            dashboard.style.display = 'none';
            loginTrigger.innerText = 'Login';
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('login-id').value;
        const pass = document.getElementById('login-pass').value;

        // Dummy auth logic
        if (id && pass) {
            localStorage.setItem('hostelUser', id);
            loginModal.style.display = 'none';
            checkLoginStatus();
            alert(`Welcome back, ${id}!`);
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('hostelUser');
        checkLoginStatus();
        window.scrollTo(0,0);
    });

    checkLoginStatus();

    // Password Toggle
    const togglePass = document.getElementById('toggle-password');
    const passInput = document.getElementById('login-pass');
    togglePass.addEventListener('click', () => {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        togglePass.classList.toggle('fa-eye-slash');
    });

    // --- 8. Leave Form Handling ---
    const leaveForm = document.getElementById('leave-form');
    const leaveSuccess = document.getElementById('leave-success');

    leaveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic date validation
        const fromDate = new Date(document.getElementById('from-date').value);
        const toDate = new Date(document.getElementById('to-date').value);

        if (toDate < fromDate) {
            alert("Error: 'To Date' cannot be before 'From Date'.");
            return;
        }

        // Store data in localStorage (simulating backend)
        const leaveData = {
            name: document.getElementById('student-name').value,
            room: document.getElementById('room-no').value,
            reason: document.getElementById('leave-reason').value,
            from: fromDate,
            to: toDate,
            status: 'Pending'
        };

        const existingLeaves = JSON.parse(localStorage.getItem('myLeaves') || '[]');
        existingLeaves.push(leaveData);
        localStorage.setItem('myLeaves', JSON.stringify(existingLeaves));

        leaveForm.style.display = 'none';
        leaveSuccess.style.display = 'block';

        setTimeout(() => {
            leaveForm.reset();
            leaveForm.style.display = 'block';
            leaveSuccess.style.display = 'none';
        }, 5000);
    });

    // --- 9. Smooth Scroll Enhancement ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
