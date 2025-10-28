// ===== UTILITIES (AUTH + ANIMATIONS) =====

// API configuration
const API_URL = 'http://localhost:3000/api';

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${message}</span>
        `;
        errorDiv.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Hide error message
function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Show loading state
function setLoading(isLoading) {
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (isLoading) {
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-block';
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Handle sign up
async function handleSignUp(event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to sign in page
            window.location.href = '/signin';
        } else {
            showError(data.message || 'Sign up failed');
            setLoading(false);
        }
    } catch (error) {
        console.error('Sign up error:', error);
        showError('Could not connect to server. Please make sure the server is running.');
        setLoading(false);
    }
}

// Handle sign in
async function handleSignIn(event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            showError(data.message || 'Sign in failed');
            setLoading(false);
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showError('Could not connect to server. Please make sure the server is running.');
        setLoading(false);
    }
}

// Handle sign out
function handleSignOut() {
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const currentPage = window.location.pathname;

    // Pages that require authentication
    const protectedPages = ['/dashboard', '/calculators', '/budget'];
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));

    // Redirect to landing if not authenticated and on protected page
    if (!user && isProtectedPage) {
        window.location.href = '/';
        return null;
    }

    // Only redirect to dashboard if authenticated AND not on landing page
    // Remove automatic redirect from signin/signup pages
    // if (user && (currentPage.includes('/signin') || currentPage.includes('/signup'))) {
    //     window.location.href = '/dashboard';
    //     return user;
    // }

    return user;
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();

    // Update user email in dashboard
    if (user && document.getElementById('user-email')) {
        document.getElementById('user-email').textContent = user.email;
    }

    // Update welcome title in dashboard
    if (user && document.getElementById('welcome-title')) {
        const username = user.email.split('@')[0];
        const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById('welcome-title').textContent = `Welcome back, ${capitalizedUsername}!`;
    }
});

// Create animated background
function createAnimatedBackground() {
    const bg = document.getElementById('animated-bg');
    if (!bg) return;

    // Clear any existing content
    bg.innerHTML = '';

    // Create gradient orbs
    const orbData = [
        {
            color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
            size: 400,
            top: '10%',
            left: '10%',
            duration: 15
        },
        {
            color: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
            size: 500,
            bottom: '15%',
            right: '15%',
            duration: 20
        },
        {
            color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15))',
            size: 450,
            top: '50%',
            left: '50%',
            duration: 22
        }
    ];

    orbData.forEach((data, i) => {
        const orb = document.createElement('div');
        orb.className = 'gradient-orb';
        orb.style.cssText = `
            position: absolute;
            width: ${data.size}px;
            height: ${data.size}px;
            background: ${data.color};
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.3;
            ${data.top ? `top: ${data.top};` : ''}
            ${data.left ? `left: ${data.left};` : ''}
            ${data.right ? `right: ${data.right};` : ''}
            ${data.bottom ? `bottom: ${data.bottom};` : ''}
            animation: orbFloat${i} ${data.duration}s infinite ease-in-out;
        `;
        bg.appendChild(orb);
    });

    // Create fewer particles for better performance
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(16, 185, 129, 0.4);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat${i} ${10 + Math.random() * 10}s infinite linear;
        `;
        bg.appendChild(particle);
    }
}

