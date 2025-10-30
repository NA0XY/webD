# FinanceIQ - GitHub Pages Version

A comprehensive financial dashboard application optimized for GitHub Pages deployment.

## Features

- 📊 **Interactive Dashboard** - Real-time financial analytics with charts and KPIs
- 🧮 **Financial Calculators** - Loan, savings, investment, retirement, and mortgage calculators
- 💰 **Budget Management** - Track expenses and manage financial goals
- 📈 **Data Visualization** - Beautiful charts powered by Chart.js
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Demo Mode** - Try the full application without registration

## Demo Access

Click the "Try Demo" button on the homepage to access all features with sample data.

## Local Development

To run locally:

1. Clone this repository
2. Open `index.html` in your browser
3. All functionality works offline with localStorage

## GitHub Pages Deployment

This version is specifically optimized for GitHub Pages:

1. Upload the contents of the `github-pages/` folder to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as the source
4. Your site will be available at `https://yourusername.github.io/repository-name/`

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js 4.4.0
- **Data Processing**: PapaParse 5.4.1
- **Date Handling**: date-fns 2.29.3
- **Styling**: Custom CSS with glassmorphism effects

## File Structure

```
github-pages/
├── index.html          # Landing page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── app.js          # Application logic
├── data/
│   ├── business-transactions.csv
│   └── personal-transactions.csv
├── pages/
│   ├── dashboard.html
│   ├── calculators.html
│   ├── budget.html
│   ├── features.html
│   ├── about.html
│   ├── contact.html
│   ├── news.html
│   └── help.html
└── .nojekyll          # Prevents Jekyll processing
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is open source and available under the MIT License.