// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a navigation link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Contact Form Validation & Submission Handler
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function setError(element, isError) {
    const formGroup = element.parentElement;
    if (isError) {
        formGroup.classList.add('error');
    } else {
        formGroup.classList.remove('error');
    }
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (nameInput.value.trim() === '') {
        setError(nameInput, true);
        isValid = false;
    } else {
        setError(nameInput, false);
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
        setError(emailInput, true);
        isValid = false;
    } else {
        setError(emailInput, false);
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
        setError(messageInput, true);
        isValid = false;
    } else {
        setError(messageInput, false);
    }

    // If all inputs pass validation
    if (isValid) {
        formSuccess.style.display = 'block';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    } else {
        formSuccess.style.display = 'none';
    }
});

// Resume Download Handler
const downloadResumeBtn = document.getElementById('downloadResumeBtn');

if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const fileUrl = downloadResumeBtn.getAttribute('href') || 'ChandiraCV.pdf';
        const fileName = downloadResumeBtn.getAttribute('download') || 'ChandiraCV.pdf';

        function downloadBlob(blob, name) {
            const blobUrl = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobUrl;
            tempLink.download = name;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
        }

        // 1. When served over HTTP/HTTPS (e.g. Live Server, localhost, GitHub Pages, or web hosting):
        // Dynamically fetch the current file directly from the folder with nocache to force instant download
        if (window.location.protocol.startsWith('http')) {
            try {
                const response = await fetch(fileUrl + '?nocache=' + Date.now());
                if (!response.ok) throw new Error('File not found');
                const fileBlob = await response.blob();
                const octetBlob = new Blob([fileBlob], { type: 'application/octet-stream' });
                downloadBlob(octetBlob, fileName);
                return;
            } catch (err) {
                console.warn('Live fetch failed, trying local fallback:', err);
            }
        }

        // 2. When opened locally via file:// (or if fetch failed):
        // Convert the current file data to a binary Blob to trigger an instant browser download
        if (window.CURRENT_RESUME && window.CURRENT_RESUME.base64) {
            try {
                const byteCharacters = atob(window.CURRENT_RESUME.base64);
                const byteArrays = [];
                const sliceSize = 1024;
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }
                const octetBlob = new Blob(byteArrays, { type: 'application/octet-stream' });
                downloadBlob(octetBlob, window.CURRENT_RESUME.fileName || fileName);
                return;
            } catch (err) {
                console.error('Base64 conversion failed:', err);
            }
        }

        // 3. Fallback: navigate directly to file
        window.location.href = fileUrl;
    });
}