// Create floating shapes
function createFloatingShapes() {
    const container = document.getElementById('floating-shapes');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Large circles
    const circleData = [
        { size: 256, top: '10%', left: '5%', duration: 15 },
        { size: 384, top: '50%', right: '10%', duration: 20 },
        { size: 320, bottom: '10%', left: '15%', duration: 18 }
    ];

    circleData.forEach((data, i) => {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: absolute;
            width: ${data.size}px;
            height: ${data.size}px;
            border-radius: 50%;
            border: 1px solid rgba(16, 185, 129, 0.1);
            ${data.top ? `top: ${data.top};` : ''}
            ${data.left ? `left: ${data.left};` : ''}
            ${data.right ? `right: ${data.right};` : ''}
            ${data.bottom ? `bottom: ${data.bottom};` : ''}
            animation: shapeFloat ${data.duration}s infinite ease-in-out;
            will-change: transform;
        `;
        container.appendChild(circle);
    });

    // Geometric shapes
    const square = document.createElement('div');
    square.style.cssText = `
        position: absolute;
        width: 128px;
        height: 128px;
        border: 1px solid rgba(6, 182, 212, 0.15);
        top: 30%;
        left: 40%;
        transform: rotate(45deg);
        animation: squareFloat 12s infinite ease-in-out;
        will-change: transform;
    `;
    container.appendChild(square);

    // Small accent dots
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: dotPulse ${Math.random() * 3 + 2}s infinite ease-in-out;
            animation-delay: ${Math.random() * 2}s;
            will-change: transform, opacity;
        `;
        container.appendChild(dot);
    }
}

// Add animation keyframes dynamically
function addAnimationStyles() {
    // Check if styles already exist
    if (document.getElementById('animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        @keyframes orbFloat0 {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            50% {
                transform: translate(50px, 30px) scale(1.1);
            }
        }

        @keyframes orbFloat1 {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            50% {
                transform: translate(-40px, -20px) scale(1.15);
            }
        }

        @keyframes orbFloat2 {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            50% {
                transform: translate(30px, -40px) scale(1.08);
            }
        }

        @keyframes shapeFloat {
            0%, 100% {
                transform: rotate(45deg) translate(0, 0);
            }
            50% {
                transform: rotate(135deg) translate(15px, -15px);
            }
        }

        @keyframes squareFloat {
            0%, 100% {
                transform: rotate(45deg) translate(0, 0);
            }
            50% {
                transform: rotate(135deg) translate(15px, -15px);
            }
        }

        @keyframes dotPulse {
            0%, 100% {
                opacity: 0.3;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.5);
            }
        }

        ${Array.from({length: 20}, (_, i) => `
            @keyframes particleFloat${i} {
                0% {
                    opacity: 0.2;
                    transform: translate(0, 0);
                }
                50% {
                    opacity: 0.8;
                }
                100% {
                    opacity: 0.2;
                    transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px);
                }
            }
        `).join('\n')}
    `;
    document.head.appendChild(style);
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    createAnimatedBackground();
    createFloatingShapes();

    // Add page transition effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '1';
    }, 10);
});

// Prevent animation issues on page unload
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

// ===== CONTENT (HELP + NEWS) =====

// Help content database
const helpContent = {
    'getting-started': {
        title: 'Getting Started with FinanceIQ',
        content: `
            <h2>Welcome to FinanceIQ!</h2>
            <p>FinanceIQ is your comprehensive financial management platform designed to help you take control of your finances. Whether you're planning for retirement, managing a budget, or making investment decisions, we have the tools you need.</p>

            <h3>Creating Your Account</h3>
            <p>To get started:</p>
            <ol>
                <li>Click the "Sign Up" button in the top navigation</li>
                <li>Fill in your email and create a secure password</li>
                <li>Verify your email address</li>
                <li>Complete your profile information</li>
            </ol>

            <h3>Navigating the Platform</h3>
            <p>FinanceIQ features several main sections:</p>
            <ul>
                <li><strong>Dashboard:</strong> Your main financial overview with charts and KPIs</li>
                <li><strong>Calculators:</strong> Powerful financial calculation tools</li>
                <li><strong>Budget:</strong> Expense tracking and budget management</li>
                <li><strong>News:</strong> Financial news and market insights</li>
                <li><strong>Help:</strong> This help center and documentation</li>
            </ul>

            <div class="note">
                <strong>Tip:</strong> Start by exploring the Dashboard to upload your financial data and get an overview of your financial health.
            </div>
        `
    },
    'calculators': {
        title: 'Using Financial Calculators',
        content: `
            <h2>Financial Calculators Guide</h2>
            <p>Our calculators provide powerful tools for financial planning and decision-making. Each calculator includes detailed breakdowns and visual charts.</p>

            <h3>Available Calculators</h3>

            <h4>Loan Calculator</h4>
            <p>Calculate monthly payments, total interest, and payment schedules for loans.</p>
            <ul>
                <li>Enter loan amount, interest rate, and term</li>
                <li>Get detailed payment breakdown</li>
                <li>View interactive payment chart</li>
            </ul>

            <h4>Savings Calculator</h4>
            <p>Plan your savings goals and see how compound interest works for you.</p>
            <ul>
                <li>Set target amount and timeline</li>
                <li>Add regular monthly contributions</li>
                <li>See interest earned over time</li>
            </ul>

            <h4>Investment Calculator</h4>
            <p>Project investment growth and returns over time.</p>
            <ul>
                <li>Calculate compound growth</li>
                <li>Factor in regular contributions</li>
                <li>Compare different scenarios</li>
            </ul>

            <h4>Retirement Calculator</h4>
            <p>Plan for your retirement and estimate future needs.</p>
            <ul>
                <li>Project savings growth</li>
                <li>Calculate retirement income</li>
                <li>Adjust for different scenarios</li>
            </ul>

            <h4>Mortgage Calculator</h4>
            <p>Calculate mortgage payments and total costs.</p>
            <ul>
                <li>Compare different loan terms</li>
                <li>See total interest paid</li>
                <li>Understand payment breakdowns</li>
            </ul>

            <div class="note">
                <strong>Pro Tip:</strong> Use the calculators together - for example, use the savings calculator to determine how much you need to save monthly to reach your retirement goals.
            </div>
        `
    },
    'budget': {
        title: 'Budget Management Guide',
        content: `
            <h2>Mastering Budget Management</h2>
            <p>Effective budget management is the foundation of financial success. Our budget tools help you track expenses, set goals, and stay on financial track.</p>

            <h3>Setting Up Your Budget</h3>
            <ol>
                <li><strong>Create Categories:</strong> Start by adding budget categories like Food, Transportation, Housing, etc.</li>
                <li><strong>Set Limits:</strong> Assign monthly spending limits to each category</li>
                <li><strong>Track Expenses:</strong> Record your daily expenses in the appropriate categories</li>
                <li><strong>Monitor Progress:</strong> Watch your progress bars and get alerts when approaching limits</li>
            </ol>

            <h3>Budget Categories Best Practices</h3>
            <ul>
                <li>Use specific categories (e.g., "Groceries" instead of just "Food")</li>
                <li>Include both fixed and variable expenses</li>
                <li>Don't forget irregular expenses like annual insurance premiums</li>
                <li>Review and adjust categories quarterly</li>
            </ul>

            <h3>Expense Tracking</h3>
            <p>Consistent expense tracking is crucial for budget success:</p>
            <ul>
                <li>Record expenses as soon as possible after they occur</li>
                <li>Use the correct categories for accurate tracking</li>
                <li>Include all expenses, even small ones</li>
                <li>Review your spending patterns monthly</li>
            </ul>

            <h3>Setting Financial Goals</h3>
            <p>Use the goals feature to stay motivated:</p>
            <ul>
                <li>Set specific, measurable goals</li>
                <li>Include target dates for urgency</li>
                <li>Track progress visually</li>
                <li>Celebrate milestones</li>
            </ul>

            <div class="note">
                <strong>Remember:</strong> A budget is a living document. Review it regularly and adjust as your life circumstances change.
            </div>
        `
    },
    'dashboard': {
        title: 'Understanding Your Dashboard',
        content: `
            <h2>Dashboard Overview</h2>
            <p>Your dashboard provides a comprehensive view of your financial health with interactive charts, key metrics, and actionable insights.</p>

            <h3>Key Dashboard Components</h3>

            <h4>Financial Overview Cards</h4>
            <p>The top cards show your key financial metrics:</p>
            <ul>
                <li><strong>Total Revenue:</strong> Your total income across all sources</li>
                <li><strong>Total Expenses:</strong> All your spending combined</li>
                <li><strong>Net Income:</strong> Revenue minus expenses</li>
                <li><strong>Savings Rate:</strong> Percentage of income saved</li>
            </ul>

            <h4>Interactive Charts</h4>
            <p>Visualize your financial data with multiple chart types:</p>
            <ul>
                <li><strong>Revenue vs Expenses:</strong> Track income and spending trends</li>
                <li><strong>Expense Breakdown:</strong> See where your money goes</li>
                <li><strong>Cash Flow:</strong> Monitor money movement over time</li>
                <li><strong>Anomaly Detection:</strong> Identify unusual spending patterns</li>
            </ul>

            <h4>Recent Transactions</h4>
            <p>View and manage your latest financial activity:</p>
            <ul>
                <li>Sort and filter transactions</li>
                <li>Search for specific entries</li>
                <li>Categorize transactions automatically</li>
                <li>Export transaction data</li>
            </ul>

            <h3>Uploading Financial Data</h3>
            <p>To populate your dashboard:</p>
            <ol>
                <li>Prepare your data in CSV format</li>
                <li>Click "Upload CSV" on the dashboard</li>
                <li>Map your columns to the correct fields</li>
                <li>Review and confirm the import</li>
            </ol>

            <h4>Supported CSV Format</h4>
            <p>Your CSV should include these columns:</p>
            <ul>
                <li><code>date</code> - Transaction date (YYYY-MM-DD format)</li>
                <li><code>description</code> - Transaction description</li>
                <li><code>amount</code> - Transaction amount (positive for income, negative for expenses)</li>
                <li><code>category</code> - Transaction category (optional)</li>
            </ul>

            <div class="note">
                <strong>Data Privacy:</strong> Your financial data is processed locally in your browser and never sent to external servers unless you explicitly choose to export it.
            </div>
        `
    }
};

// Mock market data
const mockMarketData = {
    sp500: { value: 4789.25, change: 1.23, changePercent: 0.026 },
    dow: { value: 37589.45, change: -45.67, changePercent: -0.001 },
    nasdaq: { value: 14987.32, change: 2.89, changePercent: 0.019 },
    vix: { value: 18.45, change: -0.32, changePercent: -0.017 }
};

// Mock news articles
const mockNewsArticles = [
    {
        id: 1,
        title: "Federal Reserve Signals Potential Rate Cuts in 2025",
        excerpt: "The Federal Reserve indicated that interest rate cuts could begin as early as next year, citing cooling inflation and stable economic growth.",
        source: "Financial Times",
        date: "2025-10-27",
        category: "economy",
        image: "FED"
    },
    {
        id: 2,
        title: "Tech Stocks Rally on Strong Earnings Reports",
        excerpt: "Major technology companies reported better-than-expected quarterly earnings, driving a broad market rally in the tech sector.",
        source: "Bloomberg",
        date: "2025-10-27",
        category: "technology",
        image: "TECH"
    },
    {
        id: 3,
        title: "Cryptocurrency Market Shows Signs of Recovery",
        excerpt: "Bitcoin and major altcoins have gained significant value this week, with analysts predicting continued upward momentum.",
        source: "CoinDesk",
        date: "2025-10-26",
        category: "cryptocurrency",
        image: "CRYPTO"
    },
    {
        id: 4,
        title: "Global Markets React to Trade Agreement",
        excerpt: "International markets surged following the announcement of a new trade agreement between major economic powers.",
        source: "Reuters",
        date: "2025-10-26",
        category: "markets",
        image: "TRADE"
    },
    {
        id: 5,
        title: "Oil Prices Surge Amid Supply Concerns",
        excerpt: "Crude oil prices reached new highs as geopolitical tensions threaten global supply chains.",
        source: "Wall Street Journal",
        date: "2025-10-25",
        category: "markets",
        image: "OIL"
    },
    {
        id: 6,
        title: "AI Investment Reaches Record Levels",
        excerpt: "Venture capital funding for artificial intelligence startups has reached unprecedented levels this quarter.",
        source: "TechCrunch",
        date: "2025-10-25",
        category: "technology",
        image: "AI"
    },
    {
        id: 7,
        title: "Economic Growth Exceeds Expectations",
        excerpt: "Latest GDP figures show stronger-than-anticipated economic growth, boosting investor confidence.",
        source: "CNBC",
        date: "2025-10-24",
        category: "economy",
        image: "GDP"
    },
    {
        id: 8,
        title: "Central Bank Digital Currency Progress",
        excerpt: "Several countries are making significant progress in developing their central bank digital currencies.",
        source: "Forbes",
        date: "2025-10-24",
        category: "cryptocurrency",
        image: "CBDC"
    }
];

let currentFilter = 'all';
let displayedArticles = 6;

// Initialize help center
function initializeHelpCenter() {
    // Show default content
    showCategory('getting-started');

    // Set up search functionality
    const searchInput = document.getElementById('help-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchHelp();
            }
        });
    }
}

// Show help category content
function showCategory(category) {
    const container = document.getElementById('content-container');

    if (helpContent[category]) {
        container.innerHTML = `
            <div class="help-article">
                <h2>${helpContent[category].title}</h2>
                ${helpContent[category].content}
            </div>
        `;
    } else {
        container.innerHTML = '<p>Content not found.</p>';
    }

    // Update active category styling
    document.querySelectorAll('.help-category').forEach(cat => {
        cat.classList.remove('active');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Search help content
function searchHelp() {
    const query = document.getElementById('help-search').value.toLowerCase().trim();
    const container = document.getElementById('content-container');

    if (!query) {
        showCategory('getting-started');
        return;
    }

    // Search through all content
    let results = [];
    Object.keys(helpContent).forEach(category => {
        const content = helpContent[category];
        const titleMatch = content.title.toLowerCase().includes(query);
        const contentMatch = content.content.toLowerCase().includes(query);

        if (titleMatch || contentMatch) {
            results.push({
                category: category,
                title: content.title,
                excerpt: getExcerpt(content.content, query)
            });
        }
    });

    // Display search results
    if (results.length > 0) {
        let html = '<div class="help-article"><h2>Search Results</h2>';
        results.forEach(result => {
            html += `
                <div class="search-result" onclick="showCategory('${result.category}')">
                    <h3>${result.title}</h3>
                    <p>${result.excerpt}</p>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } else {
        container.innerHTML = `
            <div class="help-article">
                <h2>No Results Found</h2>
                <p>We couldn't find any help articles matching "${query}". Try different keywords or browse our categories above.</p>
            </div>
        `;
    }
}

