// voting.js - Complete voting functionality connected to backend

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let currentElection = null;
let positions = [];
let allCandidates = [];
let currentPositionIndex = 0;
let selectedVotes = {}; // { positionId: candidateId }
let studentData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeVoting();
    setupEventListeners();
});

// Initialize voting page
async function initializeVoting() {
    try {
        showLoading('Loading voting data...');
        
        // Check authentication - match the key used in signup
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Token found, proceeding with initialization');
        
        // Load student data
        await loadStudentData();
        
        // Get election ID from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const electionId = urlParams.get('election') || localStorage.getItem('currentElectionId');
        
        if (!electionId) {
            showError('No election selected');
            setTimeout(() => window.location.href = 'dashboard.html', 2000);
            return;
        }
        
        // Check if student has already voted
        await checkVotingStatus(electionId);
        
        // Load election data
        await loadElectionData(electionId);
        
        // Load positions
        await loadPositions(electionId);
        
        // Load all candidates
        await loadCandidates(electionId);
        
        // Display first position
        displayPosition(0);
        
        hideLoading();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load voting data. Please try again.');
        hideLoading();
    }
}

// Load student data
async function loadStudentData() {
    try {
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            studentData = data.data.student;
            updateUserProfile(studentData);
        } else {
            throw new Error('Failed to load student data');
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        throw error;
    }
}

// Update user profile in header
function updateUserProfile(student) {
    const userName = document.getElementById('user-name');
    const userRegNumber = document.getElementById('user-reg-number');
    const userAvatar = document.getElementById('user-avatar');
    
    if (userName) {
        userName.textContent = `${student.firstName} ${student.lastName}`;
    }
    
    if (userRegNumber) {
        userRegNumber.textContent = student.registrationNumber;
    }
    
    if (userAvatar) {
        const initial = student.firstName.charAt(0).toUpperCase();
        userAvatar.textContent = initial;
    }
}

// Check if student has already voted
async function checkVotingStatus(electionId) {
    try {
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/votes/status/${electionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.data.hasVoted) {
            alert('You have already voted in this election!');
            window.location.href = `confirmation.html?election=${electionId}`;
        }
    } catch (error) {
        console.error('Error checking voting status:', error);
    }
}

// Load election data
async function loadElectionData(electionId) {
    try {
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentElection = data.data;
            updateElectionHeader(currentElection);
            startCountdown(currentElection.endDate);
        } else {
            throw new Error('Failed to load election');
        }
    } catch (error) {
        console.error('Error loading election:', error);
        throw error;
    }
}

// Load positions for election
async function loadPositions(electionId) {
    try {
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/positions/election/${electionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            positions = data.data;
            updatePositionTabs();
            updateSidebarStats();
        } else {
            throw new Error('Failed to load positions');
        }
    } catch (error) {
        console.error('Error loading positions:', error);
        throw error;
    }
}

// Load all candidates for election
async function loadCandidates(electionId) {
    try {
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/candidates/election/${electionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allCandidates = data.data;
            updateSidebarStats();
        } else {
            throw new Error('Failed to load candidates');
        }
    } catch (error) {
        console.error('Error loading candidates:', error);
        throw error;
    }
}

// Update election header
function updateElectionHeader(election) {
    const titleEl = document.getElementById('election-title');
    const descEl = document.getElementById('election-description');
    const positionsCountEl = document.getElementById('positions-count');
    const candidatesCountEl = document.getElementById('candidates-count');
    
    if (titleEl) titleEl.textContent = election.title;
    if (descEl) descEl.textContent = election.description;
    if (positionsCountEl) positionsCountEl.textContent = `${election.positions.length} positions`;
    if (candidatesCountEl) candidatesCountEl.textContent = `${allCandidates.length} candidates`;
}

