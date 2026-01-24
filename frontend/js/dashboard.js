// KIBU Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
});

function initDashboard() {
    // First check authentication
    checkAuthentication();
    
    // Then initialize all dashboard components
    initUserProfile();
    initCountdownTimer();
    initMobileMenu();
    initCardInteractions();
    initNotificationSystem();
    initVotingActions();
    initRealTimeUpdates();
}

// Authentication Check
function checkAuthentication() {
    const token = localStorage.getItem('kibu_token');
    const userData = localStorage.getItem('kibu_user');
    
    if (!token || !userData) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    return JSON.parse(userData);
}
// Add this function to dashboard.js
function initProfileCardNavigation() {
    const studentCard = document.getElementById('student-card');
    const userInfo = document.querySelector('.user-info');
    
    // Make student card clickable
    if (studentCard) {
        studentCard.style.cursor = 'pointer';
        studentCard.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
        
        // Add hover effect
        studentCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        studentCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    }
    
    // Make header user info clickable too
    if (userInfo) {
        userInfo.style.cursor = 'pointer';
        userInfo.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
        
        userInfo.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        });
        
        userInfo.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    }
}

// Load and Display User Profile
function initUserProfile() {
    const userData = checkAuthentication();
    
    if (!userData) {
        console.log('No user data found');
        return;
    }
    
    // Extract user information
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    const registrationNumber = userData.registrationNumber || '';
    const email = userData.email || '';
    const faculty = userData.faculty || '';
    const yearOfStudy = userData.yearOfStudy || '';
    const fullName = `${firstName} ${lastName}`;
    
    // Update header user info
    const userNameElement = document.getElementById('user-name');
    const userRegElement = document.getElementById('user-reg-number');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) userNameElement.textContent = fullName;
    if (userRegElement) userRegElement.textContent = registrationNumber || 'KIBU/---/--';
    
    // Get user initial for avatar
    const initial = getInitials(firstName, lastName);
    updateUserAvatar(initial, userAvatarElement);
    
    // Update sidebar student card
    const studentNameElement = document.getElementById('student-name');
    const studentFacultyElement = document.getElementById('student-faculty');
    const studentYearElement = document.getElementById('student-year');
    const studentAvatarElement = document.getElementById('student-avatar-img');
    
    if (studentNameElement) studentNameElement.textContent = fullName;
    if (studentFacultyElement) studentFacultyElement.textContent = faculty || '---';
    if (studentYearElement) studentYearElement.textContent = `Year ${yearOfStudy}` || 'Year --';
    
    // Update student avatar with initial
    updateUserAvatar(initial, studentAvatarElement);
    
    // Update welcome title with user's first name
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
        const currentHour = new Date().getHours();
        let greeting = '';
        
        if (currentHour < 12) greeting = 'Good morning';
        else if (currentHour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        welcomeTitle.textContent = `${greeting}, ${firstName}!`;
    }
    
    // Initialize logout functionality
    initLogout();

    initProfileCardNavigation();
    
    // Fetch additional user data from server if needed
    fetchUserDetails();
}

// Get user initials from name
function getInitials(firstName, lastName) {
    if (!firstName && !lastName) return 'U';
    
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    
    return firstInitial + lastInitial || 'U';
}

