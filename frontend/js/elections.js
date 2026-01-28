// KIBU Election Center JavaScript
const API_BASE_URL = 'http://localhost:5000/api';

// Global state
let allElections = [];
let userToken = null;
let userData = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('KIBU Election Center Initialized');
    
    // Check if user is logged in
    userToken = localStorage.getItem('kibu_token');
    
    if (userToken) {
        // User is logged in, fetch elections and user data
        initializeApp();
    } else {
        // User is not logged in, show login prompt
        showLoginPrompt();
    }
});

async function initializeApp() {
    try {
        // Show loading state
        showLoading(true);
        
        // Fetch user data
        await fetchUserData();
        
        // Fetch all elections
        await fetchAllElections();
        
        // Initialize all components
        initializeLiveCounter();
        initializeFilters();
        initializeCountdownTimers();
        initializeSearch();
        setupEventListeners();
        initializeMobileNavigation();
        
        // Hide loading
        showLoading(false);
        
        // Show welcome message
        showWelcomeToast();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showLoading(false);
        showToast('Failed to load election data. Please try again.', 'error');
    }
}

// Fetch all elections from backend
async function fetchAllElections() {
    try {
        const response = await fetch(`${API_BASE_URL}/elections`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch elections`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            allElections = data.data;
            renderElections(allElections);
        } else {
            throw new Error(data.message || 'Failed to fetch elections');
        }
        
    } catch (error) {
        console.error('Fetch elections error:', error);
        
        // If no elections in database, create sample elections
        if (error.message.includes('404') || error.message.includes('no data')) {
            createSampleElections();
        } else {
            showToast('Unable to connect to server. Please check your connection.', 'error');
        }
    }
}

// Fetch user data
async function fetchUserData() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch user data`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            userData = data.data.student;
            updateUserInfo();
        }
        
    } catch (error) {
        console.error('Fetch user data error:', error);
        // Continue without user data if there's an error
    }
}

// Render elections on the page
function renderElections(elections) {
    // Clear existing content
    const activeGrid = document.querySelector('#active-elections .election-grid');
    const upcomingGrid = document.querySelector('#upcoming-elections .election-grid');
    const completedGrid = document.querySelector('#completed-elections .election-grid');
    
    if (activeGrid) activeGrid.innerHTML = '';
    if (upcomingGrid) upcomingGrid.innerHTML = '';
    if (completedGrid) completedGrid.innerHTML = '';
    
    // Sort elections by status
    const activeElections = elections.filter(e => e.status === 'active');
    const upcomingElections = elections.filter(e => e.status === 'upcoming');
    const completedElections = elections.filter(e => e.status === 'completed');
    
    // Render active elections
    if (activeGrid && activeElections.length > 0) {
        activeElections.forEach(election => {
            activeGrid.appendChild(createElectionCard(election));
        });
    } else if (activeGrid) {
        activeGrid.innerHTML = `
            <div class="no-elections">
                <i class="fas fa-calendar-times"></i>
                <h3>No Active Elections</h3>
                <p>There are currently no active elections.</p>
            </div>
        `;
    }
    
    // Render upcoming elections
    if (upcomingGrid && upcomingElections.length > 0) {
        upcomingElections.forEach(election => {
            upcomingGrid.appendChild(createElectionCard(election));
        });
    } else if (upcomingGrid) {
        upcomingGrid.innerHTML = `
            <div class="no-elections">
                <i class="fas fa-calendar-plus"></i>
                <h3>No Upcoming Elections</h3>
                <p>Check back later for upcoming elections.</p>
            </div>
        `;
    }
    
    // Render completed elections
    if (completedGrid && completedElections.length > 0) {
        completedElections.forEach(election => {
            completedGrid.appendChild(createElectionCard(election));
        });
    } else if (completedGrid) {
        completedGrid.innerHTML = `
            <div class="no-elections">
                <i class="fas fa-calendar-check"></i>
                <h3>No Completed Elections</h3>
                <p>No elections have been completed yet.</p>
            </div>
        `;
    }
    
    // Update stats
    updateStats(activeElections.length, upcomingElections.length);
}