// Get excerpt from content around search term
function getExcerpt(content, query) {
    const plainText = content.replace(/<[^>]*>/g, '');
    const index = plainText.toLowerCase().indexOf(query);

    if (index === -1) return plainText.substring(0, 150) + '...';

    const start = Math.max(0, index - 75);
    const end = Math.min(plainText.length, index + query.length + 75);

    return (start > 0 ? '...' : '') + plainText.substring(start, end) + (end < plainText.length ? '...' : '');
}

// Toggle FAQ answers
function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    faqItem.classList.toggle('active');
}

// Initialize news page
function initializeNewsPage() {
    loadMarketData();
    renderNews();
    initializeCharts();
}

// Load market data
function loadMarketData() {
    // Update S&P 500
    const sp500Value = document.getElementById('sp500-value');
    const sp500Change = document.getElementById('sp500-change');
    if (sp500Value) sp500Value.textContent = mockMarketData.sp500.value.toLocaleString();
    if (sp500Change) updateChangeDisplay('sp500-change', mockMarketData.sp500.change, mockMarketData.sp500.changePercent);

    // Update Dow Jones
    const dowValue = document.getElementById('dow-value');
    const dowChange = document.getElementById('dow-change');
    if (dowValue) dowValue.textContent = mockMarketData.dow.value.toLocaleString();
    if (dowChange) updateChangeDisplay('dow-change', mockMarketData.dow.change, mockMarketData.dow.changePercent);

    // Update NASDAQ
    const nasdaqValue = document.getElementById('nasdaq-value');
    const nasdaqChange = document.getElementById('nasdaq-change');
    if (nasdaqValue) nasdaqValue.textContent = mockMarketData.nasdaq.value.toLocaleString();
    if (nasdaqChange) updateChangeDisplay('nasdaq-change', mockMarketData.nasdaq.change, mockMarketData.nasdaq.changePercent);

    // Update VIX
    const vixValue = document.getElementById('vix-value');
    const vixChange = document.getElementById('vix-change');
    if (vixValue) vixValue.textContent = mockMarketData.vix.value.toFixed(2);
    if (vixChange) updateChangeDisplay('vix-change', mockMarketData.vix.change, mockMarketData.vix.changePercent);
}

// Update change display with color coding
function updateChangeDisplay(elementId, change, changePercent) {
    const element = document.getElementById(elementId);
    const sign = change >= 0 ? '+' : '';
    const colorClass = change >= 0 ? 'positive' : 'negative';

    element.textContent = `${sign}${change.toFixed(2)} (${(changePercent * 100).toFixed(2)}%)`;
    element.className = `index-change ${colorClass}`;
}

