// KIBU Digital Democracy Registration System
class RegistrationSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            profilePhoto: null
        };
        this.API_BASE_URL = 'http://localhost:5000/api/auth';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateStepCounters();
        console.log("KIBU Registration System initialized");
    }

    bindEvents() {
        // Navigation buttons
        const nextStepBtn = document.getElementById('next-step-btn');
        const prevStepBtn = document.getElementById('prev-step-btn');
        
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => this.previousStep());
        }

        // Clear form
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
        
        // Success modal events
        this.bindSuccessModalEvents();
        
        // Help chat
        this.bindHelpChat();
        
        // Select element events
        this.bindSelectEvents();

        // Terms view buttons
        this.bindTermsView();
    }

    bindFormValidation() {
        // Registration number validation
        const regInput = document.getElementById('registrationNumber');
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

    bindSelectEvents() {
        const selectElements = document.querySelectorAll('.form-select');
        selectElements.forEach(select => {
            select.addEventListener('change', () => {
                this.validateRequiredField(select);
                this.updateSelectLabel(select);
            });
            
            select.addEventListener('focus', () => {
                select.parentElement.classList.add('focused');
            });
            
            select.addEventListener('blur', () => {
                select.parentElement.classList.remove('focused');
                this.validateRequiredField(select);
                this.updateSelectLabel(select);
            });
            
            this.updateSelectLabel(select);
        });
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

        // Bind photo action buttons
        this.bindPhotoActions();
    }

    bindPhotoActions() {
        // These would be implemented in a real application
        // For now, they just show notifications
        const cropBtn = document.querySelector('.crop-btn');
        const rotateBtn = document.querySelector('.rotate-btn');
        const removeBtn = document.querySelector('.remove-btn');

        if (cropBtn) {
            cropBtn.addEventListener('click', () => {
                this.showNotification('Crop functionality would be implemented here', 'info');
            });
        }

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.showNotification('Rotate functionality would be implemented here', 'info');
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const uploadArea = document.getElementById('photo-upload-area');
                const placeholder = uploadArea.querySelector('.upload-placeholder');
                const preview = uploadArea.querySelector('.photo-preview');
                
                if (placeholder) placeholder.style.display = 'block';
                if (preview) preview.style.display = 'none';
                
                this.formData.profilePhoto = null;
                document.getElementById('photo-input').value = '';
                
                this.showNotification('Photo removed', 'success');
            });
        }
    }

    bindPasswordEvents() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
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
                const icon = e.target.querySelector('i') || e.target;
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    bindSuccessModalEvents() {
        const goLoginBtn = document.getElementById('go-login-btn');
        const goDashboardBtn = document.getElementById('go-dashboard-btn');

        if (goLoginBtn) {
            goLoginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }

        if (goDashboardBtn) {
            goDashboardBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
    }

    bindHelpChat() {
        const helpChat = document.getElementById('help-chat');
        if (helpChat) {
            helpChat.addEventListener('click', () => this.showHelp());
        }
    }

    bindTermsView() {
        const viewTermsBtns = document.querySelectorAll('.view-terms-btn');
        viewTermsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const termsType = btn.getAttribute('data-terms');
                this.showNotification(`Viewing ${termsType} terms would open a modal`, 'info');
            });
        });
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
            this.updateNavigationButtons();
            this.updateStepCounters();
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
            this.updateNavigationButtons();
            this.updateStepCounters();
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        
        if (prevBtn) {
            if (this.currentStep > 1) {
                prevBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
            }
        }
        
        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.innerHTML = 'Complete Registration <i class="fas fa-check"></i>';
            } else {
                nextBtn.innerHTML = 'Continue to Next Step <i class="fas fa-arrow-right"></i>';
            }
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        
        // Update progress bars
        const progressFill = document.querySelector('.progress-fill');
        const completionFill = document.querySelector('.completion-fill');
        const completionText = document.querySelector('.completion-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        if (completionFill) {
            completionFill.style.width = `${progressPercentage}%`;
        }
        if (completionText) {
            completionText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }
    }

    updateStepCounters() {
        const stepText = document.querySelector('.step-text');
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
        const requiredFields = [
            'firstName',
            'lastName',
            'registrationNumber',
            'email',
            'phone',
            'faculty',
            'yearOfStudy',
            'course'
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && !this.validateRequiredField(element)) {
                isValid = false;
                console.log(`Field ${field} is invalid or empty`);
            }
        });

        // Specific validations
        if (!this.validateRegNumber()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePhone()) isValid = false;

        return isValid;
    }

    validateStep2() {
        // Check if photo is uploaded (optional for now)
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
        const regInput = document.getElementById('registrationNumber');
        const errorElement = document.getElementById('reg-error');
        
        if (!regInput) {
            console.error('Registration number input not found');
            return false;
        }
        
        const regNumber = regInput.value.trim();
        const regPattern = /^[A-Z]{2,4}\/\d{4}\/\d{2}$/;
        
        if (!regNumber) {
            this.showError(regInput, errorElement, 'Registration number is required');
            return false;
        }
        
        if (!regPattern.test(regNumber)) {
            this.showError(regInput, errorElement, 'Invalid format. Use: CourseCode/Number/Year (e.g., BIT/0019/23)');
            return false;
        }
        
        this.clearError(regInput, errorElement);
        return true;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        
        if (!emailInput) {
            console.error('Email input not found');
            return false;
        }
        
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
        
        this.clearError(emailInput, errorElement);
        return true;
    }

    validatePhone() {
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phone-error');
        
        if (!phoneInput) {
            console.error('Phone input not found');
            return false;
        }
        
        const phone = phoneInput.value.trim();
        const phonePattern = /^[0-9]{9}$/;
        
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
        
        if (!passwordInput) {
            console.error('Password input not found');
            return false;
        }
        
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
                const icon = requirementElement.querySelector('.requirement-icon i');
                if (requirements[req]) {
                    icon.className = 'fas fa-check';
                    requirementElement.classList.add('met');
                } else {
                    icon.className = 'fas fa-times';
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
        const password = document.getElementById('password')?.value || '';
        const confirmPassword = document.getElementById('confirmPassword')?.value || '';
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
        if (!field) return false;
        
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
            if (!uploadArea) return;
            
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
        this.formData.profilePhoto = file;
    }

    takePhoto() {
        this.showNotification('Camera access would be requested here in a real implementation', 'info');
        
        setTimeout(() => {
            this.showNotification('Photo captured successfully!', 'success');
            
            // Simulate adding a photo
            const uploadArea = document.getElementById('photo-upload-area');
            if (!uploadArea) return;
            
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            const preview = uploadArea.querySelector('.photo-preview');
            
            if (placeholder) placeholder.style.display = 'none';
            if (preview) preview.style.display = 'block';
        }, 2000);
    }

    saveFormData() {
        // IMPORTANT: Ensure these IDs match exactly with your HTML form
        this.formData = {
            firstName: document.getElementById('firstName')?.value || '',
            middleName: document.getElementById('middleName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            registrationNumber: document.getElementById('registrationNumber')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            faculty: document.getElementById('faculty')?.value || '',
            course: document.getElementById('course')?.value || '',
            yearOfStudy: document.getElementById('yearOfStudy')?.value || '',
            password: document.getElementById('password')?.value || '',
            termsAccepted: document.getElementById('terms')?.checked || false,
            privacyAccepted: document.getElementById('privacy')?.checked || false,
            guidelinesAccepted: document.getElementById('voting-guidelines')?.checked || false
        };
        
        console.log('Saved form data:', this.formData);
    }

    async submitForm() {
        if (!this.validateCurrentStep()) {
            this.showNotification('Please fix all errors before submitting', 'error');
            return;
        }

        // Collect all form data
        this.saveFormData();

        // Show loading
        this.showLoading(true);

        try {
            // Prepare JSON data
            const jsonData = {
                firstName: this.formData.firstName,
                middleName: this.formData.middleName,
                lastName: this.formData.lastName,
                registrationNumber: this.formData.registrationNumber,
                email: this.formData.email,
                phone: this.formData.phone,
                faculty: this.formData.faculty,
                course: this.formData.course,
                yearOfStudy: parseInt(this.formData.yearOfStudy) || 0, // Make sure this is a number
                password: this.formData.password,
                profilePhoto: ""  // You might handle photo upload separately
            };

            console.log('Sending data:', JSON.stringify(jsonData, null, 2));

            // Send to backend API as JSON
            const response = await fetch(`${this.API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)
            });

            const result = await response.json();
            console.log('Server response:', JSON.stringify(result, null, 2));

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            // Show success modal
            this.showSuccessModal();
            
            // Store token in localStorage
            if (result.data && result.data.token) {
                localStorage.setItem('kibu_token', result.data.token);
                localStorage.setItem('kibu_user', JSON.stringify(result.data.student));
            }

        } catch (error) {
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
            console.error('Registration error:', error);
            console.error('Full error details:', error);
        } finally {
            this.showLoading(false);
        }
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
                }
            });
            
            // Clear error messages
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(el => {
                el.textContent = '';
                el.style.display = 'none';
            });
            
            // Reset checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset to step 1
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelector('[data-step="1"]').classList.add('active');
            
            this.currentStep = 1;
            this.updateProgress();
            this.updateNavigationButtons();
            this.updateStepCounters();
            this.formData = { profilePhoto: null };
            
            // Clear photo preview
            const uploadArea = document.getElementById('photo-upload-area');
            if (uploadArea) {
                const placeholder = uploadArea.querySelector('.upload-placeholder');
                const preview = uploadArea.querySelector('.photo-preview');
                
                if (placeholder) placeholder.style.display = 'block';
                if (preview) preview.style.display = 'none';
            }
            
            this.showNotification('Form cleared successfully', 'success');
        }
    }

    // Success Modal Methods
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    showHelp() {
        this.showNotification('Help system would open here with live chat support', 'info');
    }

    // Utility Methods
    showError(input, errorElement, message) {
        if (!input) return;
        
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(input, errorElement) {
        if (!input) return;
        
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    updateSelectLabel(select) {
        if (!select) return;
        
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

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('active');
            } else {
                loadingOverlay.classList.remove('active');
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

// Initialize the registration system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationSystem();
});