// Create an election card
function createElectionCard(election) {
    const card = document.createElement('div');
    card.className = `election-card ${election.status}`;
    card.setAttribute('data-category', election.type);
    card.setAttribute('data-id', election._id);
    
    // Format dates
    const startDate = new Date(election.startDate).toLocaleDateString();
    const endDate = new Date(election.endDate).toLocaleDateString();
    
    // Get icon based on type
    const icon = getElectionIcon(election.type);
    
    // Check if user has voted (simplified - in real app, check vote status)
    const hasVoted = checkIfUserVoted(election._id);
    
    // Create card HTML
    card.innerHTML = `
        <div class="card-header">
            <span class="status-badge ${election.status}">${getStatusText(election.status)}</span>
            <div class="card-icon">
                <i class="${icon}"></i>
            </div>
        </div>
        
        <h3 class="card-title">${election.title}</h3>
        
        <div class="card-dates">
            <i class="far fa-calendar"></i> ${startDate} - ${endDate}
        </div>
        
        ${election.status === 'active' || election.status === 'upcoming' ? 
            `<div class="countdown-timer" id="timer-${election._id}">
                ${election.status === 'active' ? 'Ends in:' : 'Starts in:'} 
                <span class="countdown">${formatTimeRemaining(election.endDate, election.status)}</span>
            </div>` : ''
        }
        
        ${election.positions && election.positions.length > 0 ? `
            <div class="positions-list">
                <h4>${election.positions.length} Position${election.positions.length > 1 ? 's' : ''} Available:</h4>
                <div class="positions-grid">
                    ${election.positions.map(pos => 
                        `<span class="position-tag">${getPositionIcon(pos.title)} ${pos.title}</span>`
                    ).slice(0, 5).join('')}
                    ${election.positions.length > 5 ? 
                        `<span class="position-tag more">+${election.positions.length - 5} more</span>` : ''
                    }
                </div>
            </div>
        ` : ''}
        
        ${election.status === 'active' || election.status === 'completed' ? `
            <div class="participation">
                <div class="progress-bar">
                    <div class="progress-fill ${election.status}" 
                         style="width: ${election.turnoutPercentage || 0}%"></div>
                </div>
                <span class="vote-count">
                    ${election.totalVotes || 0} votes cast 
                    (${election.turnoutPercentage || 0}% turnout)
                </span>
            </div>
        ` : ''}
        
        <div class="user-status ${hasVoted ? '' : 'not-voted'}">
            ${hasVoted ? 
                '<i class="fas fa-check-circle"></i> <span>VOTED</span>' : 
                '<i class="far fa-clock"></i> <span>NOT VOTED</span>'
            }
        </div>
        
        <div class="positions">
            <i class="fas fa-users"></i> 
            ${election.positions ? election.positions.length : 0} positions • 
            ${election.candidateCount || 0} candidates
        </div>
        
        <div class="card-actions">
            ${getActionButton(election, hasVoted)}
        </div>
    `;
    
    return card;
}

// Helper functions
function getElectionIcon(type) {
    const icons = {
        'student-council': 'fas fa-crown',
        'sports': 'fas fa-futbol',
        'clubs': 'fas fa-mask',
        'faculty': 'fas fa-graduation-cap',
        'academic': 'fas fa-chalkboard-teacher',
        'library': 'fas fa-book',
        'departmental': 'fas fa-university',
        'hostel': 'fas fa-home'
    };
    return icons[type] || 'fas fa-vote-yea';
}

function getStatusText(status) {
    const texts = {
        'active': 'VOTING OPEN',
        'upcoming': 'COMING SOON',
        'completed': 'COMPLETED'
    };
    return texts[status] || status.toUpperCase();
}

function getPositionIcon(positionTitle) {
    const lowerTitle = positionTitle.toLowerCase();
    
    if (lowerTitle.includes('president') || lowerTitle.includes('chair')) return '👑';
    if (lowerTitle.includes('vice')) return '👥';
    if (lowerTitle.includes('secretary')) return '📝';
    if (lowerTitle.includes('treasurer')) return '💰';
    if (lowerTitle.includes('academic')) return '📚';
    if (lowerTitle.includes('security')) return '🛡️';
    if (lowerTitle.includes('captain')) return '⚽';
    if (lowerTitle.includes('director')) return '🎭';
    if (lowerTitle.includes('manager')) return '📋';
    if (lowerTitle.includes('head')) return '👤';
    if (lowerTitle.includes('representative')) return '🗳️';
    if (lowerTitle.includes('committee')) return '🏛️';
    if (lowerTitle.includes('welfare')) return '❤️';
    if (lowerTitle.includes('social')) return '🎉';
    
    return '👤';
}