// Filter news articles
function filterNews(category) {
    currentFilter = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    // Reset displayed articles
    displayedArticles = 6;
    renderNews();
}

// Render news articles
function renderNews() {
    const container = document.getElementById('news-grid');
    if (!container) return;

    container.innerHTML = '';

    let filteredArticles = mockNewsArticles;
    if (currentFilter !== 'all') {
        filteredArticles = mockNewsArticles.filter(article => article.category === currentFilter);
    }

    const articlesToShow = filteredArticles.slice(0, displayedArticles);

    articlesToShow.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-image">${article.image}</div>
            <div class="news-content">
                <div class="news-title">${article.title}</div>
                <div class="news-excerpt">${article.excerpt}</div>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${formatDate(article.date)}</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // Update load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (displayedArticles >= filteredArticles.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

// Load more news articles
function loadMoreNews() {
    displayedArticles += 6;
    renderNews();
}

// Initialize charts
function initializeCharts() {
    // Technical analysis chart
    const technicalCtx = document.getElementById('technical-chart');
    if (technicalCtx) {
        new Chart(technicalCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'S&P 500',
                    data: [4500, 4600, 4550, 4700, 4650, 4789],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// ===== BUDGET MANAGEMENT =====

// Budget data structure
let budgetData = {
    categories: [],
    expenses: [],
    goals: []
};

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBudgetData();
    updateOverview();
    renderCategories();
    renderExpenses();
    renderGoals();
    populateCategorySelect();
    setDefaultDate();
});

// Load budget data from localStorage
function loadBudgetData() {
    const saved = localStorage.getItem('financeIQ_budget');
    if (saved) {
        budgetData = JSON.parse(saved);
    }
}

// Save budget data to localStorage
function saveBudgetData() {
    localStorage.setItem('financeIQ_budget', JSON.stringify(budgetData));
}

// Update budget overview
function updateOverview() {
    const totalBudget = budgetData.categories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = budgetData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = totalBudget - totalSpent;

    document.getElementById('total-budget').textContent = '$' + totalBudget.toFixed(2);
    document.getElementById('total-spent').textContent = '$' + totalSpent.toFixed(2);
    document.getElementById('remaining-budget').textContent = '$' + remaining.toFixed(2);

    // Update progress bars
    const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const spentProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const remainingProgress = totalBudget > 0 ? (remaining / totalBudget) * 100 : 0;

    document.getElementById('budget-progress').style.width = Math.min(budgetProgress, 100) + '%';
    document.getElementById('spent-progress').style.width = Math.min(spentProgress, 100) + '%';
}

// Add new category
function addCategory() {
    const name = document.getElementById('category-name').value.trim();
    const budget = parseFloat(document.getElementById('category-budget').value);
    const color = document.getElementById('category-color').value;

    if (!name || !budget || budget <= 0) {
        alert('Please enter valid category name and budget amount.');
        return;
    }

    const category = {
        id: Date.now().toString(),
        name: name,
        budget: budget,
        color: color,
        spent: 0
    };

    budgetData.categories.push(category);
    saveBudgetData();

    // Clear form
    document.getElementById('category-name').value = '';
    document.getElementById('category-budget').value = '';

    // Update UI
    renderCategories();
    updateOverview();
    populateCategorySelect();
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categories-grid');
    container.innerHTML = '';

    if (budgetData.categories.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-400); grid-column: 1 / -1;">No categories added yet. Add your first category above!</p>';
        return;
    }

    budgetData.categories.forEach(category => {
        // Calculate spent amount for this category
        const spent = budgetData.expenses
            .filter(exp => exp.category === category.id)
            .reduce((sum, exp) => sum + exp.amount, 0);

        category.spent = spent;
        const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;

        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-header">
                <div class="category-name">${category.name}</div>
                <div class="category-color" style="background: ${category.color}"></div>
            </div>
            <div class="category-budget">$${category.budget.toFixed(2)}</div>
            <div class="category-spent">Spent: $${spent.toFixed(2)}</div>
            <div class="category-progress">
                <div class="category-progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${category.color}"></div>
            </div>
        `;

        container.appendChild(card);
    });

    saveBudgetData();
}

// Add expense
function addExpense() {
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    if (!description || !amount || amount <= 0 || !category || !date) {
        alert('Please fill in all expense details.');
        return;
    }

    const expense = {
        id: Date.now().toString(),
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    budgetData.expenses.push(expense);
    saveBudgetData();

    // Clear form
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    renderExpenses();
    renderCategories();
    updateOverview();
}

// Render expenses
function renderExpenses() {
    const container = document.getElementById('expenses-list');
    container.innerHTML = '';

    if (budgetData.expenses.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-400);">No expenses recorded yet.</p>';
        return;
    }

    // Sort expenses by date (newest first)
    const sortedExpenses = [...budgetData.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const category = budgetData.categories.find(cat => cat.id === expense.category);
        const categoryName = category ? category.name : 'Unknown';

        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">${categoryName} • ${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="expense-delete" onclick="deleteExpense('${expense.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;

        container.appendChild(item);
    });
}

// Delete expense
function deleteExpense(expenseId) {
    if (confirm('Are you sure you want to delete this expense?')) {
        budgetData.expenses = budgetData.expenses.filter(exp => exp.id !== expenseId);
        saveBudgetData();
        renderExpenses();
        renderCategories();
        updateOverview();
    }
}

// Add goal
function addGoal() {
    const name = document.getElementById('goal-name').value.trim();
    const target = parseFloat(document.getElementById('goal-target').value);
    const deadline = document.getElementById('goal-deadline').value;

    if (!name || !target || target <= 0 || !deadline) {
        alert('Please enter valid goal details.');
        return;
    }

    const goal = {
        id: Date.now().toString(),
        name: name,
        target: target,
        current: 0,
        deadline: deadline
    };

    budgetData.goals.push(goal);
    saveBudgetData();

    // Clear form
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-deadline').value = '';

    // Update UI
    renderGoals();
}

// Render goals
function renderGoals() {
    const container = document.getElementById('goals-grid');
    container.innerHTML = '';

    if (budgetData.goals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-400); grid-column: 1 / -1;">No goals set yet. Set your first financial goal above!</p>';
        return;
    }

    budgetData.goals.forEach(goal => {
        const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
            <div class="goal-name">${goal.name}</div>
            <div class="goal-progress">
                <div class="goal-amounts">
                    <span>$${goal.current.toFixed(2)}</span>
                    <span>$${goal.target.toFixed(2)}</span>
                </div>
                <div class="goal-bar">
                    <div class="goal-fill" style="width: ${Math.min(percentage, 100)}%; background: linear-gradient(90deg, var(--emerald), var(--cyan))"></div>
                </div>
            </div>
            <div class="goal-deadline">
                ${daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </div>
            <div style="margin-top: 16px;">
                <button onclick="contributeToGoal('${goal.id}')" class="btn-link" style="margin-right: 8px;">Add Money</button>
                <button onclick="deleteGoal('${goal.id}')" class="btn-link" style="color: #ef4444;">Delete</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Contribute to goal
function contributeToGoal(goalId) {
    const amount = parseFloat(prompt('Enter amount to contribute:'));
    if (amount && amount > 0) {
        const goal = budgetData.goals.find(g => g.id === goalId);
        if (goal) {
            goal.current += amount;
            saveBudgetData();
            renderGoals();
        }
    }
}

// Delete goal
function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
        budgetData.goals = budgetData.goals.filter(g => g.id !== goalId);
        saveBudgetData();
        renderGoals();
    }
}

// Populate category select dropdown
function populateCategorySelect() {
    const select = document.getElementById('expense-category');
    select.innerHTML = '<option value="">Select Category</option>';

    budgetData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Set default date to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ===== CALCULATORS =====

// Global chart variables
let loanChart, savingsChart, investmentChart, retirementChart, mortgageChart;

// Initialize calculators
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

// Initialize Chart.js instances
function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: 'white',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };

    // Loan Chart
    const loanCtx = document.getElementById('loan-chart');
    if (loanCtx) {
        loanChart = new Chart(loanCtx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#10b981', '#06b6d4'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    // Savings Chart
    const savingsCtx = document.getElementById('savings-chart');
    if (savingsCtx) {
        savingsChart = new Chart(savingsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Contributions', 'Interest'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#10b981', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    // Investment Chart
    const investmentCtx = document.getElementById('investment-chart');
    if (investmentCtx) {
        investmentChart = new Chart(investmentCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Investment Value',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });
    }

    // Retirement Chart
    const retirementCtx = document.getElementById('retirement-chart');
    if (retirementCtx) {
        retirementChart = new Chart(retirementCtx, {
            type: 'bar',
            data: {
                labels: ['Current Savings', 'Future Projections'],
                datasets: [{
                    label: 'Savings Amount',
                    data: [0, 0],
                    backgroundColor: ['#06b6d4', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Mortgage Chart
    const mortgageCtx = document.getElementById('mortgage-chart');
    if (mortgageCtx) {
        mortgageChart = new Chart(mortgageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }
}

// Switch between calculators
function switchCalculator(calculatorType) {
    // Hide all calculator contents
    const contents = document.querySelectorAll('.calculator-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.calc-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected calculator
    document.getElementById(calculatorType + '-calculator').classList.add('active');

    // Add active class to selected tab
    event.target.classList.add('active');
}

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const rate = parseFloat(document.getElementById('loan-rate').value) || 0;
    const term = parseFloat(document.getElementById('loan-term').value) || 0;

    if (amount <= 0 || rate <= 0 || term <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }

    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalAmount = monthlyPayment * numPayments;
    const totalInterest = totalAmount - amount;

    // Update results
    document.getElementById('monthly-payment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('total-interest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('total-amount').textContent = '$' + totalAmount.toFixed(2);

    // Update chart
    if (loanChart) {
        loanChart.data.datasets[0].data = [amount, totalInterest];
        loanChart.update();
    }
}

// Savings Calculator
function calculateSavings() {
    const goal = parseFloat(document.getElementById('savings-goal').value) || 0;
    const rate = parseFloat(document.getElementById('savings-rate').value) || 0;
    const time = parseFloat(document.getElementById('savings-time').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;

    if (goal <= 0 || rate <= 0 || time <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }

    const monthlyRate = rate / 100 / 12;
    const numMonths = time * 12;

    let futureValue = 0;
    let totalContributions = monthlyContribution * numMonths;

    if (monthlyRate === 0) {
        futureValue = totalContributions;
    } else {
        const compoundFactor = (Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate;
        futureValue = monthlyContribution * compoundFactor;
    }

    const interestEarned = futureValue - totalContributions;

    // Update results
    document.getElementById('total-contributions').textContent = '$' + totalContributions.toFixed(2);
    document.getElementById('interest-earned').textContent = '$' + interestEarned.toFixed(2);
    document.getElementById('final-amount').textContent = '$' + futureValue.toFixed(2);

    // Update chart
    if (savingsChart) {
        savingsChart.data.datasets[0].data = [totalContributions, interestEarned];
        savingsChart.update();
    }
}

// Investment Calculator
function calculateInvestment() {
    const initial = parseFloat(document.getElementById('initial-investment').value) || 0;
    const rate = parseFloat(document.getElementById('investment-return').value) || 0;
    const time = parseFloat(document.getElementById('investment-time').value) || 0;
    const monthly = parseFloat(document.getElementById('monthly-investment').value) || 0;

    if ((initial <= 0 && monthly <= 0) || rate <= 0 || time <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }

    const monthlyRate = rate / 100 / 12;
    const numMonths = time * 12;

    let futureValue = initial * Math.pow(1 + monthlyRate, numMonths);
    let totalInvested = initial;

    if (monthly > 0) {
        const monthlyFutureValue = monthly * (Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate;
        futureValue += monthlyFutureValue;
        totalInvested += monthly * numMonths;
    }

    const growth = futureValue - totalInvested;

    // Update results
    document.getElementById('total-invested').textContent = '$' + totalInvested.toFixed(2);
    document.getElementById('investment-growth').textContent = '$' + growth.toFixed(2);
    document.getElementById('future-value').textContent = '$' + futureValue.toFixed(2);

    // Update chart with growth over time
    if (investmentChart) {
        const labels = [];
        const data = [];

        for (let year = 0; year <= time; year++) {
            const months = year * 12;
            let value = initial * Math.pow(1 + monthlyRate, months);
            if (monthly > 0) {
                value += monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
            }
            labels.push('Year ' + year);
            data.push(value);
        }

        investmentChart.data.labels = labels;
        investmentChart.data.datasets[0].data = data;
        investmentChart.update();
    }
}

// Retirement Calculator
function calculateRetirement() {
    const currentAge = parseFloat(document.getElementById('current-age').value) || 0;
    const retirementAge = parseFloat(document.getElementById('retirement-age').value) || 0;
    const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthlySaving = parseFloat(document.getElementById('monthly-saving').value) || 0;
    const expectedReturn = parseFloat(document.getElementById('expected-return').value) || 0;

    if (currentAge >= retirementAge || expectedReturn <= 0) {
        alert('Please enter valid retirement planning values.');
        return;
    }

    const yearsUntilRetirement = retirementAge - currentAge;
    const monthsUntilRetirement = yearsUntilRetirement * 12;
    const monthlyRate = expectedReturn / 100 / 12;

    // Future value of current savings
    const currentSavingsFuture = currentSavings * Math.pow(1 + monthlyRate, monthsUntilRetirement);

    // Future value of monthly contributions
    let monthlyContributionsFuture = 0;
    if (monthlySaving > 0) {
        monthlyContributionsFuture = monthlySaving * (Math.pow(1 + monthlyRate, monthsUntilRetirement) - 1) / monthlyRate;
    }

    const projectedSavings = currentSavingsFuture + monthlyContributionsFuture;
    const monthlyIncome = projectedSavings * 0.04 / 12; // 4% safe withdrawal rate

    // Update results
    document.getElementById('years-until-retirement').textContent = yearsUntilRetirement;
    document.getElementById('projected-savings').textContent = '$' + projectedSavings.toFixed(2);
    document.getElementById('monthly-income').textContent = '$' + monthlyIncome.toFixed(2);

    // Update chart
    if (retirementChart) {
        retirementChart.data.datasets[0].data = [currentSavings, projectedSavings];
        retirementChart.update();
    }
}

// Mortgage Calculator
function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('home-price').value) || 0;
    const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
    const rate = parseFloat(document.getElementById('mortgage-rate').value) || 0;
    const term = parseFloat(document.getElementById('mortgage-term').value) || 0;

    if (homePrice <= 0 || downPayment >= homePrice || rate <= 0 || term <= 0) {
        alert('Please enter valid mortgage values.');
        return;
    }

    const loanAmount = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalCost = monthlyPayment * numPayments;
    const totalInterest = totalCost - loanAmount;

    // Update results
    document.getElementById('loan-amount-result').textContent = '$' + loanAmount.toFixed(2);
    document.getElementById('mortgage-payment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('mortgage-interest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('total-mortgage-cost').textContent = '$' + totalCost.toFixed(2);

    // Update chart
    if (mortgageChart) {
        mortgageChart.data.datasets[0].data = [loanAmount, totalInterest];
        mortgageChart.update();
    }
}

// ===== DASHBOARD =====

let transactions = [
    { id: '1', date: '2025-10-26', description: 'Client Payment - Acme Corp', amount: 45000, status: 'completed' },
    { id: '2', date: '2025-10-26', description: 'Software Subscription', amount: 299, status: 'completed' },
    { id: '3', date: '2025-10-25', description: 'Office Supplies', amount: 1250, status: 'completed' },
    { id: '4', date: '2025-10-25', description: 'Marketing Campaign', amount: 8500, status: 'completed' },
    { id: '5', date: '2025-10-24', description: 'Client Payment - TechStart', amount: 125000, status: 'completed' },
    { id: '6', date: '2025-10-24', description: 'Payroll Processing', amount: 82000, status: 'pending' },
    { id: '7', date: '2025-10-23', description: 'Cloud Services', amount: 3200, status: 'completed' },
    { id: '8', date: '2025-10-23', description: 'Consulting Services', amount: 15000, status: 'completed' },
    { id: '9', date: '2025-10-22', description: 'Equipment Purchase', amount: 28500, status: 'completed' },
    { id: '10', date: '2025-10-22', description: 'Travel Expenses', amount: 4200, status: 'failed' }
];
// Expose mutable transactions reference so uploaded data can replace it
window.transactions = transactions;

const DEFAULT_CSV_PATH = 'data/default-transactions.csv';

function normalizeDate(value) {
    if (!value) return value;
    const trimmed = value.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    const dmyMatch = trimmed.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
    if (dmyMatch) {
        const [, dd, mm, yyyy] = dmyMatch;
        return `${yyyy}-${mm}-${dd}`;
    }
    return trimmed;
}

// CSV parser
function parseCSVText(text) {
    // Prefer PapaParse when available for robust CSV handling
    if (typeof Papa !== 'undefined' && Papa.parse) {
        const res = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
        return res.data || [];
    }
    // Fallback simple parser
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const cols = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = cols[i] !== undefined ? cols[i].trim() : '';
        });
        return obj;
    });
    return rows;
}

// Load default transactions
async function loadDefaultTransactions() {
    try {
        const response = await fetch(DEFAULT_CSV_PATH, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${DEFAULT_CSV_PATH}: ${response.status}`);
        }
        const csvText = await response.text();
        const rows = parseCSVText(csvText);
        if (Array.isArray(rows) && rows.length) {
            const parsedTxns = rows
                .filter(row => row && row.date)
                .map((row, index) => {
                    const amountSource = row.amount !== undefined && row.amount !== null && row.amount !== ''
                        ? row.amount
                        : (row.value !== undefined && row.value !== null && row.value !== '' ? row.value : 0);
                    const normalizedDate = normalizeDate(row.date);
                    return {
                        id: row.id || String(Date.now()) + '-' + index,
                        date: normalizedDate,
                        description: row.description || row.desc || 'Imported',
                        amount: sanitizeAmount(amountSource),
                        status: (row.status || 'completed').toString().toLowerCase()
                    };
                })
                .filter(txn => txn.date && !Number.isNaN(new Date(txn.date).valueOf()));

            console.log('Parsed transactions from CSV:', parsedTxns.length);
            if (parsedTxns.length) {
                transactions = parsedTxns;
                window.transactions = transactions;
                return true;
            }
        }
    } catch (err) {
        console.warn('Unable to load default transactions CSV, falling back to hard-coded data.', err);
    }
    window.transactions = transactions;
    return false;
}

