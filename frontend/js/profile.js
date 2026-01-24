// KIBU Profile Management System
class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.originalData = {};
        this.hasChanges = false;
        this.API_BASE_URL = 'http://localhost:5000/api/auth';
        this.init();
    }

    init() {
        // Check authentication first
        if (!this.checkAuthentication()) {
            return;
        }
        
        this.bindEvents();
        this.loadUserProfile();
        this.initTabs();
        console.log("KIBU Profile System initialized");
    }

    checkAuthentication() {
        const token = localStorage.getItem('kibu_token');
        const userData = localStorage.getItem('kibu_user');
        
        if (!token || !userData) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return false;
        }
        
        this.currentUser = JSON.parse(userData);
        return true;
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });
        
        // Form submissions
        document.getElementById('personal-info-form')?.addEventListener('submit', (e) => this.savePersonalInfo(e));
        document.getElementById('academic-info-form')?.addEventListener('submit', (e) => this.saveAcademicInfo(e));
        document.getElementById('password-change-form')?.addEventListener('submit', (e) => this.changePassword(e));
        
        // Cancel buttons
        document.getElementById('cancel-personal')?.addEventListener('click', () => this.resetPersonalForm());
        document.getElementById('cancel-academic')?.addEventListener('click', () => this.resetAcademicForm());
        
        // Avatar actions
        document.getElementById('change-avatar-btn')?.addEventListener('click', () => this.changeAvatar());
        document.getElementById('remove-avatar-btn')?.addEventListener('click', () => this.removeAvatar());
        
        // Form input changes
        this.bindFormChanges();
        
        // Security toggles
        this.bindSecurityToggles();
        
        // Export buttons
        document.getElementById('export-votes')?.addEventListener('click', () => this.exportVotes());
        document.getElementById('export-data')?.addEventListener('click', () => this.exportAllData());
        
        // Modal buttons
        document.getElementById('modal-ok-btn')?.addEventListener('click', () => this.hideModal('success'));
        document.getElementById('confirm-cancel')?.addEventListener('click', () => this.hideModal('confirm'));
        document.getElementById('confirm-proceed')?.addEventListener('click', () => this.handleConfirm());
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => this.logout(e));
        
        // Password strength
        document.getElementById('new-password')?.addEventListener('input', () => this.checkPasswordStrength());
        document.getElementById('confirm-password')?.addEventListener('input', () => this.checkPasswordMatch());
        
        // Mobile menu
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => this.toggleMobileMenu());
    }

    initTabs() {
        // Set first tab as active
        const firstTab = document.querySelector('.tab-btn[data-tab="personal"]');
        if (firstTab) {
            this.switchTab({ target: firstTab });
        }
    }

    switchTab(e) {
        const targetTab = e.target.closest('.tab-btn');
        const tabId = targetTab.getAttribute('data-tab');
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        targetTab.classList.add('active');
        
        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }

    async loadUserProfile() {
        this.showLoading(true);
        
        try {
            const token = localStorage.getItem('kibu_token');
            
            // Fetch fresh user data from server
            const response = await fetch(`${this.API_BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.data.student) {
                    this.currentUser = data.data.student;
                    localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
                    
                    // Update UI with user data
                    this.updateProfileUI();
                    
                    // Store original data for form reset
                    this.originalData = { ...this.currentUser };
                    
                    // Update header
                    this.updateHeader();
                }
            } else {
                // If API fails, use cached data
                console.log('Using cached user data');
                this.updateProfileUI();
                this.updateHeader();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Use cached data as fallback
            this.updateProfileUI();
            this.updateHeader();
        } finally {
            this.showLoading(false);
        }
    }

    updateProfileUI() {
        const user = this.currentUser;
        
        // Update avatar initial
        const initial = this.getInitials(user.firstName, user.lastName);
        document.getElementById('avatar-initial').textContent = initial;
        
        // Update profile header
        document.getElementById('profile-fullname').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-course').textContent = user.course || 'Not specified';
        document.getElementById('profile-reg-number').textContent = user.registrationNumber || 'KIBU/---/--';
        document.getElementById('member-since').textContent = new Date(user.createdAt).toLocaleDateString();
        
        // Update verification status
        const verificationElement = document.getElementById('verification-status');
        if (verificationElement) {
            if (user.isVerified) {
                verificationElement.className = 'profile-badge status verified';
                verificationElement.innerHTML = '<i class="fas fa-shield-alt"></i><span>Verified Student</span>';
            } else {
                verificationElement.className = 'profile-badge status unverified';
                verificationElement.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Not Verified</span>';
            }
        }
        
        // Update personal info form
        document.getElementById('first-name').value = user.firstName || '';
        document.getElementById('middle-name').value = user.middleName || '';
        document.getElementById('last-name').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('registration-number').value = user.registrationNumber || '';
        
        // Update academic info form
        document.getElementById('faculty').value = user.faculty || '';
        document.getElementById('course').value = user.course || '';
        document.getElementById('year-of-study').value = user.yearOfStudy || '';
        document.getElementById('student-id-display').textContent = user.registrationNumber || 'KIBU/---/--';
        
        // Update sidebar
        document.getElementById('student-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('student-faculty').textContent = user.faculty || '---';
        document.getElementById('student-year').textContent = `Year ${user.yearOfStudy}` || 'Year --';
        
        // Update header
        document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('user-reg-number').textContent = user.registrationNumber || 'KIBU/---/--';
        
        // Update avatar initials in sidebar and header
        this.updateAvatarInitials();
        
        // Update last updated
        document.getElementById('last-updated').textContent = new Date().toLocaleDateString();
        
        // Update activity stats
        this.updateActivityStats();
    }

    updateHeader() {
        const user = this.currentUser;
        
        // Update header user info
        document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('user-reg-number').textContent = user.registrationNumber || 'KIBU/---/--';
        
        // Update avatar
        this.updateAvatarInitials();
    }

    updateAvatarInitials() {
        const user = this.currentUser;
        const initial = this.getInitials(user.firstName, user.lastName);
        
        // Update header avatar
        const headerAvatar = document.getElementById('user-avatar');
        const headerAvatarParent = headerAvatar?.parentElement;
        if (headerAvatarParent) {
            // Remove existing initial if any
            const existingInitial = headerAvatarParent.querySelector('.avatar-initial');
            if (existingInitial) existingInitial.remove();
            
            // Hide image if exists
            if (headerAvatar.hasAttribute('src')) {
                headerAvatar.style.display = 'none';
                
                // Create initial div
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
                headerAvatarParent.appendChild(initialDiv);
            }
        }
        
        // Update sidebar avatar
        const sidebarAvatar = document.getElementById('student-avatar-img');
        const sidebarAvatarParent = sidebarAvatar?.parentElement;
        if (sidebarAvatarParent) {
            const existingInitial = sidebarAvatarParent.querySelector('.avatar-initial');
            if (existingInitial) existingInitial.remove();
            
            if (sidebarAvatar.hasAttribute('src')) {
                sidebarAvatar.style.display = 'none';
                
                const initialDiv = document.createElement('div');
                initialDiv.className = 'avatar-initial';
                initialDiv.textContent = initial;
                sidebarAvatarParent.appendChild(initialDiv);
            }
        }
    }

    getInitials(firstName, lastName) {
        if (!firstName && !lastName) return 'U';
        
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        
        return firstInitial + lastInitial || 'U';
    }

    bindFormChanges() {
        // Track changes in personal form
        const personalInputs = document.querySelectorAll('#personal-info-form input');
        personalInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.hasChanges = true;
            });
        });
        
        // Track changes in academic form
        const academicInputs = document.querySelectorAll('#academic-info-form select');
        academicInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.hasChanges = true;
            });
        });
    }

    bindSecurityToggles() {
        // Two-factor toggle
        const twoFactorToggle = document.getElementById('two-factor-toggle');
        if (twoFactorToggle) {
            twoFactorToggle.addEventListener('change', () => {
                this.showNotification(
                    twoFactorToggle.checked ? 
                    'Two-factor authentication enabled' : 
                    'Two-factor authentication disabled',
                    'info'
                );
            });
        }
        
        // Email notifications toggle
        const emailToggle = document.getElementById('email-notifications-toggle');
        if (emailToggle) {
            emailToggle.addEventListener('change', () => {
                this.showNotification(
                    emailToggle.checked ? 
                    'Email notifications enabled' : 
                    'Email notifications disabled',
                    'info'
                );
            });
        }
        
        // SMS notifications toggle
        const smsToggle = document.getElementById('sms-notifications-toggle');
        if (smsToggle) {
            smsToggle.addEventListener('change', () => {
                this.showNotification(
                    smsToggle.checked ? 
                    'SMS notifications enabled' : 
                    'SMS notifications disabled',
                    'info'
                );
            });
        }
        
        // Manage sessions button
        const manageSessionsBtn = document.getElementById('manage-sessions');
        if (manageSessionsBtn) {
            manageSessionsBtn.addEventListener('click', () => {
                this.showNotification('Session management feature coming soon', 'info');
            });
        }
    }

    async savePersonalInfo(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validatePersonalForm()) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            const token = localStorage.getItem('kibu_token');
            const formData = {
                firstName: document.getElementById('first-name').value.trim(),
                middleName: document.getElementById('middle-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim(),
                phone: document.getElementById('phone').value.trim()
            };
            
            // Send update request
            const response = await fetch(`${this.API_BASE_URL}/update-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Update local user data
                this.currentUser = { ...this.currentUser, ...formData };
                localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
                
                // Update UI
                this.updateProfileUI();
                this.updateHeader();
                
                // Show success message
                this.showSuccessModal('Personal Information Updated', 'Your personal details have been updated successfully.');
                
                // Reset change tracking
                this.hasChanges = false;
                
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile');
            }
            
        } catch (error) {
            this.showNotification(error.message || 'Failed to update profile. Please try again.', 'error');
            console.error('Update error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async saveAcademicInfo(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateAcademicForm()) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            const token = localStorage.getItem('kibu_token');
            const formData = {
                faculty: document.getElementById('faculty').value,
                course: document.getElementById('course').value,
                yearOfStudy: document.getElementById('year-of-study').value
            };
            
            // Send update request
            const response = await fetch(`${this.API_BASE_URL}/update-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Update local user data
                this.currentUser = { ...this.currentUser, ...formData };
                localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
                
                // Update UI
                this.updateProfileUI();
                
                // Show success message
                this.showSuccessModal('Academic Information Updated', 'Your academic details have been updated successfully.');
                
                // Reset change tracking
                this.hasChanges = false;
                
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update academic information');
            }
            
        } catch (error) {
            this.showNotification(error.message || 'Failed to update academic information. Please try again.', 'error');
            console.error('Update error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async changePassword(e) {
        e.preventDefault();
        
        // Validate password
        if (!this.validatePasswordForm()) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            const token = localStorage.getItem('kibu_token');
            const formData = {
                currentPassword: document.getElementById('current-password').value,
                newPassword: document.getElementById('new-password').value
            };
            
            // Send password change request
            const response = await fetch(`${this.API_BASE_URL}/update-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Update token if returned
                if (data.data.token) {
                    localStorage.setItem('kibu_token', data.data.token);
                }
                
                // Clear password fields
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';
                
                // Reset password strength
                document.getElementById('password-strength-fill').style.width = '0%';
                document.getElementById('password-strength-label').textContent = 'Very Weak';
                
                // Show success message
                this.showSuccessModal('Password Updated', 'Your password has been changed successfully.');
                
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to change password');
            }
            
        } catch (error) {
            this.showNotification(error.message || 'Failed to change password. Please try again.', 'error');
            console.error('Password change error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    resetPersonalForm() {
        if (this.hasChanges) {
            this.showConfirmModal(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to discard them?',
                () => {
                    // Reset form to original values
                    document.getElementById('first-name').value = this.originalData.firstName || '';
                    document.getElementById('middle-name').value = this.originalData.middleName || '';
                    document.getElementById('last-name').value = this.originalData.lastName || '';
                    document.getElementById('phone').value = this.originalData.phone || '';
                    
                    this.hasChanges = false;
                    this.hideModal('confirm');
                }
            );
        }
    }

    resetAcademicForm() {
        if (this.hasChanges) {
            this.showConfirmModal(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to discard them?',
                () => {
                    // Reset form to original values
                    document.getElementById('faculty').value = this.originalData.faculty || '';
                    document.getElementById('course').value = this.originalData.course || '';
                    document.getElementById('year-of-study').value = this.originalData.yearOfStudy || '';
                    
                    this.hasChanges = false;
                    this.hideModal('confirm');
                }
            );
        }
    }

    validatePersonalForm() {
        let isValid = true;
        
        // First name validation
        const firstName = document.getElementById('first-name').value.trim();
        const firstNameError = document.getElementById('first-name-error');
        if (!firstName) {
            firstNameError.textContent = 'First name is required';
            isValid = false;
        } else {
            firstNameError.textContent = '';
        }
        
        // Last name validation
        const lastName = document.getElementById('last-name').value.trim();
        const lastNameError = document.getElementById('last-name-error');
        if (!lastName) {
            lastNameError.textContent = 'Last name is required';
            isValid = false;
        } else {
            lastNameError.textContent = '';
        }
        
        // Phone validation
        const phone = document.getElementById('phone').value.trim();
        const phoneError = document.getElementById('phone-error');
        const phonePattern = /^[0-9]{9}$/;
        
        if (!phone) {
            phoneError.textContent = 'Phone number is required';
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            phoneError.textContent = 'Please enter a valid Kenyan phone number (9 digits)';
            isValid = false;
        } else {
            phoneError.textContent = '';
        }
        
        return isValid;
    }

    validateAcademicForm() {
        let isValid = true;
        
        // Faculty validation
        const faculty = document.getElementById('faculty').value;
        const facultyError = document.getElementById('faculty-error');
        if (!faculty) {
            facultyError.textContent = 'Please select your faculty';
            isValid = false;
        } else {
            facultyError.textContent = '';
        }
        
        // Course validation
        const course = document.getElementById('course').value;
        const courseError = document.getElementById('course-error');
        if (!course) {
            courseError.textContent = 'Please select your course';
            isValid = false;
        } else {
            courseError.textContent = '';
        }
        
        // Year validation
        const year = document.getElementById('year-of-study').value;
        const yearError = document.getElementById('year-error');
        if (!year) {
            yearError.textContent = 'Please select your year of study';
            isValid = false;
        } else {
            yearError.textContent = '';
        }
        
        return isValid;
    }

    validatePasswordForm() {
        let isValid = true;
        
        // Current password validation
        const currentPassword = document.getElementById('current-password').value;
        if (!currentPassword) {
            this.showNotification('Please enter your current password', 'error');
            isValid = false;
        }
        
        // New password validation
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchError = document.getElementById('password-match-error');
        
        if (!newPassword) {
            this.showNotification('Please enter a new password', 'error');
            isValid = false;
        }
        
        if (newPassword !== confirmPassword) {
            matchError.textContent = 'Passwords do not match';
            isValid = false;
        } else {
            matchError.textContent = '';
        }
        
        // Check password strength
        const strength = this.calculatePasswordStrength(newPassword);
        if (strength < 50) {
            this.showNotification('Please choose a stronger password', 'error');
            isValid = false;
        }
        
        return isValid;
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        return strength;
    }

    checkPasswordStrength() {
        const password = document.getElementById('new-password').value;
        const strength = this.calculatePasswordStrength(password);
        const strengthFill = document.getElementById('password-strength-fill');
        const strengthLabel = document.getElementById('password-strength-label');
        
        strengthFill.style.width = `${strength}%`;
        
        if (strength < 25) {
            strengthFill.style.backgroundColor = '#f44336';
            strengthLabel.textContent = 'Very Weak';
        } else if (strength < 50) {
            strengthFill.style.backgroundColor = '#FF9800';
            strengthLabel.textContent = 'Weak';
        } else if (strength < 75) {
            strengthFill.style.backgroundColor = '#FFC107';
            strengthLabel.textContent = 'Good';
        } else if (strength < 100) {
            strengthFill.style.backgroundColor = '#4CAF50';
            strengthLabel.textContent = 'Strong';
        } else {
            strengthFill.style.backgroundColor = '#2E7D32';
            strengthLabel.textContent = 'Very Strong';
        }
    }

    checkPasswordMatch() {
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchError = document.getElementById('password-match-error');
        
        if (!confirmPassword) {
            matchError.textContent = '';
            return false;
        }
        
        if (password === confirmPassword) {
            matchError.textContent = '';
            return true;
        } else {
            matchError.textContent = 'Passwords do not match';
            return false;
        }
    }

    changeAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadAvatar(file);
            }
        };
        
        input.click();
    }

    async uploadAvatar(file) {
        // Validate file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!validTypes.includes(file.type)) {
            this.showNotification('Please select a valid image file (JPG, PNG, or WebP)', 'error');
            return;
        }
        
        if (file.size > maxSize) {
            this.showNotification('File size must be less than 2MB', 'error');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result;
                
                // Send to server
                const token = localStorage.getItem('kibu_token');
                const response = await fetch(`${this.API_BASE_URL}/update-profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ profilePhoto: base64Image })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update local user data
                    this.currentUser.profilePhoto = base64Image;
                    localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
                    
                    // Update avatar display
                    const avatarElement = document.getElementById('profile-avatar');
                    const initialElement = document.getElementById('avatar-initial');
                    
                    // Remove initial and show image
                    initialElement.style.display = 'none';
                    
                    const img = document.createElement('img');
                    img.src = base64Image;
                    img.alt = 'Profile Avatar';
                    avatarElement.appendChild(img);
                    
                    this.showSuccessModal('Profile Photo Updated', 'Your profile photo has been updated successfully.');
                    
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to upload avatar');
                }
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            this.showNotification(error.message || 'Failed to upload avatar. Please try again.', 'error');
            console.error('Avatar upload error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    removeAvatar() {
        this.showConfirmModal(
            'Remove Profile Photo?',
            'Are you sure you want to remove your profile photo?',
            async () => {
                try {
                    this.showLoading(true);
                    
                    // Send request to remove avatar
                    const token = localStorage.getItem('kibu_token');
                    const response = await fetch(`${this.API_BASE_URL}/update-profile`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ profilePhoto: null })
                    });
                    
                    if (response.ok) {
                        // Update local user data
                        this.currentUser.profilePhoto = null;
                        localStorage.setItem('kibu_user', JSON.stringify(this.currentUser));
                        
                        // Update avatar display
                        const avatarElement = document.getElementById('profile-avatar');
                        const img = avatarElement.querySelector('img');
                        
                        if (img) img.remove();
                        
                        const initialElement = document.getElementById('avatar-initial');
                        initialElement.style.display = 'flex';
                        
                        this.showSuccessModal('Profile Photo Removed', 'Your profile photo has been removed successfully.');
                        
                    } else {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to remove avatar');
                    }
                    
                } catch (error) {
                    this.showNotification(error.message || 'Failed to remove avatar. Please try again.', 'error');
                    console.error('Remove avatar error:', error);
                } finally {
                    this.showLoading(false);
                    this.hideModal('confirm');
                }
            }
        );
    }

    updateActivityStats() {
        // Simulate activity data (in real app, fetch from backend)
        const user = this.currentUser;
        
        // Calculate account age
        const createdAt = new Date(user.createdAt || Date.now());
        const now = new Date();
        const diffTime = Math.abs(now - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Generate random stats for demo
        const totalVotes = Math.floor(Math.random() * 20) + 5;
        const electionsParticipated = Math.floor(Math.random() * 8) + 2;
        const participationRate = Math.min(100, Math.floor(Math.random() * 30) + 70);
        
        // Update stats
        document.getElementById('total-votes').textContent = totalVotes;
        document.getElementById('elections-participated').textContent = electionsParticipated;
        document.getElementById('account-age').textContent = diffDays;
        document.getElementById('participation-rate').textContent = `${participationRate}%`;
        
        // Update sidebar stats
        document.getElementById('profile-votes').textContent = totalVotes;
        
        // Update activity timeline
        this.updateActivityTimeline();
    }

    updateActivityTimeline() {
        const timeline = document.getElementById('profile-activity-timeline');
        if (!timeline) return;
        
        const activities = [
            {
                time: 'Today',
                action: 'Updated profile information',
                icon: 'fas fa-user-edit',
                color: '#3498db'
            },
            {
                time: 'Yesterday',
                action: 'Voted in Student Council Elections',
                icon: 'fas fa-vote-yea',
                color: '#27ae60'
            },
            {
                time: '3 days ago',
                action: 'Changed account password',
                icon: 'fas fa-key',
                color: '#f39c12'
            },
            {
                time: '1 week ago',
                action: 'Verified email address',
                icon: 'fas fa-check-circle',
                color: '#9b59b6'
            },
            {
                time: '2 weeks ago',
                action: 'Registered on KIBU Digital Democracy',
                icon: 'fas fa-user-plus',
                color: '#e74c3c'
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

    exportVotes() {
        this.showNotification('Voting history export feature coming soon', 'info');
    }

    exportAllData() {
        this.showNotification('Data export feature coming soon', 'info');
    }

    async logout(e) {
        e.preventDefault();
        
        this.showConfirmModal(
            'Logout',
            'Are you sure you want to logout?',
            async () => {
                const token = localStorage.getItem('kibu_token');
                
                try {
                    // Call logout API
                    await fetch(`${this.API_BASE_URL}/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.log('Logout API error:', error);
                } finally {
                    // Clear local storage and redirect
                    localStorage.removeItem('kibu_token');
                    localStorage.removeItem('kibu_user');
                    window.location.href = 'login.html';
                }
            }
        );
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const menuBtn = document.getElementById('mobileMenuBtn');
        
        if (sidebar && menuBtn) {
            sidebar.classList.toggle('mobile-open');
            
            // Update menu icon
            const icon = menuBtn.querySelector('i');
            if (sidebar.classList.contains('mobile-open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    }

    // Modal Methods
    showSuccessModal(title, message) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').classList.add('active');
    }

    showConfirmModal(title, message, confirmCallback) {
        this.confirmCallback = confirmCallback;
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-modal').classList.add('active');
    }

    hideModal(modalType) {
        document.getElementById(`${modalType}-modal`).classList.remove('active');
    }

    handleConfirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.hideModal('confirm');
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.style.display = 'flex';
                setTimeout(() => {
                    loadingOverlay.style.opacity = '1';
                }, 10);
            } else {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
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

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Close button
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
}

// Initialize the profile system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileSystem();
});