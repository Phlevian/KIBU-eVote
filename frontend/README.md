# KIBU-eVote 🗳

*Blockchain Powered KIBU Voting System*

A secure, transparent, and modern digital voting platform for Kibabii University (KIBU) students. This system leverages blockchain technology to ensure vote integrity, transparency, and anonymity in student elections.

---

## 🎯 Project Overview

KIBU-eVote is a web-based voting application that allows KIBU students to participate in university elections securely from anywhere. The system features real-time vote counting, blockchain verification, and a user-friendly interface that makes democratic participation easy and accessible for all students.

### Key Features

✅ *Secure Authentication* - Student ID and password-based login with optional 2FA  
✅ *Blockchain Security* - All votes recorded on immutable blockchain ledger  
✅ *Real-time Results* - Live vote counting and transparent result display  
✅ *Multiple Elections* - Support for various election types (Student Council, Sports, Clubs)  
✅ *Vote Verification* - Students can verify their votes on the blockchain  
✅ *Mobile Responsive* - Works seamlessly on desktop, tablet, and mobile devices  
✅ *Offline Support* - Physical voting stations for students without internet access  
✅ *Anonymous Voting* - Complete voter privacy while maintaining vote integrity  

---

## 🏗 Project Structure


KIBU-eVote/
│
├── index.html                  # Landing page
├── signup.html                 # Student registration page
├── login.html                  # Login page
├── dashboard.html              # Main dashboard after login
├── voting.html                 # Voting interface/ballot page
├── confirmation.html           # Vote confirmation page
├── results.html                # Election results page
├── elections.html              # Election status page
│
├── css/
│   ├── main.css               # Global styles and variables
│   ├── landing.css            # Landing page styles
│   ├── auth.css               # Login and signup styles
│   ├── dashboard.css          # Dashboard styles
│   ├── voting.css             # Voting interface styles
│   ├── confirmation.css       # Confirmation page styles
│   ├── results.css            # Results page styles
│   └── elections.css          # Elections page styles
│
├── js/
│   ├── main.js                # Global functions and utilities
│   ├── auth.js                # Authentication logic
│   ├── dashboard.js           # Dashboard functionality
│   ├── voting.js              # Voting logic and validation
│   ├── blockchain.js          # Blockchain integration
│   ├── results.js             # Results display logic
│   └── elections.js           # Elections page functionality
│
├── assets/
│   ├── images/
│   │   ├── logo.png           # KIBU logo
│   │   ├── hero-bg.jpg        # Hero background images
│   │   └── candidates/        # Candidate photos
│   ├── icons/                 # SVG icons and graphics
│   └── fonts/                 # Custom fonts (if any)
│
├── data/
│   ├── elections.json         # Election data (mock data)
│   ├── candidates.json        # Candidate information
│   └── students.json          # Student data (mock)
│
├── README.md                  # This file
└── .gitignore                # Git ignore file


---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- A code editor (VS Code, Sublime Text, etc.)
- Git installed on your computer

### Installation

1. *Clone the repository*
bash
git clone https://github.com/your-username/KIBU-eVote.git
cd KIBU-eVote


2. *Create the project structure*

Run these commands in your terminal to create all necessary folders and files:

bash
# Create main HTML files
touch index.html signup.html login.html dashboard.html voting.html confirmation.html results.html elections.html

# Create CSS folder and files
mkdir css
touch css/main.css css/landing.css css/auth.css css/dashboard.css css/voting.css css/confirmation.css css/results.css css/elections.css

# Create JS folder and files
mkdir js
touch js/main.js js/auth.js js/dashboard.js js/voting.js js/blockchain.js js/results.js js/elections.js

# Create assets folders
mkdir -p assets/images/candidates
mkdir assets/icons
mkdir assets/fonts

# Create data folder and files
mkdir data
touch data/elections.json data/candidates.json data/students.json

# Create additional files
touch .gitignore README.md


3. *Open in your browser*

Simply open index.html in your browser to view the landing page, or use a local server:

bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"


Visit http://localhost:8000 in your browser.

---

## 📁 File Descriptions

### HTML Pages

| File | Purpose | Key Features |
|------|---------|--------------|
| index.html | Landing page | Hero section, features, how it works, KIBU branding |
| signup.html | Student registration | Multi-step form, photo upload, validation |
| login.html | User authentication | Student ID login, biometric options, password recovery |
| dashboard.html | Main hub | Election cards, countdown timers, quick actions, sidebar |
| voting.html | Ballot interface | Candidate selection, position navigation, review votes |
| confirmation.html | Vote receipt | Transaction ID, blockchain proof, download receipt |
| results.html | Election outcomes | Charts, winner announcements, transparency data |
| elections.html | Election overview | All elections status, calendar view, filters |

### CSS Files