function formatTimeRemaining(endDate, status) {
    const now = new Date();
    const targetDate = new Date(endDate);
    const timeDiff = status === 'active' ? targetDate - now : targetDate - now;
    
    if (timeDiff <= 0) {
        return 'Ended';
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
}

function checkIfUserVoted(electionId) {
    // In a real app, this would check the user's voting history
    // For now, we'll use localStorage
    const votedElections = JSON.parse(localStorage.getItem('voted_elections') || '[]');
    return votedElections.includes(electionId);
}

function getActionButton(election, hasVoted) {
    switch(election.status) {
        case 'active':
            if (hasVoted) {
                return `<button class="btn-primary" onclick="viewReceipt('${election._id}')">VIEW RECEIPT</button>`;
            } else {
                return `<button class="btn-primary" onclick="startVoting('${election._id}')">VOTE NOW</button>`;
            }
        case 'upcoming':
            return `<button class="btn-outline" onclick="setReminder('${election._id}', '${election.title}')">SET REMINDER</button>`;
        case 'completed':
            return `<button class="btn-outline" onclick="viewResults('${election._id}')">VIEW RESULTS</button>`;
        default:
            return '';
    }
}

// Update user info in the UI
function updateUserInfo() {
    if (userData) {
        // Update user name if element exists
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        }
    }
}

// Update stats
function updateStats(activeCount, upcomingCount) {
    // Update active elections count
    const activeCountElement = document.querySelector('.stat-active .stat-value');
    if (activeCountElement && activeCount > 0) {
        activeCountElement.textContent = `${activeCount} ACTIVE`;
    }
    
    // Update upcoming elections count
    const upcomingCountElement = document.querySelector('.stat-upcoming .stat-value');
    if (upcomingCountElement && upcomingCount > 0) {
        upcomingCountElement.textContent = `${upcomingCount} UPCOMING`;
    }
    
    // Update total voters count (simulated)
    const totalVotersElement = document.querySelector('.stat-total .stat-value');
    if (totalVotersElement) {
        totalVotersElement.textContent = '9,482 registered voters';
    }
}

// Create sample elections if database is empty
function createSampleElections() {
    const sampleElections = [
        {
            _id: 'student-council-2024',
            title: 'Student Council Elections 2024',
            description: 'Annual student council elections for all positions',
            type: 'student-council',
            startDate: new Date('2024-03-10'),
            endDate: new Date('2024-03-17'),
            status: 'active',
            positions: [
                { _id: 'pos1', title: 'Chairperson', description: 'Student Council Chair' },
                { _id: 'pos2', title: 'Vice Chairperson', description: 'Student Council Vice Chair' },
                { _id: 'pos3', title: 'Secretary General', description: 'General Secretary' },
                { _id: 'pos4', title: 'Treasurer', description: 'Financial Officer' }
            ],
            candidateCount: 12,
            totalVotes: 8247,
            totalVoters: 9482,
            turnoutPercentage: 87
        },
        {
            _id: 'library-committee-2024',
            title: 'Library Committee Representatives',
            description: 'Election for library committee student representatives',
            type: 'library',
            startDate: new Date('2024-03-15'),
            endDate: new Date('2024-03-20'),
            status: 'active',
            positions: [
                { _id: 'pos5', title: 'Head Librarian', description: 'Head Student Librarian' },
                { _id: 'pos6', title: 'Digital Resources', description: 'Digital Resources Manager' }
            ],
            candidateCount: 6,
            totalVotes: 1456,
            totalVoters: 9482,
            turnoutPercentage: 15
        },
        {
            _id: 'sports-captain-2024',
            title: 'Sports Captain Elections',
            description: 'Election for sports team captains',
            type: 'sports',
            startDate: new Date('2024-03-20'),
            endDate: new Date('2024-03-25'),
            status: 'upcoming',
            positions: [
                { _id: 'pos7', title: 'Football Captain', description: 'Football Team Captain' },
                { _id: 'pos8', title: 'Basketball Captain', description: 'Basketball Team Captain' }
            ],
            candidateCount: 8
        }
    ];
    
    allElections = sampleElections;
    renderElections(allElections);
}

