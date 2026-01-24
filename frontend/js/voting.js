// Voting System JavaScript - KIBU Digital Democracy
document.addEventListener('DOMContentLoaded', function() {
    console.log('KIBU Voting System Initializing...');

    // Position data with all 13 positions
    const positions = [
        {
            id: 1,
            title: "Chairperson",
            description: "Lead the student body and represent KIBU students",
            icon: "👑",
            candidates: [
                {
                    id: 1,
                    name: "Sarah Wanjiku",
                    course: "Business Administration - Year 3",
                    platform: "Improve campus facilities and student services",
                    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "James Kiprotich",
                    course: "Computer Science - Year 4",
                    platform: "Digital innovation and tech improvements",
                    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 3,
                    name: "Grace Akinyi",
                    course: "Nursing - Year 3",
                    platform: "Sustainability and environmental initiatives",
                    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 2,
            title: "Vice Chairperson",
            description: "Support the chairperson and oversee committees",
            icon: "👥",
            candidates: [
                {
                    id: 1,
                    name: "Michael Ochieng",
                    course: "Information Technology - Year 3",
                    platform: "Student rights and advocacy",
                    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Lucy Muthoni",
                    course: "Education - Year 2",
                    platform: "Academic support and tutoring programs",
                    photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 3,
            title: "Secretary General",
            description: "Manage documentation and communication",
            icon: "📝",
            candidates: [
                {
                    id: 1,
                    name: "David Kimani",
                    course: "Journalism - Year 3",
                    platform: "Transparent communication and record keeping",
                    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Faith Njeri",
                    course: "Communication - Year 2",
                    platform: "Digital communication and social media engagement",
                    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 4,
            title: "Treasurer",
            description: "Manage student council finances and budgeting",
            icon: "💰",
            candidates: [
                {
                    id: 1,
                    name: "Brian Otieno",
                    course: "Accounting - Year 3",
                    platform: "Financial transparency and accountability",
                    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Susan Wambui",
                    course: "Economics - Year 4",
                    platform: "Efficient fund allocation and financial planning",
                    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 5,
            title: "Academic Secretary",
            description: "Address academic concerns and improve learning environment",
            icon: "📚",
            candidates: [
                {
                    id: 1,
                    name: "Peter Maina",
                    course: "Criminology - Year 3",
                    platform: "Improved library resources and study spaces",
                    photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Alice Chebet",
                    course: "Nursing - Year 2",
                    platform: "Academic support and mentorship programs",
                    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 6,
            title: "Accommodation & Security Secretary",
            description: "Address housing and safety concerns on campus",
            icon: "🏠",
            candidates: [
                {
                    id: 1,
                    name: "Robert Mwangi",
                    course: "Criminology - Year 3",
                    platform: "Enhanced campus security and student safety",
                    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Joyce Atieno",
                    course: "Social Work - Year 2",
                    platform: "Improved hostel facilities and accommodation",
                    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 7,
            title: "Special Interests Secretary",
            description: "Represent diverse student interests and clubs",
            icon: "🎭",
            candidates: [
                {
                    id: 1,
                    name: "Daniel Omolo",
                    course: "Journalism - Year 3",
                    platform: "Support for clubs and extracurricular activities",
                    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Mercy Wanjiru",
                    course: "Social work - Year 2",
                    platform: "Inclusive representation for all student groups",
                    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 8,
            title: "FASS – Academic Nominee",
            description: "Represent Faculty of Arts and Social Sciences academic interests",
            icon: "🎓",
            candidates: [
                {
                    id: 1,
                    name: "John Kamau",
                    course: "Journalism - Year 3",
                    platform: "Enhanced academic resources for FASS",
                    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Maryanne Kariuki",
                    course: "Social work - Year 2",
                    platform: "Support for FASS research and publications",
                    photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 9,
            title: "FASS – Female Nominee",
            description: "Represent female students in Faculty of Arts and Social Sciences",
            icon: "👩",
            candidates: [
                {
                    id: 1,
                    name: "Cynthia Adhiambo",
                    course: "Criminology - Year 3",
                    platform: "Women empowerment and gender equality",
                    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Rebecca Nyong'o",
                    course: "Social work - Year 2",
                    platform: "Support for female students in FASS",
                    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 10,
            title: "FASS – Male Nominee",
            description: "Represent male students in Faculty of Arts and Social Sciences",
            icon: "👨",
            candidates: [
                {
                    id: 1,
                    name: "Samuel Gitau",
                    course: "Journalism - Year 3",
                    platform: "Male student advocacy and support",
                    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Victor Odhiambo",
                    course: "Criminology - Year 2",
                    platform: "Academic support for male students",
                    photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 11,
            title: "Evening & Weekend Nominee",
            description: "Represent part-time and evening/weekend program students",
            icon: "🌙",
            candidates: [
                {
                    id: 1,
                    name: "Pauline Achieng",
                    course: "Business (Evening) - Year 3",
                    platform: "Better scheduling and resources for evening students",
                    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Kevin Mbugua",
                    course: "IT (Weekend) - Year 2",
                    platform: "Support for working students and flexible learning",
                    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 12,
            title: "Part-Time Nominee",
            description: "Represent part-time students' unique needs and concerns",
            icon: "⏱️",
            candidates: [
                {
                    id: 1,
                    name: "Nancy Wambui",
                    course: "Education (Part-time) - Year 3",
                    platform: "Flexible academic policies for part-time students",
                    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Simon Njoroge",
                    course: "Commerce (Part-time) - Year 2",
                    platform: "Support for balancing work and studies",
                    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                }
            ]
        },
        {
            id: 13,
            title: "Postgraduate Nominee",
            description: "Represent postgraduate students and research interests",
            icon: "🎓",
            candidates: [
                {
                    id: 1,
                    name: "Dr. Elizabeth Mwangi",
                    course: "PhD in Education",
                    platform: "Enhanced research facilities and funding",
                    photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Mark Omondi",
                    course: "Masters in Computer Science",
                    platform: "Support for postgraduate research and publications",
                    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
                }
            ]
        }
    ];

    // User selections storage
    let userSelections = {};
    let currentPositionIndex = 0;

    // DOM Elements
    const elements = {
        positionTitle: document.getElementById('position-title'),
        positionDescription: document.getElementById('position-description'),
        positionIcon: document.querySelector('.position-icon'),
        candidatesContainer: document.getElementById('candidates-container'),
        abstainOption: document.getElementById('abstain-option'),
        validationMessage: document.getElementById('validation-message'),
        prevButton: document.getElementById('prev-button'),
        nextButton: document.getElementById('next-button'),
        positionIndicators: document.getElementById('position-indicators'),
        currentPositionSpan: document.getElementById('current-position'),
        progressFill: document.querySelector('.progress-fill'),
        selectionsList: document.getElementById('selections-list'),
        completedPositions: document.getElementById('completed-positions'),
        reviewModal: document.getElementById('review-modal'),
        closeReviewModal: document.getElementById('close-review-modal'),
        backToEdit: document.getElementById('back-to-edit'),
        submitVotes: document.getElementById('submit-votes'),
        processingModal: document.getElementById('processing-modal'),
        successModal: document.getElementById('success-modal'),
        voteSummary: document.getElementById('vote-summary'),
        saveDraftButton: document.getElementById('save-draft'),
        autoSaveStatus: document.getElementById('auto-save-status'),
        countdown: document.getElementById('countdown'),
        sessionTimer: document.getElementById('session-timer'),
        connectionStatus: document.getElementById('connection-status'),
        highContrastToggle: document.getElementById('high-contrast-toggle'),
        textSizeToggle: document.getElementById('text-size-toggle'),
        viewReceipt: document.getElementById('view-receipt'),
        backToDashboard: document.getElementById('back-to-dashboard'),
        themeToggle: document.getElementById('theme-toggle')
    };

    // Initialize the voting interface
    function initVoting() {
        console.log('Initializing voting system...');
        
        // Validate DOM elements
        if (!validateDOMElements()) {
            console.error('Critical DOM elements missing. Please check your HTML structure.');
            showError('System initialization failed. Please refresh the page.');
            return;
        }

        try {
            // Initialize theme
            initTheme();
            
            // Initialize components
            createPositionIndicators();
            loadSavedSelections();
            displayPosition(currentPositionIndex);
            updateNavigationButtons();
            updateSidebar();
            setupEventListeners();
            startTimers();
            
            console.log('Voting system initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
            showError('Failed to initialize voting system. Please try again.');
        }
    }

    // Initialize theme from localStorage
    function initTheme() {
        const savedTheme = localStorage.getItem('kibuVotingTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkTheme();
        } else {
            setLightTheme();
        }
    }

    // Set dark theme
    function setDarkTheme() {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="theme-text">Light Mode</span>';
        localStorage.setItem('kibuVotingTheme', 'dark');
    }

    // Set light theme
    function setLightTheme() {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="theme-text">Dark Mode</span>';
        localStorage.setItem('kibuVotingTheme', 'light');
    }

    // Toggle theme
    function toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    }

    // Validate required DOM elements
    function validateDOMElements() {
        const required = [
            'positionTitle', 'positionDescription', 'candidatesContainer', 
            'abstainOption', 'prevButton', 'nextButton', 'positionIndicators',
            'themeToggle'
        ];
        
        for (const key of required) {
            if (!elements[key]) {
                console.error(`Missing required element: ${key}`);
                return false;
            }
        }
        return true;
    }

    // Create position indicators
    function createPositionIndicators() {
        elements.positionIndicators.innerHTML = '';
        
        positions.forEach((position, index) => {
            const dot = document.createElement('div');
            dot.className = 'position-dot';
            dot.setAttribute('data-position', index);
            dot.setAttribute('aria-label', `Go to position: ${position.title}`);
            
            dot.addEventListener('click', () => goToPosition(index));
            dot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    goToPosition(index);
                }
            });
            
            elements.positionIndicators.appendChild(dot);
        });
        
        updatePositionIndicators();
    }

    // Display a specific position
    function displayPosition(index) {
        if (index < 0 || index >= positions.length) {
            console.error('Invalid position index:', index);
            return;
        }

        const position = positions[index];
        
        // Update position info
        elements.positionTitle.textContent = position.title;
        elements.positionDescription.textContent = position.description;
        elements.positionIcon.textContent = position.icon;
        elements.positionIcon.setAttribute('aria-label', position.title);
        
        // Update current position indicator
        elements.currentPositionSpan.textContent = index + 1;
        
        // Update progress bar
        const progressPercentage = ((index + 1) / positions.length) * 100;
        elements.progressFill.style.width = `${progressPercentage}%`;
        
        // Display candidates
        displayCandidates(position.candidates, position.id);
        
        // Update position indicators
        updatePositionIndicators();
        
        // Check if user has already made a selection for this position
        checkExistingSelection(position.id);
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Hide validation message
        hideValidationMessage();
        
        // Set focus for accessibility
        elements.positionTitle.focus();
    }

    // Display candidates for a position
    function displayCandidates(candidates, positionId) {
        elements.candidatesContainer.innerHTML = '';
        
        candidates.forEach(candidate => {
            const candidateCard = document.createElement('div');
            candidateCard.className = 'candidate-card';
            candidateCard.setAttribute('data-candidate-id', candidate.id);
            candidateCard.setAttribute('tabindex', '0');
            candidateCard.setAttribute('role', 'button');
            candidateCard.setAttribute('aria-label', `Select candidate ${candidate.name}`);
            
            candidateCard.innerHTML = `
                <div class="candidate-selected-indicator">
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                </div>
                <div class="candidate-photo">
                    <img src="${candidate.photo}" alt="Photo of ${candidate.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiM0YTZmYTUiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iMjUiIHk9IjI1Ij4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6bTAgMTdjLTIuNjEgMC00Ljk1LTEuMjgtNi41NC0zLjM4QzcuNTUgMTQuNDIgOS4zMyAxNCAxMiAxNHM0LjQ1LjQyIDYuNTQgMS42MkMxNi45NSAxNy43MiAxNC42MSAxOSAxMiAxOXoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                </div>
                <div class="candidate-info">
                    <h4 class="candidate-name">${candidate.name}</h4>
                    <p class="candidate-course">${candidate.course}</p>
                    <p class="candidate-platform">${candidate.platform}</p>
                </div>
                <button class="vote-button" type="button" aria-label="Vote for ${candidate.name}">
                    SELECT ${candidate.name.split(' ')[0].toUpperCase()}
                </button>
            `;
            
            elements.candidatesContainer.appendChild(candidateCard);
        });
        
        // Add event listeners to candidate cards
        setTimeout(() => {
            document.querySelectorAll('.candidate-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const candidateId = parseInt(this.getAttribute('data-candidate-id'));
                    selectCandidate(positionId, candidateId);
                });
                
                card.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const candidateId = parseInt(this.getAttribute('data-candidate-id'));
                        selectCandidate(positionId, candidateId);
                    }
                });
            });
        }, 0);
        
        // Add event listener to abstain button
        const abstainButton = elements.abstainOption.querySelector('.abstain-button');
        if (abstainButton) {
            abstainButton.addEventListener('click', function(e) {
                e.stopPropagation();
                selectAbstain(positionId);
            });
            
            abstainButton.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectAbstain(positionId);
                }
            });
        }
    }

    // Select a candidate
    function selectCandidate(positionId, candidateId) {
        console.log(`Selecting candidate ${candidateId} for position ${positionId}`);
        
        // Deselect abstain if it was selected
        elements.abstainOption.classList.remove('selected');
        
        // Deselect all candidates
        document.querySelectorAll('.candidate-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select the clicked candidate
        const selectedCard = document.querySelector(`.candidate-card[data-candidate-id="${candidateId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            // Save selection
            const position = positions.find(p => p.id === positionId);
            if (position) {
                const candidate = position.candidates.find(c => c.id === candidateId);
                if (candidate) {
                    userSelections[positionId] = {
                        type: 'candidate',
                        candidateId: candidateId,
                        candidateName: candidate.name,
                        positionTitle: position.title
                    };
                    
                    // Hide validation message
                    hideValidationMessage();
                    
                    // Update UI
                    updateSidebar();
                    updateNavigationButtons();
                    
                    // Auto-save
                    autoSave();
                    
                    // Announce for screen readers
                    announceSelection(`Selected ${candidate.name} for ${position.title}`);
                }
            }
        }
    }

    // Select abstain option
    function selectAbstain(positionId) {
        console.log(`Selecting abstain for position ${positionId}`);
        
        // Deselect all candidates
        document.querySelectorAll('.candidate-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select abstain
        elements.abstainOption.classList.add('selected');
        
        // Save selection
        const position = positions.find(p => p.id === positionId);
        if (position) {
            userSelections[positionId] = {
                type: 'abstain',
                positionTitle: position.title
            };
            
            // Hide validation message
            hideValidationMessage();
            
            // Update UI
            updateSidebar();
            updateNavigationButtons();
            
            // Auto-save
            autoSave();
            
            // Announce for screen readers
            announceSelection(`Abstained from voting for ${position.title}`);
        }
    }

    // Check if user has already made a selection for the current position
    function checkExistingSelection(positionId) {
        if (userSelections[positionId]) {
            if (userSelections[positionId].type === 'candidate') {
                const candidateCard = document.querySelector(`.candidate-card[data-candidate-id="${userSelections[positionId].candidateId}"]`);
                if (candidateCard) {
                    candidateCard.classList.add('selected');
                }
            } else if (userSelections[positionId].type === 'abstain') {
                elements.abstainOption.classList.add('selected');
            }
        }
    }

    // Update position indicators
    function updatePositionIndicators() {
        document.querySelectorAll('.position-dot').forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            
            if (index === currentPositionIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
            
            if (userSelections[positions[index].id]) {
                dot.classList.add('completed');
            }
        });
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        // Previous button
        elements.prevButton.disabled = currentPositionIndex === 0;
        
        // Next button
        const currentPositionId = positions[currentPositionIndex].id;
        elements.nextButton.disabled = !userSelections[currentPositionId];
        
        // Change next button text on last position
        if (currentPositionIndex === positions.length - 1) {
            elements.nextButton.innerHTML = 'Review & Submit <i class="fas fa-arrow-right" aria-hidden="true"></i>';
            elements.nextButton.setAttribute('aria-label', 'Review and submit all votes');
        } else {
            elements.nextButton.innerHTML = 'Next Position <i class="fas fa-arrow-right" aria-hidden="true"></i>';
            elements.nextButton.setAttribute('aria-label', 'Go to next position');
        }
    }

    // Go to a specific position
    function goToPosition(index) {
        if (index < 0 || index >= positions.length) return;
        
        // Validate current position selection before leaving
        const currentPositionId = positions[currentPositionIndex].id;
        if (!userSelections[currentPositionId]) {
            showValidationMessage();
            return;
        }
        
        // Update current position index
        currentPositionIndex = index;
        
        // Display the position
        displayPosition(currentPositionIndex);
    }

    // Navigate to next position
    function nextPosition() {
        // Validate current position selection
        const currentPositionId = positions[currentPositionIndex].id;
        if (!userSelections[currentPositionId]) {
            showValidationMessage();
            return;
        }
        
        // If it's the last position, show review modal
        if (currentPositionIndex === positions.length - 1) {
            showReviewModal();
            return;
        }
        
        // Go to next position
        currentPositionIndex++;
        displayPosition(currentPositionIndex);
    }

    // Navigate to previous position
    function prevPosition() {
        if (currentPositionIndex === 0) return;
        
        currentPositionIndex--;
        displayPosition(currentPositionIndex);
    }

    // Show validation message
    function showValidationMessage() {
        elements.validationMessage.classList.add('show');
        elements.validationMessage.setAttribute('aria-live', 'assertive');
    }

    // Hide validation message
    function hideValidationMessage() {
        elements.validationMessage.classList.remove('show');
    }

    // Update sidebar with current selections
    function updateSidebar() {
        if (!elements.selectionsList || !elements.completedPositions) return;
        
        elements.selectionsList.innerHTML = '';
        
        let completedCount = 0;
        
        positions.forEach(position => {
            const selectionItem = document.createElement('div');
            selectionItem.className = 'selection-item';
            selectionItem.setAttribute('tabindex', '0');
            selectionItem.setAttribute('role', 'button');
            selectionItem.setAttribute('aria-label', `Review selection for ${position.title}`);
            
            const selection = userSelections[position.id];
            let candidateChoice = 'Not selected';
            let status = '❌';
            let statusClass = 'not-selected';
            
            if (selection) {
                completedCount++;
                
                if (selection.type === 'candidate') {
                    candidateChoice = selection.candidateName;
                    status = '✅';
                    statusClass = 'selected';
                } else if (selection.type === 'abstain') {
                    candidateChoice = 'ABSTAIN';
                    status = '➖';
                    statusClass = 'abstained';
                }
            }
            
            selectionItem.innerHTML = `
                <span class="position-name">${position.title}</span>
                <span class="candidate-choice ${statusClass}">${candidateChoice}</span>
                <span class="selection-status" aria-label="Selection status">${status}</span>
            `;
            
            // Add click event to navigate to this position
            selectionItem.addEventListener('click', () => {
                const positionIndex = positions.findIndex(p => p.id === position.id);
                goToPosition(positionIndex);
            });
            
            selectionItem.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const positionIndex = positions.findIndex(p => p.id === position.id);
                    goToPosition(positionIndex);
                }
            });
            
            elements.selectionsList.appendChild(selectionItem);
        });
        
        // Update completed positions count
        elements.completedPositions.textContent = completedCount;
    }

    // Show review modal
    function showReviewModal() {
        console.log('Showing review modal');
        
        // Generate vote summary
        generateVoteSummary();
        
        // Show modal
        elements.reviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set focus to modal for accessibility
        setTimeout(() => {
            const modalHeader = elements.reviewModal.querySelector('h2');
            if (modalHeader) modalHeader.focus();
        }, 100);
    }

    // Generate vote summary for review modal
    function generateVoteSummary() {
        if (!elements.voteSummary) return;
        
        elements.voteSummary.innerHTML = '<h3>Your Vote Summary</h3>';
        
        positions.forEach(position => {
            const selection = userSelections[position.id];
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            
            if (selection && selection.type === 'candidate') {
                const candidate = position.candidates.find(c => c.id === selection.candidateId);
                
                summaryItem.innerHTML = `
                    <div class="summary-candidate">
                        <div class="candidate-photo-small">
                            <img src="${candidate.photo}" alt="${candidate.name}" 
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjIuNSIgY3k9IjIyLjUiIHI9IjIyLjUiIGZpbGw9IiM0YTZmYTUiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iMTIuNSIgeT0iMTIuNSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDNjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02em0wIDE3Yy0yLjYxIDAtNC45NS0xLjI4LTYuNTQtMy4zOEM3LjU1IDE0LjQyIDkuMzMgMTQgMTIgMTRzNC40NS40MiA2LjU0IDEuNjJDMTYuOTUgMTcuNzIgMTQuNjEgMTkgMTIgMTl6IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo8L3N2Zz4K='">
                        </div>
                        <div class="candidate-details">
                            <h4>${position.title}</h4>
                            <p>${candidate.name}</p>
                            <small>${candidate.course}</small>
                        </div>
                    </div>
                    <button class="edit-button" data-position="${position.id}" type="button" aria-label="Edit vote for ${position.title}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                        Edit
                    </button>
                `;
            } else if (selection && selection.type === 'abstain') {
                summaryItem.classList.add('abstained');
                summaryItem.innerHTML = `
                    <div class="summary-candidate">
                        <div class="abstain-icon-small">❌</div>
                        <div class="candidate-details">
                            <h4>${position.title}</h4>
                            <p>[ABSTAIN]</p>
                            <small>No candidate selected</small>
                        </div>
                    </div>
                    <button class="edit-button" data-position="${position.id}" type="button" aria-label="Edit vote for ${position.title}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                        Edit
                    </button>
                `;
            } else {
                summaryItem.classList.add('not-selected');
                summaryItem.innerHTML = `
                    <div class="summary-candidate">
                        <div class="candidate-details">
                            <h4>${position.title}</h4>
                            <p style="color: var(--error-red);">Not selected</p>
                            <small>Please go back and make a selection</small>
                        </div>
                    </div>
                    <button class="edit-button" data-position="${position.id}" type="button" aria-label="Edit vote for ${position.title}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                        Edit
                    </button>
                `;
            }
            
            elements.voteSummary.appendChild(summaryItem);
        });
        
        // Add event listeners to edit buttons
        setTimeout(() => {
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', function() {
                    const positionId = parseInt(this.getAttribute('data-position'));
                    const positionIndex = positions.findIndex(p => p.id === positionId);
                    
                    // Close modal
                    closeReviewModal();
                    
                    // Go to the position
                    goToPosition(positionIndex);
                });
            });
        }, 0);
    }

    // Close review modal
    function closeReviewModal() {
        elements.reviewModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to next button
        setTimeout(() => elements.nextButton.focus(), 100);
    }

    // Submit votes
    function submitVotes() {
        console.log('Submitting votes...');
        
        // Validate all positions have selections
        const incompletePositions = positions.filter(position => !userSelections[position.id]);
        if (incompletePositions.length > 0) {
            alert('Please complete all positions before submitting.');
            closeReviewModal();
            return;
        }
        
        // Close review modal
        closeReviewModal();
        
        // Show processing modal
        elements.processingModal.classList.add('active');
        
        // Simulate blockchain processing
        simulateBlockchainProcessing();
    }

    // Simulate blockchain processing
    function simulateBlockchainProcessing() {
        let progress = 0;
        const blocks = document.querySelectorAll('.blockchain-animation .block');
        const spinner = document.querySelector('.spinner');
        
        const interval = setInterval(() => {
            progress += 20;
            
            // Animate blocks
            if (blocks[progress / 20 - 1]) {
                blocks[progress / 20 - 1].classList.add('active');
            }
            
            // Update spinner
            if (spinner) {
                spinner.style.transform = `rotate(${progress * 3.6}deg)`;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Hide processing modal
                elements.processingModal.classList.remove('active');
                
                // Show success modal
                showSuccessModal();
            }
        }, 300);
    }

    // Show success modal
    function showSuccessModal() {
        elements.successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Clear saved selections
        localStorage.removeItem('kibuVotingSelections');
        userSelections = {};
        
        // Announce success for screen readers
        announceSelection('Your votes have been successfully submitted and recorded on the blockchain.');
        
        // Set focus to success modal
        setTimeout(() => {
            const successHeader = elements.successModal.querySelector('h3');
            if (successHeader) successHeader.focus();
        }, 100);
    }

    // Auto-save selections
    function autoSave() {
        try {
            localStorage.setItem('kibuVotingSelections', JSON.stringify(userSelections));
            
            // Show auto-save status
            if (elements.autoSaveStatus) {
                elements.autoSaveStatus.textContent = 'Draft saved automatically';
                elements.autoSaveStatus.style.color = 'var(--success-green)';
                
                // Hide status after 3 seconds
                setTimeout(() => {
                    elements.autoSaveStatus.textContent = 'Draft saved automatically';
                }, 3000);
            }
        } catch (error) {
            console.error('Error auto-saving:', error);
        }
    }

    // Load saved selections from localStorage
    function loadSavedSelections() {
        try {
            const savedSelections = localStorage.getItem('kibuVotingSelections');
            if (savedSelections) {
                userSelections = JSON.parse(savedSelections);
                console.log('Loaded saved selections:', userSelections);
                
                // Show recovery message
                if (Object.keys(userSelections).length > 0) {
                    showRecoveryMessage();
                }
            }
        } catch (error) {
            console.error('Error loading saved selections:', error);
        }
    }

    // Show recovery message
    function showRecoveryMessage() {
        const completed = Object.keys(userSelections).length;
        if (completed > 0) {
            const recoveryMsg = document.createElement('div');
            recoveryMsg.className = 'recovery-message';
            recoveryMsg.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <span>Recovered ${completed} saved position${completed > 1 ? 's' : ''} from your draft</span>
            `;
            
            document.querySelector('.voting-header').appendChild(recoveryMsg);
            
            setTimeout(() => {
                recoveryMsg.remove();
            }, 5000);
        }
    }

    // Manual save draft
    function saveDraft() {
        console.log('Manual save draft');
        autoSave();
        
        // Show manual save confirmation
        if (elements.autoSaveStatus) {
            elements.autoSaveStatus.textContent = 'Draft saved successfully!';
            elements.autoSaveStatus.style.color = 'var(--accent-teal)';
            
            // Reset after 3 seconds
            setTimeout(() => {
                elements.autoSaveStatus.textContent = 'Draft saved automatically';
            }, 3000);
        }
    }

    // Start timers
    function startTimers() {
        // Election countdown timer (24 hours from now)
        const electionEnd = new Date();
        electionEnd.setHours(electionEnd.getHours() + 24);
        
        function updateCountdown() {
            const now = new Date();
            const diff = electionEnd - now;
            
            if (diff <= 0) {
                elements.countdown.textContent = 'Election ended';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            elements.countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Session timer (30 minutes)
        let sessionTime = 30 * 60; // 30 minutes in seconds
        
        function updateSessionTimer() {
            const minutes = Math.floor(sessionTime / 60);
            const seconds = sessionTime % 60;
            
            elements.sessionTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (sessionTime <= 0) {
                showSessionExpired();
                return;
            }
            
            sessionTime--;
        }
        
        // Start timers
        updateCountdown();
        updateSessionTimer();
        
        setInterval(updateCountdown, 1000);
        setInterval(updateSessionTimer, 1000);
    }

    // Show session expired message
    function showSessionExpired() {
        const expiredModal = document.createElement('div');
        expiredModal.className = 'modal-overlay active';
        expiredModal.innerHTML = `
            <div class="modal-content session-expired-modal">
                <div class="session-expired-animation">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Session Expired</h3>
                <p>Your voting session has expired due to inactivity.</p>
                <div class="session-actions">
                    <button class="renew-session" onclick="location.reload()">
                        <i class="fas fa-redo"></i>
                        Renew Session
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(expiredModal);
    }

    // Accessibility functions
    function setupAccessibility() {
        // High contrast toggle
        elements.highContrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            elements.highContrastToggle.setAttribute('aria-pressed', isHighContrast);
            announceSelection(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
        });
        
        // Text size toggle
        elements.textSizeToggle.addEventListener('click', () => {
            document.body.classList.toggle('large-text');
            const isLargeText = document.body.classList.contains('large-text');
            elements.textSizeToggle.setAttribute('aria-pressed', isLargeText);
            announceSelection(`Large text mode ${isLargeText ? 'enabled' : 'disabled'}`);
        });
        
        // Set initial states
        elements.highContrastToggle.setAttribute('aria-pressed', 'false');
        elements.textSizeToggle.setAttribute('aria-pressed', 'false');
    }

    // Announce selection for screen readers
    function announceSelection(message) {
        const announcer = document.getElementById('aria-announcer') || createAriaAnnouncer();
        announcer.textContent = message;
        
        // Clear after a delay
        setTimeout(() => {
            announcer.textContent = '';
        }, 3000);
    }

    // Create ARIA announcer
    function createAriaAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);
        return announcer;
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.querySelector('.voting-container').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Set up event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);
        
        // Navigation buttons
        elements.nextButton.addEventListener('click', nextPosition);
        elements.prevButton.addEventListener('click', prevPosition);
        
        // Modal controls
        elements.closeReviewModal.addEventListener('click', closeReviewModal);
        elements.backToEdit.addEventListener('click', closeReviewModal);
        elements.submitVotes.addEventListener('click', submitVotes);
        
        // Save draft button
        elements.saveDraftButton.addEventListener('click', saveDraft);
        
        // Success modal buttons
        elements.viewReceipt.addEventListener('click', () => {
            alert('Vote receipt would be displayed here with transaction hash: 0x' + Math.random().toString(16).substr(2, 64));
        });
        
        elements.backToDashboard.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });
        
        // Setup accessibility
        setupAccessibility();
        
        // Connection status simulation
        simulateConnectionStatus();
        
        console.log('Event listeners setup completed');
    }

    // Simulate connection status
    function simulateConnectionStatus() {
        let isOnline = true;
        
        setInterval(() => {
            // Randomly change connection status for demo
            if (Math.random() > 0.95) {
                isOnline = !isOnline;
                updateConnectionStatus(isOnline);
            }
        }, 10000);
    }

    // Update connection status
    function updateConnectionStatus(online) {
        if (online) {
            elements.connectionStatus.innerHTML = '<i class="fas fa-wifi"></i><span>Connected</span>';
            elements.connectionStatus.className = 'connection-status';
        } else {
            elements.connectionStatus.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Offline</span>';
            elements.connectionStatus.className = 'connection-status offline';
        }
    }

    // Initialize the voting interface
    initVoting();
});

// Add some CSS for the new elements
const additionalCSS = `
.recovery-message {
    background: linear-gradient(135deg, var(--success-green), var(--accent-teal));
    color: white;
    border-radius: 8px;
    padding: 10px 15px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
}

.error-message {
    background: linear-gradient(135deg, var(--error-red), #ff6b6b);
    color: white;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
}

.session-expired-modal {
    text-align: center;
    padding: 40px;
    max-width: 400px;
}

.session-expired-animation {
    font-size: 4rem;
    color: var(--warning-orange);
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

.session-actions {
    margin-top: 20px;
}

.renew-session {
    background: var(--accent-blue);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto;
    transition: all 0.3s ease;
}

.renew-session:hover {
    background: var(--primary-blue);
    transform: translateY(-2px);
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);