// Update position tabs
function updatePositionTabs() {
    const tabsContainer = document.getElementById('position-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    
    positions.forEach((position, index) => {
        const tab = document.createElement('div');
        tab.className = 'nav-tab';
        if (index === 0) tab.classList.add('active');
        if (selectedVotes[position._id]) tab.classList.add('completed');
        
        tab.innerHTML = `
            ${selectedVotes[position._id] ? '<i class="fas fa-check-circle"></i>' : ''}
            <span>${position.title}</span>
        `;
        
        tab.addEventListener('click', () => displayPosition(index));
        tabsContainer.appendChild(tab);
    });
}

// Display position and its candidates
function displayPosition(index) {
    currentPositionIndex = index;
    const position = positions[index];
    
    // Update active tab
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // Update position header
    const titleEl = document.getElementById('position-title');
    const descEl = document.getElementById('position-description');
    
    if (titleEl) titleEl.textContent = position.title;
    if (descEl) descEl.textContent = position.description;
    
    // Display candidates for this position
    displayCandidates(position._id);
}

// Display candidates for a position
function displayCandidates(positionId) {
    const container = document.getElementById('candidates-container');
    if (!container) return;
    
    // Filter candidates for this position
    const positionCandidates = allCandidates.filter(c => c.positionId._id === positionId);
    
    if (positionCandidates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>No candidates for this position</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    positionCandidates.forEach(candidate => {
        const card = createCandidateCard(candidate, positionId);
        container.appendChild(card);
    });
}

// Create candidate card element
function createCandidateCard(candidate, positionId) {
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.dataset.candidateId = candidate._id;
    
    // Check if this candidate is selected
    if (selectedVotes[positionId] === candidate._id) {
        card.classList.add('selected');
    }
    
    const student = candidate.studentId;
    const photoUrl = student.profilePhoto || candidate.photo;
    const initial = student.firstName.charAt(0).toUpperCase();
    
    card.innerHTML = `
        ${selectedVotes[positionId] === candidate._id ? '<div class="selected-badge"><i class="fas fa-check"></i></div>' : ''}
        
        <div class="candidate-photo">
            ${photoUrl 
                ? `<img src="${photoUrl}" alt="${student.firstName} ${student.lastName}">`
                : `<div class="candidate-photo-placeholder">${initial}</div>`
            }
        </div>
        
        <div class="candidate-info">
            <h3 class="candidate-name">${student.firstName} ${student.lastName}</h3>
            <p class="candidate-reg">${student.registrationNumber}</p>
        </div>
        
        <div class="candidate-manifesto">
            <p>${candidate.manifesto}</p>
        </div>
        
        <div class="candidate-actions">
            <button class="btn-select" data-candidate-id="${candidate._id}" data-position-id="${positionId}">
                ${selectedVotes[positionId] === candidate._id 
                    ? '<i class="fas fa-times"></i> Deselect' 
                    : '<i class="fas fa-check"></i> Select'}
            </button>
        </div>
    `;
    
    // Add click listener to select button
    const selectBtn = card.querySelector('.btn-select');
    selectBtn.addEventListener('click', () => toggleCandidateSelection(candidate._id, positionId));
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-select')) {
            toggleCandidateSelection(candidate._id, positionId);
        }
    });
    
    return card;
}

// Toggle candidate selection
function toggleCandidateSelection(candidateId, positionId) {
    // If this candidate is already selected, deselect
    if (selectedVotes[positionId] === candidateId) {
        delete selectedVotes[positionId];
    } else {
        // Select this candidate (only one per position)
        selectedVotes[positionId] = candidateId;
    }
    
    // Update UI
    displayCandidates(positionId);
    updateVotingSummary();
    updatePositionTabs();
    updateVotingProgress();
    updateSubmitButton();
}

// Update voting summary
function updateVotingSummary() {
    const summaryContent = document.getElementById('summary-content');
    if (!summaryContent) return;
    
    const selectedCount = Object.keys(selectedVotes).length;
    
    if (selectedCount === 0) {
        summaryContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No selections yet</p>
                <span>Start voting by selecting candidates above</span>
            </div>
        `;
        return;
    }
    
    summaryContent.innerHTML = '';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const student = candidate.studentId;
        
        const item = document.createElement('div');
        item.className = 'summary-item';
        item.innerHTML = `
            <div class="summary-item-info">
                <div class="summary-item-icon">
                    <i class="fas fa-check"></i>
                </div>
                <div class="summary-item-details">
                    <h4>${position.title}</h4>
                    <p>${student.firstName} ${student.lastName}</p>
                </div>
            </div>
            <button class="btn-remove" data-position-id="${positionId}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const removeBtn = item.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            delete selectedVotes[positionId];
            displayCandidates(positionId);
            updateVotingSummary();
            updatePositionTabs();
            updateVotingProgress();
            updateSubmitButton();
        });
        
        summaryContent.appendChild(item);
    });
}

// Update voting progress
function updateVotingProgress() {
    const votedCount = Object.keys(selectedVotes).length;
    const totalCount = positions.length;
    const percentage = totalCount > 0 ? Math.round((votedCount / totalCount) * 100) : 0;
    
    // Update circle progress
    const circleProgress = document.querySelector('.circle-progress');
    const percentageText = document.querySelector('.percentage');
    
    if (circleProgress) {
        circleProgress.setAttribute('stroke-dasharray', `${percentage}, 100`);
    }
    
    if (percentageText) {
        percentageText.textContent = `${percentage}%`;
    }
    
    // Update text
    const positionsVoted = document.getElementById('positions-voted');
    const totalPositions = document.getElementById('total-positions');
    
    if (positionsVoted) positionsVoted.textContent = votedCount;
    if (totalPositions) totalPositions.textContent = totalCount;
}

