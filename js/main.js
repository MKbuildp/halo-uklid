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
    // NEODSTRAŇUJEME preventDefault() - necháme Formspree fungovat přirozeně
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Nastavení loading stavu
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Odesílám...';
    form.classList.add('loading');
    
    // Necháme Formspree odeslat formulář přirozeně
    // Po odeslání se stránka přesměruje podle _next parametru
    // nebo zobrazí Formspree potvrzení
    
    // Po 3 sekundách obnovíme tlačítko (pro případ, že by se něco pokazilo)
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Odeslat poptávku';
        form.classList.remove('loading');
    }, 3000);
    
    // Nastavíme _replyto na email zákazníka
    const emailField = form.querySelector('input[name="email"]');
    const replytoField = form.querySelector('input[name="_replyto"]');
    if (emailField && replytoField) {
        replytoField.value = emailField.value;
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
    const imagePreview = document.getElementById('image-preview');
    
    if (!imageInput || !imagePreview) return;
    
    imageInput.addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        
        // Vyčistit předchozí náhled
        imagePreview.innerHTML = '';
        
        files.forEach((file, index) => {
            // Kontrola velikosti (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`Soubor ${file.name} je příliš velký. Maximální velikost je 5MB.`, 'error');
                return;
            }
            
            // Kontrola typu
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                showNotification(`Soubor ${file.name} není podporovaný obrázek. Použijte JPEG, PNG nebo WebP.`, 'error');
                return;
            }
            
            // Vytvořit náhled
            createImagePreviewItem(file, index);
            
            // Automaticky nahrát na ImgBB
            uploadImageToImgBB(file, index);
        });
    });
}

// Vytvořit náhled obrázku
function createImagePreviewItem(file, index) {
    const imagePreview = document.getElementById('image-preview');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = function() {
            previewItem.remove();
            removeImageLinkFromForm(index);
        };
        
        const status = document.createElement('div');
        status.className = 'upload-status';
        status.textContent = 'Nahrávám...';
        
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewItem.appendChild(status);
        imagePreview.appendChild(previewItem);
    };
    
    reader.readAsDataURL(file);
}

// Upload obrázku na ImgBB
async function uploadImageToImgBB(file, index) {
    // ImgBB API key - zadarmo (max 32MB/měsíc)
    const IMGBB_API_KEY = '221ec6ecd092057753cf4f7884b1f21d';
    
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Chyba při nahrávání obrázku');
        }
        
        const result = await response.json();
        const imageUrl = result.data.url;
        
        // Aktualizovat status
        updateImageUploadStatus(index, 'success', imageUrl);
        
        // Přidat link do formuláře
        addImageLinkToForm(imageUrl);
        
        // Zobrazit notifikaci s linkem
        showNotification(`Obrázek ${file.name} byl úspěšně nahrán!`, 'success');
        
    } catch (error) {
        console.error('Chyba při nahrávání obrázku:', error);
        updateImageUploadStatus(index, 'error');
        showNotification(`Chyba při nahrávání ${file.name}`, 'error');
    }
}

// Aktualizovat status nahrávání
function updateImageUploadStatus(index, status, imageUrl = '') {
    const statusElement = document.querySelector(`[data-index="${index}"] .upload-status`);
    if (statusElement) {
        if (status === 'success') {
            statusElement.textContent = '✓ Nahrané';
            statusElement.style.background = 'rgba(16, 185, 129, 0.9)';
        } else {
            statusElement.textContent = '✗ Chyba';
            statusElement.style.background = 'rgba(239, 68, 68, 0.9)';
        }
    }
}

// Přidat link obrázku do formuláře
function addImageLinkToForm(imageUrl) {
    const imageLinksField = document.getElementById('image_links');
    const nahraneObrazkyField = document.getElementById('nahrane_obrazky');
    
    if (imageLinksField && nahraneObrazkyField) {
        const currentLinks = imageLinksField.value ? imageLinksField.value.split(',') : [];
        if (!currentLinks.includes(imageUrl)) {
            currentLinks.push(imageUrl);
            imageLinksField.value = currentLinks.join(',');
            
            // Aktualizovat textové pole pro Formspree
            if (currentLinks.length === 1) {
                nahraneObrazkyField.value = `Nahrané obrázky: ${imageUrl}`;
            } else {
                nahraneObrazkyField.value = `Nahrané obrázky: ${currentLinks.join(', ')}`;
            }
        }
    }
}

// Odebrat link obrázku z formuláře
function removeImageLinkFromForm(index) {
    // Implementace pro odebrání linku při smazání náhledu
    // Pro jednoduchost zatím necháme všechny linky
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

