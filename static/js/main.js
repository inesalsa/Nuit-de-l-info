// NIRD Quest - JavaScript Principal

// Animations au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Animation des cartes au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observer toutes les cartes
    document.querySelectorAll('.card, .solution-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // Animation des badges de score
    document.querySelectorAll('.score-badge').forEach((badge, index) => {
        badge.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
        badge.style.opacity = '0';
    });
    
    // Effet hover sur les cartes de solutions
    document.querySelectorAll('.solution-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scroll pour les ancres
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
    
    // Animation du logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});

// Fonction pour afficher une notification toast
function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = type === 'success' ? '✅' : 
                 type === 'error' ? '❌' : 
                 type === 'warning' ? '⚠️' : 'ℹ️';
    
    toast.innerHTML = `<strong>${icon}</strong> ${message}`;
    
    // Couleur selon le type
    if (type === 'success') {
        toast.style.borderColor = '#50C878';
    } else if (type === 'error') {
        toast.style.borderColor = '#E74C3C';
    } else if (type === 'warning') {
        toast.style.borderColor = '#F39C12';
    }
    
    document.body.appendChild(toast);
    
    // Retirer après la durée
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Copier dans le presse-papier
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Copié dans le presse-papier !', 'success');
            })
            .catch(() => {
                showNotification('Erreur lors de la copie', 'error');
            });
    } else {
        // Fallback pour les navigateurs anciens
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification('Copié dans le presse-papier !', 'success');
        } catch (err) {
            showNotification('Erreur lors de la copie', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// Détecter le thème système (pour une future implémentation dark/light mode)
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

// Animation des chiffres qui s'incrémentent
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (target - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Observer pour animer les chiffres au scroll
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseInt(element.textContent);
            if (!isNaN(target)) {
                animateNumber(element, target);
                numberObserver.unobserve(element);
            }
        }
    });
}, { threshold: 0.5 });

// Observer tous les éléments avec classe .score-value
document.querySelectorAll('.score-value').forEach(el => {
    numberObserver.observe(el);
});

// Effet parallaxe léger sur les SVG
document.addEventListener('mousemove', (e) => {
    const svgs = document.querySelectorAll('svg');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    svgs.forEach(svg => {
        if (svg.closest('.hero')) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            svg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});

// Gestion des erreurs de chargement d'images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image non chargée:', this.src);
    });
});

// Log pour debug (à retirer en production)
console.log('🌟 NIRD Quest chargé avec succès !');
console.log('💻 Projet 100% libre et open source');
console.log('🌍 Pour un numérique inclusif, responsable et durable');

// Easter egg : Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Easter Egg ! Vous avez trouvé le code Konami ! 🎮', 'success', 5000);
        document.body.style.animation = 'pulse 0.5s ease-in-out 3';
        konamiCode = [];
    }
});

// Détection de la connexion pour les appels API
window.addEventListener('online', () => {
    showNotification('Connexion rétablie', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Connexion perdue - Certaines fonctionnalités peuvent ne pas fonctionner', 'warning', 5000);
});

// Export des fonctions utiles
window.nirdQuest = {
    showNotification,
    copyToClipboard,
    animateNumber
};
