// KIBU Election Center JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('KIBU Election Center Initialized');
    
    // Initialize all components
    initializeLiveCounter();
    initializeFilters();
    initializeCountdownTimers();
    initializeSearch();
    setupEventListeners();
    initializeMobileNavigation();
    
    // Show welcome message
    showWelcomeToast();
});

// Live Counter Simulation
function initializeLiveCounter() {
    const liveCounter = document.getElementById('live-voter-count');
    if (!liveCounter) return;

    // Simulate live voter count updates
    setInterval(() => {
        const currentCount = parseInt(liveCounter.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newCount = Math.max(2300, currentCount + change);
        liveCounter.textContent = newCount.toLocaleString();
    }, 5000);
}

// Filter Functionality
function initializeFilters() {
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const sortOptions = document.getElementById('sort-options');

    if (statusFilter) {
        statusFilter.addEventListener('change', filterElections);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterElections);
    }

    if (sortOptions) {
        sortOptions.addEventListener('change', sortElections);
    }
}

function filterElections() {
    const statusFilter = document.getElementById('status-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const electionCards = document.querySelectorAll('.election-card');

    electionCards.forEach(card => {
        const cardStatus = card.classList.contains('active') ? 'active' : 
                          card.classList.contains('upcoming') ? 'upcoming' : 'completed';
        const cardCategory = card.getAttribute('data-category');

        let shouldShow = true;

        // Status filter
        if (statusFilter !== 'all' && cardStatus !== statusFilter) {
            shouldShow = false;
        }

        // Category filter
        if (categoryFilter !== 'all' && cardCategory !== categoryFilter) {
            shouldShow = false;
        }

        // Show/hide card
        card.style.display = shouldShow ? 'block' : 'none';
    });

    // Show message if no results
    showNoResultsMessage();
}

function showNoResultsMessage() {
    const visibleCards = document.querySelectorAll('.election-card[style="display: block"]');
    const sections = document.querySelectorAll('.election-section');
    
    sections.forEach(section => {
        const sectionCards = section.querySelectorAll('.election-card[style="display: block"]');
        const noResultsMsg = section.querySelector('.no-results-message');
        
        if (sectionCards.length === 0) {
            if (!noResultsMsg) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--medium-gray);">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3>No elections match your filters</h3>
                        <p>Try adjusting your search criteria or browse all elections</p>
                        <button class="btn-outline" onclick="resetFilters()">Show All Elections</button>
                    </div>
                `;
                section.appendChild(message);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
}

function resetFilters() {
    document.getElementById('status-filter').value = 'all';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('search-elections').value = '';
    filterElections();
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-elections');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase().trim();
            const electionCards = document.querySelectorAll('.election-card');
            
            if (searchTerm === '') {
                electionCards.forEach(card => card.style.display = 'block');
                showNoResultsMessage();
                return;
            }
            
            electionCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            showNoResultsMessage();
        }, 300));
    }
}

// Debounce function for search
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

// Sort Functionality
function sortElections() {
    const sortBy = document.getElementById('sort-options').value;
    const sections = document.querySelectorAll('.election-section');
    
    sections.forEach(section => {
        const grid = section.querySelector('.election-grid');
        const cards = Array.from(grid.querySelectorAll('.election-card[style="display: block"]'));
        
        if (cards.length === 0) return;
        
        cards.sort((a, b) => {
            switch (sortBy) {
                case 'closing-soon':
                    return getTimeRemaining(a) - getTimeRemaining(b);
                case 'most-popular':
                    return getParticipation(b) - getParticipation(a);
                case 'newest':
                default:
                    return 0; // Keep original order for newest
            }
        });
        
        // Re-append cards in sorted order
        cards.forEach(card => grid.appendChild(card));
    });
}

function getTimeRemaining(card) {
    const timer = card.querySelector('.countdown');
    if (!timer) return Infinity;
    
    // This is a simplified version - in real implementation, parse the actual time
    return Math.random() * 1000; // Placeholder
}

function getParticipation(card) {
    const progressFill = card.querySelector('.progress-fill');
    if (!progressFill) return 0;
    
    const width = parseFloat(progressFill.style.width);
    return isNaN(width) ? 0 : width;
}

// Countdown Timers
function initializeCountdownTimers() {
    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);
}

function updateAllCountdowns() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    timers.forEach(timer => {
        const countdownElement = timer.querySelector('.countdown');
        if (!countdownElement) return;
        
        let timeText = countdownElement.textContent;
        let timeRemaining = parseCountdownTime(timeText);
        
        if (timeRemaining <= 0) {
            countdownElement.textContent = 'Ended';
            countdownElement.style.color = 'var(--error-red)';
            return;
        }
        
        timeRemaining -= 1000; // Subtract one second
        countdownElement.textContent = formatCountdownTime(timeRemaining);
    });
}

function parseCountdownTime(timeText) {
    // Parse "1 day 14:32:15" or "3 days 08:15:30" format
    const daysMatch = timeText.match(/(\d+)\s*day/);
    const timeMatch = timeText.match(/(\d+):(\d+):(\d+)/);
    
    let totalMs = 0;
    
    if (daysMatch) {
        totalMs += parseInt(daysMatch[1]) * 24 * 60 * 60 * 1000;
    }
    
    if (timeMatch) {
        totalMs += parseInt(timeMatch[1]) * 60 * 60 * 1000;
        totalMs += parseInt(timeMatch[2]) * 60 * 1000;
        totalMs += parseInt(timeMatch[3]) * 1000;
    }
    
    return totalMs;
}

function formatCountdownTime(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Event Listeners
function setupEventListeners() {
    // Set reminder buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        if (button.textContent.includes('REMINDER')) {
            button.addEventListener('click', function() {
                const electionTitle = this.closest('.election-card').querySelector('.card-title').textContent;
                setReminder(electionTitle);
            });
        }
    });
    
    // Vote now buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('VOTE NOW')) {
            button.addEventListener('click', startVoting);
        }
    });
    
    // View results buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        if (button.textContent.includes('RESULTS')) {
            button.addEventListener('click', function() {
                const electionTitle = this.closest('.election-card').querySelector('.card-title').textContent;
                viewResults(electionTitle);
            });
        }
    });
}

// Mobile Navigation
function initializeMobileNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Handle navigation (simplified)
            const buttonText = this.querySelector('span').textContent;
            handleMobileNavigation(buttonText);
        });
    });
}

function handleMobileNavigation(destination) {
    switch(destination) {
        case 'Home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'Vote':
            startVoting();
            break;
        case 'Results':
            viewResults();
            break;
        case 'Profile':
            viewFullHistory();
            break;
    }
}

// Main Action Functions
function startVoting() {
    showToast('Redirecting to voting page...', 'info');
    // Simulate redirect
    setTimeout(() => {
        window.location.href = 'voting.html';
    }, 1500);
}

function viewReceipt() {
    showToast('Opening vote receipt...', 'info');
    // Simulate redirect to confirmation page
    setTimeout(() => {
        window.location.href = 'confirmation.html';
    }, 1500);
}

function viewResults(electionName = '') {
    if (electionName) {
        showToast(`Loading results for ${electionName}...`, 'info');
    } else {
        showToast('Opening election results...', 'info');
    }
    // In real implementation, this would open results page
}

function setReminder(electionName) {
    showToast(`Reminder set for ${electionName}`, 'success');
    
    // Simulate notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function openNominations() {
    showToast('Opening nomination form...', 'info');
    // In real implementation, this would open nomination form
}

function viewFullHistory() {
    showToast('Loading your complete voting history...', 'info');
    // In real implementation, this would open profile/history page
}

function manageNotifications() {
    showToast('Opening notification settings...', 'info');
    // In real implementation, this would open settings
}

function downloadRecords() {
    showToast('Preparing your voting records download...', 'info');
    // Simulate download
    setTimeout(() => {
        showToast('Voting records downloaded successfully!', 'success');
    }, 2000);
}

function verifyVotes() {
    showToast('Verifying all your votes on blockchain...', 'info');
    // Simulate verification
    setTimeout(() => {
        showToast('All votes verified successfully!', 'success');
    }, 3000);
}

function showHelp() {
    showToast('Opening help center...', 'info');
    // In real implementation, this would open help/FAQ page
}

function reportIssue() {
    showToast('Opening issue report form...', 'info');
    // In real implementation, this would open support form
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-left: 4px solid;
        z-index: 10000;
        animation: toastSlideIn 0.3s ease-out;
        max-width: 400px;
        border-left-color: ${getToastColor(type)};
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
    
    // Add CSS for toast animations if not already added
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .toast-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .toast-message {
                flex: 1;
                font-weight: 500;
            }
            
            .toast-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toast-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

function getToastColor(type) {
    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706',
        info: '#2563eb'
    };
    return colors[type] || colors.info;
}

function showWelcomeToast() {
    setTimeout(() => {
        showToast('Welcome to KIBU Election Center! 🗳️', 'info');
    }, 1000);
}

// Export functions for global access
window.startVoting = startVoting;
window.viewReceipt = viewReceipt;
window.viewResults = viewResults;
window.setReminder = setReminder;
window.openNominations = openNominations;
window.viewFullHistory = viewFullHistory;
window.manageNotifications = manageNotifications;
window.downloadRecords = downloadRecords;
window.verifyVotes = verifyVotes;
window.showHelp = showHelp;
window.reportIssue = reportIssue;
window.resetFilters = resetFilters;