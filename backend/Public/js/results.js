// results.js - KIBU Blockchain Election Results Dashboard
class ElectionResults {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.initializeCharts();
        this.bindEvents();
        this.initializeAnimations();
        console.log('Election Results Dashboard initialized');
    }

    // Chart Initialization
    initializeCharts() {
        // Add a small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.createPresidentChart();
            this.createFacultyChart();
            this.createTurnoutChart();
            this.animateStats();
        }, 100);
    }

    // President Results Chart - IMPROVED STYLING
    createPresidentChart() {
        const ctx = document.getElementById('presidentChart');
        if (!ctx) {
            console.error('President chart canvas not found');
            return;
        }

        try {
            // Ensure canvas has proper dimensions
            ctx.style.width = '100%';
            ctx.style.height = '300px';

            this.charts.president = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Sarah Wanjiku', 'James Kiprotich', 'Grace Akinyi', 'Abstentions'],
                    datasets: [{
                        data: [3247, 1221, 487, 12],
                        backgroundColor: [
                            '#4CAF50', // Green for winner
                            '#2196F3', // Blue
                            '#FF9800', // Orange
                            '#9E9E9E'  // Gray for abstentions
                        ],
                        borderWidth: 3,
                        borderColor: '#ffffff',
                        hoverBorderWidth: 4,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    weight: '500'
                                },
                                color: '#333'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { 
                                family: 'Inter, sans-serif',
                                size: 13,
                                weight: '600'
                            },
                            bodyFont: { 
                                family: 'Inter, sans-serif',
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.raw / total) * 100).toFixed(1);
                                    return `${context.label}: ${context.raw.toLocaleString()} votes (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('President chart created successfully');
        } catch (error) {
            console.error('Error creating president chart:', error);
        }
    }

    // Faculty Breakdown Chart - IMPROVED STYLING
    createFacultyChart() {
        const ctx = document.getElementById('facultyChart');
        if (!ctx) {
            console.error('Faculty chart canvas not found');
            return;
        }

        try {
            ctx.style.width = '100%';
            ctx.style.height = '300px';

            this.charts.faculty = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Business', 'Engineering', 'Computer Science', 'Education', 'Health Sciences'],
                    datasets: [{
                        label: 'Votes Cast',
                        data: [2150, 1870, 1945, 1280, 1002],
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(33, 150, 243, 0.6)'
                        ],
                        borderColor: [
                            '#1976D2',
                            '#1976D2',
                            '#1976D2',
                            '#1976D2',
                            '#1976D2'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom: 10
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { 
                                family: 'Inter, sans-serif',
                                size: 13,
                                weight: '600'
                            },
                            bodyFont: { 
                                family: 'Inter, sans-serif',
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label;
                                },
                                label: function(context) {
                                    return `Votes: ${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 11,
                                    weight: '500'
                                },
                                color: '#666',
                                padding: 8,
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            },
                            title: {
                                display: true,
                                text: 'Number of Votes',
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    weight: '600'
                                },
                                color: '#333'
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 11,
                                    weight: '500'
                                },
                                color: '#666',
                                maxRotation: 45
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('Faculty chart created successfully');
        } catch (error) {
            console.error('Error creating faculty chart:', error);
        }
    }

    // Historical Turnout Chart - IMPROVED STYLING
    createTurnoutChart() {
        const ctx = document.getElementById('turnoutChart');
        if (!ctx) {
            console.error('Turnout chart canvas not found');
            return;
        }

        try {
            ctx.style.width = '100%';
            ctx.style.height = '300px';

            this.charts.turnout = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'Voter Turnout (%)',
                        data: [72, 75, 78, 82, 87],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.15)',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4CAF50',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#388E3C',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom: 10
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { 
                                family: 'Inter, sans-serif',
                                size: 13,
                                weight: '600'
                            },
                            bodyFont: { 
                                family: 'Inter, sans-serif',
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `Turnout: ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 65,
                            max: 95,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 11,
                                    weight: '500'
                                },
                                color: '#666',
                                padding: 8,
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Voter Turnout (%)',
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    weight: '600'
                                },
                                color: '#333'
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 11,
                                    weight: '500'
                                },
                                color: '#666'
                            },
                            title: {
                                display: true,
                                text: 'Election Year',
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                    weight: '600'
                                },
                                color: '#333'
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('Turnout chart created successfully');
        } catch (error) {
            console.error('Error creating turnout chart:', error);
        }
    }

    // Event Binding
    bindEvents() {
        this.bindActionButtons();
        this.bindWinnerCards();
        this.bindStatCards();
    }

    bindActionButtons() {
        const actionButtons = document.querySelector('.action-buttons');
        if (!actionButtons) {
            console.error('Action buttons container not found');
            return;
        }

        actionButtons.addEventListener('click', (e) => {
            const target = e.target.closest('button') || e.target.closest('a');
            if (!target) return;

            e.preventDefault();

            if (target.classList.contains('primary')) {
                this.verifyVoteOnBlockchain(target);
            } else if (target.classList.contains('secondary')) {
                if (target.textContent.includes('Other Election')) {
                    this.showOtherElectionResults();
                } else if (target.textContent.includes('Share')) {
                    this.shareElectionResults();
                }
            } else if (target.classList.contains('back-link')) {
                this.goBackToDashboard();
            }
        });
    }

    bindWinnerCards() {
        const winnerCards = document.querySelectorAll('.winner-card');
        winnerCards.forEach(card => {
            card.addEventListener('mouseenter', this.animateWinnerCard.bind(this));
            card.addEventListener('click', this.showCandidateDetails.bind(this));
        });
    }

    bindStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('click', this.toggleStatDetails.bind(this));
        });
    }

    // Animation Methods
    initializeAnimations() {
        this.animateHeader();
        this.animateWinnerCards();
        this.observeElements();
    }

    animateHeader() {
        const header = document.querySelector('.results-header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                header.style.transition = 'all 0.8s ease';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    animateWinnerCards() {
        const winnerCards = document.querySelectorAll('.winner-card');
        winnerCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const value = stat.textContent.trim();
            let target;
            
            if (value.includes('%')) {
                target = parseInt(value);
            } else {
                target = parseInt(value.replace(/,/g, ''));
            }
            
            if (!isNaN(target)) {
                this.animateNumber(stat, 0, target, 2000);
            }
        });
    }

    animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (element.textContent.includes('%')) {
                element.textContent = value + '%';
            } else {
                element.textContent = value.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    animateWinnerCard(event) {
        const card = event.currentTarget;
        if (card.classList.contains('president-winner')) {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Action Methods - DEBUGGED
    async verifyVoteOnBlockchain(button) {
        try {
            this.setButtonLoading(button, 'Verifying on Blockchain...');
            
            const verificationResult = await this.simulateBlockchainVerification();
            
            if (verificationResult.success) {
                this.showNotification('✅ Your vote has been successfully verified on the blockchain!', 'success');
                this.showVerificationDetails(verificationResult);
            } else {
                this.showNotification('❌ Vote verification failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Blockchain verification error:', error);
            this.showNotification('⚠️ Network error. Please check your connection.', 'error');
        } finally {
            this.setButtonReady(button, '🔍 Verify My Vote on Blockchain');
        }
    }

    async simulateBlockchainVerification() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
                    blockNumber: Math.floor(Math.random() * 1000000),
                    timestamp: new Date().toISOString(),
                    voterId: 'STD' + Math.floor(Math.random() * 10000).toString().padStart(5, '0')
                });
            }, 2500);
        });
    }

    showVerificationDetails(details) {
        const modal = this.createVerificationModal(details);
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    createVerificationModal(details) {
        const modal = document.createElement('div');
        modal.className = 'verification-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✅ Vote Verification Successful</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="verification-details">
                        <div class="detail-item">
                            <span class="label">Transaction Hash:</span>
                            <span class="value">${details.transactionHash}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Block Number:</span>
                            <span class="value">${details.blockNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Voter ID:</span>
                            <span class="value">${details.voterId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Verification Time:</span>
                            <span class="value">${new Date(details.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="verification-success">
                        <p>Your vote has been permanently recorded on the KIBU Blockchain and cannot be altered.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn secondary">View on Blockchain Explorer</button>
                    <button class="btn primary">Download Receipt</button>
                </div>
            </div>
        `;

        this.injectModalStyles();
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.hideModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });

        return modal;
    }

    // DEBUGGED: Show Other Election Results
    showOtherElectionResults() {
        console.log('Show Other Election Results clicked');
        this.showArchiveModal();
    }

    showArchiveModal() {
        console.log('Showing archive modal');
        const modal = document.createElement('div');
        modal.className = 'verification-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📚 Previous Election Results</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="archive-list">
                        <div class="archive-item">
                            <h4>2023 Student Council Election</h4>
                            <p><strong>Date:</strong> March 15, 2023</p>
                            <p><strong>Turnout:</strong> 82% (7,512 students)</p>
                            <button class="btn secondary view-archive" data-year="2023">View Results</button>
                        </div>
                        
                        <div class="archive-item">
                            <h4>2022 Student Council Election</h4>
                            <p><strong>Date:</strong> March 16, 2022</p>
                            <p><strong>Turnout:</strong> 78% (6,891 students)</p>
                            <button class="btn secondary view-archive" data-year="2022">View Results</button>
                        </div>
                        
                        <div class="archive-item">
                            <h4>2021 Student Council Election</h4>
                            <p><strong>Date:</strong> March 18, 2021</p>
                            <p><strong>Turnout:</strong> 75% (6,234 students)</p>
                            <button class="btn secondary view-archive" data-year="2021">View Results</button>
                        </div>
                        
                        <div class="archive-item">
                            <h4>2020 Student Council Election</h4>
                            <p><strong>Date:</strong> March 12, 2020</p>
                            <p><strong>Turnout:</strong> 72% (5,987 students)</p>
                            <button class="btn secondary view-archive" data-year="2020">View Results</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn primary close-archive-modal">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.showModal(modal);
        
        // Add event listeners
        const closeModal = () => this.hideModal(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.close-archive-modal').addEventListener('click', closeModal);

        // Handle view archive buttons
        modal.querySelectorAll('.view-archive').forEach(button => {
            button.addEventListener('click', (e) => {
                const year = e.target.getAttribute('data-year');
                this.showNotification(`Loading ${year} election results...`, 'info');
                this.hideModal(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
        
        // Add archive-specific styles
        this.injectArchiveStyles();
    }

    injectArchiveStyles() {
        if (document.getElementById('archive-styles')) return;

        const styles = `
            .archive-list {
                max-height: 400px;
                overflow-y: auto;
                padding: 10px 5px;
            }
            .archive-item {
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
                background: #fafafa;
            }
            .archive-item:hover {
                background: #f0f0f0;
                border-color: #4CAF50;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .archive-item h4 {
                margin: 0 0 10px 0;
                color: #2c3e50;
                font-size: 16px;
                font-weight: 600;
            }
            .archive-item p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
            }
            .archive-item .btn {
                margin-top: 10px;
                padding: 8px 16px;
                font-size: 14px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'archive-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    async shareElectionResults() {
        const shareData = {
            title: 'KIBU Student Council Election Results 2024',
            text: 'Check out the official results of the KIBU Student Council Elections 2024!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showNotification('📱 Results shared successfully!', 'success');
            } else {
                await this.copyToClipboard(shareData.url);
                this.showNotification('📋 Results link copied to clipboard!', 'success');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share error:', error);
                await this.copyToClipboard(shareData.url);
                this.showNotification('📋 Results link copied to clipboard!', 'success');
            }
        }
    }

    goBackToDashboard() {
        console.log('Back to Dashboard clicked');
        
        const possiblePaths = [
            'dashboard.html',
            '../dashboard.html',
            'dashboard.html',
            '../dashboard.html',
            './',
            '../'
        ];
        
        const currentPath = window.location.pathname;
        if (currentPath.includes('dashboard') || currentPath.includes('dashboard')) {
            this.showNotification('You are already on the dashboard page.', 'info');
            return;
        }
        
        this.findDashboardPath(possiblePaths);
    }

    async findDashboardPath(paths) {
        for (const path of paths) {
            try {
                console.log(`Testing path: ${path}`);
                const response = await fetch(path, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`Found dashboard at: ${path}`);
                    document.body.style.opacity = '0.7';
                    document.body.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = path;
                    }, 300);
                    return;
                }
            } catch (error) {
                console.log(`Path ${path} not found, trying next...`);
            }
        }
        
        console.log('No dashboard path found, showing error modal');
        this.showDashboardNotFoundModal();
    }

    showDashboardNotFoundModal() {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚧 Dashboard Not Found</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>The dashboard page could not be found. This might be because:</p>
                    <ul>
                        <li>The application is running from a different directory</li>
                        <li>The main page has a different filename</li>
                        <li>You're viewing this locally without a server</li>
                    </ul>
                    <p>Please navigate to your main application page manually.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn secondary" id="stay-on-page">Stay on This Page</button>
                    <button class="btn primary" id="go-to-home">Go to Home</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.showModal(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.hideModal(modal);
        });

        modal.querySelector('#stay-on-page').addEventListener('click', () => {
            this.hideModal(modal);
        });

        modal.querySelector('#go-to-home').addEventListener('click', () => {
            window.location.href = './';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
    }

    showCandidateDetails(event) {
        const card = event.currentTarget;
        const candidateName = card.querySelector('.winner-name').textContent;
        this.showNotification(`Showing details for ${candidateName}`, 'info');
    }

    toggleStatDetails(event) {
        const card = event.currentTarget;
        card.classList.toggle('expanded');
    }

    // Utility Methods
    setButtonLoading(button, text) {
        button.disabled = true;
        button.innerHTML = `⏳ ${text}`;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    }

    setButtonReady(button, text) {
        button.disabled = false;
        button.innerHTML = text;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    }

    showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            if (modal.querySelector('.modal-content')) {
                modal.querySelector('.modal-content').style.transform = 'scale(1)';
            }
        }, 10);
    }

    hideModal(modal) {
        modal.style.opacity = '0';
        if (modal.querySelector('.modal-content')) {
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        }
        setTimeout(() => {
            modal.style.display = 'none';
            modal.remove();
        }, 300);
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            background: ${this.getNotificationColor(type)};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        const autoRemove = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#FF9800'
        };
        return colors[type] || colors.info;
    }

    injectModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const styles = `
            .verification-modal, .error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }
            .modal-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
                font-weight: 600;
            }
            .close-modal {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #7f8c8d;
            }
            .modal-body {
                padding: 24px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
            }
            .detail-item .label {
                font-weight: 600;
                color: #555;
                min-width: 140px;
            }
            .detail-item .value {
                font-family: monospace;
                background: #f8f9fa;
                padding: 4px 8px;
                border-radius: 4px;
                flex: 1;
                word-break: break-all;
            }
            .modal-footer {
                padding: 20px 24px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .btn.primary {
                background: #4CAF50;
                color: white;
            }
            .btn.secondary {
                background: #757575;
                color: white;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please check the CDN link.');
        // Create fallback display for charts
        document.querySelectorAll('.chart-container').forEach(container => {
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: #666; background: #f5f5f5; border-radius: 8px;">Chart loading failed. Please check Chart.js installation.</div>';
        });
        return;
    }
    
    new ElectionResults();
});

// Enhanced CSS for animations and charts
const additionalStyles = `
    .winner-card {
        transition: all 0.3s ease;
    }
    .winner-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    .stat-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .stat-card:hover {
        transform: translateY(-3px);
    }
    section {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    .chart-container {
        position: relative;
        height: 300px;
        width: 100%;
        margin: 20px 0;
    }
    .chart-container canvas {
        border-radius: 8px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Enhanced chart responsiveness */
    @media (max-width: 768px) {
        .chart-container {
            height: 250px;
        }
    }
    
    @media (max-width: 480px) {
        .chart-container {
            height: 200px;
        }
    }
`;

// Inject additional styles
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);