| File | Purpose |
|------|---------|
| main.css | Global styles, CSS variables, reusable components |
| landing.css | Landing page specific styles |
| auth.css | Login and signup page styles |
| dashboard.css | Dashboard layout and components |
| voting.css | Voting interface and candidate cards |
| confirmation.css | Confirmation page styles |
| results.css | Charts and results display |
| elections.css | Elections page grid and filters |

### JavaScript Files

| File | Purpose |
|------|---------|
| main.js | Global utilities, helpers, DOM manipulation |
| auth.js | Login/signup logic, session management |
| dashboard.js | Dashboard data loading, countdown timers |
| voting.js | Vote selection, validation, submission |
| blockchain.js | Blockchain integration, transaction handling |
| results.js | Results fetching, chart rendering |
| elections.js | Elections filtering, search, calendar |

---

## 🎨 Design System

### Color Palette

css
/* Primary Colors */
--electric-blue: #0080FF;
--vibrant-purple: #8A2BE2;
--deep-emerald: #00C851;

/* Accent Colors */
--bright-orange: #FF6B35;
--coral-pink: #FF5E5B;
--golden-yellow: #FFD23F;

/* Status Colors */
--success-green: #4CAF50;
--warning-orange: #FF9800;
--error-red: #F44336;

/* Neutral Colors */
--white: #FFFFFF;
--light-gray: #F5F5F5;
--dark-navy: #1A237E;


### Typography

- *Headings*: Bold, modern sans-serif (Inter, Roboto)
- *Body*: Clean, readable sans-serif
- *Monospace*: For transaction IDs and blockchain data

---

## 🔧 Development Guide

### Coding Standards

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Write modular, reusable JavaScript functions
- Comment complex logic
- Keep functions small and focused
- Use meaningful variable names

### Git Workflow

bash
# Create a new feature branch
git checkout -b feature/voting-interface

# Make your changes and commit
git add .
git commit -m "Add voting interface with candidate selection"

# Push to GitHub
git push origin feature/voting-interface

# Create a pull request on GitHub


---

## 📱 Pages Breakdown

### 1. Landing Page (index.html)
- Hero section with KIBU branding
- Feature showcase (Security, Accessibility, Transparency)
- How it works section (4 steps)
- Call-to-action buttons
- Footer with links

### 2. Signup Page (signup.html)
- Multi-step registration form
- Student ID verification
- Photo upload
- Password creation
- Terms acceptance

### 3. Login Page (login.html)
- Student ID input
- Password input
- Remember device option
- Alternative login methods
- Forgot password link

### 4. Dashboard (dashboard.html)
- Header with countdown timer
- Left sidebar navigation
- Active elections cards
- Quick actions panel
- Recent activity timeline
- Statistics cards

### 5. Voting Page (voting.html)
- Election header with timer
- Position-by-position navigation
- Candidate cards with photos
- Selection feedback
- Review section
- Submit button

### 6. Confirmation Page (confirmation.html)
- Success celebration
- Transaction receipt
- Blockchain verification
- Download/email options
- Next steps information

### 7. Results Page (results.html)
- Winner announcements
- Vote breakdown charts
- Faculty analysis
- Statistics dashboard
- Transparency features
- Download reports

### 8. Elections Page (elections.html)
- Filter and search
- Active elections section
- Upcoming elections section
- Completed elections section
- Personal voting history
- Election calendar

---

## 🔐 Security Features

- Student ID and password authentication
- Session management
- Input validation and sanitization
- HTTPS encryption (in production)
- Blockchain vote recording
- Anonymous voting while maintaining integrity
- Vote verification system

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## 📝 To-Do List

- [ ] Complete landing page HTML structure
- [ ] Style signup page with vibrant colors
- [ ] Implement login authentication logic
- [ ] Build dashboard with sidebar and cards
- [ ] Create voting interface with candidate selection
- [ ] Add confirmation page with blockchain integration
- [ ] Design results page with charts
- [ ] Implement elections filtering and search
- [ ] Add mobile responsiveness to all pages
- [ ] Integrate with blockchain backend (future)
- [ ] Add real-time vote counting
- [ ] Implement offline voting station interface

---

## 📚 Resources

- [HTML5 Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS3 Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Chart.js Documentation](https://www.chartjs.org/docs/) (for results charts)
- [Blockchain Basics](https://www.investopedia.com/terms/b/blockchain.asp)

---

## 👥 Team

*KIBU Computer Science Students*
- Developer 1: [Phlevian]
- Developer 2: [Friend's Name]

---

## 📄 License

This project is for educational purposes as part of KIBU coursework.

---

## 📞 Support

For questions or issues:
- Email: voting@kibu.ac.ke
- KIBU ICT Department
- GitHub Issues: [Create an issue](https://github.com/your-username/KIBU-eVote/issues)

---

## 🎉 Acknowledgments

- Kibabii University ICT Department
- KIBU Student Council
- All students who will participate in digital democracy

---

*Made with ❤ for KIBU Students by KIBU Students*