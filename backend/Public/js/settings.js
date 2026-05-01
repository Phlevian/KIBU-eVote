// KIBU-eVote Settings Page JavaScript

class SettingsManager {
    constructor() {
        this.currentUser = null;
        this.settings = {};
        this.currentSection = 'account';
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadSettings();
        this.bindEvents();
        this.initializeUI();
        console.log('KIBU-eVote Settings initialized');
    }

    loadUserData() {
        // In a real app, this would come from an API or localStorage
        this.currentUser = {
            name: 'Efedha Phlevian',
            regNumber: 'BIT/0019/23',
            email: 'efedha.phlevian@kibu.ac.ke',
            phone: '+254 712 345 678',
            faculty: 'computing',
            course: 'Bachelor of Information Technology',
            profilePicture: null
        };
        
        // Update UI with user data
        this.updateUserUI();
    }

    loadSettings() {
        // Load settings from localStorage or use defaults
        const savedSettings = localStorage.getItem('kibu_settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = this.getDefaultSettings();
            this.saveSettings();
        }
        
        this.applySettings();
    }

    getDefaultSettings() {
        return {
            account: {
                language: 'en',
                timezone: 'Africa/Nairobi',
                dateFormat: 'DD/MM/YYYY',
                profileVisibility: 'students'
            },
            security: {
                twoFactorEnabled: true,
                loginAlerts: true,
                passwordChangeAlerts: true
            },
            privacy: {
                votingHistoryAnonymous: true,
                hideActivity: false
            },
            notifications: {
                newElections: true,
                electionReminders: true,
                resultsAnnouncements: true,
                loginAlerts: true,
                passwordChangeAlerts: true,
                maintenanceAlerts: false,
                featureUpdates: true,
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false
            },
            appearance: {
                theme: 'dark',
                accentColor: 'blue',
                fontSize: 14,
                reduceMotion: false,
                smoothScrolling: true
            },
            blockchain: {
                autoVerify: true,
                transactionNotifications: true,
                gasFeeOptimization: true
            }
        };
    }

    updateUserUI() {
        // Update username
        document.getElementById('current-username').textContent = this.currentUser.name;
        
        // Update form fields
        document.getElementById('full-name').value = this.currentUser.name;
        document.getElementById('student-id').value = this.currentUser.regNumber;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('phone').value = this.currentUser.phone;
        document.getElementById('faculty').value = this.currentUser.faculty;
        document.getElementById('course').value = this.currentUser.course;
        
        // Update profile avatar if exists
        if (this.currentUser.profilePicture) {
            const avatar = document.getElementById('profile-avatar');
            avatar.innerHTML = `<img src="${this.currentUser.profilePicture}" alt="Profile">`;
        }
    }

    applySettings() {
        // Apply theme
        this.applyTheme(this.settings.appearance.theme);
        
        // Apply accent color
        this.applyAccentColor(this.settings.appearance.accentColor);
        
        // Apply font size
        this.applyFontSize(this.settings.appearance.fontSize);
        
        // Set form values from settings
        this.populateSettingsForms();
    }

    applyTheme(theme) {
        document.body.className = `settings-page ${theme}-theme`;
        document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
    }

    applyAccentColor(color) {
        const root = document.documentElement;
        const colors = {
            blue: '#0080FF',
            purple: '#8A2BE2',
            green: '#00C851',
            orange: '#FF6B35',
            pink: '#FF5E5B'
        };
        
        if (colors[color]) {
            root.style.setProperty('--electric-blue', colors[color]);
            document.querySelector(`.color-option[data-color="${color}"]`).classList.add('active');
        }
    }

    applyFontSize(size) {
        document.documentElement.style.fontSize = `${size}px`;
        document.getElementById('font-size-slider').value = size;
        document.getElementById('font-preview').style.fontSize = `${size}px`;
    }

