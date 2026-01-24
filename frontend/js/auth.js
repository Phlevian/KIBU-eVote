// KIBU Digital Democracy Registration System
class RegistrationSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        console.log("KIBU Registration System initialized");
    }

    bindEvents() {
        // Navigation buttons
        const nextStepBtn = document.getElementById('next-step-btn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => this.nextStep());
        }

        // Save draft and clear form
        const saveDraftBtn = document.getElementById('save-draft-btn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => this.saveDraft());
        }

        const clearFormBtn = document.getElementById('clear-form-btn');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearForm());
        }

        // Form validation events
        this.bindFormValidation();
        
        // Photo upload events
        this.bindPhotoUpload();
        
        // Password events
        this.bindPasswordEvents();
        
        // Verification events
        this.bindVerificationEvents();
        
        // Success modal events
        this.bindSuccessModalEvents();
        
        // Help chat
        this.bindHelpChat();
        
        // Select element events - FIXED
        this.bindSelectEvents();
    }

    bindFormValidation() {
        // Registration number validation
        const regInput = document.getElementById('reg-number');
        if (regInput) {
            regInput.addEventListener('input', () => this.validateRegNumber());
            regInput.addEventListener('blur', () => this.validateRegNumber());
        }

        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhone());
            phoneInput.addEventListener('blur', () => this.validatePhone());
        }

        // Required fields
        const requiredInputs = document.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateRequiredField(input));
        });
    }

    // NEW METHOD: Bind select element events
    bindSelectEvents() {
        const selectElements = document.querySelectorAll('.form-select');
        selectElements.forEach(select => {
            // Add change event listener for validation
            select.addEventListener('change', () => {
                this.validateRequiredField(select);
                this.updateSelectLabel(select);
            });
            
            // Add focus event for styling
            select.addEventListener('focus', () => {
                select.parentElement.classList.add('focused');
            });
            
            // Add blur event for styling
            select.addEventListener('blur', () => {
                select.parentElement.classList.remove('focused');
                this.validateRequiredField(select);
                this.updateSelectLabel(select);
            });
            
            // Initialize label position
            this.updateSelectLabel(select);
        });
    }

    // NEW METHOD: Update select label position based on value
    updateSelectLabel(select) {
        const label = select.nextElementSibling;
        if (label && label.classList.contains('floating-label')) {
            if (select.value !== '') {
                label.style.top = '-0.5rem';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--accent-teal)';
                label.style.fontWeight = '500';
            } else {
                label.style.top = '0.875rem';
                label.style.fontSize = '0.95rem';
                label.style.color = 'var(--text-light)';
                label.style.fontWeight = '400';
            }
        }
    }

    bindPhotoUpload() {
        const photoUploadArea = document.getElementById('photo-upload-area');
        const photoInput = document.getElementById('photo-input');
        const cameraBtn = document.getElementById('camera-btn');

        if (photoUploadArea && photoInput) {
            // Click to upload
            photoUploadArea.addEventListener('click', () => photoInput.click());
            
            // Drag and drop
            photoUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                photoUploadArea.classList.add('drag-over');
            });
            
            photoUploadArea.addEventListener('dragleave', () => {
                photoUploadArea.classList.remove('drag-over');
            });
            
            photoUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                photoUploadArea.classList.remove('drag-over');
                if (e.dataTransfer.files.length) {
                    this.handlePhotoUpload(e.dataTransfer.files[0]);
                }
            });
            
            // File input change
            photoInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handlePhotoUpload(e.target.files[0]);
                }
            });
        }

        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => this.takePhoto());
        }
    }

    bindPasswordEvents() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const toggleButtons = document.querySelectorAll('.toggle-password');

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validatePassword();
                this.checkPasswordMatch();
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.checkPasswordMatch());
        }

        // Toggle password visibility
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.closest('.password-input-container').querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    e.target.textContent = '🙈';
                } else {
                    input.type = 'password';
                    e.target.textContent = '👁️';
                }
            });
        });
    }

    bindVerificationEvents() {
        const emailVerifyBtn = document.getElementById('email-verify-btn');
        const smsVerifyBtn = document.getElementById('sms-verify-btn');

        if (emailVerifyBtn) {
            emailVerifyBtn.addEventListener('click', () => this.sendEmailVerification());
        }

        if (smsVerifyBtn) {
            smsVerifyBtn.addEventListener('click', () => this.sendSMSVerification());
        }
    }

    bindSuccessModalEvents() {
        const verifyNowBtn = document.getElementById('verify-now-btn');
        const goDashboardBtn = document.getElementById('go-dashboard-btn');

        if (verifyNowBtn) {
            verifyNowBtn.addEventListener('click', () => this.verifyNow());
        }

        if (goDashboardBtn) {
            goDashboardBtn.addEventListener('click', () => this.goToDashboard());
        }
    }

    bindHelpChat() {
        const helpChat = document.getElementById('help-chat');
        if (helpChat) {
            helpChat.addEventListener('click', () => this.showHelp());
        }
    }

    // Step Navigation
    nextStep() {
        if (!this.validateCurrentStep()) {
            this.showNotification('Please fix the errors before proceeding', 'error');
            return;
        }

        if (this.currentStep < this.totalSteps) {
            // Hide current step
            const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.remove('active');
            }

            // Show next step
            this.currentStep++;
            const nextStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (nextStepElement) {
                nextStepElement.classList.add('active');
            }

            this.updateProgress();
            this.saveFormData();
        } else {
            this.submitForm();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            // Hide current step
            const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.remove('active');
            }

            // Show previous step
            this.currentStep--;
            const previousStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (previousStepElement) {
                previousStepElement.classList.add('active');
            }

            this.updateProgress();
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        
        // Update progress bars
        const progressFill = document.querySelector('.progress-fill');
        const completionFill = document.querySelector('.completion-fill');
        const completionText = document.querySelector('.completion-text');
        const stepText = document.querySelector('.step-text');

        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        if (completionFill) {
            completionFill.style.width = `${progressPercentage}%`;
        }
        if (completionText) {
            completionText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }
        if (stepText) {
            stepText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    // Validation Methods
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            case 4:
                return this.validateStep4();
            default:
                return true;
        }
    }

    validateStep1() {
        let isValid = true;

        // Required fields
        const requiredFields = ['first-name', 'last-name', 'reg-number', 'email', 'phone', 'faculty', 'year', 'course'];
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && !this.validateRequiredField(element)) {
                isValid = false;
            }
        });

        // Specific validations
        if (!this.validateRegNumber()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePhone()) isValid = false;

        return isValid;
    }

    validateStep2() {
        // Check if photo is uploaded
        const photoInput = document.getElementById('photo-input');
        if (photoInput && !photoInput.files.length) {
            this.showNotification('Please upload a profile photo', 'error');
            return false;
        }
        return true;
    }

    validateStep3() {
        if (!this.validatePassword()) return false;
        if (!this.checkPasswordMatch()) return false;
        return true;
    }

    validateStep4() {
        const requiredCheckboxes = document.querySelectorAll('.agreement-checkbox[required]');
        let allChecked = true;

        requiredCheckboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                allChecked = false;
                checkbox.closest('.agreement-item').classList.add('error');
            } else {
                checkbox.closest('.agreement-item').classList.remove('error');
            }
        });

        if (!allChecked) {
            this.showNotification('Please accept all terms and agreements', 'error');
        }

        return allChecked;
    }

    validateRegNumber() {
        const regInput = document.getElementById('reg-number');
        const errorElement = document.getElementById('reg-error');
        const regNumber = regInput.value.trim();
        
        // Regular expression for KIBU registration number format: CourseCode/Number/Year
        const regPattern = /^[A-Z]{2,4}\/\d{4}\/\d{2}$/;
        
        if (!regNumber) {
            this.showError(regInput, errorElement, 'Registration number is required');
            return false;
        }
        
        if (!regPattern.test(regNumber)) {
            this.showError(regInput, errorElement, 'Invalid format. Use: CourseCode/Number/Year (e.g., BIT/0019/23)');
            return false;
        }
        
        // Check if registration number is already registered
        const existingUsers = JSON.parse(localStorage.getItem('kibu_users') || '[]');
        const isDuplicate = existingUsers.some(user => user.regNumber === regNumber);
        
        if (isDuplicate) {
            this.showError(regInput, errorElement, 'This registration number is already registered');
            return false;
        }
        
        this.clearError(regInput, errorElement);
        return true;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        const email = emailInput.value.trim();
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(emailInput, errorElement, 'Email address is required');
            return false;
        }
        
        if (!emailPattern.test(email)) {
            this.showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        // Check if email is already registered
        const existingUsers = JSON.parse(localStorage.getItem('kibu_users') || '[]');
        const isDuplicate = existingUsers.some(user => user.email === email);
        
        if (isDuplicate) {
            this.showError(emailInput, errorElement, 'This email is already registered');
            return false;
        }
        
        this.clearError(emailInput, errorElement);
        return true;
    }

    validatePhone() {
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phone-error');
        const phone = phoneInput.value.trim();
        
        const phonePattern = /^[0-9]{9}$/; // Kenyan phone number without country code
        
        if (!phone) {
            this.showError(phoneInput, errorElement, 'Phone number is required');
            return false;
        }
        
        if (!phonePattern.test(phone)) {
            this.showError(phoneInput, errorElement, 'Please enter a valid Kenyan phone number (9 digits)');
            return false;
        }
        
        this.clearError(phoneInput, errorElement);
        return true;
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const errorElement = document.getElementById('password-error');
        const password = passwordInput.value;
        
        if (!password) {
            this.showError(passwordInput, errorElement, 'Password is required');
            return false;
        }
        
        // Password strength validation
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        // Update requirements display
        Object.keys(requirements).forEach(req => {
            const requirementElement = document.querySelector(`[data-requirement="${req}"]`);
            if (requirementElement) {
                const icon = requirementElement.querySelector('.requirement-icon');
                if (requirements[req]) {
                    icon.textContent = '✅';
                    requirementElement.classList.add('met');
                } else {
                    icon.textContent = '❌';
                    requirementElement.classList.remove('met');
                }
            }
        });
        
        // Calculate strength
        const metCount = Object.values(requirements).filter(Boolean).length;
        const strength = (metCount / Object.keys(requirements).length) * 100;
        
        // Update strength indicator
        const strengthFill = document.querySelector('.strength-fill');
        const strengthLabel = document.getElementById('strength-label');
        
        if (strengthFill && strengthLabel) {
            strengthFill.style.width = `${strength}%`;
            strengthFill.setAttribute('data-strength', strength);
            
            if (strength < 25) {
                strengthLabel.textContent = 'Very Weak';
                strengthFill.style.backgroundColor = '#f44336';
            } else if (strength < 50) {
                strengthLabel.textContent = 'Weak';
                strengthFill.style.backgroundColor = '#FF9800';
            } else if (strength < 75) {
                strengthLabel.textContent = 'Good';
                strengthFill.style.backgroundColor = '#FFC107';
            } else if (strength < 100) {
                strengthLabel.textContent = 'Strong';
                strengthFill.style.backgroundColor = '#4CAF50';
            } else {
                strengthLabel.textContent = 'Very Strong';
                strengthFill.style.backgroundColor = '#2E7D32';
            }
        }
        
        if (metCount < Object.keys(requirements).length) {
            this.showError(passwordInput, errorElement, 'Please meet all password requirements');
            return false;
        }
        
        this.clearError(passwordInput, errorElement);
        return true;
    }

    checkPasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchElement = document.getElementById('password-match');
        const errorElement = document.getElementById('confirm-password-error');
        
        if (!confirmPassword) {
            if (matchElement) matchElement.style.display = 'none';
            return false;
        }
        
        if (password === confirmPassword) {
            if (matchElement) {
                matchElement.style.display = 'flex';
                matchElement.classList.add('matched');
            }
            if (errorElement) errorElement.style.display = 'none';
            return true;
        } else {
            if (matchElement) matchElement.style.display = 'none';
            if (errorElement) {
                errorElement.textContent = 'Passwords do not match';
                errorElement.style.display = 'block';
            }
            return false;
        }
    }

    validateRequiredField(field) {
        const value = field.type === 'select-one' ? field.value : field.value.trim();
        if (!value) {
            field.classList.add('error');
            return false;
        } else {
            field.classList.remove('error');
            return true;
        }
    }

    // Photo Upload Methods
    handlePhotoUpload(file) {
        // Validate file type and size
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

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadArea = document.getElementById('photo-upload-area');
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            const preview = uploadArea.querySelector('.photo-preview');
            const previewImg = document.getElementById('photo-preview-img');

            if (previewImg) {
                previewImg.src = e.target.result;
            }
            
            if (placeholder) placeholder.style.display = 'none';
            if (preview) preview.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Store file in form data
        this.formData.photo = file;
    }

    takePhoto() {
        // This would access the device camera in a real implementation
        this.showNotification('Camera access would be requested here in a real implementation', 'info');
        
        // For demo purposes, we'll simulate taking a photo after 2 seconds
        setTimeout(() => {
            this.showNotification('Photo captured successfully!', 'success');
            
            // Simulate adding a photo
            const uploadArea = document.getElementById('photo-upload-area');
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            const preview = uploadArea.querySelector('.photo-preview');
            
            if (placeholder) placeholder.style.display = 'none';
            if (preview) preview.style.display = 'block';
            
            // Store dummy photo data
            this.formData.photo = 'camera_captured_photo';
        }, 2000);
    }

    // Verification Methods
    sendEmailVerification() {
        const email = document.getElementById('email').value;
        if (!email) {
            this.showNotification('Please enter your email address first', 'error');
            return;
        }

        this.showNotification(`Verification email sent to ${email}`, 'success');
        
        // Simulate email sending
        setTimeout(() => {
            this.showNotification('Email verification code: 123456', 'info');
        }, 1500);
    }

    sendSMSVerification() {
        const phone = document.getElementById('phone').value;
        if (!phone) {
            this.showNotification('Please enter your phone number first', 'error');
            return;
        }

        this.showNotification(`SMS verification code sent to +254${phone}`, 'success');
        
        // Simulate SMS sending
        setTimeout(() => {
            this.showNotification('SMS verification code: 789012', 'info');
        }, 1500);
    }

    // Form Submission
    submitForm() {
        if (!this.validateCurrentStep()) {
            this.showNotification('Please fix all errors before submitting', 'error');
            return;
        }

        // Collect all form data
        this.saveFormData();

        // Simulate API call
        this.showNotification('Creating your account...', 'info');

        setTimeout(() => {
            // Save user to local storage (in a real app, this would be a server call)
            const users = JSON.parse(localStorage.getItem('kibu_users') || '[]');
            users.push(this.formData);
            localStorage.setItem('kibu_users', JSON.stringify(users));

            // Show success modal
            this.showSuccessModal();
        }, 2000);
    }

    saveFormData() {
        // Collect data from all steps
        this.formData = {
            // Step 1 data
            firstName: document.getElementById('first-name').value,
            middleName: document.getElementById('middle-name').value,
            lastName: document.getElementById('last-name').value,
            regNumber: document.getElementById('reg-number').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            faculty: document.getElementById('faculty').value,
            year: document.getElementById('year').value,
            course: document.getElementById('course').value,
            
            // Step 3 data
            password: document.getElementById('password').value,
            twoFactor: document.getElementById('two-factor').checked,
            
            // Step 4 data
            termsAccepted: document.getElementById('terms').checked,
            privacyAccepted: document.getElementById('privacy').checked,
            guidelinesAccepted: document.getElementById('voting-guidelines').checked,
            verificationMethod: document.querySelector('input[name="verification"]:checked').value,
            
            // Timestamp
            registeredAt: new Date().toISOString()
        };
    }

    saveDraft() {
        this.saveFormData();
        localStorage.setItem('kibu_registration_draft', JSON.stringify(this.formData));
        this.showNotification('Registration draft saved successfully', 'success');
    }

    clearForm() {
        if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
            // Clear all form fields
            const inputs = document.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type !== 'button' && input.type !== 'submit') {
                    input.value = '';
                    
                    // Reset select elements to first option
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                        this.updateSelectLabel(input);
                    }
                    
                    // Clear validation states
                    input.classList.remove('error');
                    
                    // Clear error messages
                    const errorElement = document.getElementById(`${input.id}-error`);
                    if (errorElement) {
                        errorElement.textContent = '';
                        errorElement.style.display = 'none';
                    }
                }
            });
            
            // Reset checkboxes and radio buttons
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            const radios = document.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.checked = radio.value === 'email'; // Set email as default
            });
            
            // Reset to step 1
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelector('[data-step="1"]').classList.add('active');
            
            this.currentStep = 1;
            this.updateProgress();
            this.formData = {};
            
            // Clear photo preview
            const uploadArea = document.getElementById('photo-upload-area');
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            const preview = uploadArea.querySelector('.photo-preview');
            
            if (placeholder) placeholder.style.display = 'block';
            if (preview) preview.style.display = 'none';
            
            // Reset file input
            const photoInput = document.getElementById('photo-input');
            if (photoInput) {
                photoInput.value = '';
            }
            
            this.showNotification('Form cleared successfully', 'success');
        }
    }

    // Success Modal Methods
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }

    verifyNow() {
        this.showNotification('Redirecting to verification page...', 'info');
        // In a real app, this would redirect to verification page
        setTimeout(() => {
            window.location.href = 'verification.html';
        }, 1500);
    }

    goToDashboard() {
        this.showNotification('Welcome to your dashboard!', 'success');
        // In a real app, this would redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    showHelp() {
        this.showNotification('Help system would open here with live chat support', 'info');
    }

    // Utility Methods
    showError(input, errorElement, message) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(input, errorElement) {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
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

// Initialize the registration system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationSystem();
});