// Detect anomalies
function detectAnomalies(transactions) {
    const amounts = transactions.map(t => sanitizeAmount(t.amount));
    const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    const anomalies = new Set();
    transactions.forEach(t => {
        if (Math.abs(sanitizeAmount(t.amount) - mean) > 2 * stdDev) {
            anomalies.add(t.id);
        }
    });
    
    return anomalies;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    // Use Indian rupee symbol and en-IN formatting (lakhs/crores)
    try {
        const num = Number(amount) || 0;
        return `₹${num.toLocaleString('en-IN')}`;
    } catch (e) {
        return `₹${amount}`;
    }
}

function sanitizeAmount(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const asString = value.toString().replace(/[₹,\s]/g, '');
    const parsed = Number(asString);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function computeKPIs(txns) {
    const totals = {
        revenue: 0,
        expenses: 0,
        activeAccounts: new Set()
    };

    txns.forEach(t => {
        const amount = sanitizeAmount(t.amount);
        const classification = classifyTransaction(t);
        if (classification.type === 'revenue') {
            totals.revenue += amount;
        } else {
            totals.expenses += amount;
        }
        const description = (t.description || '').toString();
        if (description) {
            const accountName = description.includes('-')
                ? description.split('-').pop().trim()
                : description.trim();
            if (accountName) totals.activeAccounts.add(accountName);
        }
    });

    const netProfit = totals.revenue - totals.expenses;
    return {
        totalRevenue: totals.revenue,
        totalExpenses: totals.expenses,
        netProfit,
        activeAccounts: totals.activeAccounts.size || txns.length
    };
}

function updateKPICards() {
    const txns = window.transactions || transactions;
    const { totalRevenue, totalExpenses, netProfit, activeAccounts } = computeKPIs(txns);

    const revenueEl = document.getElementById('kpi-total-revenue');
    if (revenueEl) revenueEl.textContent = formatCurrency(totalRevenue);

    const expensesEl = document.getElementById('kpi-total-expenses');
    if (expensesEl) expensesEl.textContent = formatCurrency(totalExpenses);

    const netEl = document.getElementById('kpi-net-profit');
    if (netEl) netEl.textContent = formatCurrency(netProfit);

    const accountsEl = document.getElementById('kpi-active-accounts');
    if (accountsEl) accountsEl.textContent = (activeAccounts || 0).toLocaleString('en-IN');
}

// Render transactions table
function renderTransactions() {
    const tbody = document.getElementById('transactions-body');
    if (!tbody) return;
    updateKPICards();
    const txns = window.transactions || transactions;
    const anomalies = window._anomalies || detectAnomalies(txns);
    
    // Update anomaly count
    const anomalyCount = document.getElementById('anomaly-count');
    if (anomalyCount) {
        anomalyCount.textContent = `${anomalies.size} ${anomalies.size === 1 ? 'anomaly' : 'anomalies'} detected`;
    }
    
    tbody.innerHTML = (txns || []).map(transaction => {
        const isAnomaly = anomalies.has(transaction.id);
        
        return `
            <tr class="${isAnomaly ? 'anomaly' : ''}">
                <td class="transaction-date">${formatDate(transaction.date)}</td>
                <td class="transaction-desc">
                    ${transaction.description}
                    ${isAnomaly ? `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f59e0b; flex-shrink: 0;">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    ` : ''}
                </td>
                <td class="transaction-amount">${formatCurrency(transaction.amount)}</td>
                <td style="text-align: center">
                    <span class="status-badge status-${transaction.status}">${transaction.status}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// Create Revenue Chart
let revenueChart = null;
function createRevenueChart() {
    console.log('Creating revenue chart...');
    const canvas = document.getElementById('revenueChart');
    if (!canvas) {
        console.error('Revenue chart canvas not found');
        return;
    }
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) {
        console.error('Cannot get 2d context for revenue chart');
        return;
    }

    // Destroy existing chart if it exists
    if (revenueChart) {
        revenueChart.destroy();
    }

    // Build per-transaction series (time-based)
    const txns = (window.transactions || transactions)
        .slice()
        .filter(t => t && t.date)
        .map(t => ({
            ...t,
            date: normalizeDate(t.date),
            amount: sanitizeAmount(t.amount)
        }))
        .filter(t => t.date && !Number.isNaN(new Date(t.date).valueOf()));

    console.log('Filtered transactions:', txns.length);
    if (!txns.length) {
        console.warn('No valid transactions for revenue chart');
        return;
    }

    const dailyTotals = {};
    txns.forEach(t => {
        const key = t.date;
        if (!dailyTotals[key]) {
            dailyTotals[key] = { revenue: 0, expenses: 0 };
        }
        const cls = classifyTransaction(t);
        if (cls.type === 'revenue') {
            dailyTotals[key].revenue += t.amount;
        } else {
            dailyTotals[key].expenses += t.amount;
        }
    });

    const sortedKeys = Object.keys(dailyTotals).sort((a, b) => new Date(a) - new Date(b));
    const revenuePoints = sortedKeys.map(dateKey => ({ x: new Date(dateKey), y: dailyTotals[dateKey].revenue }));
    const expensePoints = sortedKeys.map(dateKey => ({ x: new Date(dateKey), y: dailyTotals[dateKey].expenses }));

    console.log('Revenue points:', revenuePoints);
    console.log('Expense points:', expensePoints);

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Revenue',
                    data: revenuePoints,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    showLine: true,
                    tension: 0.25,
                    pointStyle: 'circle',
                    parsing: { xAxisKey: 'x', yAxisKey: 'y' }
                },
                {
                    label: 'Expenses',
                    data: expensePoints,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6,182,212,0.08)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    showLine: true,
                    tension: 0.25,
                    pointStyle: 'rectRounded',
                    parsing: { xAxisKey: 'x', yAxisKey: 'y' }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'nearest' },
            plugins: {
                legend: { display: true, labels: { color: '#d1d5db' } },
                tooltip: {
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 8,
                    titleColor: '#f3f4f6',
                    bodyColor: '#f3f4f6',
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const amount = formatCurrency(context.parsed && context.parsed.y ? context.parsed.y : 0);
                            return `${label}: ${amount}`;
                        },
                        title: function(items) {
                            if (!items || !items.length) return '';
                            const parsed = items[0].parsed;
                            const date = parsed && parsed.x ? (parsed.x instanceof Date ? parsed.x : new Date(parsed.x)) : null;
                            return date ? date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day', tooltipFormat: 'dd MMM yyyy' },
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af', callback: function(v){ return formatCurrency(v); } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                }
            }
        }
    });

    console.log('Revenue chart created successfully');
}

