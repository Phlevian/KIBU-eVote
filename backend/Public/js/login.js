// KIBU Digital Democracy Login System
class LoginSystem {
    constructor() {
        this.API_BASE_URL = 'http://localhost:5000/api/auth';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkSavedLogin();
        console.log("KIBU Login System initialized");
    }

    bindEvents() {
        // Form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle password visibility
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Alternative login methods
        const biometricLogin = document.getElementById('biometric-login');
        if (biometricLogin) {
            biometricLogin.addEventListener('click', () => this.showBiometricModal());
        }

        const qrLogin = document.getElementById('qr-login');
        if (qrLogin) {
            qrLogin.addEventListener('click', () => this.showQRModal());
        }

        // Forgot password
        const forgotPassword = document.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Real-time validation
        const regInput = document.getElementById('registrationNumber');
        if (regInput) {
            regInput.addEventListener('input', () => this.validateRegNumber());
        }

        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
        }
    }

    // Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const registrationNumber = document.getElementById('registrationNumber').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Validate inputs
        const isRegValid = this.validateRegNumber();
        const isPasswordValid = this.validatePassword();
        
        if (!isRegValid || !isPasswordValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }
        
        // Show loading
        this.showLoading(true);
        
        try {
            // Send login request to backend
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationNumber,
                    password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            // Save login if remember me is checked
            if (rememberMe) {
                this.saveLogin(registrationNumber);
            }

            // Store token and user data
            if (result.data && result.data.token) {
                localStorage.setItem('kibu_token', result.data.token);
                localStorage.setItem('kibu_user', JSON.stringify(result.data.student));
                
                // Show success message
                this.showNotification(`Welcome back, ${result.data.student.firstName}!`, 'success');
                
                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }

        } catch (error) {
            this.showNotification(error.message || 'Invalid credentials. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    // Validate registration number format
    validateRegNumber() {
        const regInput = document.getElementById('registrationNumber');
        const errorElement = document.getElementById('reg-error');
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

    // Validate password
    validatePassword() {
        const passwordInput = document.getElementById('password');
        const errorElement = document.getElementById('password-error');
        const password = passwordInput.value;
        
        if (!password) {
            this.showError(passwordInput, errorElement, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            this.showError(passwordInput, errorElement, 'Password must be at least 8 characters');
            return false;
        }
        
        this.clearError(passwordInput, errorElement);
        return true;
    }

    // Toggle password visibility
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.querySelector('.toggle-password i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            eyeIcon.className = 'fas fa-eye';
        }
    }

    // Show biometric modal
    showBiometricModal() {
        this.showNotification('Biometric authentication would be implemented here', 'info');
        
        // Simulate biometric authentication
        setTimeout(() => {
            this.showNotification('Biometric authentication successful! Auto-filling credentials...', 'success');
            
            // For demo purposes, auto-fill with test credentials
            document.getElementById('registrationNumber').value = 'BIT/0019/23';
            document.getElementById('password').value = 'password123';
        }, 2000);
    }

    // Show QR modal
    showQRModal() {
        this.showNotification('QR code login would be implemented here', 'info');
    }

    // Handle forgot password
    handleForgotPassword() {
        const registrationNumber = document.getElementById('registrationNumber').value.trim();
        
        if (!registrationNumber) {
            this.showNotification('Please enter your registration number first', 'error');
            return;
        }
        
        this.showNotification(`Password reset instructions would be sent to the email associated with ${registrationNumber}`, 'info');
    }

    // Check for saved login
    checkSavedLogin() {
        const savedRegNumber = localStorage.getItem('kibu_saved_reg');
        if (savedRegNumber) {
            document.getElementById('registrationNumber').value = savedRegNumber;
            document.getElementById('remember-me').checked = true;
        }
    }

    // Save login information
    saveLogin(registrationNumber) {
        localStorage.setItem('kibu_saved_reg', registrationNumber);
    }

    // Show error message
    showError(input, errorElement, message) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Clear error message
    clearError(input, errorElement) {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Show loading
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

    // Show notification
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

    // Hide notification
    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    // Get notification color based on type
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

// Initialize the login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});