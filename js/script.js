document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        
        // Toggle icon
        const icon = navToggle.querySelector('i');
        if (nav.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Sticky Header Effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            header.style.padding = "10px 0";
            header.style.backgroundColor = "rgba(252, 251, 249, 0.98)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
            header.style.padding = "20px 0";
            header.style.backgroundColor = "rgba(252, 251, 249, 0.95)";
        }
    });
    
    // Smooth scrolling for navigation links (polyfill for older browsers if needed, but mainly for consistent offset)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Load Services and Gallery
    loadServices();
    loadGallery();

    async function loadServices() {
        try {
            const response = await fetch('data/services.json');
            const services = await response.json();
            const servicesWrapper = document.querySelector('.services-wrapper');
            
            servicesWrapper.innerHTML = services.map(service => `
                <div class="swiper-slide">
                    <div class="service-card">
                        <div class="service-img-container">
                            <img src="${service.image}" alt="${service.title}" class="service-img">
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <span class="price">${service.price}</span>
                    </div>
                </div>
            `).join('');

            // Initialize Swiper
            const swiper = new Swiper('.services-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }
            });


            // Populate Booking Dropdown
            const serviceSelect = document.getElementById('service');
            const bookingForm = document.getElementById('booking-form');

            if (serviceSelect) {
                services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.title;
                    option.textContent = service.title;
                    serviceSelect.appendChild(option);
                });
            }

            // WhatsApp Booking Logic
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const name = document.getElementById('name').value;
                    const phone = document.getElementById('phone').value;
                    const service = document.getElementById('service').value;
                    const date = document.getElementById('date').value;
                    const time = document.getElementById('time').value;

                    const message = `Hello \nNew booking request:\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}`;
                    const whatsappNumber = '254714734883'; // Verified business number
                    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                    window.open(url, '_blank');
                });
            }

        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    async function loadGallery() {
        try {
            const response = await fetch('data/gallery.json');
            const gallery = await response.json();
            const galleryGrid = document.querySelector('.gallery-grid');

            galleryGrid.innerHTML = gallery.map(item => `
                <div class="gallery-item reveal">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            `).join('');

            // Observe new elements
            document.querySelectorAll('.gallery-grid .reveal').forEach(el => revealObserver.observe(el));
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    }
});