// Create a small pie chart for spending breakdown
function createSpendingPieChart() {
    const canvas = document.getElementById('spendingPieChart');
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;
    // derive breakdown from transactions by same heuristics as expense chart
    const txns = window.transactions || transactions;
    const categories = {};
    txns.forEach(t => {
        const cls = classifyTransaction(t);
        if (cls.type === 'expense') {
            const cat = cls.category || 'Other';
            categories[cat] = (categories[cat] || 0) + sanitizeAmount(t.amount);
        }
    });
    const labels = Object.keys(categories);
    const values = labels.map(l => categories[l]);
    const colors = ['#10b981','#06b6d4','#8b5cf6','#f59e0b','#ef4444','#a3e635','#60a5fa'];

    if (window.spendingPieChart && typeof window.spendingPieChart.destroy === 'function') window.spendingPieChart.destroy();
    window.spendingPieChart = new Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data: values, backgroundColor: labels.map((_, i) => colors[i % colors.length]) }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#d1d5db' } } } }
    });
}

// Create expenditure chart
function createExpenditureChart() {
    const canvas = document.getElementById('expenditureChart');
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;
    // Build monthly expense series from transactions
    const txns = window.transactions || transactions;
    const monthly = {};
    txns.forEach(t => {
        const cls = classifyTransaction(t);
        if (cls.type !== 'expense') return;
        const d = new Date(t.date);
        if (isNaN(d)) return;
        const key = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        if (!monthly[key]) monthly[key] = 0;
        monthly[key] += sanitizeAmount(t.amount);
    });

    const labels = Object.keys(monthly).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map(l => monthly[l] || 0);

    if (window.expenditureChart && typeof window.expenditureChart.destroy === 'function') window.expenditureChart.destroy();
    window.expenditureChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Expenses', data: values, backgroundColor: 'rgba(6,182,212,0.6)' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { color: '#9ca3af' } }, x: { ticks: { color: '#9ca3af' } } } }
    });
}

