// KIBU Digital Democracy Verification System
class VerificationSystem {
    constructor() {
        this.verificationCode = '';
        this.countdownTime = 60;
        this.countdownInterval = null;
        this.userData = this.getUserData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.startCountdown();
        this.populateUserData();
        console.log("KIBU Verification System initialized");
    }

    bindEvents() {
        // Code input events
        this.bindCodeInputEvents();
        
        // Button events
        this.bindButtonEvents();
        
        // Modal events
        this.bindModalEvents();
    }

    getUserData() {
        // In a real app, this would come from the server or session storage
        // For demo purposes, we'll use localStorage or mock data
        const savedData = localStorage.getItem('kibu_registration_data');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Mock data for demonstration
        return {
            email: 'student@kibu.ac.ke',
            phone: '+254 712 345 678',
            firstName: 'John',
            lastName: 'Doe',
            regNumber: 'BIT/0019/23'
        };
    }

    populateUserData() {
        // Populate user email and phone
        const emailElement = document.getElementById('user-email');
        const phoneElement = document.getElementById('user-phone');
        
        if (emailElement && this.userData.email) {
            emailElement.textContent = this.userData.email;
        }
        
        if (phoneElement && this.userData.phone) {
            phoneElement.textContent = this.userData.phone;
        }
        
        // Generate a mock verification code for demo
        this.verificationCode = this.generateVerificationCode();
        console.log(`Demo Verification Code: ${this.verificationCode}`);
    }

    generateVerificationCode() {
        // Generate a random 6-digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    bindCodeInputEvents() {
        const codeInputs = document.querySelectorAll('.code-input');
        
        codeInputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    e.target.value = '';
                    return;
                }
                
