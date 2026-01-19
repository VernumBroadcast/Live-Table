# Asian Men's Handball Championship 2026 - Tournament Management System

A beautiful, interactive tournament management system with an admin panel and a clean output display page.

## Features

- 🎛️ **Admin Panel** - Full control over tournament data
- 📺 **Output Page** - Clean, professional display that updates automatically
- 🏆 View standings for all groups (A, B, C, D)
- 📊 Interactive tournament tables with team positions, stats, and points
- ⚽ Match schedules and results management
- 🎨 Beautiful graphical interface with custom background and fonts
- 📱 Responsive design for mobile and desktop
- 🚩 Local flag images for all teams
- 💾 Data persistence using localStorage

## Pages

### Admin Page (`admin.html`)
- Manage tournament groups and teams
- Edit team statistics (wins, losses, points, goal difference)
- Add/edit/delete matches
- Configure tournament title and subtitle
- Export/import data as JSON
- Reset to default data

### Output Page (`output.html`)
- Clean, professional display
- Automatically reflects changes made in admin panel
- Updates every 2 seconds to show latest changes
- Perfect for display on screens or projectors

## Files Structure

### Core Files
- `admin.html` - Admin panel interface
- `admin.css` - Admin panel styling
- `admin.js` - Admin functionality and data management
- `output.html` - Clean output display page
- `output.css` - Output page styling
- `output.js` - Output display logic

### Data Files
- `data.js` - Default tournament data structure
- `flag-mapping.js` - Mapping of team names to local flag files

### Assets
- `FLAGS/` - Folder containing all team flag images
- `BACKDROP.png` - Background image
- `Cairo-Bold.ttf` - Custom font

### Legacy Files
- `index.html` - Original single-page version (can be used standalone)
- `styles.css` - Original styling (shared styles)
- `app.js` - Original app logic (for standalone version)

## Usage

### Admin Mode
1. Open `admin.html` in a web browser
2. Navigate between Groups, Matches, and Settings tabs
3. Edit teams, scores, and tournament information
4. Click "Save All Changes" to persist updates
5. Click "View Output Page" to see the display

### Display Mode
1. Open `output.html` in a web browser (or use the link from admin)
2. Select groups using the dropdown menu
3. The page automatically updates every 2 seconds with admin changes
4. Perfect for displaying on screens during events

## Data Storage

All tournament data is stored in the browser's localStorage. This means:
- Changes persist across page reloads
- Data is stored locally (no server required)
- Each browser/user has their own data
- Use Export/Import to share data between devices

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
