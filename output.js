// Output page - automatically fetches data from the Asian Handball website
let displayData = {};

// Fetch data from the website
async function fetchTournamentData() {
    try {
        const url = 'https://asianhandball.org/kuwait2026/s/';
        // Use a CORS proxy to fetch the HTML
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (!data.contents) {
            throw new Error('No content received');
        }
        
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Extract tournament data
        const fetchedData = parseTournamentData(doc);
        
        // Only update if we got valid data
        if (fetchedData && Object.keys(fetchedData).length > 0) {
            displayData = fetchedData;
            const currentGroup = document.getElementById('group-select').value;
            renderGroup(currentGroup);
        }
        
    } catch (error) {
        console.error('Error fetching tournament data:', error);
        // On error, use fallback data
        if (!displayData || Object.keys(displayData).length === 0) {
            displayData = JSON.parse(JSON.stringify(tournamentData));
            updateFlagPaths(displayData);
            const currentGroup = document.getElementById('group-select').value;
            renderGroup(currentGroup);
        }
    }
}

// Parse tournament data from HTML
function parseTournamentData(doc) {
    const parsedData = {};
    
    // Find all group sections (they have h4 headers)
    const allHeaders = Array.from(doc.querySelectorAll('h4'));
    
    allHeaders.forEach(header => {
        const headerText = header.textContent.trim();
        
        // Check if this is a group header
        if (headerText.includes('Group A')) {
            parsedData['group-a'] = parseGroupFromHeader(doc, header, 'Group A', 'group-a');
        } else if (headerText.includes('Group B')) {
            parsedData['group-b'] = parseGroupFromHeader(doc, header, 'Group B', 'group-b');
        } else if (headerText.includes('Group C')) {
            parsedData['group-c'] = parseGroupFromHeader(doc, header, 'Group C', 'group-c');
        } else if (headerText.includes('Group D')) {
            parsedData['group-d'] = parseGroupFromHeader(doc, header, 'Group D', 'group-d');
        }
    });
    
    // Fill in missing groups with default data
    const defaultData = JSON.parse(JSON.stringify(tournamentData));
    Object.keys(defaultData).forEach(key => {
        if (!parsedData[key]) {
            parsedData[key] = defaultData[key];
        }
    });
    
    // Update all flag paths to use local flags
    updateFlagPaths(parsedData);
    
    return parsedData;
}

// Parse a group from its header element
function parseGroupFromHeader(doc, header, groupName, groupKey) {
    // Find the next table after this header
    let currentElement = header.nextElementSibling;
    let table = null;
    
    // Search for the table (might be in next few siblings)
    let attempts = 0;
    while (currentElement && attempts < 10) {
        if (currentElement.tagName === 'TABLE') {
            table = currentElement;
            break;
        }
        // Check children for table
        const childTable = currentElement.querySelector('table');
        if (childTable) {
            table = childTable;
            break;
        }
        currentElement = currentElement.nextElementSibling;
        attempts++;
    }
    
    if (!table) {
        // No table found, return default data for this group
        const defaultData = tournamentData[groupKey];
        if (defaultData) {
            updateFlagPathsForGroup(defaultData);
            return defaultData;
        }
        return null;
    }
    
    // Parse teams from table rows
    const teams = [];
    const tbody = table.querySelector('tbody') || table;
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 2) return;
        
        // Position (first cell)
        const posText = cells[0].textContent.trim();
        const pos = parseInt(posText) || (index + 1);
        
        // Team name (second cell) - get text but remove flag images
        const teamCell = cells[1];
        const teamName = teamCell.textContent.trim().replace(/\s+/g, ' ').split('\n')[0].trim();
        
        if (!teamName || teamName === '' || teamName.length < 2) return;
        
        // Parse stats if available
        let pld = 0, w = 0, d = 0, l = 0, diff = 0, pts = 0;
        
        if (cells.length >= 8) {
            pld = parseInt(cells[2]?.textContent.trim()) || 0;
            w = parseInt(cells[3]?.textContent.trim()) || 0;
            d = parseInt(cells[4]?.textContent.trim()) || 0;
            l = parseInt(cells[5]?.textContent.trim()) || 0;
            const diffText = cells[6]?.textContent.trim() || '0';
            diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
            pts = parseInt(cells[7]?.textContent.trim()) || 0;
        }
        
        teams.push({
            pos: pos,
            name: teamName,
            flag: getFlagPath(teamName),
            pld: pld,
            w: w,
            d: d,
            l: l,
            diff: diff,
            pts: pts
        });
    });
    
    // Get matches from default data (parsing matches from HTML is complex)
    const defaultData = tournamentData[groupKey];
    const matches = defaultData?.matches || [];
    
    return {
        name: groupName,
        teams: teams.length > 0 ? teams : (defaultData?.teams || []),
        matches: matches
    };
}

