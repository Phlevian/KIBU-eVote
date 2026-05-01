// voting.js – FIXED: election ID handling + positionId string comparison
const API_BASE_URL = 'http://localhost:5000/api';

let currentElection = null;
let positions = [];
let allCandidates = [];
let currentPositionIndex = 0;
let selectedVotes = {};
let studentData = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  showLoading('Loading voting system...');
  try {
    const token = localStorage.getItem('kibu_token');
    if (!token) throw new Error('No token. Please log in.');

    // ✅ FIX: Get election ID from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    let electionId = urlParams.get('election');

    if (!electionId) {
      // ✅ FIX: Instead of just throwing, try to get active elections and redirect
      hideLoading();
      await handleNoElectionId(token);
      return;
    }

    await loadStudentData(token);
    await checkIfVoted(electionId, token);
    await loadElection(electionId, token);
    await loadPositions(electionId, token);
    await loadCandidates(electionId, token);
    setupEventListeners();
    renderPositionTabs();
    if (positions.length) showPosition(0);
    else showNoPositionsMessage();
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error('Init error:', error);
    alert(error.message);
    if (
      error.message.includes('token') ||
      error.message.includes('log in') ||
      error.message.includes('Invalid token')
    ) {
      window.location.href = 'login.html';
    }
  }
}

// ✅ NEW: If no election ID in URL, fetch active elections and redirect to first one
async function handleNoElectionId(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/elections/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.success && data.data && data.data.length > 0) {
      // Redirect to voting page with the first active election's ID
      const firstElection = data.data[0];
      window.location.href = `voting.html?election=${firstElection._id}`;
    } else {
      document.getElementById('candidates-grid').innerHTML =
        '<div class="empty-message">No active elections available at this time.</div>';
      document.getElementById('election-title').innerText = 'No Active Elections';
      document.getElementById('election-description').innerText =
        'There are currently no active elections to vote in.';
    }
  } catch (err) {
    console.error('handleNoElectionId error:', err);
    alert('Could not load active elections. Please try again or contact support.');
  }
}

async function loadStudentData(token) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load user data');
  studentData = data.data.student;
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.innerText = `${studentData.firstName} ${studentData.lastName}`;
}

async function checkIfVoted(electionId, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/votes/status/${electionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.hasVoted) {
        alert('You have already voted in this election!');
        window.location.href = 'dashboard.html';
        throw new Error('Already voted');
      }
    }
  } catch (err) {
    if (err.message === 'Already voted') throw err;
    // If status check fails for other reasons, allow voting to continue
    console.warn('Could not check vote status:', err.message);
  }
}

async function loadElection(electionId, token) {
  const res = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Election not found');
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load election');
  currentElection = data.data;

  const titleEl = document.getElementById('election-title');
  const descEl = document.getElementById('election-description');
  if (titleEl) titleEl.innerText = currentElection.title;
  if (descEl) descEl.innerText = currentElection.description || '';
  if (currentElection.endDate) startCountdown(currentElection.endDate);
}

