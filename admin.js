// Admin functionality - simple display settings
let displaySettings = {};

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
        displaySettings = JSON.parse(savedSettings);
        
        // Apply settings to form
        if (displaySettings.group) {
            document.getElementById('display-group').value = displaySettings.group;
        }
        
        if (displaySettings.showFixtures !== undefined) {
            document.getElementById('show-fixtures').checked = displaySettings.showFixtures;
        } else {
            // Default to false if not set
            document.getElementById('show-fixtures').checked = false;
        }
        
        if (displaySettings.title) {
            document.getElementById('tournament-title').value = displaySettings.title;
        }
        
        if (displaySettings.subtitle) {
            document.getElementById('tournament-subtitle').value = displaySettings.subtitle;
        }
    } else {
        // Set defaults
        displaySettings = {
            group: 'group-a',
            showFixtures: false,  // Fixtures off by default
            title: 'Asian Men\'s Handball Championship 2026',
            subtitle: 'Tournament Tables & Results'
        };
        saveSettings();
    }
}

// Save settings to localStorage
function saveSettings() {
    displaySettings = {
        group: document.getElementById('display-group').value,
        showFixtures: document.getElementById('show-fixtures').checked,
        title: document.getElementById('tournament-title').value || 'Asian Men\'s Handball Championship 2026',
        subtitle: document.getElementById('tournament-subtitle').value || 'Tournament Tables & Results'
    };
    
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
    
    alert('Settings saved! The output page will update automatically.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});