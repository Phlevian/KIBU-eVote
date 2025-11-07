// KIBU Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
});

function initDashboard() {
    // Initialize all dashboard components
    initCountdownTimer();
    initMobileMenu();
    initCardInteractions();
    initNotificationSystem();
    initVotingActions();
}

// Countdown Timer Functionality
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown-timer');
    
    // Set the target date (2 days from now for demo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(14, 32, 45, 0);
    
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = targetDate - now;
        
        if (timeRemaining <= 0) {
            countdownElement.textContent = "VOTING ENDED";
            return;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${days} days ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
        
        // Update menu icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuBtn && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
}

// Card Interactions and Animations
function initCardInteractions() {
    // Add hover effects to all interactive cards
    const interactiveCards = document.querySelectorAll('.election-card, .action-card, .stat-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.card-button, .cta-button, .action-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Notification System
function initNotificationSystem() {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationBadge = document.querySelector('.notification-badge');
    
    notificationBell.addEventListener('click', function() {
        // Show notification popup (simulated)
        showNotificationPopup();
        
        // Clear notification badge
        notificationBadge.style.display = 'none';
        
        // Add animation
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

function showNotificationPopup() {
    // Create notification popup
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        padding: 1.5rem;
        z-index: 1000;
        max-width: 300px;
        animation: slideDown 0.3s ease;
    `;
    
    popup.innerHTML = `
        <h3>Notifications (3)</h3>
        <div class="notification-list">
            <div class="notification-item">
                <div class="notification-icon">🗳</div>
                <div class="notification-content">
                    <strong>Student Council Voting</strong>
                    <p>Don't forget to vote! Ends in 2 days</p>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">📊</div>
                <div class="notification-content">
                    <strong>Vote Verified</strong>
                    <p>Your vote has been confirmed on blockchain</p>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">🎉</div>
                <div class="notification-content">
                    <strong>New Election</strong>
                    <p>Sports Captain elections starting Monday</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification-item {
            display: flex;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .notification-item:last-child {
            border-bottom: none;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            width: 30px;
            text-align: center;
        }
        
        .notification-content strong {
            display: block;
            margin-bottom: 2px;
            color: #1A237E;
        }
        
        .notification-content p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
    
    // Remove popup when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && e.target !== document.querySelector('.notification-bell')) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

// Voting Actions
function initVotingActions() {
    // Handle vote now buttons
    const voteButtons = document.querySelectorAll('.card-button.primary');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.election-card');
            const electionName = card.querySelector('.card-title').textContent;
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Redirecting...';
            this.disabled = true;
            
            // Simulate navigation delay
            setTimeout(() => {
                showSuccessMessage(`Redirecting to ${electionName} voting...`);
                // In real app: window.location.href = 'voting.html';
                
                // Reset button after delay
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
    
    // Handle action cards
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('h3').textContent;
            
            // Add click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle different actions
            switch(action) {
                case 'Verify My Vote':
                    showVerificationModal();
                    break;
                case 'Get QR Code':
                    showQRCodeModal();
                    break;
                case 'Notifications':
                    // Already handled by notification bell
                    break;
                case 'Contact Support':
                    window.location.href = 'mailto:support@kibu.ac.ke';
                    break;
            }
        });
    });
}

// Success Message System
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        animation: slideInDown 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Modal Systems
function showVerificationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            animation: scaleIn 0.3s ease;
        ">
            <h2>Vote Verification</h2>
            <p>Your votes are securely recorded on the blockchain. Here's your verification:</p>
            
            <div class="verification-details" style="
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 10px;
                margin: 1.5rem 0;
                font-family: monospace;
            ">
                <div><strong>Transaction ID:</strong> 0x7d9e...c4a2</div>
                <div><strong>Block:</strong> #184729</div>
                <div><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
                <div><strong>Status:</strong> <span style="color: #4CAF50;">Confirmed ✓</span></div>
            </div>
            
            <button class="close-modal" style="
                background: #0080FF;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showQRCodeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 300px;
            width: 90%;
            text-align: center;
            animation: scaleIn 0.3s ease;
        ">
            <h2>Quick Vote QR Code</h2>
            <p>Scan this code with your phone to vote quickly:</p>
            
            <div class="qr-placeholder" style="
                background: #f8f9fa;
                padding: 2rem;
                border-radius: 10px;
                margin: 1.5rem 0;
                font-size: 4rem;
            ">
                📱
            </div>
            
            <p style="font-size: 0.9rem; color: #666;">Open KIBU-eVote app and scan this code</p>
            
            <button class="close-modal" style="
                background: #0080FF;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                margin-top: 1rem;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add CSS for animations
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(dashboardStyles);

// Initialize real-time data updates
function initRealTimeUpdates() {
    // Simulate real-time vote count updates
    setInterval(() => {
        const voteCountElement = document.querySelector('.welcome-stats .stat-number');
        if (voteCountElement) {
            const currentCount = parseInt(voteCountElement.textContent.replace(',', ''));
            const newCount = currentCount + Math.floor(Math.random() * 10);
            voteCountElement.textContent = newCount.toLocaleString();
        }
        
        // Update today's votes in system status
        const todayVotesElement = document.querySelector('.system-status-card .status-item:last-child span');
        if (todayVotesElement && todayVotesElement.textContent.includes('Today\'s votes')) {
            const currentVotes = parseInt(todayVotesElement.textContent.match(/\d+/)[0]);
            const newVotes = currentVotes + Math.floor(Math.random() * 5);
            todayVotesElement.textContent = `Today's votes: ${newVotes.toLocaleString()}`;
        }
    }, 10000); // Update every 10 seconds
}

// Initialize real-time updates
initRealTimeUpdates();