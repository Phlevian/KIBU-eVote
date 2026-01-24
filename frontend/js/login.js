// KIBU Digital Democracy Login System
class LoginSystem {
    constructor() {
        // Sample valid users database (in a real system, this would be on a server)
        this.validUsers = [
            { regNumber: "BIT/0019/23", password: "password123", name: "John Doe", course: "BIT" },
            { regNumber: "COM/0025/23", password: "password123", name: "Jane Smith", course: "Computer Science" },
            { regNumber: "ENG/0034/22", password: "password123", name: "Mike Johnson", course: "Engineering" },
            { regNumber: "BUS/0012/24", password: "password123", name: "Sarah Williams", course: "Business" },
            { regNumber: "LAW/0008/23", password: "password123", name: "David Brown", course: "Law" }
        ];
        
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
        const togglePassword = document.getElementById('toggle-password');
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

        // Modal close buttons
        const closeQRModal = document.getElementById('close-qr-modal');
        if (closeQRModal) {
            closeQRModal.addEventListener('click', () => this.hideModal('qr-modal'));
        }

        const closeBiometricModal = document.getElementById('close-biometric-modal');
        if (closeBiometricModal) {
            closeBiometricModal.addEventListener('click', () => this.hideModal('biometric-modal'));
        }

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            const qrModal = document.getElementById('qr-modal');
            const biometricModal = document.getElementById('biometric-modal');
            
            if (e.target === qrModal) {
                this.hideModal('qr-modal');
            }
            if (e.target === biometricModal) {
                this.hideModal('biometric-modal');
            }
        });

        // Real-time validation
        const regInput = document.getElementById('reg-number');
        if (regInput) {
            regInput.addEventListener('input', () => this.validateRegNumber());
        }

        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
        }
    }

    // Handle login form submission
    handleLogin(e) {
        e.preventDefault();
        
        const regNumber = document.getElementById('reg-number').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-device').checked;
        
        // Validate inputs
        const isRegValid = this.validateRegNumber();
        const isPasswordValid = this.validatePassword();
        
        if (!isRegValid || !isPasswordValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }
        
        // Check if user exists
        const user = this.authenticateUser(regNumber, password);
        
        if (user) {
            // Save login if remember me is checked
            if (rememberMe) {
                this.saveLogin(regNumber);
            }
            
            // Show success and redirect
            this.showNotification(`Welcome back, ${user.name}! Redirecting to dashboard...`, 'success');
            
            // Simulate login process
            this.simulateLoginProcess(user);
        } else {
            this.showNotification('Invalid registration number or password', 'error');
        }
    }

    // Validate registration number format
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

    // Authenticate user against the database
    authenticateUser(regNumber, password) {
        return this.validUsers.find(user => 
            user.regNumber === regNumber && user.password === password
        );
    }

    // Toggle password visibility
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.querySelector('.eye-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            eyeIcon.textContent = '👁️';
        }
    }

    // Show biometric modal
    showBiometricModal() {
        this.showModal('biometric-modal');
        
        // Simulate biometric authentication
        setTimeout(() => {
            // For demo purposes, auto-authenticate after 2 seconds
            this.hideModal('biometric-modal');
            this.showNotification('Biometric authentication successful!', 'success');
            
            // Auto-fill with a demo user for convenience
            document.getElementById('reg-number').value = 'BIT/0019/23';
            document.getElementById('password').value = 'password123';
        }, 2000);
    }

    // Show QR modal
    showQRModal() {
        this.showModal('qr-modal');
    }

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // Check for saved login
    checkSavedLogin() {
        const savedRegNumber = localStorage.getItem('kibu_saved_reg');
        if (savedRegNumber) {
            document.getElementById('reg-number').value = savedRegNumber;
            document.getElementById('remember-device').checked = true;
        }
    }

    // Save login information
    saveLogin(regNumber) {
        localStorage.setItem('kibu_saved_reg', regNumber);
    }

    // Show error message
    showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Clear error message
    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
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

    // Simulate login process
    simulateLoginProcess(user) {
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<span class="btn-text">AUTHENTICATING...</span><span class="btn-icon">⏳</span>';
        loginBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // In a real application, you would redirect to the dashboard
            // window.location.href = 'dashboard.html';
            
            // For demo purposes, show success message
            this.showNotification(`Login successful! Welcome ${user.name} (${user.regNumber})`, 'success');
            
            // Reset button
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            
            console.log(`User ${user.name} (${user.regNumber}) logged in successfully`);
        }, 1500);
    }
}

// Initialize the login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});