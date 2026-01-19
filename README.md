# Asian Men's Handball Championship 2026 - Tournament Display

A beautiful, interactive tournament display page that automatically fetches data from the Asian Handball website.

## Features

- 📺 **Live Display Page** - Clean, professional display that updates automatically
- 🏆 View standings for all groups (A, B, C, D)
- 📊 Interactive tournament tables with team positions, stats, and points
- ⚽ Match schedules and results (optional)
- 🎨 Beautiful graphical interface with custom background and fonts
- 📱 Responsive design for mobile and desktop
- 🚩 Local flag images for all teams
- 🔄 Auto-refreshes every 30 seconds with latest data
- 🎯 Manual group selection in top-right corner

## Output Page (`output.html`)

- Automatically fetches data from the Asian Handball website
- Manual group selection dropdown in top-right corner
- Updates every 30 seconds with latest tournament data
- Perfect for display on screens or projectors
- Fixtures/matches hidden by default (can be enabled)

## Files Structure

### Core Files
- `output.html` - Main display page
- `output.css` - Display page styling
- `output.js` - Display logic and data fetching

### Data Files
- `data.js` - Default tournament data structure (fallback)
- `flag-mapping.js` - Mapping of team names to local flag files

### Assets
- `Flags Updated/` - Folder containing all team flag images
- `BACKDROP.png` - Background image
- `Cairo-Bold.ttf` - Custom font

### Legacy Files
- `index.html` - Original single-page version (can be used standalone)
- `styles.css` - Original styling (shared styles)
- `app.js` - Original app logic (for standalone version)

## Usage

1. Open `output.html` in a web browser
2. Use the dropdown in the top-right corner to select which group to display
3. The page automatically fetches fresh data from the Asian Handball website every 30 seconds
4. Perfect for displaying on screens during events

## Data Storage

- Group selection is saved in localStorage (persists across page reloads)
- Fixtures preference is saved in localStorage
- Tournament data is automatically fetched from the website (no manual data entry needed)

## Flag Images

All flag images are stored locally in the `FLAGS/` folder:
- Flag_of_Qatar.svg.png
- Flag_of_South_Korea.svg.png
- Flag_of_Bahrain.svg.png
- Flag_of_Iraq.svg.png
- ... and more

The `flag-mapping.js` file automatically maps team names to their flag files.

## Design Features

- Custom Cairo-Bold font for elegant typography
- BACKDROP.png as the page background
- Color-coded statistics (green for positive, red for negative goal differences)
- Special highlighting for top 3 positions (gold, silver, bronze)
- Smooth animations and hover effects
- Glass-morphism effects on header and cards
- Responsive mobile design

## Data Source

Tournament data sourced from: https://asianhandball.org/kuwait2026/s/

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- ES6 JavaScript features
- CSS Grid and Flexbox
