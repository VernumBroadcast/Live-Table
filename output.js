// Championship Live Table - fetches from BBC Sport
let displayData = {};

const CHAMPIONSHIP_URL = 'https://www.bbc.com/sport/football/championship/table';

const PROXY_URLS = [
    `https://corsproxy.io/?${encodeURIComponent(CHAMPIONSHIP_URL)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(CHAMPIONSHIP_URL)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(CHAMPIONSHIP_URL)}`
];

// Club name -> short display (e.g. for table)
const clubAbbrev = {
    'Coventry City': 'COV', 'Middlesbrough': 'MID', 'Ipswich Town': 'IPS', 'Hull City': 'HUL',
    'Millwall': 'MIL', 'Wrexham': 'WRE', 'Bristol City': 'BRC', 'Watford': 'WAT',
    'Preston North End': 'PRE', 'Stoke City': 'STK', 'Derby County': 'DER',
    'Queens Park Rangers': 'QPR', 'Birmingham City': 'BIR', 'Leicester City': 'LEI',
    'Southampton': 'SOU', 'Swansea City': 'SWA', 'Sheffield United': 'SHU',
    'Charlton Athletic': 'CHA', 'West Bromwich Albion': 'WBA', 'Norwich City': 'NOR',
    'Portsmouth': 'POR', 'Blackburn Rovers': 'BLB', 'Oxford United': 'OXF',
    'Sheffield Wednesday': 'SHW'
};

function getTeamDisplay(name) {
    if (!name) return '—';
    // Return full team name (no abbreviations needed since we removed icons)
    return name;
}

function getPlaceholderLogo() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%234a5568' stroke='%23718096' stroke-width='2'/%3E%3Ctext x='16' y='20' font-size='14' fill='%23fff' text-anchor='middle' font-family='sans-serif'%3E?%3C/text%3E%3C/svg%3E";
}

async function fetchTournamentData() {
    for (let i = 0; i < PROXY_URLS.length; i++) {
        try {
            const isAllOrigins = PROXY_URLS[i].includes('allorigins.win');
            const res = await fetch(PROXY_URLS[i], {
                method: 'GET',
                headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
            });
            let html = '';
            if (isAllOrigins) {
                const j = await res.json();
                html = j.contents || '';
            } else {
                html = await res.text();
            }
            if (!html || html.length < 200) throw new Error('No content');

            const doc = new DOMParser().parseFromString(html, 'text/html');
            const parsed = parseChampionshipData(doc);
            if (parsed && parsed.championship && parsed.championship.teams.length > 0) {
                console.log(`Successfully parsed ${parsed.championship.teams.length} teams from BBC Sport`);
                displayData = parsed;
                renderGroup('championship');
                return;
            }
            throw new Error('No table parsed');
        } catch (e) {
            console.warn(`Championship fetch attempt ${i + 1} failed:`, e.message);
        }
    }
    // Fallback
    if (!displayData.championship) {
        displayData = JSON.parse(JSON.stringify(tournamentData));
        renderGroup('championship');
    }
}

