// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeVisitCounter();
    initializeClickTracking();
    initializeAnimations();
});

// Visit Counter
function initializeVisitCounter() {
    const visitCountKey = 'butterbear_visits';
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('butterbear_last_visit_date');
    let visitCount = parseInt(localStorage.getItem(visitCountKey)) || 0;

    // Reset counter if it's a new day
    if (lastVisitDate !== today) {
        visitCount = 1;
        localStorage.setItem('butterbear_last_visit_date', today);
    } else {
        visitCount++;
    }

    localStorage.setItem(visitCountKey, visitCount);
    document.getElementById('visitCount').textContent = visitCount;
}

// Click Tracking for Analytics
function initializeClickTracking() {
    const links = document.querySelectorAll('.link-button');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.textContent.trim();
            const href = this.href;
            
            // Track click (you could send this to analytics)
            trackLinkClick(platform, href);
            
            // Add visual feedback
            addClickFeedback(this);
        });
    });
}

function trackLinkClick(platform, href) {
    // Store click data in localStorage for analytics
    const clicksKey = 'butterbear_clicks';
    let clicks = JSON.parse(localStorage.getItem(clicksKey)) || {};
    
    if (!clicks[platform]) {
        clicks[platform] = 0;
    }
    clicks[platform]++;
    
    localStorage.setItem(clicksKey, JSON.stringify(clicks));
    
    // You could send this to a server here
    // Example: sendAnalyticsData({platform, timestamp: new Date()});
}

function addClickFeedback(element) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to stylesheet dynamically
function initializeAnimations() {
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(20);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth scroll behavior
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

// Add touch device optimizations
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    
    // Adjust hover effects for touch
    document.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Optional: Page visibility tracking
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('User left Butterbear biolink');
    } else {
        console.log('User returned to Butterbear biolink');
    }
});

// Optional: Detect offline/online status
window.addEventListener('offline', function() {
    console.warn('You are offline');
    // Could show a notification here
});

window.addEventListener('online', function() {
    console.log('You are back online');
});

// Utility function for sending analytics data (if backend is available)
function sendAnalyticsData(data) {
    // Example implementation - uncomment and modify as needed
    /*
    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        })
    }).catch(err => console.log('Analytics tracking failed:', err));
    */
}

// Optional: Share functionality
function addShareButtons() {
    const currentUrl = window.location.href;
    const shareData = {
        title: 'Butterbear - Biolink',
        text: 'Check out Butterbear on all platforms!',
        url: currentUrl
    };
    
    // Modern Web Share API
    if (navigator.share) {
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Share';
        shareButton.addEventListener('click', async () => {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        });
    }
}

// Initialize share buttons if needed
// addShareButtons();