async function loadPositions(electionId, token) {
  const res = await fetch(`${API_BASE_URL}/positions/election/${electionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  positions = data.data || [];

  const countEl = document.getElementById('positions-count');
  const totalEl = document.getElementById('total-count');
  if (countEl) countEl.innerText = `${positions.length} positions`;
  if (totalEl) totalEl.innerText = positions.length;

  console.log(`Loaded ${positions.length} positions`);
}

async function loadCandidates(electionId, token) {
  const res = await fetch(`${API_BASE_URL}/candidates/election/${electionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  allCandidates = data.data || [];

  const countEl = document.getElementById('candidates-count');
  if (countEl) countEl.innerText = `${allCandidates.length} candidates`;

  console.log(`Loaded ${allCandidates.length} candidates`);
}

function renderPositionTabs() {
  const container = document.getElementById('position-tabs');
  if (!container) return;
  container.innerHTML = '';

  if (!positions.length) {
    container.innerHTML = '<div class="empty-message">No positions available</div>';
    return;
  }

  positions.forEach((pos, idx) => {
    const tab = document.createElement('button');
    tab.className = 'position-tab';
    if (idx === currentPositionIndex) tab.classList.add('active');
    if (selectedVotes[pos._id]) tab.classList.add('completed');
    tab.innerHTML = `<span>${escapeHtml(pos.title)}</span>${selectedVotes[pos._id] ? ' ✓' : ''}`;
    tab.onclick = () => showPosition(idx);
    container.appendChild(tab);
  });
}

function showPosition(index) {
  currentPositionIndex = index;
  const pos = positions[index];

  const titleEl = document.getElementById('position-title');
  const descEl = document.getElementById('position-description');
  if (titleEl) titleEl.innerText = pos.title;
  if (descEl) descEl.innerText = pos.description || 'Select a candidate below.';

  document.querySelectorAll('.position-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  renderCandidates(pos._id);
}

function renderCandidates(positionId) {
  const container = document.getElementById('candidates-grid');
  if (!container) return;

  // ✅ FIX: Normalize positionId to string for comparison
  // The API returns positionId as an ObjectId object or string
  const posIdStr = positionId.toString();

  const candidatesForPos = allCandidates.filter(c => {
    const candPosId = c.positionId?._id
      ? c.positionId._id.toString()
      : c.positionId?.toString();
    return candPosId === posIdStr && c.status === 'approved';
  });

  if (!candidatesForPos.length) {
    container.innerHTML = '<div class="empty-message">No approved candidates for this position.</div>';
    return;
  }

  container.innerHTML = '';

  for (const cand of candidatesForPos) {
    const isSelected = selectedVotes[posIdStr] === cand._id.toString();
    const initials = getInitials(cand.name);
    const card = document.createElement('div');
    card.className = `candidate-card${isSelected ? ' selected' : ''}`;

    card.innerHTML = `
      ${isSelected ? '<div class="selected-badge"><i class="fas fa-check"></i></div>' : ''}
      <div class="candidate-avatar">
        <div class="avatar-initials">${escapeHtml(initials)}</div>
      </div>
      <div class="candidate-info">
        <h3 class="candidate-name">${escapeHtml(cand.name)}</h3>
        <p class="candidate-reg">${escapeHtml(cand.regNo)}</p>
        <p class="candidate-faculty">${escapeHtml(cand.department || 'N/A')}</p>
        <div class="candidate-manifesto">
          <h4>Manifesto:</h4>
          <p>${escapeHtml(cand.manifesto || 'No manifesto provided')}</p>
        </div>
      </div>
      <div class="candidate-actions">
        <button class="select-btn" data-position="${posIdStr}" data-candidate="${cand._id}">
          ${isSelected
            ? '<i class="fas fa-times"></i> Deselect'
            : '<i class="fas fa-check"></i> Select'}
        </button>
      </div>
    `;

    const btn = card.querySelector('.select-btn');
    btn.onclick = () => selectCandidate(posIdStr, cand._id.toString());
    container.appendChild(card);
  }
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function selectCandidate(positionId, candidateId) {
  if (selectedVotes[positionId] === candidateId) {
    delete selectedVotes[positionId];
  } else {
    selectedVotes[positionId] = candidateId;
  }
  renderCandidates(positions[currentPositionIndex]._id);
  renderPositionTabs();
  updateSelectionsSummary();
  updateProgress();
}

function updateSelectionsSummary() {
  const container = document.getElementById('selections-list');
  const clearBtn = document.getElementById('clear-btn');
  const submitBtn = document.getElementById('submit-btn');
  if (!container) return;

  const voteCount = Object.keys(selectedVotes).length;

  if (voteCount === 0) {
    container.innerHTML = '<div class="empty-message">No selections yet.</div>';
    if (clearBtn) clearBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  let html = '';
  for (const [posId, candId] of Object.entries(selectedVotes)) {
    const pos = positions.find(p => p._id.toString() === posId);
    const cand = allCandidates.find(c => c._id.toString() === candId);
    if (pos && cand) {
      html += `
        <div class="selection-item">
          <div><strong>${escapeHtml(pos.title)}:</strong> ${escapeHtml(cand.name)}</div>
          <button class="remove-btn" data-pos="${posId}">✖</button>
        </div>`;
    }
  }
  container.innerHTML = html;

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => removeSelection(btn.getAttribute('data-pos'));
  });

  if (clearBtn) clearBtn.disabled = false;
  if (submitBtn) submitBtn.disabled = voteCount !== positions.length;
}

function removeSelection(positionId) {
  delete selectedVotes[positionId];
  if (positions.length) renderCandidates(positions[currentPositionIndex]._id);
  renderPositionTabs();
  updateSelectionsSummary();
  updateProgress();
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const votedEl = document.getElementById('voted-count');
  const voted = Object.keys(selectedVotes).length;
  const total = positions.length;
  const percent = total ? (voted / total) * 100 : 0;
  if (fill) fill.style.width = `${percent}%`;
  if (votedEl) votedEl.innerText = voted;
}

function startCountdown(endDateISO) {
  const end = new Date(endDateISO);
  const timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  const update = () => {
    const diff = end - new Date();
    if (diff <= 0) {
      timerEl.innerText = 'Voting Closed';
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) submitBtn.disabled = true;
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    timerEl.innerText = `${days}d ${hours}h ${mins}m ${secs}s`;
  };
  update();
  setInterval(update, 1000);
}

function clearAllSelections() {
  if (confirm('Clear all your selections?')) {
    selectedVotes = {};
    if (positions.length) renderCandidates(positions[currentPositionIndex]._id);
    renderPositionTabs();
    updateSelectionsSummary();
    updateProgress();
  }
}

async function submitVote() {
  if (Object.keys(selectedVotes).length !== positions.length) {
    alert(`Please select a candidate for all ${positions.length} positions.`);
    return;
  }

  showLoading('Submitting your vote...');
  try {
    const token = localStorage.getItem('kibu_token');
    const votesArray = Object.entries(selectedVotes).map(([posId, candId]) => ({
      positionId: posId,
      candidateId: candId
    }));

    const res = await fetch(`${API_BASE_URL}/votes/cast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ electionId: currentElection._id, votes: votesArray })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Vote submission failed');

    hideLoading();

    const hashEl = document.getElementById('vote-hash');
    const timeEl = document.getElementById('vote-time');
    const modal = document.getElementById('success-modal');
    if (hashEl) hashEl.innerText = data.data.voteHash;
    if (timeEl) timeEl.innerText = new Date(data.data.timestamp).toLocaleString();
    if (modal) modal.classList.add('active');
  } catch (err) {
    hideLoading();
    console.error('submitVote error:', err);
    alert('Vote submission failed: ' + err.message);
  }
}

function showLoading(msg) {
  const overlay = document.getElementById('loading-overlay');
  const text = document.getElementById('loading-text');
  if (overlay) overlay.classList.add('active');
  if (text) text.innerText = msg || 'Loading...';
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function showNoPositionsMessage() {
  const grid = document.getElementById('candidates-grid');
  if (grid) grid.innerHTML = '<div class="empty-message">No positions have been added to this election yet.</div>';
}

function setupEventListeners() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('kibu_token');
    window.location.href = 'login.html';
  });

  document.getElementById('clear-btn')?.addEventListener('click', clearAllSelections);

  document.getElementById('submit-btn')?.addEventListener('click', () => {
    if (Object.keys(selectedVotes).length === positions.length) {
      document.getElementById('confirm-modal')?.classList.add('active');
    } else {
      alert(`Please vote for all ${positions.length} positions before submitting.`);
    }
  });

  document.getElementById('cancel-btn')?.addEventListener('click', () => {
    document.getElementById('confirm-modal')?.classList.remove('active');
  });

  document.getElementById('confirm-btn')?.addEventListener('click', () => {
    document.getElementById('confirm-modal')?.classList.remove('active');
    submitVote();
  });

  document.getElementById('view-results-btn')?.addEventListener('click', () => {
    window.location.href = `results.html?election=${currentElection._id}`;
  });
}

// Expose functions used in HTML onclick attributes (if any)
window.selectCandidate = selectCandidate;
window.removeSelection = removeSelection;