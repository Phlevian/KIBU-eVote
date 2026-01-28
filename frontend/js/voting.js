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
    console.log('Voting page initialization started...');
    showLoading('Initializing voting system...');
    
    try {
        // Check authentication
        const token = localStorage.getItem('kibu_token');
        console.log('Token check:', token ? 'Token found' : 'No token');
        
        if (!token) {
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }
        
        // Get election ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const electionId = urlParams.get('election');
        console.log('Election ID from URL:', electionId);
        
        if (!electionId) {
            alert('No election selected. Please select an election from the dashboard.');
            window.location.href = 'dashboard.html';
            return;
        }
        
        // First test if backend is reachable
        console.log('Testing backend connection...');
        try {
            const testResponse = await fetch(`${API_BASE_URL}/test`);
            console.log('Backend test response:', testResponse.status);
            if (!testResponse.ok) {
                throw new Error(`Backend responded with ${testResponse.status}`);
            }
            const testData = await testResponse.json();
            console.log('Backend test data:', testData);
        } catch (testError) {
            console.error('Backend test failed:', testError);
            alert('Cannot connect to backend server. Please make sure the server is running on port 5000.');
            return;
        }
        
        // Load student data
        console.log('Loading student data...');
        await loadStudentData(token);
        
        // Check if already voted
        console.log('Checking voting status...');
        await checkIfVoted(electionId, token);
        
        // Load election data
        console.log('Loading election data...');
        await loadElection(electionId, token);
        
        // Load positions
        console.log('Loading positions...');
        await loadPositions(electionId, token);
        
        // Load candidates
        console.log('Loading candidates...');
        await loadCandidates(electionId, token);
        
        // Debug log loaded data
        console.log('Loaded data:', {
            positions: positions.length,
            candidates: allCandidates.length,
            election: currentElection?.title
        });
        
        // Setup UI
        console.log('Setting up UI...');
        setupEventListeners();
        renderPositionTabs();
        
        if (positions.length > 0) {
            showPosition(0);
        } else {
            console.warn('No positions found for this election');
            showNoPositionsMessage();
        }
        
        hideLoading();
        console.log('Voting page initialized successfully!');
        
    } catch (error) {
        console.error('Initialization error:', error);
        console.error('Error stack:', error.stack);
        hideLoading();
        
        // Show user-friendly error
        let errorMessage = 'Failed to load voting page. ';
        
        if (error.message.includes('network') || error.message.includes('Network')) {
            errorMessage += 'Network error. Please check your internet connection.';
        } else if (error.message.includes('401') || error.message.includes('token')) {
            errorMessage += 'Session expired. Please login again.';
            localStorage.removeItem('kibu_token');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else if (error.message.includes('404') || error.message.includes('not found')) {
            errorMessage += 'Election not found. The election may have been removed.';
        } else if (error.message.includes('Already voted')) {
            // Already handled in checkIfVoted
            return;
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
}
// In your voting page JavaScript
async function loadVotingPage() {
  // Get election ID from URL or storage
  const urlParams = new URLSearchParams(window.location.search);
  const electionId = urlParams.get('electionId') 
                    || localStorage.getItem('selectedElectionId');
  
  if (!electionId) {
    showError("No election selected. Please select an election first.");
    return;
  }
  
  // Now fetch THIS specific election
  const response = await fetch(`/api/elections/${electionId}`);
  const election = await response.json();
  
  // Load positions and candidates for THIS election
  loadPositions(election.positions);
}
// Load student data
async function loadStudentData(token) {
    console.log('Fetching student data from:', `${API_BASE_URL}/auth/me`);
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Student data response status:', response.status);
    
    if (response.status === 401) {
        throw new Error('Invalid or expired token. Please login again.');
    }
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load student data`);
    }
    
    const data = await response.json();
    console.log('Student data response:', data);
    
    if (!data.success) {
        throw new Error(data.message || 'Failed to load student data');
    }
    
    studentData = data.data.student;
    console.log('Student data loaded:', studentData);
    
    // Update user name in header
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = `${studentData.firstName} ${studentData.lastName}`;
    }
}

// Check if student has voted
async function checkIfVoted(electionId, token) {
    console.log('Checking voting status...');
    
    const response = await fetch(`${API_BASE_URL}/votes/status/${electionId}`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        console.log('Voting status check failed, assuming not voted');
        return; // Assume not voted if check fails
    }
    
    const data = await response.json();
    if (data.success && data.data.hasVoted) {
        alert('You have already voted in this election!');
        window.location.href = 'dashboard.html';
        throw new Error('Already voted');
    }
}

// Load election - FIXED VERSION
async function loadElection(electionId, token) {
    console.log('Fetching election from:', `${API_BASE_URL}/elections/${electionId}`);
    
    const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Election response status:', response.status);
    
    if (response.status === 404) {
        showNoElectionMessage('Election not found');
        throw new Error('Election not found');
    }
    
    if (!response.ok) {
        throw new Error(`Failed to load election: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Election data:', data);
    
    if (!data.success) {
        showNoElectionMessage(data.message || 'Failed to load election');
        throw new Error(data.message || 'Failed to load election');
    }
    
    currentElection = data.data;
    console.log('Election loaded:', currentElection);
    
    // Update UI - SAFELY check if elements exist
    const electionTitleElement = document.getElementById('election-title');
    const electionDescriptionElement = document.getElementById('election-description');
    
    if (electionTitleElement) {
        electionTitleElement.textContent = currentElection.title;
    }
    
    if (electionDescriptionElement) {
        electionDescriptionElement.textContent = currentElection.description;
    }
    
    // Start countdown if end date exists
    if (currentElection.endDate) {
        startCountdown(currentElection.endDate);
    }
}

// Show no election message - FIXED VERSION
function showNoElectionMessage(message = 'No election data available') {
    console.log('Showing no election message:', message);
    
    // Safely update elements if they exist
    const electionTitleElement = document.getElementById('election-title');
    const electionDescriptionElement = document.getElementById('election-description');
    const positionTitleElement = document.getElementById('position-title');
    const positionDescriptionElement = document.getElementById('position-description');
    const candidatesGridElement = document.getElementById('candidates-grid');
    
    if (electionTitleElement) {
        electionTitleElement.textContent = 'Election Not Found';
    }
    
    if (electionDescriptionElement) {
        electionDescriptionElement.textContent = message;
    }
    
    if (positionTitleElement) {
        positionTitleElement.textContent = 'Cannot Load Voting';
    }
    
    if (positionDescriptionElement) {
        positionDescriptionElement.textContent = 'The election you are trying to vote in could not be found.';
    }
    
    if (candidatesGridElement) {
        candidatesGridElement.innerHTML = `
            <div class="no-election-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Election Not Available</h3>
                <p>${message}</p>
                <button onclick="window.location.href='dashboard.html'" class="btn-primary">
                    Return to Dashboard
                </button>
            </div>
        `;
    }
}

// Load positions
async function loadPositions(electionId, token) {
    console.log('Fetching positions from:', `${API_BASE_URL}/positions/election/${electionId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/positions/election/${electionId}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Positions response status:', response.status);
        
        if (!response.ok) {
            console.warn('Positions not found or error:', response.status);
            positions = []; // Set empty array if no positions
            return;
        }
        
        const data = await response.json();
        console.log('Positions data:', data);
        
        if (data.success) {
            positions = data.data || [];
        } else {
            positions = [];
        }
        
        console.log('Positions loaded:', positions.length);
        
        // Update UI
        const positionsCountElement = document.getElementById('positions-count');
        const totalCountElement = document.getElementById('total-count');
        
        if (positionsCountElement) {
            positionsCountElement.textContent = `${positions.length} positions`;
        }
        
        if (totalCountElement) {
            totalCountElement.textContent = positions.length;
        }
        
    } catch (error) {
        console.error('Error loading positions:', error);
        positions = []; // Set empty array on error
    }
}

// Load candidates
async function loadCandidates(electionId, token) {
    console.log('Fetching candidates from:', `${API_BASE_URL}/candidates/election/${electionId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/candidates/election/${electionId}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Candidates response status:', response.status);
        
        if (!response.ok) {
            console.warn('Candidates not found or error:', response.status);
            allCandidates = []; // Set empty array if no candidates
            return;
        }
        
        const data = await response.json();
        console.log('Candidates data structure:', {
            success: data.success,
            count: data.count,
            dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'N/A'
        });
        
        if (data.success) {
            allCandidates = data.data || [];
        } else {
            allCandidates = [];
        }
        
        console.log('Candidates loaded:', allCandidates.length);
        
        // Update UI
        const candidatesCountElement = document.getElementById('candidates-count');
        if (candidatesCountElement) {
            candidatesCountElement.textContent = `${allCandidates.length} candidates`;
        }
        
    } catch (error) {
        console.error('Error loading candidates:', error);
        allCandidates = []; // Set empty array on error
    }
}

// Show no positions message
function showNoPositionsMessage() {
    const positionTitleElement = document.getElementById('position-title');
    const positionDescriptionElement = document.getElementById('position-description');
    const candidatesGridElement = document.getElementById('candidates-grid');
    
    if (positionTitleElement) {
        positionTitleElement.textContent = 'No Positions Available';
    }
    
    if (positionDescriptionElement) {
        positionDescriptionElement.textContent = 'This election does not have any positions to vote for.';
    }
    
    if (candidatesGridElement) {
        candidatesGridElement.innerHTML = `
            <div class="no-data">
                <i class="fas fa-exclamation-circle"></i>
                <h3>No Voting Positions</h3>
                <p>Please contact the election administrator if you believe this is an error.</p>
            </div>
        `;
    }
}

// Render position tabs
function renderPositionTabs() {
    const container = document.getElementById('position-tabs');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (positions.length === 0) {
        container.innerHTML = '<div class="no-positions">No positions available for this election</div>';
        return;
    }
    
    positions.forEach((position, index) => {
        const tab = document.createElement('button');
        tab.className = 'position-tab';
        tab.innerHTML = `
            <span class="tab-title">${position.title}</span>
            ${selectedVotes[position._id] ? '<span class="tab-check"><i class="fas fa-check"></i></span>' : ''}
        `;
        tab.onclick = () => showPosition(index);
        
        if (index === currentPositionIndex) {
            tab.classList.add('active');
        }
        if (selectedVotes[position._id]) {
            tab.classList.add('completed');
        }
        
        container.appendChild(tab);
    });
}

// Show position and candidates
function showPosition(index) {
    currentPositionIndex = index;
    const position = positions[index];
    
    // Update active tab
    document.querySelectorAll('.position-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // Update position info
    const positionTitleElement = document.getElementById('position-title');
    const positionDescriptionElement = document.getElementById('position-description');
    
    if (positionTitleElement) {
        positionTitleElement.textContent = position.title;
    }
    
    if (positionDescriptionElement) {
        positionDescriptionElement.textContent = position.description;
    }
    
    // Show candidates
    renderCandidates(position._id);
}

// Render candidates for a position
function renderCandidates(positionId) {
    const container = document.getElementById('candidates-grid');
    if (!container) return;
    
    // Filter candidates for this position
    const positionCandidates = allCandidates.filter(candidate => {
        if (!candidate || !candidate.positionId) return false;
        
        // Handle both string and object positionId
        const candidatePositionId = typeof candidate.positionId === 'object' 
            ? candidate.positionId._id 
            : candidate.positionId;
        
        return candidatePositionId === positionId && candidate.status === 'approved';
    });
    
    if (positionCandidates.length === 0) {
        container.innerHTML = `
            <div class="no-candidates">
                <i class="fas fa-user-slash"></i>
                <h3>No Candidates</h3>
                <p>There are no approved candidates for this position yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    positionCandidates.forEach(candidate => {
        if (!candidate || !candidate.studentId) {
            console.warn('Invalid candidate data:', candidate);
            return;
        }
        
        const student = candidate.studentId;
        const card = document.createElement('div');
        card.className = 'candidate-card';
        
        // Check if this candidate is selected
        if (selectedVotes[positionId] === candidate._id) {
            card.classList.add('selected');
        }
        
        // Get student initials safely
        const firstName = student.firstName || 'Unknown';
        const lastName = student.lastName || 'Candidate';
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        
        // Get registration number safely
        const regNumber = student.registrationNumber || 'N/A';
        
        // Get faculty and course safely
        const faculty = student.faculty || 'Unknown Faculty';
        const course = student.course || 'Unknown Course';
        
        card.innerHTML = `
            ${selectedVotes[positionId] === candidate._id ? 
                '<div class="selected-badge"><i class="fas fa-check"></i> Selected</div>' : ''}
            
            <div class="candidate-avatar">
                <div class="avatar-initials">${initials}</div>
            </div>
            
            <div class="candidate-info">
                <h3 class="candidate-name">${firstName} ${lastName}</h3>
                <p class="candidate-reg">${regNumber}</p>
                <p class="candidate-faculty">${faculty} - ${course}</p>
                
                <div class="candidate-manifesto">
                    <h4>Manifesto:</h4>
                    <p>${candidate.manifesto || 'No manifesto provided'}</p>
                </div>
            </div>
            
            <div class="candidate-actions">
                <button class="select-btn ${selectedVotes[positionId] === candidate._id ? 'selected' : ''}"
                        onclick="selectCandidate('${positionId}', '${candidate._id}')">
                    ${selectedVotes[positionId] === candidate._id ? 
                        '<i class="fas fa-times"></i> Deselect' : 
                        '<i class="fas fa-check"></i> Select'}
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
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

// Update selections summary
function updateSelectionsSummary() {
    const container = document.getElementById('selections-list');
    if (!container) return;
    
    const selectedCount = Object.keys(selectedVotes).length;
    const totalPositions = positions.length;
    
    if (selectedCount === 0) {
        container.innerHTML = `
            <div class="empty-selections">
                <i class="fas fa-inbox"></i>
                <p>No selections yet. Choose candidates from the list above.</p>
            </div>
        `;
        
        const clearBtn = document.getElementById('clear-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (clearBtn) clearBtn.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        
        return;
    }
    
    let html = '';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const student = candidate.studentId;
        html += `
            <div class="selection-item">
                <div class="selection-info">
                    <strong>${position.title}:</strong>
                    <span>${student.firstName} ${student.lastName}</span>
                </div>
                <button class="remove-btn" onclick="removeSelection('${positionId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Enable/disable buttons
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (clearBtn) clearBtn.disabled = selectedCount === 0;
    if (submitBtn) submitBtn.disabled = selectedCount !== totalPositions;
}

// Remove selection
window.removeSelection = function(positionId) {
    delete selectedVotes[positionId];
    renderCandidates(positions[currentPositionIndex]._id);
    renderPositionTabs();
    updateSelectionsSummary();
    updateProgress();
};

// Update progress bar
function updateProgress() {
    const progressFillElement = document.getElementById('progress-fill');
    const votedCountElement = document.getElementById('voted-count');
    
    if (!progressFillElement || !votedCountElement) return;
    
    const selectedCount = Object.keys(selectedVotes).length;
    const totalCount = positions.length;
    const percentage = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
    
    progressFillElement.style.width = `${percentage}%`;
    votedCountElement.textContent = selectedCount;
}

// Start countdown timer
function startCountdown(endDate) {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    function updateTimer() {
        const now = new Date();
        const end = new Date(endDate);
        const timeLeft = end - now;
        
        if (timeLeft <= 0) {
            countdownElement.textContent = 'Voting Closed';
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = true;
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownElement.textContent = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }
    
    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.onclick = clearAllSelections;
    }
    
    // Submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.onclick = showConfirmModal;
    }
    
    // Modal buttons
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const viewResultsBtn = document.getElementById('view-results-btn');
    
    if (cancelBtn) cancelBtn.onclick = hideConfirmModal;
    if (confirmBtn) confirmBtn.onclick = submitVote;
    if (viewResultsBtn) viewResultsBtn.onclick = viewResults;
}
// FRONTEND: Before navigating to voting page
async function goToVoting(electionId) {
  // Store election ID
  localStorage.setItem('selectedElectionId', electionId);
  
  // Navigate with ID in URL
  window.location.href = `/vote?electionId=${electionId}`;
  // OR
  window.location.href = `/vote/${electionId}`;
}
// Logout
function logout() {
    localStorage.removeItem('kibu_token');
    window.location.href = 'login.html';
}

// Clear all selections
function clearAllSelections() {
    if (confirm('Are you sure you want to clear all selections?')) {
        selectedVotes = {};
        if (positions.length > 0) {
            renderCandidates(positions[currentPositionIndex]._id);
        }
        renderPositionTabs();
        updateSelectionsSummary();
        updateProgress();
    }
}

// Show confirmation modal
function showConfirmModal() {
    const selectedCount = Object.keys(selectedVotes).length;
    const totalPositions = positions.length;
    
    if (selectedCount !== totalPositions) {
        alert(`Please select candidates for all ${totalPositions} positions before submitting.`);
        return;
    }
    
    const modal = document.getElementById('confirm-modal');
    const container = document.getElementById('final-selections');
    
    if (!modal || !container) return;
    
    let html = '<div class="final-selections-list">';
    
    Object.entries(selectedVotes).forEach(([positionId, candidateId]) => {
        const position = positions.find(p => p._id === positionId);
        const candidate = allCandidates.find(c => c._id === candidateId);
        
        if (!position || !candidate) return;
        
        const student = candidate.studentId;
        html += `
            <div class="final-selection-item">
                <div class="position-name">${position.title}</div>
                <div class="candidate-name">${student.firstName} ${student.lastName}</div>
                <div class="candidate-details">${student.registrationNumber} | ${student.faculty}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    modal.classList.add('active');
}

// Hide confirmation modal
function hideConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Submit vote
async function submitVote() {
    hideConfirmModal();
    showLoading('Submitting your vote...');
    
    try {
        const token = localStorage.getItem('kibu_token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        if (!currentElection || !currentElection._id) {
            throw new Error('No election selected');
        }
        
        const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
            positionId,
            candidateId
        }));
        
        console.log('Submitting vote with data:', {
            electionId: currentElection._id,
            votes: votes
        });
        
        const response = await fetch(`${API_BASE_URL}/votes/cast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                electionId: currentElection._id,
                votes: votes
            })
        });
        
        const data = await response.json();
        console.log('Vote submission response:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to submit vote');
        }
        
        hideLoading();
        showSuccessModal(data.data);
        
    } catch (error) {
        console.error('Submit error:', error);
        hideLoading();
        alert('Failed to submit vote: ' + error.message);
    }
}

// Show success modal
function showSuccessModal(voteData) {
    const voteHashElement = document.getElementById('vote-hash');
    const voteTimeElement = document.getElementById('vote-time');
    const successModal = document.getElementById('success-modal');
    
    if (voteHashElement) {
        voteHashElement.textContent = voteData.voteHash || 'No hash generated';
    }
    
    if (voteTimeElement) {
        voteTimeElement.textContent = new Date(voteData.timestamp).toLocaleString();
    }
    
    if (successModal) {
        successModal.classList.add('active');
    }
}

// View results
function viewResults() {
    if (currentElection && currentElection._id) {
        window.location.href = `results.html?election=${currentElection._id}`;
    } else {
        alert('No election selected');
    }
}

// Loading functions
function showLoading(text) {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    if (loadingText) {
        loadingText.textContent = text;
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Make functions globally available
window.selectCandidate = selectCandidate;
window.removeSelection = removeSelection;