// Heuristic classifier: determine revenue vs expense and a category
function classifyTransaction(t) {
    const desc = (t.description || '').toString().toLowerCase();
    // revenue keywords
    const revenueKeywords = ['payment','invoice','paid','income','deposit','receipt'];
    for (const k of revenueKeywords) if (desc.includes(k)) return { type: 'revenue', category: 'Revenue' };

    // expense categories
    const mapping = [
        { keys: ['salary','payroll','salaries'], cat: 'Salaries' },
        { keys: ['marketing','ad','campaign'], cat: 'Marketing' },
        { keys: ['travel','flight','taxi','uber'], cat: 'Travel' },
        { keys: ['cloud','services','hosting','aws','azure'], cat: 'Operations' },
        { keys: ['consult','consulting'], cat: 'Consulting' },
        { keys: ['equipment','purchase','equipment','hardware'], cat: 'Equipment' },
        { keys: ['r&d','research'], cat: 'R&D' }
    ];
    for (const m of mapping) {
        for (const k of m.keys) if (desc.includes(k)) return { type: 'expense', category: m.cat };
    }

    // default fallback
    return { type: 'expense', category: 'Other' };
}

// Parse uploaded file
function parseUploadedFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            try {
                // Try JSON first
                const parsed = JSON.parse(text);
                return resolve(parsed);
            } catch (e) {
                // Not JSON — try CSV. Use PapaParse when available for robust parsing.
                try {
                    if (typeof Papa !== 'undefined' && Papa.parse) {
                        const res = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
                        return resolve(res.data || []);
                    }
                    // Fallback simple CSV parsing
                    const lines = text.split(/\r?\n/).filter(l => l.trim());
                    const headers = lines[0].split(',').map(h => h.trim());
                    const rows = lines.slice(1).map(line => {
                        const cols = line.split(',');
                        const obj = {};
                        headers.forEach((h, i) => obj[h] = cols[i]);
                        return obj;
                    });
                    return resolve(rows);
                } catch (err) {
                    return reject(err);
                }
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Mock anomaly model: simulate async call and mark large transactions as anomalies
function mockAnomalyModel(txns) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const amounts = txns.map(t => sanitizeAmount(t.amount));
            const mean = amounts.reduce((s, v) => s + v, 0) / Math.max(1, amounts.length);
            const variance = amounts.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / Math.max(1, amounts.length);
            const sd = Math.sqrt(variance);
            const anomalies = new Set();
            txns.forEach(t => {
                if (Math.abs(sanitizeAmount(t.amount) - mean) > 1.5 * sd) {
                    anomalies.add(t.id);
                }
            });
            resolve(anomalies);
        }, 700); // simulate latency
    });
}