function parseChampionshipData(doc) {
    // BBC Sport table structure: Team, Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points, Form
    const tables = doc.querySelectorAll('table');
    
    for (const table of tables) {
        const rows = table.querySelectorAll('tr');
        if (rows.length < 2) continue;

        // Check if this looks like the BBC Championship table
        const headerRow = rows[0];
        const ths = headerRow.querySelectorAll('th, td');
        const headerText = Array.from(ths).map(t => t.textContent.trim().toLowerCase()).join(' ');
        
        // BBC table has: Team, Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points
        const looksLikeBBC = /team|played|won|drawn|lost|goals|points/i.test(headerText) && ths.length >= 8;
        
        if (!looksLikeBBC) continue;

        const teams = [];
        
        // BBC table structure: first cell is position number, second is team (with logo and link)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.querySelector('th')) continue;
            
            const cells = row.querySelectorAll('td');
            if (cells.length < 8) continue;

            // BBC table structure: Position might be in first cell or part of team cell
            // Team cell is usually the first or second cell
            let pos = 0;
            let teamCell = null;
            let statsStart = 0;
            
            // Check if first cell is just a number (position)
            const firstCellText = (cells[0]?.textContent || '').trim();
            const firstCellNum = parseInt(firstCellText, 10);
            
            if (!isNaN(firstCellNum) && firstCellNum > 0 && firstCellNum < 30 && firstCellText.length <= 3) {
                // First cell is position number
                pos = firstCellNum;
                teamCell = cells[1];
                statsStart = 2; // Stats start at cell 2
            } else {
                // Position might be in team cell or implicit
                teamCell = cells[0];
                statsStart = 1; // Stats start at cell 1
                // Try to extract position from team cell or use row number
                const posMatch = firstCellText.match(/^(\d+)/);
                pos = posMatch ? parseInt(posMatch[1], 10) : teams.length + 1;
            }
            
            if (!teamCell) continue;
            
            // Extract team name - BBC table has team name in a link
            let name = '';
            const teamLink = teamCell.querySelector('a');
            
            if (teamLink) {
                // Method 1: Get text directly from link
                name = teamLink.textContent.trim();
                
                // Method 2: If no text, try to get from link's child elements
                if (!name || name.length < 2) {
                    const linkClone = teamLink.cloneNode(true);
                    linkClone.querySelectorAll('img, svg, picture').forEach(el => el.remove());
                    name = linkClone.textContent.trim();
                }
                
                // Method 3: Extract from href if still no name
                if (!name || name.length < 2) {
                    const href = teamLink.getAttribute('href') || '';
                    if (href.includes('/teams/')) {
                        const teamSlug = href.split('/teams/').pop()?.split('/')[0];
                        if (teamSlug && teamSlug !== 'table' && teamSlug.length > 2) {
                            // Convert "coventry-city" to "Coventry City"
                            name = teamSlug.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ');
                        }
                    }
                }
            }
            
            // Fallback: get all text from cell, removing images and other elements
            if (!name || name.length < 2) {
                const teamClone = teamCell.cloneNode(true);
                // Remove all images, SVGs, and other non-text elements
                teamClone.querySelectorAll('img, svg, picture, span[class*="icon"], span[class*="badge"], span[class*="logo"]').forEach(el => el.remove());
                name = teamClone.textContent.trim().replace(/\s+/g, ' ');
            }
            
            // Clean up - remove leading numbers, extra whitespace, and non-letter prefixes
            name = name.replace(/^\d+\s*/, ''); // Remove leading numbers
            name = name.replace(/^[^a-zA-Z]+/, ''); // Remove any remaining non-letter characters at start
            name = name.trim();
            
            if (!name || name.length < 2) {
                console.warn(`Could not extract team name from row ${i}`, {
                    cellText: teamCell.textContent.trim(),
                    cellHTML: teamCell.innerHTML.substring(0, 200),
                    allCells: Array.from(cells).map((c, idx) => ({ idx, text: c.textContent.trim().substring(0, 50) }))
                });
                continue;
            }
            
            // Ensure proper capitalization
            name = name.split(' ').map(word => {
                if (word.length === 0) return '';
                // Handle special cases like "FC", "United", etc.
                const upperWords = ['FC', 'Utd', 'United', 'City', 'Town', 'Rovers', 'Athletic', 'Albion', 'Wanderers'];
                if (upperWords.includes(word.toUpperCase())) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
            
            console.log(`Parsed team ${i}: "${name}" (position ${pos})`);

            // Debug: log cell structure for first team
            if (i === 1) {
                console.log('Cell structure for first team:', Array.from(cells).map((c, idx) => ({
                    idx,
                    text: c.textContent.trim().substring(0, 30)
                })));
            }
            
            // Parse stats - BBC table order: Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points
            let pld = 0, w = 0, d = 0, l = 0, diff = 0, pts = 0;
            
            // Parse from statsStart (determined above)
            if (cells[statsStart]) {
                pld = parseInt((cells[statsStart]?.textContent || '').trim(), 10) || 0;
            }
            if (cells[statsStart + 1]) {
                w = parseInt((cells[statsStart + 1]?.textContent || '').trim(), 10) || 0;
            }
            if (cells[statsStart + 2]) {
                d = parseInt((cells[statsStart + 2]?.textContent || '').trim(), 10) || 0;
            }
            if (cells[statsStart + 3]) {
                l = parseInt((cells[statsStart + 3]?.textContent || '').trim(), 10) || 0;
            }
            
            // Goal Difference is usually 6 cells after Played (or 7 if there are Goals For/Against columns)
            // Try multiple positions
            for (let gdOffset = 6; gdOffset <= 8; gdOffset++) {
                if (cells[statsStart + gdOffset]) {
                    const gdText = (cells[statsStart + gdOffset]?.textContent || '').trim();
                    const gdMatch = gdText.match(/(-?\d+)/);
                    if (gdMatch) {
                        const testDiff = parseInt(gdMatch[1], 10);
                        // Goal difference is usually between -100 and +100
                        if (!isNaN(testDiff) && testDiff >= -100 && testDiff <= 100) {
                            diff = testDiff;
                            break;
                        }
                    }
                }
            }
            
            // Points is usually 7-8 cells after Played
            for (let ptsOffset = 7; ptsOffset <= 9; ptsOffset++) {
                if (cells[statsStart + ptsOffset]) {
                    const ptsText = (cells[statsStart + ptsOffset]?.textContent || '').trim();
                    const testPts = parseInt(ptsText, 10);
                    // Points are usually between 0 and 100+
                    if (!isNaN(testPts) && testPts >= 0 && testPts <= 150) {
                        pts = testPts;
                        break;
                    }
                }
            }
            
            // Fallback: try second to last cell for points (before Form column)
            if (pts === 0 && cells.length > statsStart + 7) {
                const fallbackPts = parseInt((cells[cells.length - 2]?.textContent || '').trim(), 10);
                if (!isNaN(fallbackPts) && fallbackPts > 0) {
                    pts = fallbackPts;
                }
            }
            
            // Debug logging for first few teams
            if (i <= 3) {
                console.log(`Team ${i} "${name}": Pld=${pld}, W=${w}, D=${d}, L=${l}, Diff=${diff}, Pts=${pts} (statsStart=${statsStart}, cells.length=${cells.length})`);
            }

            teams.push({
                pos,
                name,
                flag: '', // No icons/flags needed
                pld,
                w,
                d,
                l,
                diff,
                pts
            });
        }

        if (teams.length > 0) {
            console.log(`Parsed ${teams.length} teams from BBC Sport`);
            return {
                championship: {
                    name: 'Championship',
                    teams,
                    matches: []
                }
            };
        }
    }
    
    console.warn('No BBC Championship table found');
    return null;
}

function renderGroup(groupKey) {
    const group = displayData[groupKey];
    if (!group) return;

    const tableContainer = document.getElementById('table-container');
    const matchesContainer = document.getElementById('matches-container');
    tableContainer.innerHTML = '';
    if (matchesContainer) matchesContainer.innerHTML = '';

    let tableHTML = `
        <h2 class="group-headline">Championship Table</h2>
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>Pld</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>DIFF</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>`;

    if (group.teams && group.teams.length > 0) {
        // Find Norwich City's position
        const norwichIndex = group.teams.findIndex(team => 
            team.name.toLowerCase().includes('norwich')
        );
        
        let teamsToShow = group.teams;
        
        // If Norwich is found, filter to show only 2 above, Norwich, and 2 below
        if (norwichIndex !== -1) {
            const norwichPos = group.teams[norwichIndex].pos;
            const startPos = Math.max(1, norwichPos - 2);
            const endPos = norwichPos + 2;
            
            teamsToShow = group.teams.filter(team => 
                team.pos >= startPos && team.pos <= endPos
            );
        }
        
        teamsToShow.forEach((team, index) => {
            const disp = getTeamDisplay(team.name);
            const diffClass = team.diff > 0 ? 'positive' : team.diff < 0 ? 'negative' : '';
            const isNorwich = team.name.toLowerCase().includes('norwich');
            const isRelegationLine = team.pos === 22;
            
            // Norwich row: green background, yellow text, no hover
            const rowClass = isNorwich ? 'norwich-row' : '';
            const rowStyle = isNorwich ? 'background-color: #003e14; color: yellow;' : '';
            
            // Add red line above position 22 (relegation zone)
            let relegationLine = '';
            if (isRelegationLine) {
                relegationLine = '<tr class="relegation-line"><td colspan="8" style="padding: 0; height: 4px; background-color: red; border: none;"></td></tr>';
            }

            tableHTML += relegationLine + `
                <tr class="${rowClass}" style="vertical-align: middle; ${rowStyle}">
                    <td style="vertical-align: middle; text-align: center; ${rowStyle}">
                        ${team.pos}
                    </td>
                    <td style="vertical-align: middle; ${rowStyle}">
                        ${disp}
                    </td>
                    <td style="${rowStyle}">${team.pld ?? 0}</td>
                    <td style="${rowStyle}">${team.w ?? 0}</td>
                    <td style="${rowStyle}">${team.d ?? 0}</td>
                    <td style="${rowStyle}">${team.l ?? 0}</td>
                    <td class="stats ${diffClass}" style="${rowStyle}">${(team.diff > 0 ? '+' : '')}${team.diff ?? 0}</td>
                    <td class="stats" style="${rowStyle}">${team.pts ?? 0}</td>
                </tr>`;
        });
    }

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;

    tableContainer.classList.remove('fade-in');
    requestAnimationFrame(() => tableContainer.classList.add('fade-in'));
}

function manualRefresh() {
    const btn = document.getElementById('refresh-btn');
    if (btn) {
        btn.style.transform = 'rotate(360deg)';
        btn.style.transition = 'transform 0.5s ease';
        setTimeout(() => { btn.style.transform = 'rotate(0deg)'; }, 500);
    }
    fetchTournamentData();
}

document.addEventListener('DOMContentLoaded', () => {
    displayData = JSON.parse(JSON.stringify(tournamentData));
    renderGroup('championship');
    fetchTournamentData();
    setInterval(fetchTournamentData, 10000);
});