                // Auto-focus next input
                if (value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Update verification status
                this.updateVerificationStatus();
            });
            
            // Handle paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                this.handlePasteCode(pastedData);
            });
            
            // Handle backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }

    handlePasteCode(pastedData) {
        const codeInputs = document.querySelectorAll('.code-input');
        const numbers = pastedData.replace(/\D/g, ''); // Remove non-digits
        
        if (numbers.length === 6) {
            codeInputs.forEach((input, index) => {
                if (index < numbers.length) {
                    input.value = numbers[index];
                    input.classList.add('filled');
                }
            });
            
            // Focus last input
            if (codeInputs[5]) {
                codeInputs[5].focus();
            }
            
            this.updateVerificationStatus();
        }
    }

    updateVerificationStatus() {
        const codeInputs = document.querySelectorAll('.code-input');
        const verifyBtn = document.getElementById('verify-btn');
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        
        // Check if all inputs are filled
        const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
        
        // Update input styles
        codeInputs.forEach(input => {
            if (input.value.length === 1) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
        
        // Enable/disable verify button
        if (verifyBtn) {
            verifyBtn.disabled = !allFilled;
        }
        
        // Auto-verify if code is complete and correct (for demo)
        if (allFilled && enteredCode === this.verificationCode) {
            setTimeout(() => {
                this.verifyCode();
            }, 500);
        }
    }

    bindButtonEvents() {
        // Verify button
        const verifyBtn = document.getElementById('verify-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.verifyCode());
        }
        
        // Resend button
        const resendBtn = document.getElementById('resend-btn');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => this.resendCode());
        }
        
        // Back to login button
        const backToLoginBtn = document.getElementById('back-to-login-btn');
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => this.goToLogin());
        }
        
        // Alternative method buttons
        const smsMethodBtn = document.getElementById('sms-method-btn');
        if (smsMethodBtn) {
            smsMethodBtn.addEventListener('click', () => this.showSMSModal());
        }
        
        const backupMethodBtn = document.getElementById('backup-method-btn');
        if (backupMethodBtn) {
            backupMethodBtn.addEventListener('click', () => this.showBackupModal());
        }
        
        // Go to dashboard button
        const goDashboardBtn = document.getElementById('go-dashboard-btn');
        if (goDashboardBtn) {
            goDashboardBtn.addEventListener('click', () => this.goToDashboard());
        }
    }

    bindModalEvents() {
        // SMS Modal
        const smsModal = document.getElementById('sms-modal');
        const closeSmsModal = document.getElementById('close-sms-modal');
        const sendSmsBtn = document.getElementById('send-sms-btn');
        
        if (closeSmsModal) {
            closeSmsModal.addEventListener('click', () => this.hideSMSModal());
        }
        
        if (sendSmsBtn) {
            sendSmsBtn.addEventListener('click', () => this.sendSMSVerification());
        }
        
        // Backup Modal
        const backupModal = document.getElementById('backup-modal');
        const closeBackupModal = document.getElementById('close-backup-modal');
        const useBackupBtn = document.getElementById('use-backup-btn');
        
        if (closeBackupModal) {
            closeBackupModal.addEventListener('click', () => this.hideBackupModal());
        }
        
        if (useBackupBtn) {
            useBackupBtn.addEventListener('click', () => this.useBackupCode());
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (smsModal && e.target === smsModal) {
                this.hideSMSModal();
            }
            if (backupModal && e.target === backupModal) {
                this.hideBackupModal();
            }
        });
    }

    verifyCode() {
        const codeInputs = document.querySelectorAll('.code-input');
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        const errorElement = document.getElementById('code-error');
        
        // Show loading state
        const verifyBtn = document.getElementById('verify-btn');
        if (verifyBtn) {
            verifyBtn.textContent = 'Verifying...';
            verifyBtn.disabled = true;
        }
        
        // Simulate API call
        setTimeout(() => {
            if (enteredCode === this.verificationCode) {
                this.showSuccess();
            } else {
                // Show error
                if (errorElement) {
                    errorElement.textContent = 'Invalid verification code. Please try again.';
                    errorElement.classList.add('show');
                }
                
                // Shake animation for error
                codeInputs.forEach(input => {
                    input.style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        input.style.animation = '';
                    }, 500);
                });
                
                // Reset button
                if (verifyBtn) {
                    verifyBtn.textContent = 'Verify & Continue →';
                    verifyBtn.disabled = false;
                }
            }
        }, 1500);
    }

    resendCode() {
        const resendBtn = document.getElementById('resend-btn');
        const countdownElement = document.getElementById('countdown');
        
        if (resendBtn && resendBtn.disabled) return;
        
        // Generate new code
        this.verificationCode = this.generateVerificationCode();
        console.log(`New Demo Verification Code: ${this.verificationCode}`);
        
        // Show success message
        this.showNotification('New verification code sent to your email', 'success');
        
        // Reset and start countdown
        this.countdownTime = 60;
        this.startCountdown();
        
        // Update UI
        if (resendBtn) {
            resendBtn.disabled = true;
        }
    }

    startCountdown() {
        const resendBtn = document.getElementById('resend-btn');
        const countdownElement = document.getElementById('countdown');
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.updateCountdownDisplay();
        
        this.countdownInterval = setInterval(() => {
            this.countdownTime--;
            this.updateCountdownDisplay();
            
            if (this.countdownTime <= 0) {
                clearInterval(this.countdownInterval);
                if (resendBtn) {
                    resendBtn.disabled = false;
                }
                if (countdownElement) {
                    countdownElement.textContent = '';
                }
            }
        }, 1000);
    }

    updateCountdownDisplay() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = `(${this.countdownTime}s)`;
        }
    }

    showSMSModal() {
        const smsModal = document.getElementById('sms-modal');
        if (smsModal) {
            smsModal.classList.add('active');
        }
    }

    hideSMSModal() {
        const smsModal = document.getElementById('sms-modal');
        if (smsModal) {
            smsModal.classList.remove('active');
        }
    }

    sendSMSVerification() {
        this.hideSMSModal();
        this.showNotification('SMS verification code sent to your phone', 'success');
        
        // In a real app, this would trigger an SMS sending API
        console.log('SMS verification triggered');
    }

    showBackupModal() {
        const backupModal = document.getElementById('backup-modal');
        if (backupModal) {
            backupModal.classList.add('active');
        }
    }

    hideBackupModal() {
        const backupModal = document.getElementById('backup-modal');
        if (backupModal) {
            backupModal.classList.remove('active');
        }
    }

    useBackupCode() {
        const backupInput = document.getElementById('backup-code-input');
        const backupCode = backupInput ? backupInput.value.trim() : '';
        
        if (!backupCode) {
            this.showNotification('Please enter a backup code', 'error');
            return;
        }
        
        // Simulate backup code verification
        if (backupCode.length === 6) {
            this.hideBackupModal();
            this.showSuccess();
        } else {
            this.showNotification('Invalid backup code', 'error');
        }
    }

    showSuccess() {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.add('active');
            
            // Update user verification status in storage
            this.markUserAsVerified();
            
            // Auto-redirect after 5 seconds
            setTimeout(() => {
                this.goToDashboard();
            }, 5000);
        }
    }

    markUserAsVerified() {
        // Update user data to mark as verified
        if (this.userData) {
            this.userData.verified = true;
            this.userData.verifiedAt = new Date().toISOString();
            
            // Save to localStorage (in real app, this would be a server call)
            localStorage.setItem('kibu_registration_data', JSON.stringify(this.userData));
            
            // Also update the main users list
            const users = JSON.parse(localStorage.getItem('kibu_users') || '[]');
            const userIndex = users.findIndex(user => user.email === this.userData.email);
            
            if (userIndex !== -1) {
                users[userIndex].verified = true;
                users[userIndex].verifiedAt = new Date().toISOString();
                localStorage.setItem('kibu_users', JSON.stringify(users));
            }
        }
    }

    goToLogin() {
        this.showNotification('Redirecting to login...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    goToDashboard() {
        this.showNotification('Welcome to your dashboard!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
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

// Add shake animation for error states
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the verification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VerificationSystem();
});