// Update sidebar stats
function updateSidebarStats() {
    const totalCandidatesEl = document.getElementById('total-candidates');
    if (totalCandidatesEl) {
        totalCandidatesEl.textContent = allCandidates.length;
    }
}

// Update submit button state
function updateSubmitButton() {
    const submitBtn = document.getElementById('submit-vote-btn');
    if (!submitBtn) return;
    
    const hasSelections = Object.keys(selectedVotes).length > 0;
    submitBtn.disabled = !hasSelections;
}

// Start countdown timer
function startCountdown(endDate) {
    const timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;
    
    const updateTimer = () => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const distance = end - now;
        
        if (distance < 0) {
            timerEl.textContent = 'VOTING CLOSED';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Clear all button
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all selections?')) {
                selectedVotes = {};
                displayCandidates(positions[currentPositionIndex]._id);
                updateVotingSummary();
                updatePositionTabs();
                updateVotingProgress();
                updateSubmitButton();
            }
        });
    }
    
    // Submit vote button
    const submitBtn = document.getElementById('submit-vote-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', showConfirmationModal);
    }
    
    // Cancel submit button in modal
    const cancelBtn = document.getElementById('cancel-submit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideConfirmationModal);
    }
    
    // Confirm submit button in modal
    const confirmBtn = document.getElementById('confirm-submit-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', submitVote);
    }
    
    // View results button
    const viewResultsBtn = document.getElementById('view-results-btn');
    if (viewResultsBtn) {
        viewResultsBtn.addEventListener('click', () => {
            window.location.href = `results.html?election=${currentElection._id}`;
        });
    }
    
    // Download receipt button
    const downloadBtn = document.getElementById('download-receipt-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadReceipt);
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

// Show confirmation modal
function showConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    const finalSelectionsEl = document.getElementById('final-selections');
    
    if (!modal || !finalSelectionsEl) return;
    
    // Build final selections HTML
    finalSelectionsEl.innerHTML = '';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const student = candidate.studentId;
        
        const item = document.createElement('div');
        item.className = 'final-selection-item';
        item.innerHTML = `
            <h4>${position.title}</h4>
            <p>${student.firstName} ${student.lastName} (${student.registrationNumber})</p>
        `;
        
        finalSelectionsEl.appendChild(item);
    });
    
    modal.classList.add('active');
}

// Hide confirmation modal
function hideConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Submit vote to backend
async function submitVote() {
    try {
        hideConfirmationModal();
        showLoading('Submitting your vote...');
        
        // Format votes for API
        const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
            positionId,
            candidateId
        }));
        
        const token = localStorage.getItem('kibu_token') || localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/votes/cast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                electionId: currentElection._id,
                votes
            })
        });
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            // Show success modal with vote hash
            showSuccessModal(data.data);
        } else {
            showError(data.message || 'Failed to submit vote');
        }
        
    } catch (error) {
        console.error('Error submitting vote:', error);
        hideLoading();
        showError('Failed to submit vote. Please try again.');
    }
}

// Show success modal
function showSuccessModal(voteData) {
    const modal = document.getElementById('success-modal');
    const voteHashEl = document.getElementById('vote-hash');
    const timestampEl = document.getElementById('vote-timestamp');
    
    if (!modal) return;
    
    if (voteHashEl) {
        voteHashEl.textContent = voteData.voteHash;
    }
    
    if (timestampEl) {
        const timestamp = new Date(voteData.timestamp);
        timestampEl.textContent = timestamp.toLocaleString();
    }
    
    modal.classList.add('active');
}

// Download receipt
function downloadReceipt() {
    const voteHash = document.getElementById('vote-hash').textContent;
    const timestamp = document.getElementById('vote-timestamp').textContent;
    
    const receiptText = `
KIBU eVote - Vote Receipt
==========================

Election: ${currentElection.title}
Student: ${studentData.firstName} ${studentData.lastName}
Registration: ${studentData.registrationNumber}

Vote Hash: ${voteHash}
Timestamp: ${timestamp}

Your vote has been securely recorded on the blockchain.

Thank you for participating in democracy!
    `;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-receipt-${voteHash.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Handle logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('currentElectionId');
        window.location.href = 'login.html';
    }
}

// Utility functions
function showLoading(text = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    if (overlay) overlay.classList.add('active');
    if (loadingText) loadingText.textContent = text;
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('active');
}

function showError(message) {
    alert(message);
}