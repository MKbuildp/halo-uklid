/**
 * Halo Úklid - Hlavní JavaScript soubor
 * Obsahuje funkcionalitu pro mobilní menu, formuláře a interaktivní prvky
 */

// ===== DOM LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== HLAVNÍ INICIALIZACE =====
function initializeApp() {
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeImageUpload();
    initializeAnimations();
    initializeAccessibility();
}

// ===== MOBILNÍ MENU =====
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Přepínání mobilního menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Zavření menu po kliknutí na odkaz
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Zavření menu po kliknutí mimo
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Zavření menu při změně orientace
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }, 100);
    });
}

// ===== Plynulé scrollování =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ZPRACOVÁNÍ FORMULÁŘŮ =====
function initializeFormHandling() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Validace formulářů v reálném čase
    initializeFormValidation();
}

// ===== REZERVAČNÍ FORMULÁŘ =====
async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        // Nastavení loading stavu
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Odesílám...';
        form.classList.add('loading');
        
        // Získání dat z formuláře
        const formData = new FormData(form);
        const bookingData = {
            services: formData.getAll('services'),
            address: formData.get('address'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            images: formData.getAll('images')
        };
        
        // Validace dat byla odstraněna, spoléháme na HTML5 `required` atribut
        
        // Simulace odeslání (nahraďte skutečným API voláním)
        await simulateApiCall(bookingData);
        
        // Úspěch
        showNotification('Rezervace byla úspěšně odeslána! Budeme vás kontaktovat.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Chyba při odesílání rezervace:', error);
        showNotification(error.message || 'Došlo k chybě při odesílání rezervace.', 'error');
    } finally {
        // Obnovení původního stavu
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        form.classList.remove('loading');
    }
}

// ===== KONTAKTNÍ FORMULÁŘ =====
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Odesílám...';
        
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name') || form.querySelector('input[type="text"]').value,
            email: formData.get('email') || form.querySelector('input[type="email"]').value,
            message: formData.get('message') || form.querySelector('textarea').value
        };
        
        if (!validateContactData(contactData)) {
            throw new Error('Prosím vyplňte všechna povinná pole');
        }
        
        await simulateApiCall(contactData);
        
        showNotification('Zpráva byla úspěšně odeslána! Odpovíme vás co nejdříve.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Chyba při odesílání zprávy:', error);
        showNotification(error.message || 'Došlo k chybě při odesílání zprávy.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// ===== VALIDACE FORMULÁŘŮ =====
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Základní validace
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Toto pole je povinné';
    }
    
    // Email validace
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Zadejte platný email';
        }
    }
    
    // Telefon validace
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Zadejte platné telefonní číslo';
        }
    }
    
    // Datum validace
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Datum nemůže být v minulosti';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: var(--danger-color); font-size: 0.875rem; margin-top: 0.25rem;';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--danger-color)';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// ===== VALIDACE DAT (ODSTRANĚNO) =====

// ===== UPLOAD OBRÁZKŮ =====
function initializeImageUpload() {
    const imageInput = document.getElementById('images');
    
    if (!imageInput) return;
    
    imageInput.addEventListener('change', function(event) {
        const files = event.target.files;
        handleImageUpload(files);
    });
}

function handleImageUpload(files) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    for (let file of files) {
        // Kontrola velikosti
        if (file.size > maxSize) {
            showNotification(`Soubor ${file.name} je příliš velký. Maximální velikost je 5MB.`, 'error');
            continue;
        }
        
        // Kontrola typu
        if (!allowedTypes.includes(file.type)) {
            showNotification(`Soubor ${file.name} není podporovaný obrázek. Použijte JPEG, PNG nebo WebP.`, 'error');
            continue;
        }
        
        // Náhled obrázku
        createImagePreview(file);
    }
}

function createImagePreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview';
        previewContainer.style.cssText = 'display: inline-block; margin: 0.5rem; position: relative;';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = 'width: 100px; height: 100px; object-fit: cover; border-radius: 8px;';
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = 'position: absolute; top: -8px; right: -8px; background: var(--danger-color); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 14px;';
        removeBtn.onclick = function() {
            previewContainer.remove();
        };
        
        previewContainer.appendChild(img);
        previewContainer.appendChild(removeBtn);
        
        // Přidání náhledu do formuláře
        const imageInput = document.getElementById('images');
        const parent = imageInput.parentNode;
        parent.appendChild(previewContainer);
    };
    
    reader.readAsDataURL(file);
}

// ===== ANIMACE =====
function initializeAnimations() {
    // Intersection Observer pro animace při scrollování
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Pozorování elementů pro animace
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== PŘÍSTUPNOST =====
function initializeAccessibility() {
    // Klávesové zkratky
    document.addEventListener('keydown', function(event) {
        // ESC pro zavření mobilního menu
        if (event.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
        
        // Enter pro odeslání formulářů
        if (event.key === 'Enter' && event.ctrlKey) {
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                activeForm.requestSubmit();
            }
        }
    });
    
    // ARIA labels pro mobilní menu
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Otevřít/zavřít menu');
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// ===== NOTIFIKACE =====
function showNotification(message, type = 'info') {
    // Odstranění existujících notifikací
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styly notifikace
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Barvy podle typu
    switch (type) {
        case 'success':
            notification.style.backgroundColor = 'var(--success-color)';
            break;
        case 'error':
            notification.style.backgroundColor = 'var(--danger-color)';
            break;
        case 'warning':
            notification.style.backgroundColor = 'var(--accent-color)';
            break;
        default:
            notification.style.backgroundColor = 'var(--primary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animace vstupu
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Automatické odstranění
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Možnost zavřít kliknutím
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    });
}

// ===== POMOCNÉ FUNKCE =====
function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
        // Simulace API volání s 2 sekundovým zpožděním
        setTimeout(() => {
            // Simulace úspěchu (90% šance)
            if (Math.random() > 0.1) {
                resolve({ success: true, message: 'Data byla úspěšně odeslána' });
            } else {
                reject(new Error('Simulovaná chyba serveru'));
            }
        }, 2000);
    });
}

// ===== PERFORMANCE OPTIMALIZACE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimalizace scroll eventu
const optimizedScrollHandler = debounce(function() {
    // Zde můžete přidat logiku pro scroll animace
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== SERVICE WORKER REGISTRACE (pro PWA funkcionalitu) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Registrace service workera pro offline funkcionalitu
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// ===== EXPORT PRO MODULOVÝ SYSTÉM =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        validateField
    };
}

