// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect to sections
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-5px)';
        });

        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateY(0)';
        });
    });

    // Add current year to footer copyright
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Add typing effect to header
    const headerText = document.querySelector('.header h1');
    if (headerText) {
        const text = headerText.textContent;
        headerText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                headerText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        typeWriter();
    }

    // Autoplay video when scrolled into view
    const aboutVideo = document.getElementById('about-video');
    if (aboutVideo) {
        let hasPlayed = false;
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasPlayed) {
                    aboutVideo.play();
                    hasPlayed = true;
                    observer.unobserve(aboutVideo);
                }
            });
        }, { threshold: 0.5 });
        videoObserver.observe(aboutVideo);
    }

    // Phone number validation with AbstractAPI
    const phoneApiKey = "1d484b5ad1a742c7a269957075669581";
    const phoneInput = document.getElementById('phone');
    const contactError = document.getElementById('contactError');
    let phoneTimeout;

    if (phoneInput && contactError) {
        phoneInput.addEventListener('input', function() {
            clearTimeout(phoneTimeout);
            const number = phoneInput.value.trim();
            if (!number) {
                contactError.textContent = '';
                return;
            }
            contactError.textContent = 'Checking...';
            contactError.style.color = '#888';
            phoneTimeout = setTimeout(() => {
                fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${phoneApiKey}&phone=${encodeURIComponent(number)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.valid) {
                            contactError.textContent = `✔ Valid number (${data.location || "Unknown location"})`;
                            contactError.style.color = "green";
                        } else {
                            contactError.textContent = "✘ Invalid number";
                            contactError.style.color = "red";
                        }
                    })
                    .catch(() => {
                        contactError.textContent = "Error checking number.";
                        contactError.style.color = "red";
                    });
            }, 600);
        });
    }

    // Email validation with AbstractAPI
    const emailApiKey = "fd9c941204004a5385114acea4e0d40c";
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    let emailTimeout;

    if (emailInput && emailError) {
        emailInput.addEventListener('input', function() {
            clearTimeout(emailTimeout);
            const email = emailInput.value.trim();
            if (!email) {
                emailError.textContent = '';
                return;
            }
            emailError.textContent = 'Checking...';
            emailError.style.color = '#888';
            emailTimeout = setTimeout(() => {
                fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${emailApiKey}&email=${encodeURIComponent(email)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.deliverability === 'DELIVERABLE') {
                            emailError.textContent = `✔ Valid email (${data.is_valid_format.value ? 'Format OK' : 'Format Issue'})`;
                            emailError.style.color = "green";
                        } else {
                            emailError.textContent = "✘ Invalid or undeliverable email";
                            emailError.style.color = "red";
                        }
                    })
                    .catch(() => {
                        emailError.textContent = "Error checking email.";
                        emailError.style.color = "red";
                    });
            }, 600);
        });
    }
}); 