// Update user avatar with initial
function updateUserAvatar(initial, avatarElement) {
    if (!avatarElement) return;
    
    // Check if avatar has src attribute (image)
    if (avatarElement.hasAttribute('src')) {
        // If no avatar image exists, create a colored circle with initial
        avatarElement.style.display = 'none';
        
        // Create a div with initial
        const avatarContainer = avatarElement.parentElement;
        if (!avatarContainer.querySelector('.avatar-initial')) {
            const initialDiv = document.createElement('div');
            initialDiv.className = 'avatar-initial';
            initialDiv.textContent = initial;
            initialDiv.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
            `;
            avatarContainer.appendChild(initialDiv);
        }
    }
}

// Fetch additional user details from server
async function fetchUserDetails() {
    const token = localStorage.getItem('kibu_token');
    
    if (!token) return;
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data.student) {
                const student = data.data.student;
                
                // Update localStorage with complete user data
                localStorage.setItem('kibu_user', JSON.stringify(student));
                
                // Update UI with any additional fields
                updateAdditionalUserInfo(student);
            }
        }
    } catch (error) {
        console.log('Could not fetch additional user details:', error);
        // Silently fail - we already have basic info from localStorage
    }
}

// Update additional user information
function updateAdditionalUserInfo(student) {
    // Update course if available
    const courseElement = document.querySelector('.student-course');
    if (courseElement && student.course) {
        courseElement.textContent = student.course;
    }
    
    // Update phone if available
    const phoneElement = document.querySelector('.student-phone');
    if (phoneElement && student.phone) {
        phoneElement.textContent = student.phone;
    }
    
    // Update verification status
    const verificationElement = document.querySelector('.verification-status');
    if (verificationElement) {
        verificationElement.textContent = student.isVerified ? 'Verified ✓' : 'Not Verified';
        verificationElement.style.color = student.isVerified ? '#4CAF50' : '#FF9800';
    }
}

// Initialize Logout Functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Show confirmation
            if (confirm('Are you sure you want to logout?')) {
                const token = localStorage.getItem('kibu_token');
                
                try {
                    // Call logout API
                    const response = await fetch('http://localhost:5000/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    // Clear local storage regardless of API response
                    localStorage.removeItem('kibu_token');
                    localStorage.removeItem('kibu_user');
                    
                    // Redirect to login page
                    window.location.href = 'login.html';
                    
                } catch (error) {
                    // Even if API fails, clear local storage and redirect
                    localStorage.removeItem('kibu_token');
                    localStorage.removeItem('kibu_user');
                    window.location.href = 'login.html';
                }
            }
        });
    }
}

// Countdown Timer Functionality
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown-timer');
    
    if (!countdownElement) return;
    
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
    
    if (!mobileMenuBtn || !sidebar) return;
    
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
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
    
    if (!notificationBell || !notificationBadge) return;
    
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
        const clickHandler = function(e) {
            if (!popup.contains(e.target) && e.target !== document.querySelector('.notification-bell')) {
                popup.remove();
                document.removeEventListener('click', clickHandler);
            }
        };
        document.addEventListener('click', clickHandler);
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
            
            // Check if user is authenticated
            const token = localStorage.getItem('kibu_token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            
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
            
            // Check if user is authenticated
            const token = localStorage.getItem('kibu_token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            
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
    // Get user data for verification
    const userData = JSON.parse(localStorage.getItem('kibu_user') || '{}');
    const regNumber = userData.registrationNumber || '';
    
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
                <div><strong>Student ID:</strong> ${regNumber}</div>
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
    
    /* Avatar initial styles */
    .user-avatar .avatar-initial,
    .student-avatar .avatar-initial {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
    }
`;
document.head.appendChild(dashboardStyles);

// Initialize real-time data updates
function initRealTimeUpdates() {
    // Simulate real-time vote count updates
    setInterval(() => {
        const voteCountElement = document.querySelector('.welcome-stats .stat-number');
        if (voteCountElement) {
            const currentCount = parseInt(voteCountElement.textContent.replace(',', '')) || 0;
            const newCount = currentCount + Math.floor(Math.random() * 10);
            voteCountElement.textContent = newCount.toLocaleString();
        }
        
        // Update today's votes in system status
        const todayVotesElement = document.querySelector('.system-status-card .status-value');
        if (todayVotesElement) {
            const currentVotes = parseInt(todayVotesElement.textContent.replace(',', '')) || 8247;
            const newVotes = currentVotes + Math.floor(Math.random() * 5);
            todayVotesElement.textContent = newVotes.toLocaleString();
        }
        
        // Update sidebar stats
        const votesCountElement = document.getElementById('votes-count');
        if (votesCountElement) {
            const currentVotes = parseInt(votesCountElement.textContent) || 0;
            votesCountElement.textContent = (currentVotes + Math.floor(Math.random() * 3)).toString();
        }
        
        const participationElement = document.getElementById('participation-rate');
        if (participationElement) {
            const currentRate = parseFloat(participationElement.textContent) || 0;
            const newRate = Math.min(100, currentRate + Math.random() * 2).toFixed(1);
            participationElement.textContent = `${newRate}%`;
        }
        
    }, 10000); // Update every 10 seconds
    
    // Initialize with random data
    setTimeout(() => {
        // Set initial random values
        const voteCountElement = document.querySelector('.welcome-stats .stat-number');
        if (voteCountElement) {
            voteCountElement.textContent = (Math.floor(Math.random() * 100) + 50).toString();
        }
        
        const votesCountElement = document.getElementById('votes-count');
        if (votesCountElement) {
            votesCountElement.textContent = (Math.floor(Math.random() * 1000) + 500).toString();
        }
        
        const participationElement = document.getElementById('participation-rate');
        if (participationElement) {
            participationElement.textContent = `${(Math.random() * 30 + 65).toFixed(1)}%`;
        }
        
        // Update voting activity timeline
        updateVotingActivity();
        
        // Update deadlines timeline
        updateDeadlines();
        
        // Update statistics
        updateStatistics();
        
    }, 500);
}

// Update Voting Activity Timeline
function updateVotingActivity() {
    const timeline = document.getElementById('voting-timeline');
    if (!timeline) return;
    
    const activities = [
        {
            time: 'Today, 10:30 AM',
            action: 'Voted for Student Council President',
            icon: 'fas fa-vote-yea',
            color: '#4CAF50'
        },
        {
            time: 'Yesterday, 2:15 PM',
            action: 'Verified your vote on blockchain',
            icon: 'fas fa-shield-alt',
            color: '#2196F3'
        },
        {
            time: '3 days ago',
            action: 'Participated in Club Elections',
            icon: 'fas fa-users',
            color: '#9C27B0'
        },
        {
            time: '1 week ago',
            action: 'Completed profile verification',
            icon: 'fas fa-user-check',
            color: '#FF9800'
        }
    ];
    
    timeline.innerHTML = '';
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-icon" style="background: ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-time">${activity.time}</div>
                <div class="timeline-action">${activity.action}</div>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// Update Deadlines Timeline
function updateDeadlines() {
    const timeline = document.getElementById('deadlines-timeline');
    if (!timeline) return;
    
    const deadlines = [
        {
            title: 'Student Council Elections',
            time: 'Ends in 2 days',
            icon: 'fas fa-crown',
            color: '#FF5252',
            urgent: true
        },
        {
            title: 'Sports Captain Nominations',
            time: 'Opens on Monday',
            icon: 'fas fa-futbol',
            color: '#2196F3',
            urgent: false
        },
        {
            title: 'Faculty Representative',
            time: 'Next week',
            icon: 'fas fa-user-tie',
            color: '#4CAF50',
            urgent: false
        }
    ];
    
    timeline.innerHTML = '';
    
    deadlines.forEach(deadline => {
        const item = document.createElement('div');
        item.className = 'deadline-item';
        if (deadline.urgent) item.classList.add('urgent');
        
        item.innerHTML = `
            <div class="deadline-icon" style="background: ${deadline.color}">
                <i class="${deadline.icon}"></i>
            </div>
            <div class="deadline-content">
                <div class="deadline-title">${deadline.title}</div>
                <div class="deadline-time">${deadline.time}</div>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// Update Statistics
function updateStatistics() {
    // Get user data to personalize stats
    const userData = JSON.parse(localStorage.getItem('kibu_user') || '{}');
    const yearOfStudy = parseInt(userData.yearOfStudy) || 1;
    
    // Generate personalized stats based on year of study
    const baseElections = 3 + yearOfStudy; // More elections for senior students
    const baseDays = 30 * yearOfStudy; // More days active for senior students
    
    document.getElementById('total-elections').textContent = baseElections;
    document.getElementById('days-active').textContent = baseDays;
    document.getElementById('participation-percent').textContent = `${Math.min(100, 70 + (yearOfStudy * 10))}%`;
    document.getElementById('upcoming-count').textContent = '2'; // Always 2 upcoming
}

// Hide loading overlay when everything is loaded
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }, 500);
    }
});