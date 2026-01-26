// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// State
let currentElection = null;
let positions = [];
let allCandidates = [];
let currentPositionIndex = 0;
let selectedVotes = {}; // { positionId: candidateId }
let studentData = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    showLoading('Initializing...');
    
    // Check authentication
    const token = localStorage.getItem('kibu_token');
    if (!token) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Load student data
        await loadStudentData();
        
        // Get election ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const electionId = urlParams.get('election');
        
        if (!electionId) {
            alert('No election selected');
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Check if already voted
        const hasVoted = await checkIfVoted(electionId);
        if (hasVoted) {
            alert('You have already voted in this election!');
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Load election data
        await loadElection(electionId);
        await loadPositions(electionId);
        await loadCandidates(electionId);
        
        // Setup UI
        setupEventListeners();
        renderPositionTabs();
        if (positions.length > 0) {
            showPosition(0);
        }
        
        hideLoading();
        
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load voting page. Please try again.');
        hideLoading();
    }
}

// Load student data
async function loadStudentData() {
    const token = localStorage.getItem('kibu_token');
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error('Failed to load student data');
    
    studentData = data.data.student;
    document.getElementById('user-name').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
}

// Check if student has voted
async function checkIfVoted(electionId) {
    const token = localStorage.getItem('kibu_token');
    const response = await fetch(`${API_BASE_URL}/votes/status/${electionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    return data.success && data.data.hasVoted;
}

// Load election
async function loadElection(electionId) {
    const token = localStorage.getItem('kibu_token');
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error('Failed to load election');
    
    currentElection = data.data;
    
    // Update UI
    document.getElementById('election-title').textContent = currentElection.title;
    document.getElementById('election-description').textContent = currentElection.description;
    
    // Start countdown
    startCountdown(currentElection.endDate);
}

// Load positions
async function loadPositions(electionId) {
    const token = localStorage.getItem('kibu_token');
    const response = await fetch(`${API_BASE_URL}/positions/election/${electionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error('Failed to load positions');
    
    positions = data.data;
    
    document.getElementById('positions-count').textContent = `${positions.length} positions`;
    document.getElementById('total-count').textContent = positions.length;
}

// Load candidates
async function loadCandidates(electionId) {
    const token = localStorage.getItem('kibu_token');
    const response = await fetch(`${API_BASE_URL}/candidates/election/${electionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error('Failed to load candidates');
    
    allCandidates = data.data;
    
    document.getElementById('candidates-count').textContent = `${allCandidates.length} candidates`;
}

// Render position tabs
function renderPositionTabs() {
    const container = document.getElementById('position-tabs');
    container.innerHTML = '';
    
    positions.forEach((position, index) => {
        const tab = document.createElement('button');
        tab.className = 'position-tab';
        tab.textContent = position.title;
        tab.onclick = () => showPosition(index);
        
        if (index === 0) tab.classList.add('active');
        if (selectedVotes[position._id]) tab.classList.add('completed');
        
        container.appendChild(tab);
    });
}

// Show position and its candidates
function showPosition(index) {
    currentPositionIndex = index;
    const position = positions[index];
    
    // Update active tab
    document.querySelectorAll('.position-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // Update position info
    document.getElementById('position-title').textContent = position.title;
    document.getElementById('position-description').textContent = position.description;
    
    // Show candidates for this position
    renderCandidates(position._id);
}

// Fix for candidate filtering in renderCandidates function:
function renderCandidates(positionId) {
    const container = document.getElementById('candidates-grid');
    
    // Filter approved candidates for this position
    const positionCandidates = allCandidates.filter(c => 
        c.positionId._id === positionId && c.status === 'approved'
    );
    
    if (positionCandidates.length === 0) {
        container.innerHTML = '<div class="empty-message">No approved candidates for this position</div>';
        return;
    }
    
    container.innerHTML = '';
    
    positionCandidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        if (selectedVotes[positionId] === candidate._id) {
            card.classList.add('selected');
        }
        
        // Check if candidate.studentId is populated (it should be based on your API)
        const student = candidate.studentId;
        const initial = student.firstName ? student.firstName.charAt(0).toUpperCase() : '?';
        
        card.innerHTML = `
            ${selectedVotes[positionId] === candidate._id 
                ? '<div class="selected-badge"><i class="fas fa-check"></i></div>' 
                : ''}
            <div class="candidate-photo">
                ${student.profilePhoto 
                    ? `<img src="${student.profilePhoto}" alt="${student.firstName}">` 
                    : `<div class="candidate-initial">${initial}</div>`}
            </div>
            <div class="candidate-name">${student.firstName} ${student.lastName}</div>
            <div class="candidate-reg">${student.registrationNumber}</div>
            <div class="candidate-faculty">${student.faculty || 'N/A'}</div>
            <div class="candidate-manifesto">${candidate.manifesto}</div>
        `;
        
        card.onclick = () => selectCandidate(positionId, candidate._id);
        container.appendChild(card);
    });
}

// Add validation before submitting vote
async function submitVote() {
    hideConfirmModal();
    showLoading('Submitting your vote...');
    
    try {
        // Check if all positions are filled
        const selectedPositions = Object.keys(selectedVotes);
        if (selectedPositions.length !== positions.length) {
            hideLoading();
            alert(`Please vote for all ${positions.length} positions before submitting.`);
            return;
        }
        
        // Prepare votes array
        const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
            positionId,
            candidateId
        }));
        
        const token = localStorage.getItem('kibu_token');
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
            showSuccessModal(data.data);
            // Clear localStorage token to prevent re-voting
            localStorage.removeItem('kibu_token');
        } else {
            alert(data.message || 'Failed to submit vote');
        }
        
    } catch (error) {
        console.error('Submit error:', error);
        hideLoading();
        alert('Failed to submit vote. Please try again.');
    }
}

// Select/deselect candidate
function selectCandidate(positionId, candidateId) {
    // Toggle selection
    if (selectedVotes[positionId] === candidateId) {
        delete selectedVotes[positionId];
    } else {
        selectedVotes[positionId] = candidateId;
    }
    
    // Update UI
    renderCandidates(positionId);
    renderPositionTabs();
    updateSelectionsSummary();
    updateProgress();
}

// Update the submit button enable/disable logic
function updateSelectionsSummary() {
    const container = document.getElementById('selections-list');
    const selectedCount = Object.keys(selectedVotes).length;
    const totalPositions = positions.length;
    
    if (selectedCount === 0) {
        container.innerHTML = '<p class="empty-message">No selections yet</p>';
        document.getElementById('clear-btn').disabled = true;
        document.getElementById('submit-btn').disabled = true;
        return;
    }
    
    container.innerHTML = '';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const student = candidate.studentId || {};
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.innerHTML = `
            <div>
                <strong>${position.title}:</strong> 
                ${student.firstName || ''} ${student.lastName || ''}
            </div>
            <button onclick="removeSelection('${positionId}')">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
        
        container.appendChild(item);
    });
    
    document.getElementById('clear-btn').disabled = false;
    // Enable submit only if all positions are filled
    document.getElementById('submit-btn').disabled = selectedCount !== totalPositions;
}


// Remove selection
window.removeSelection = function(positionId) {
    delete selectedVotes[positionId];
    renderCandidates(positions[currentPositionIndex]._id);
    renderPositionTabs();
    updateSelectionsSummary();
    updateProgress();
};

// Update progress
function updateProgress() {
    const selectedCount = Object.keys(selectedVotes).length;
    const totalCount = positions.length;
    const percentage = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('voted-count').textContent = selectedCount;
}

// Start countdown
function startCountdown(endDate) {
    const updateTimer = () => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const distance = end - now;
        
        if (distance < 0) {
            document.getElementById('countdown-timer').textContent = 'ENDED';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-timer').textContent = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('logout-btn').onclick = logout;
    document.getElementById('clear-btn').onclick = clearAll;
    document.getElementById('submit-btn').onclick = showConfirmModal;
    document.getElementById('cancel-btn').onclick = hideConfirmModal;
    document.getElementById('confirm-btn').onclick = submitVote;
    document.getElementById('view-results-btn').onclick = () => {
        window.location.href = `results.html?election=${currentElection._id}`;
    };
}

// Clear all selections
function clearAll() {
    if (confirm('Clear all selections?')) {
        selectedVotes = {};
        renderCandidates(positions[currentPositionIndex]._id);
        renderPositionTabs();
        updateSelectionsSummary();
        updateProgress();
    }
}

// Show confirmation modal
function showConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const container = document.getElementById('final-selections');
    
    container.innerHTML = '';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const item = document.createElement('div');
        item.className = 'final-selection';
        item.innerHTML = `
            <strong>${position.title}:</strong> 
            ${candidate.studentId.firstName} ${candidate.studentId.lastName}
        `;
        
        container.appendChild(item);
    });
    
    modal.classList.add('active');
}

// Hide confirmation modal
function hideConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

// Submit vote
async function submitVote() {
    hideConfirmModal();
    showLoading('Submitting your vote...');
    
    try {
        const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
            positionId,
            candidateId
        }));
        
        const token = localStorage.getItem('kibu_token');
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
            showSuccessModal(data.data);
        } else {
            alert(data.message || 'Failed to submit vote');
        }
        
    } catch (error) {
        console.error('Submit error:', error);
        hideLoading();
        alert('Failed to submit vote. Please try again.');
    }
}

// Show success modal
function showSuccessModal(voteData) {
    document.getElementById('vote-hash').textContent = voteData.voteHash;
    document.getElementById('vote-time').textContent = new Date(voteData.timestamp).toLocaleString();
    document.getElementById('success-modal').classList.add('active');
}

// Logout
function logout() {
    localStorage.removeItem('kibu_token');
    window.location.href = 'login.html';
}

// Loading overlay
function showLoading(text) {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}