// Update flag paths to use local flags for a single group
function updateFlagPathsForGroup(group) {
    if (group.teams) {
        group.teams.forEach(team => {
            team.flag = getFlagPath(team.name);
        });
    }
    if (group.matches) {
        group.matches.forEach(match => {
            match.homeFlag = getFlagPath(match.home);
            match.awayFlag = getFlagPath(match.away);
        });
    }
}

// Update flag paths to use local flags
function updateFlagPaths(data) {
    for (let groupKey in data) {
        updateFlagPathsForGroup(data[groupKey]);
    }
}

// Render group table and matches
function renderGroup(groupKey) {
    const group = displayData[groupKey];
    if (!group) return;

    const isFinalRanking = groupKey === 'final-ranking';
    const tableContainer = document.getElementById('table-container');
    const matchesContainer = document.getElementById('matches-container');

    // Clear previous content
    tableContainer.innerHTML = '';
    matchesContainer.innerHTML = '';

    // Render table with group name headline
    let tableHTML = `
        <h2 class="group-headline">${group.name.toUpperCase()}</h2>
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
    `;

    if (!isFinalRanking && group.teams && group.teams.length > 0 && group.teams[0].pld !== undefined) {
        tableHTML += `
                    <th>Pld</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>DIFF</th>
                    <th>Pts</th>
        `;
    }

    tableHTML += `
                </tr>
            </thead>
            <tbody>
    `;

    // Country code mapping for compact display
    const countryCodes = {
        'Qatar': 'QAT',
        'Republic of Korea': 'KOR',
        'Korea': 'KOR',
        'Oman': 'OMA',
        'Bahrain': 'BHR',
        'Iraq': 'IRA',
        'P. R. China': 'CHN',
        'China': 'CHN',
        'Jordan': 'JOR',
        'Kuwait': 'KUW',
        'United Arab Emirates': 'UAE',
        'Hong Kong-China': 'HKG',
        'Hong Kong -- China': 'HKG',
        'India': 'IND',
        'Saudi Arabia': 'KSA',
        'I. R. Iran': 'IRN',
        'Japan': 'JPN',
        'Australia': 'AUS'
    };
    
    if (group.teams && group.teams.length > 0) {
        group.teams.forEach(team => {
            const posClass = team.pos <= 3 ? `pos-${team.pos}` : '';
            const teamCode = countryCodes[team.name] || team.name.substring(0, 3).toUpperCase();
            tableHTML += `
                <tr style="vertical-align: middle;">
                    <td style="vertical-align: middle; text-align: center;">
                        <span class="position ${posClass}">${team.pos}</span>
                    </td>
                    <td style="vertical-align: middle;">
                        <div class="team-name">
                            <img src="${team.flag || getFlagPath(team.name)}" alt="${team.name}" class="team-flag" 
                                 onerror="this.src='${getFlagPath('Default')}'">
                            <span>${teamCode}</span>
                        </div>
                    </td>
            `;

            if (!isFinalRanking && team.pld !== undefined) {
                const diffClass = team.diff > 0 ? 'positive' : team.diff < 0 ? 'negative' : '';
                tableHTML += `
                    <td>${team.pld || 0}</td>
                    <td>${team.w || 0}</td>
                    <td>${team.d || 0}</td>
                    <td>${team.l || 0}</td>
                    <td class="stats ${diffClass}">${team.diff > 0 ? '+' : ''}${team.diff || 0}</td>
                    <td class="stats">${team.pts || 0}</td>
                `;
            }

            tableHTML += `
                </tr>
            `;
        });
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;

    // Render matches if available and if settings allow
    const settings = loadDisplaySettings();
    if (settings.showFixtures && group.matches && group.matches.length > 0) {
        // Get country code abbreviations and display names
        const countryCodes = {
            'Qatar': 'QAT',
            'Republic of Korea': 'KOR',
            'Oman': 'OMA',
            'Bahrain': 'BHR',
            'Iraq': 'IRQ',
            'P. R. China': 'CHN',
            'Jordan': 'JOR',
            'Kuwait': 'KUW',
            'United Arab Emirates': 'UAE',
            'Hong Kong-China': 'HKG',
            'India': 'IND',
            'Saudi Arabia': 'KSA',
            'I. R. Iran': 'IRN',
            'Japan': 'JPN',
            'Australia': 'AUS'
        };
        
        // Display name mapping
        const displayNames = {
            'Republic of Korea': 'Korea',
            'P. R. China': 'China',
            'Hong Kong-China': 'Hong Kong -- China'
        };
        
        let matchesHTML = '';

        group.matches.forEach(match => {
            const homeCode = countryCodes[match.home] || match.home.substring(0, 3).toUpperCase();
            const awayCode = countryCodes[match.away] || match.away.substring(0, 3).toUpperCase();
            const matchTime = match.time && match.time !== 'N/A' ? match.time : 'TBD';
            
            matchesHTML += `
                <div class="match-card">
                    <div class="match-teams">
                        <div class="match-team home">
                            <img src="${match.homeFlag || getFlagPath(match.home)}" alt="${match.home}" class="team-flag"
                                 onerror="this.src='${getFlagPath('Default')}'">
                            <div class="team-name">${homeCode}</div>
                        </div>
                        <div class="match-time">${matchTime}</div>
                        <div class="match-team away">
                            <img src="${match.awayFlag || getFlagPath(match.away)}" alt="${match.away}" class="team-flag"
                                 onerror="this.src='${getFlagPath('Default')}'">
                            <div class="team-name">${awayCode}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        matchesContainer.innerHTML = matchesHTML;
        matchesContainer.style.display = 'block';
    } else {
        matchesContainer.innerHTML = '';
        matchesContainer.style.display = settings.showFixtures ? 'block' : 'none';
    }

    // Add fade-in animation
    tableContainer.classList.remove('fade-in');
    setTimeout(() => tableContainer.classList.add('fade-in'), 10);
    if (matchesContainer.innerHTML) {
        matchesContainer.classList.remove('fade-in');
        setTimeout(() => matchesContainer.classList.add('fade-in'), 10);
    }
}

// Load display settings from admin
function loadDisplaySettings() {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Set the group selector to match admin setting
        if (settings.group) {
            document.getElementById('group-select').value = settings.group;
        }
        
        // Don't override title - it's set dynamically based on content
        // if (settings.title) {
        //     document.getElementById('tournament-title').textContent = settings.title;
        // }
        
        return settings;
    }
    return {
        group: 'group-a',
        showFixtures: true
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load display settings
    const settings = loadDisplaySettings();
    
    // Load default data first for immediate display
    displayData = JSON.parse(JSON.stringify(tournamentData));
    updateFlagPaths(displayData);
    
    // Render the group specified in settings
    renderGroup(settings.group || 'group-a');

    // Handle group selection change (user can still override)
    document.getElementById('group-select').addEventListener('change', function() {
        renderGroup(this.value);
    });
    
    // Then fetch fresh data from website
    fetchTournamentData();

    // Auto-refresh every 30 seconds to get latest data from website
    setInterval(function() {
        fetchTournamentData();
        
        // Also check for settings changes
        const newSettings = loadDisplaySettings();
        const currentGroup = document.getElementById('group-select').value;
        
        // Update group if admin changed it
        if (newSettings.group && newSettings.group !== currentGroup) {
            document.getElementById('group-select').value = newSettings.group;
            renderGroup(newSettings.group);
        }
    }, 30000); // Refresh every 30 seconds
    
    // Also check settings every 2 seconds for faster updates
    setInterval(function() {
        const newSettings = loadDisplaySettings();
        const currentGroup = document.getElementById('group-select').value;
        
        // Update group if admin changed it
        if (newSettings.group && newSettings.group !== currentGroup) {
            document.getElementById('group-select').value = newSettings.group;
            renderGroup(newSettings.group);
        }
        
        // Show/hide fixtures based on setting
        const matchesContainer = document.getElementById('matches-container');
        if (matchesContainer) {
            matchesContainer.style.display = newSettings.showFixtures ? 'block' : 'none';
        }
    }, 2000); // Check every 2 seconds
});