// Initialize dashboard
async function initDashboard() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded. Please check your internet connection.');
        return;
    }

    // Load CSV defaults (falls back to in-file data if unavailable)
    const loadedFromCSV = await loadDefaultTransactions();
    if (!loadedFromCSV) {
        window.transactions = window.transactions || transactions;
    }

    updateKPICards();
    renderTransactions();
    
    // Small delay to ensure DOM is ready
    setTimeout(async () => {
        // Initialize charts (they're contained inside fixed-height wrappers so Chart.js won't create oversized canvases)
        await createRevenueChart();
        await createSpendingPieChart();
        const expenditureWrapper = document.getElementById('expenditureChartWrapper');
        if (expenditureWrapper) {
            expenditureWrapper.style.display = 'block';
            await createExpenditureChart();
        }
        animateKPICards();

        // Run mock anomaly model on initial data
        const initialAnoms = await mockAnomalyModel(window.transactions || transactions);
        window._anomalies = initialAnoms;
        const anomalyCountEl = document.getElementById('anomaly-count');
        if (anomalyCountEl) anomalyCountEl.textContent = `${initialAnoms.size} ${initialAnoms.size === 1 ? 'anomaly' : 'anomalies'} detected`;
        renderTransactions();
    }, 100);

    // Upload & controls
    const uploadInput = document.getElementById('upload-transactions');
    const toggleExpenseBtn = document.getElementById('toggleExpenseChartBtn');

    if (uploadInput) {
        uploadInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            console.log('File selected:', file.name, file.type, file.size);
            try {
                const parsed = await parseUploadedFile(file);
                console.log('Parsed data:', parsed);
                if (Array.isArray(parsed) && parsed.length) {
                    console.log('Updating transactions with', parsed.length, 'items');
                    // Replace transactions with uploaded ones (keeping IDs)
                    window.transactions = parsed.map((t, i) => ({
                        id: t.id || String(Date.now()) + '-' + i,
                        date: normalizeDate(t.date) || (new Date()).toISOString(),
                        description: t.description || t.desc || 'Uploaded',
                        amount: sanitizeAmount(t.amount || t.value || 0),
                        status: t.status || 'completed'
                    }));
                    console.log('Updated window.transactions:', window.transactions.length);
                    updateKPICards();
                    // Recreate charts and run model on uploaded data
                    await createRevenueChart();
                    await createSpendingPieChart();
                    const expenditureWrapper = document.getElementById('expenditureChartWrapper');
                    if (expenditureWrapper) {
                        expenditureWrapper.style.display = 'block';
                        await createExpenditureChart();
                    }
                    const anomalies = await mockAnomalyModel(window.transactions || transactions);
                    window._anomalies = anomalies;
                    const anomalyCountEl = document.getElementById('anomaly-count');
                    if (anomalyCountEl) anomalyCountEl.textContent = `${anomalies.size} ${anomalies.size === 1 ? 'anomaly' : 'anomalies'} detected`;
                    renderTransactions();
                    console.log('Dashboard updated successfully');
                } else {
                    console.warn('No valid data parsed from file');
                    alert('No valid data found in the uploaded file. Please check the format.');
                }
            } catch (err) {
                console.error('Failed to parse uploaded file', err);
                alert('Failed to parse uploaded file. Please upload JSON array or CSV with headers (id,date,description,amount,status)');
            }
        });
    }

    if (toggleExpenseBtn) {
        toggleExpenseBtn.addEventListener('click', () => {
            const wrapper = document.getElementById('expenditureChartWrapper');
            if (!wrapper) return;
            if (wrapper.style.display === 'none' || wrapper.style.display === '') {
                wrapper.style.display = 'block';
                createExpenditureChart();
            } else {
                wrapper.style.display = 'none';
                if (window.expenditureChart) {
                    window.expenditureChart.destroy();
                    window.expenditureChart = null;
                }
            }
        });
    }
}

// Animate KPI cards with stagger
function animateKPICards() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== INITIALIZATION =====

// Initialize content based on page
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    if (document.getElementById('content-container')) {
        // Help page
        initializeHelpCenter();
    } else if (document.getElementById('news-grid')) {
        // News page
        initializeNewsPage();
    } else if (document.getElementById('transactions-body')) {
        // Dashboard page
        initDashboard();
    }
});

// Market updates
setInterval(() => {
    // Randomly update market data slightly
    Object.keys(mockMarketData).forEach(key => {
        const change = (Math.random() - 0.5) * 10; // Random change between -5 and +5
        mockMarketData[key].change += change;
        mockMarketData[key].changePercent = mockMarketData[key].change / mockMarketData[key].value;
        mockMarketData[key].value += change;
    });

    loadMarketData();
}, 30000); // Update every 30 seconds

// Navigation helper
function navigateTo(path) {
    window.location.href = path;
}