// Show login prompt
function showLoginPrompt() {
    const mainContent = document.querySelector('.election-main');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="login-prompt">
                <div class="prompt-content">
                    <i class="fas fa-lock"></i>
                    <h2>Access Restricted</h2>
                    <p>You need to log in to access the election center.</p>
                    <button class="btn-primary" onclick="redirectToLogin()">LOGIN NOW</button>
                    <p class="demo-note">Demo: Use registration number "BIT/001/24" and password "password123"</p>
                </div>
            </div>
        `;
    }
    
    // Add styles for login prompt
    const style = document.createElement('style');
    style.textContent = `
        .login-prompt {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
        }
        
        .prompt-content {
            text-align: center;
            max-width: 400px;
            background: white;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .prompt-content i {
            font-size: 4rem;
            color: #4361ee;
            margin-bottom: 1.5rem;
        }
        
        .prompt-content h2 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #2d3748;
        }
        
        .prompt-content p {
            color: #718096;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .demo-note {
            font-size: 0.85rem;
            color: #718096;
            background: #f7fafc;
            padding: 0.75rem;
            border-radius: 8px;
            margin-top: 1.5rem;
            border-left: 4px solid #4cc9f0;
        }
    `;
    document.head.appendChild(style);
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

// Show loading state
function showLoading(show) {
    const loader = document.getElementById('loading-overlay');
    if (!loader) {
        if (show) {
            const loaderDiv = document.createElement('div');
            loaderDiv.id = 'loading-overlay';
            loaderDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                flex-direction: column;
            `;
            loaderDiv.innerHTML = `
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem; color: #4361ee; font-weight: 500;">Loading election data...</p>
            `;
            document.body.appendChild(loaderDiv);
            
            // Add spinner styles
            const style = document.createElement('style');
            style.textContent = `
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #e2e8f0;
                    border-top-color: #4361ee;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// ==================== ORIGINAL FUNCTIONS (Keep these) ====================

// Live Counter Simulation
function initializeLiveCounter() {
    const liveCounter = document.getElementById('live-voter-count');
    if (!liveCounter) return;

    setInterval(() => {
        const currentCount = parseInt(liveCounter.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 21) - 10;
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
// Add this function to your elections.js file, around line 600:

// Sort Functionality - Add this function
function sortElections() {
    const sortBy = document.getElementById('sort-options')?.value;
    if (!sortBy) return;
    
    const sections = document.querySelectorAll('.election-section');
    
    sections.forEach(section => {
        const grid = section.querySelector('.election-grid');
        if (!grid) return;
        
        const cards = Array.from(grid.querySelectorAll('.election-card[style*="display: block"], .election-card:not([style])'));
        
        if (cards.length === 0) return;
        
        cards.sort((a, b) => {
            const aId = a.getAttribute('data-id');
            const bId = b.getAttribute('data-id');
            
            // Find the elections in our data
            const electionA = allElections.find(e => e._id === aId);
            const electionB = allElections.find(e => e._id === bId);
            
            if (!electionA || !electionB) return 0;
            
            switch (sortBy) {
                case 'closing-soon':
                    const aEnd = new Date(electionA.endDate).getTime();
                    const bEnd = new Date(electionB.endDate).getTime();
                    return aEnd - bEnd;
                    
                case 'most-popular':
                    const aVotes = electionA.totalVotes || 0;
                    const bVotes = electionB.totalVotes || 0;
                    return bVotes - aVotes;
                    
                case 'newest':
                default:
                    const aDate = new Date(electionA.createdAt || electionA.startDate).getTime();
                    const bDate = new Date(electionB.createdAt || electionB.startDate).getTime();
                    return bDate - aDate;
            }
        });
        
        // Re-append cards in sorted order
        cards.forEach(card => grid.appendChild(card));
    });
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

        card.style.display = shouldShow ? 'block' : 'none';
    });

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
                    <div style="text-align: center; padding: 3rem; color: #718096;">
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
    
    const electionCards = document.querySelectorAll('.election-card');
    electionCards.forEach(card => card.style.display = 'block');
    
    showNoResultsMessage();
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
                const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
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

// Debounce function
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
        
        const electionCard = timer.closest('.election-card');
        const electionId = electionCard?.getAttribute('data-id');
        
        if (!electionId) return;
        
        // Find the election
        const election = allElections.find(e => e._id === electionId);
        if (!election) return;
        
        const timeRemaining = formatTimeRemaining(election.endDate, election.status);
        
        if (timeRemaining === 'Ended') {
            countdownElement.textContent = 'Ended';
            countdownElement.style.color = '#dc2626';
        } else {
            countdownElement.textContent = timeRemaining;
            countdownElement.style.color = '';
        }
    });
}

// Event Listeners
function setupEventListeners() {
    // Set reminder buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        if (button.textContent.includes('REMINDER')) {
            button.addEventListener('click', function() {
                const electionCard = this.closest('.election-card');
                const electionId = electionCard?.getAttribute('data-id');
                const electionTitle = electionCard?.querySelector('.card-title')?.textContent || '';
                
                if (electionId) {
                    setReminder(electionId, electionTitle);
                }
            });
        }
    });
    
    // Vote now buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('VOTE NOW')) {
            button.addEventListener('click', function() {
                const electionCard = this.closest('.election-card');
                const electionId = electionCard?.getAttribute('data-id');
                
                if (electionId) {
                    startVoting(electionId);
                }
            });
        }
    });
    
    // View results buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        if (button.textContent.includes('RESULTS')) {
            button.addEventListener('click', function() {
                const electionCard = this.closest('.election-card');
                const electionId = electionCard?.getAttribute('data-id');
                
                if (electionId) {
                    viewResults(electionId);
                }
            });
        }
    });
    
    // View receipt buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('RECEIPT')) {
            button.addEventListener('click', function() {
                const electionCard = this.closest('.election-card');
                const electionId = electionCard?.getAttribute('data-id');
                
                if (electionId) {
                    viewReceipt(electionId);
                }
            });
        }
    });
}

// ==================== MAIN ACTION FUNCTIONS ====================

function startVoting(electionId) {
    if (!userToken) {
        showToast('Please login first', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    showToast('Redirecting to voting page...', 'info');
    
    // Redirect to voting page with election ID
    setTimeout(() => {
        window.location.href = `voting.html?election=${electionId}`;
    }, 1000);
}

function viewReceipt(electionId) {
    showToast('Opening vote receipt...', 'info');
    
    // In real implementation, this would redirect to receipt page
    setTimeout(() => {
        window.location.href = `receipt.html?election=${electionId}`;
    }, 1000);
}

function viewResults(electionId) {
    showToast('Opening election results...', 'info');
    
    // In real implementation, this would redirect to results page
    setTimeout(() => {
        window.location.href = `results.html?election=${electionId}`;
    }, 1000);
}

function setReminder(electionId, electionTitle) {
    showToast(`Reminder set for ${electionTitle}`, 'success');
    
    // Save reminder to localStorage
    const reminders = JSON.parse(localStorage.getItem('election_reminders') || '[]');
    reminders.push({
        electionId,
        title: electionTitle,
        date: new Date().toISOString()
    });
    localStorage.setItem('election_reminders', JSON.stringify(reminders));
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ==================== TOAST NOTIFICATION SYSTEM ====================

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
    
    // Add CSS for animations if not already added
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

// Keep other existing functions (mobile navigation, etc.) as they are
function initializeMobileNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
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
            // Find first active election and start voting
            const activeElection = allElections.find(e => e.status === 'active');
            if (activeElection) {
                startVoting(activeElection._id);
            } else {
                showToast('No active elections to vote in', 'warning');
            }
            break;
        case 'Results':
            // Find first completed election and show results
            const completedElection = allElections.find(e => e.status === 'completed');
            if (completedElection) {
                viewResults(completedElection._id);
            } else {
                showToast('No completed elections yet', 'warning');
            }
            break;
        case 'Profile':
            showToast('Opening profile page...', 'info');
            break;
    }
}

// Export functions for global access
window.startVoting = startVoting;
window.viewReceipt = viewReceipt;
window.viewResults = viewResults;
window.setReminder = setReminder;
window.resetFilters = resetFilters;