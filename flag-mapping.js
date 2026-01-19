// Mapping of team names to local flag file paths (using Flags Updated folder)
const flagMapping = {
    'Qatar': 'Flags Updated/QAT.png',
    'Republic of Korea': 'Flags Updated/KOR.png',
    'Korea': 'Flags Updated/KOR.png', // Also map display name
    'Oman': 'Flags Updated/OMA.png',
    'Bahrain': 'Flags Updated/BHR.png',
    'Iraq': 'Flags Updated/IRA.png',
    'P. R. China': 'Flags Updated/CHN.png',
    'China': 'Flags Updated/CHN.png', // Also map display name
    'Jordan': 'Flags Updated/JOR.png',
    'Kuwait': 'Flags Updated/KUW.png',
    'United Arab Emirates': 'Flags Updated/UAE.png',
    'Hong Kong-China': 'Flags Updated/HKG.png',
    'Hong Kong -- China': 'Flags Updated/HKG.png', // Also map display name
    'India': 'Flags Updated/IND.png',
    'Saudi Arabia': 'Flags Updated/KSA.png',
    'I. R. Iran': 'Flags Updated/IRN.png',
    'Japan': 'Flags Updated/JPN.png',
    'Australia': 'Flags Updated/AUS.png',
    'Default': 'Flags Updated/JOR.png' // Fallback flag
};

// Get flag path for a team name
function getFlagPath(teamName) {
    return flagMapping[teamName] || flagMapping['Default'];
}

// Set flag path for a team (for admin customization)
function setFlagPath(teamName, flagPath) {
    flagMapping[teamName] = flagPath;
}