    populateSettingsForms() {
        // Account settings
        document.getElementById('language').value = this.settings.account.language;
        document.getElementById('timezone').value = this.settings.account.timezone;
        document.getElementById('date-format').value = this.settings.account.dateFormat;
        document.getElementById('profile-visibility').value = this.settings.account.profileVisibility;
        
        // Security settings
        document.getElementById('voting-history-toggle').checked = this.settings.privacy.votingHistoryAnonymous;
        document.getElementById('activity-feed-toggle').checked = this.settings.privacy.hideActivity;
        
        // Notification settings
        document.getElementById('new-elections-toggle').checked = this.settings.notifications.newElections;
        document.getElementById('election-reminders-toggle').checked = this.settings.notifications.electionReminders;
        document.getElementById('results-toggle').checked = this.settings.notifications.resultsAnnouncements;
        document.getElementById('login-alerts-toggle').checked = this.settings.notifications.loginAlerts;
        document.getElementById('password-change-toggle').checked = this.settings.notifications.passwordChangeAlerts;
        document.getElementById('maintenance-toggle').checked = this.settings.notifications.maintenanceAlerts;
        document.getElementById('feature-updates-toggle').checked = this.settings.notifications.featureUpdates;
        document.getElementById('email-notifications-toggle').checked = this.settings.notifications.emailNotifications;
        document.getElementById('push-notifications-toggle').checked = this.settings.notifications.pushNotifications;
        document.getElementById('sms-notifications-toggle').checked = this.settings.notifications.smsNotifications;
        
        // Appearance settings
        document.getElementById('font-size-slider').value = this.settings.appearance.fontSize;
        document.getElementById('reduce-motion-toggle').checked = this.settings.appearance.reduceMotion;
        document.getElementById('smooth-scrolling-toggle').checked = this.settings.appearance.smoothScrolling;
        
        // Blockchain settings
        document.getElementById('auto-verify-toggle').checked = this.settings.blockchain.autoVerify;
        document.getElementById('transaction-notify-toggle').checked = this.settings.blockchain.transactionNotifications;
        document.getElementById('gas-fee-toggle').checked = this.settings.blockchain.gasFeeOptimization;
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchSection(e));
        });

        // Personal info form
        document.getElementById('personal-info-form').addEventListener('submit', (e) => this.savePersonalInfo(e));
        document.getElementById('reset-personal').addEventListener('click', () => this.resetPersonalInfo());

        // Password form
        document.getElementById('password-form').addEventListener('submit', (e) => this.changePassword(e));
        
        // Password strength check
        document.getElementById('new-password').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        
        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });

        // Profile picture
        document.getElementById('upload-photo').addEventListener('click', () => this.uploadProfilePhoto());
        document.getElementById('remove-photo').addEventListener('click', () => this.removeProfilePhoto());
        document.getElementById('profile-avatar').addEventListener('click', () => this.uploadProfilePhoto());
        document.getElementById('photo-upload').addEventListener('change', (e) => this.handlePhotoUpload(e));

        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectTheme(e));
        });

        // Color selection
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectAccentColor(e));
        });

        // Font size slider
        document.getElementById('font-size-slider').addEventListener('input', (e) => this.changeFontSize(e.target.value));

        // Toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handleToggleChange(e));
        });

        // Dropdown changes
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => this.handleSelectChange(e));
        });

        // Dangerous actions
        document.getElementById('clear-history').addEventListener('click', () => this.confirmClearHistory());
        document.getElementById('delete-account').addEventListener('click', () => this.confirmDeleteAccount());
        document.getElementById('logout-all').addEventListener('click', () => this.confirmLogoutAll());
        document.getElementById('disable-2fa').addEventListener('click', () => this.confirmDisable2FA());

        // Blockchain actions
        document.getElementById('verify-votes').addEventListener('click', () => this.verifyAllVotes());
        document.getElementById('view-transactions').addEventListener('click', () => this.viewBlockchainExplorer());

        // System status check
        document.getElementById('check-status').addEventListener('click', () => this.checkSystemStatus());

        // Modal
        document.getElementById('close-modal').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-confirm').addEventListener('click', () => this.executeConfirmedAction());

        // Close modal on outside click
        document.getElementById('confirmation-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmation-modal') {
                this.hideModal();
            }
        });
    }

    initializeUI() {
        // Show first section by default
        this.switchSection({ target: document.querySelector('.nav-item.active') });
        
        // Initialize password strength meter
        this.checkPasswordStrength('');
    }

    switchSection(e) {
        const section = e.target.closest('.nav-item').dataset.section;
        
        if (this.currentSection === section) return;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.target.closest('.nav-item').classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.settings-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${section}-section`).classList.add('active');
        
        this.currentSection = section;
        
        // Scroll to top
        document.querySelector('.settings-main').scrollTop = 0;
    }

    savePersonalInfo(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            faculty: document.getElementById('faculty').value,
            course: document.getElementById('course').value
        };
        
        // Validate email
        if (!this.validateEmail(formData.email)) {
            this.showError('Please enter a valid KIBU email address');
            return;
        }
        
        // Validate phone
        if (!this.validatePhone(formData.phone)) {
            this.showError('Please enter a valid phone number');
            return;
        }
        
        // Update user data
        Object.assign(this.currentUser, formData);
        
        // Save to localStorage (in real app, this would be an API call)
        localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
        
        this.updateUserUI();
        this.showSuccess('Personal information updated successfully');
    }

    resetPersonalInfo() {
        // Reset form to original values
        document.getElementById('full-name').value = this.currentUser.name;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('phone').value = this.currentUser.phone;
        document.getElementById('faculty').value = this.currentUser.faculty;
        document.getElementById('course').value = this.currentUser.course;
        
        this.showSuccess('Form reset to original values');
    }

    async changePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validation
        if (!currentPassword) {
            this.showError('Please enter your current password');
            return;
        }
        
        if (!this.validatePassword(newPassword)) {
            this.showError('Please meet all password requirements');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showError('New passwords do not match');
            return;
        }
        
        // In a real app, this would be an API call
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Clear form
            document.getElementById('password-form').reset();
            
            this.showSuccess('Password changed successfully');
            
            // Logout user (in real app)
            // setTimeout(() => {
            //     window.location.href = 'login.html';
            // }, 2000);
            
        } catch (error) {
            this.showError('Failed to change password. Please try again.');
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-fill');
        const strengthText = document.getElementById('password-strength-text');
        const requirements = document.querySelectorAll('.requirement');
        
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        // Update requirement indicators
        requirements.forEach(req => {
            const type = req.dataset.requirement;
            if (checks[type]) {
                req.classList.add('requirement-met');
                strength += 20;
            } else {
                req.classList.remove('requirement-met');
            }
        });
        
        // Update strength bar and text
        strengthBar.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthBar.style.backgroundColor = '#f44336';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#f44336';
        } else if (strength < 80) {
            strengthBar.style.backgroundColor = '#FF9800';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#FF9800';
        } else {
            strengthBar.style.backgroundColor = '#4CAF50';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#4CAF50';
        }
    }

    togglePasswordVisibility(e) {
        const targetId = e.target.closest('.toggle-password').dataset.target;
        const input = document.getElementById(targetId);
        const icon = e.target.closest('.toggle-password').querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    uploadProfilePhoto() {
        document.getElementById('photo-upload').click();
    }

    async handlePhotoUpload(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showError('Image size should be less than 5MB');
            return;
        }
        
        // In a real app, this would upload to a server
        // For demo, we'll create a local URL
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const avatar = document.getElementById('profile-avatar');
            avatar.innerHTML = `
                <img src="${event.target.result}" alt="Profile">
                <div class="avatar-overlay">
                    <i class="fas fa-camera"></i>
                </div>
            `;
            
            this.currentUser.profilePicture = event.target.result;
            this.showSuccess('Profile picture updated successfully');
        };
        
        reader.readAsDataURL(file);
    }

    removeProfilePhoto() {
        const avatar = document.getElementById('profile-avatar');
        avatar.innerHTML = `
            <i class="fas fa-user"></i>
            <div class="avatar-overlay">
                <i class="fas fa-camera"></i>
            </div>
        `;
        
        this.currentUser.profilePicture = null;
        this.showSuccess('Profile picture removed');
    }

    selectTheme(e) {
        const theme = e.target.closest('.theme-option').dataset.theme;
        
        // Update UI
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        e.target.closest('.theme-option').classList.add('active');
        
        // Save setting
        this.settings.appearance.theme = theme;
        this.saveSettings();
        
        // Apply theme
        this.applyTheme(theme);
        
        this.showSuccess(`Theme changed to ${theme}`);
    }

    selectAccentColor(e) {
        const color = e.target.closest('.color-option').dataset.color;
        
        // Update UI
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        e.target.closest('.color-option').classList.add('active');
        
        // Save setting
        this.settings.appearance.accentColor = color;
        this.saveSettings();
        
        // Apply color
        this.applyAccentColor(color);
        
        this.showSuccess(`Accent color changed`);
    }

    changeFontSize(size) {
        // Update preview
        document.getElementById('font-preview').style.fontSize = `${size}px`;
        
        // Save setting
        this.settings.appearance.fontSize = parseInt(size);
        this.saveSettings();
        
        // Apply font size
        this.applyFontSize(size);
    }

    handleToggleChange(e) {
        const toggle = e.target;
        const section = toggle.closest('.settings-section').id.replace('-section', '');
        const option = toggle.id.replace('-toggle', '');
        
        // Update settings
        if (section === 'privacy' || section === 'notifications' || section === 'appearance' || section === 'blockchain') {
            this.settings[section][option] = toggle.checked;
            this.saveSettings();
        }
        
        this.showSuccess('Setting updated');
    }

    handleSelectChange(e) {
        const select = e.target;
        const section = select.closest('.settings-section').id.replace('-section', '');
        const option = select.id;
        
        // Update settings
        if (section === 'account') {
            this.settings.account[option] = select.value;
            this.saveSettings();
        }
        
        this.showSuccess('Setting updated');
    }

    saveSettings() {
        localStorage.setItem('kibu_settings', JSON.stringify(this.settings));
    }

    // Confirmation modal methods
    showModal(title, message, confirmCallback) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('confirmation-modal').style.display = 'flex';
        
        // Store callback
        this.pendingAction = confirmCallback;
    }

    hideModal() {
        document.getElementById('confirmation-modal').style.display = 'none';
        this.pendingAction = null;
    }

    executeConfirmedAction() {
        if (this.pendingAction) {
            this.pendingAction();
        }
        this.hideModal();
    }

    confirmClearHistory() {
        this.showModal(
            'Clear Voting History',
            'Are you sure you want to clear your voting history? This action cannot be undone.',
            () => this.clearVotingHistory()
        );
    }

    confirmDeleteAccount() {
        this.showModal(
            'Delete Account',
            'Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone.',
            () => this.deleteAccount()
        );
    }

    confirmLogoutAll() {
        this.showModal(
            'Logout All Devices',
            'Are you sure you want to logout from all devices? You will need to login again on this device.',
            () => this.logoutAllDevices()
        );
    }

    confirmDisable2FA() {
        this.showModal(
            'Disable Two-Factor Authentication',
            'Are you sure you want to disable two-factor authentication? This will reduce the security of your account.',
            () => this.disable2FA()
        );
    }

    async clearVotingHistory() {
        try {
            // In real app, this would be an API call
            await this.simulateApiCall();
            this.showSuccess('Voting history cleared successfully');
        } catch (error) {
            this.showError('Failed to clear voting history');
        }
    }

    async deleteAccount() {
        try {
            // In real app, this would be an API call
            await this.simulateApiCall(3000);
            this.showSuccess('Account deleted successfully');
            
            // Redirect to homepage
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showError('Failed to delete account');
        }
    }

    async logoutAllDevices() {
        try {
            // In real app, this would be an API call
            await this.simulateApiCall();
            this.showSuccess('Logged out from all devices');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            this.showError('Failed to logout from all devices');
        }
    }

    async disable2FA() {
        try {
            // In real app, this would be an API call
            await this.simulateApiCall();
            this.settings.security.twoFactorEnabled = false;
            this.saveSettings();
            this.showSuccess('Two-factor authentication disabled');
        } catch (error) {
            this.showError('Failed to disable two-factor authentication');
        }
    }

    async verifyAllVotes() {
        try {
            // In real app, this would verify votes on blockchain
            await this.simulateApiCall(2000);
            this.showSuccess('All votes verified successfully on blockchain');
        } catch (error) {
            this.showError('Failed to verify votes');
        }
    }

    viewBlockchainExplorer() {
        // In real app, this would open blockchain explorer
        window.open('https://explorer.kibu.ac.ke', '_blank');
    }

    async checkSystemStatus() {
        const statusBtn = document.getElementById('check-status');
        const originalText = statusBtn.innerHTML;
        
        statusBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        statusBtn.disabled = true;
        
        try {
            // In real app, this would check API endpoints
            await this.simulateApiCall(1000);
            
            // Update last checked time
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.querySelector('.last-checked').textContent = `Last checked: ${timeStr}`;
            
            this.showSuccess('All systems operational');
        } catch (error) {
            this.showError('Some systems may be experiencing issues');
        } finally {
            statusBtn.innerHTML = originalText;
            statusBtn.disabled = false;
        }
    }

    // Utility methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) && email.includes('kibu.ac.ke');
    }

    validatePhone(phone) {
        const re = /^\+?[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        return Object.values(checks).every(check => check);
    }

    simulateApiCall(duration = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    showSuccess(message) {
        const toast = document.getElementById('success-toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.style.display = 'flex';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    showError(message) {
        // In a real app, you might have a separate error toast
        alert(`Error: ${message}`);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});