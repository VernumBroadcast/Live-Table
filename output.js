// Output page - automatically fetches data from the Asian Handball website
let displayData = {};

// Fetch data from Flashscore (better structured data)
async function fetchTournamentData() {
    // Flashscore URLs for different groups/stages
    // These appear to be for Main Round Group 1 and Group 2
    const flashscoreUrls = [
        'https://www.flashscore.info/handball/asia/asian-championship/standings/#/KYBijenD/standings/',
        'https://www.flashscore.info/handball/asia/asian-championship/standings/#/W2tz5f16/standings/'
    ];
    
    // Try the original site first, then Flashscore as fallback
    const originalUrl = 'https://asianhandball.org/kuwait2026/s/';
    
    // Try multiple CORS proxy options for original URL first
    const proxyOptions = [
        `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`,
        `https://cors-anywhere.herokuapp.com/${originalUrl}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(originalUrl)}`
    ];
    
    // Also try Flashscore URLs
    flashscoreUrls.forEach(url => {
        proxyOptions.push(`https://corsproxy.io/?${encodeURIComponent(url)}`);
        proxyOptions.push(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    });
    
    for (let i = 0; i < proxyOptions.length; i++) {
        try {
            console.log(`Fetching tournament data... (attempt ${i + 1}/${proxyOptions.length})`);
            const response = await fetch(proxyOptions[i], {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });
            
            let htmlContent = '';
            
            // Handle different proxy response formats
            let htmlContent = '';
            if (proxyOptions[i].includes('allorigins.win')) {
                const data = await response.json();
                htmlContent = data.contents;
            } else {
                htmlContent = await response.text();
            }
            
            if (!htmlContent || htmlContent.length < 100) {
                throw new Error('No valid content received');
            }
            
            const isFlashscore = proxyOptions[i].includes('flashscore.info');
            console.log(`Received ${isFlashscore ? 'Flashscore' : 'original'} HTML content length: ${htmlContent.length} characters`);
            
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Check for parsing errors
            const parserErrors = doc.querySelectorAll('parsererror');
            if (parserErrors.length > 0) {
                console.warn('HTML parsing errors detected:', parserErrors);
            }
            
            // Log all tables found in the document
            const allTables = doc.querySelectorAll('table');
            console.log(`Found ${allTables.length} tables in the document`);
            
            // Extract tournament data - use Flashscore parser if it's a Flashscore URL
            let fetchedData;
            if (isFlashscore) {
                fetchedData = parseFlashscoreData(doc, proxyOptions[i]);
            } else {
                fetchedData = parseTournamentData(doc);
            }
            
            // Only update if we got valid data
            if (fetchedData && Object.keys(fetchedData).length > 0) {
                // Check which groups have actual parsed data (not just defaults)
                const groupsWithData = Object.keys(fetchedData).filter(key => {
                    const group = fetchedData[key];
                    return group && group.teams && group.teams.length > 0 && 
                           group.teams.some(team => team.pld > 0 || team.pts > 0);
                });
                
                console.log(`Groups with actual data: ${groupsWithData.join(', ')}`);
                console.log(`All groups found: ${Object.keys(fetchedData).join(', ')}`);
                
                // Check if data actually changed
                const dataChanged = JSON.stringify(displayData) !== JSON.stringify(fetchedData);
                
                if (dataChanged || groupsWithData.length > 0) {
                    console.log('Tournament data updated!');
                    displayData = fetchedData;
                    const currentGroup = getCurrentGroup();
                    renderGroup(currentGroup);
                } else {
                    console.log('No changes detected in tournament data');
                }
                return; // Success, exit function
            } else {
                throw new Error('No valid data parsed');
            }
            
        } catch (error) {
            console.warn(`Proxy ${i + 1} failed:`, error.message);
            // Try next proxy
            if (i === proxyOptions.length - 1) {
                // All proxies failed
                console.error('All CORS proxies failed. Using fallback data.');
                if (!displayData || Object.keys(displayData).length === 0) {
                    console.log('Using fallback data');
                    displayData = JSON.parse(JSON.stringify(tournamentData));
                    updateFlagPaths(displayData);
                    const currentGroup = getCurrentGroup();
                    renderGroup(currentGroup);
                }
            }
        }
    }
}

// Parse tournament data from HTML
function parseTournamentData(doc) {
    const parsedData = {};
    
    // Find all group sections - check h3, h4, and other headers
    const allHeaders = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6, .group-title, [class*="group"], [id*="group"]'));
    
    // Also check for divs and other elements that might contain group names
    const allTextElements = Array.from(doc.querySelectorAll('div, p, span, td, th')).filter(el => {
        const text = el.textContent.trim();
        return (text.match(/Main\s+Round/i) || text.match(/Cup\s+Group/i) || text.match(/Group\s+[A-D]/i)) && 
               el.children.length === 0; // Leaf nodes only
    });
    
    console.log(`Found ${allHeaders.length} potential headers:`, allHeaders.map(h => ({
        tag: h.tagName,
        text: h.textContent.trim().substring(0, 50),
        class: h.className,
        id: h.id
    })));
    
    console.log(`Found ${allTextElements.length} text elements with group names:`, allTextElements.slice(0, 10).map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 50),
        class: el.className
    })));
    
    // Also try to find tables directly and infer groups from context
    const allTables = doc.querySelectorAll('table');
    console.log(`Found ${allTables.length} tables total`);
    
    allHeaders.forEach(header => {
        const headerText = header.textContent.trim();
        
        // More flexible matching - check for partial matches too
        if (headerText.match(/Group\s+A\b/i) || headerText.includes('Group A')) {
            parsedData['group-a'] = parseGroupFromHeader(doc, header, 'Group A', 'group-a');
        } else if (headerText.match(/Group\s+B\b/i) || headerText.includes('Group B')) {
            parsedData['group-b'] = parseGroupFromHeader(doc, header, 'Group B', 'group-b');
        } else if (headerText.match(/Group\s+C\b/i) || headerText.includes('Group C')) {
            parsedData['group-c'] = parseGroupFromHeader(doc, header, 'Group C', 'group-c');
        } else if (headerText.match(/Group\s+D\b/i) || headerText.includes('Group D')) {
            parsedData['group-d'] = parseGroupFromHeader(doc, header, 'Group D', 'group-d');
        } else if (headerText.match(/Cup.*Group\s*3/i) || headerText.match(/Cup\s+Group\s+3/i) || headerText.includes('Cup Group 3')) {
            console.log('Found Cup Group 3 header:', headerText);
            parsedData['cup-group-3'] = parseGroupFromHeader(doc, header, 'Cup Group 3', 'cup-group-3');
        } else if (headerText.match(/Cup.*Group\s*4/i) || headerText.match(/Cup\s+Group\s+4/i) || headerText.includes('Cup Group 4')) {
            console.log('Found Cup Group 4 header:', headerText);
            parsedData['cup-group-4'] = parseGroupFromHeader(doc, header, 'Cup Group 4', 'cup-group-4');
        } else if (headerText.match(/Main\s+Round\s+Group\s*1/i) || headerText.match(/Main\s+Round.*1/i) || headerText.includes('Main Round Group 1') || headerText.includes('Main Round 1') || headerText.match(/^Main\s+Round\s+1$/i)) {
            console.log('Found Main Round Group 1 header:', headerText);
            parsedData['main-group-1'] = parseGroupFromHeader(doc, header, 'Main Round Group 1', 'main-group-1');
        } else if (headerText.match(/Main\s+Round\s+Group\s*2/i) || headerText.match(/Main\s+Round.*2/i) || headerText.includes('Main Round Group 2') || headerText.includes('Main Round 2') || headerText.match(/^Main\s+Round\s+2$/i)) {
            console.log('Found Main Round Group 2 header:', headerText);
            parsedData['main-group-2'] = parseGroupFromHeader(doc, header, 'Main Round Group 2', 'main-group-2');
        } else if (headerText.match(/Final\s+Ranking/i) || headerText.includes('Final Ranking')) {
            console.log('Found Final Ranking header:', headerText);
            parsedData['final-ranking'] = parseGroupFromHeader(doc, header, 'Final Ranking', 'final-ranking');
        }
    });
    
    // If second stage groups weren't found, try to find tables by looking for common patterns
    const missingGroups = ['main-group-1', 'main-group-2', 'cup-group-3', 'cup-group-4'].filter(key => !parsedData[key]);
    
    if (missingGroups.length > 0 && allTables.length > 0) {
        console.log(`Missing groups: ${missingGroups.join(', ')}, searching ${allTables.length} tables...`);
        
        // Try to parse tables directly if headers aren't found
        allTables.forEach((table, index) => {
            const rows = table.querySelectorAll('tr');
            if (rows.length > 1) { // Has header + at least one data row
                const firstRow = rows[0];
                const headers = firstRow.querySelectorAll('th, td');
                // Check if this looks like a tournament table
                if (headers.length >= 7) {
                    const headerTexts = Array.from(headers).map(h => h.textContent.trim().toLowerCase());
                    if (headerTexts.some(h => h.includes('pos') || h.includes('team') || h.includes('pld'))) {
                        console.log(`Found potential tournament table ${index} with ${rows.length} rows`);
                        
                        // Look for group name in surrounding context (more thoroughly)
                        let groupName = null;
                        let groupKey = null;
                        
                        // Check previous siblings
                        let prev = table.previousElementSibling;
                        let attempts = 0;
                        while (prev && attempts < 10) {
                            const text = prev.textContent.trim();
                            if (text.match(/Main\s+Round.*Group\s*2/i) || text.match(/Main\s+Round\s+2/i)) {
                                groupName = 'Main Round Group 2';
                                groupKey = 'main-group-2';
                                break;
                            } else if (text.match(/Main\s+Round.*Group\s*1/i) || text.match(/Main\s+Round\s+1/i)) {
                                groupName = 'Main Round Group 1';
                                groupKey = 'main-group-1';
                                break;
                            } else if (text.match(/Cup.*Group\s*3/i)) {
                                groupName = 'Cup Group 3';
                                groupKey = 'cup-group-3';
                                break;
                            } else if (text.match(/Cup.*Group\s*4/i)) {
                                groupName = 'Cup Group 4';
                                groupKey = 'cup-group-4';
                                break;
                            }
                            prev = prev.previousElementSibling;
                            attempts++;
                        }
                        
                        // Also check parent and parent's previous siblings
                        if (!groupKey && table.parentElement) {
                            let parentPrev = table.parentElement.previousElementSibling;
                            attempts = 0;
                            while (parentPrev && attempts < 5) {
                                const text = parentPrev.textContent.trim();
                                if (text.match(/Main\s+Round.*Group\s*2/i) || text.match(/Main\s+Round\s+2/i)) {
                                    groupName = 'Main Round Group 2';
                                    groupKey = 'main-group-2';
                                    break;
                                } else if (text.match(/Main\s+Round.*Group\s*1/i) || text.match(/Main\s+Round\s+1/i)) {
                                    groupName = 'Main Round Group 1';
                                    groupKey = 'main-group-1';
                                    break;
                                } else if (text.match(/Cup.*Group\s*3/i)) {
                                    groupName = 'Cup Group 3';
                                    groupKey = 'cup-group-3';
                                    break;
                                } else if (text.match(/Cup.*Group\s*4/i)) {
                                    groupName = 'Cup Group 4';
                                    groupKey = 'cup-group-4';
                                    break;
                                }
                                parentPrev = parentPrev.previousElementSibling;
                                attempts++;
                            }
                        }
                        
                        // Check table rows for team codes that indicate which group (1A, 1B, 1C, 1D = Main Round Group 1; 2A, 2B, 2C, 2D = Main Round Group 2)
                        if (!groupKey && rows.length > 1) {
                            // Check multiple rows to be sure
                            let found1X = false;
                            let found2X = false;
                            let teamCodes = [];
                            
                            for (let i = 1; i < Math.min(rows.length, 6); i++) {
                                const row = rows[i];
                                const cells = row.querySelectorAll('td');
                                if (cells.length >= 2) {
                                    const teamCell = cells[1];
                                    // Clone to remove images/flags
                                    const teamCellClone = teamCell.cloneNode(true);
                                    teamCellClone.querySelectorAll('img, svg').forEach(el => el.remove());
                                    const teamText = teamCellClone.textContent.trim().replace(/\s+/g, '');
                                    
                                    if (teamText) {
                                        teamCodes.push(teamText);
                                        console.log(`  Table ${index}, Row ${i} team text: "${teamText}"`);
                                        
                                        // Check for team codes like 1A, 1B, 1C, 1D (Main Round Group 1)
                                        if (teamText.match(/^1[ABCD]/i) || teamText.match(/^1\s*[ABCD]/i)) {
                                            found1X = true;
                                            console.log(`  ✓ Found Main Round Group 1 indicator: ${teamText}`);
                                        }
                                        // Check for team codes like 2A, 2B, 2C, 2D (Main Round Group 2)
                                        if (teamText.match(/^2[ABCD]/i) || teamText.match(/^2\s*[ABCD]/i)) {
                                            found2X = true;
                                            console.log(`  ✓ Found Main Round Group 2 indicator: ${teamText}`);
                                        }
                                    }
                                }
                            }
                            
                            console.log(`  Table ${index} team codes found: ${teamCodes.join(', ')}`);
                            
                            // Prioritize groups that aren't already parsed
                            if (found1X && !parsedData['main-group-1']) {
                                groupName = 'Main Round Group 1';
                                groupKey = 'main-group-1';
                                console.log(`  ✓✓✓ Identified table ${index} as Main Round Group 1 based on team codes: ${teamCodes.join(', ')}`);
                            } else if (found2X && !parsedData['main-group-2']) {
                                groupName = 'Main Round Group 2';
                                groupKey = 'main-group-2';
                                console.log(`  ✓✓✓ Identified table ${index} as Main Round Group 2 based on team codes: ${teamCodes.join(', ')}`);
                            } else if (found1X) {
                                console.log(`  ⚠ Table ${index} has Group 1 codes but main-group-1 already parsed`);
                            } else if (found2X) {
                                console.log(`  ⚠ Table ${index} has Group 2 codes but main-group-2 already parsed`);
                            }
                        }
                        
                        if (groupKey && !parsedData[groupKey] && missingGroups.includes(groupKey)) {
                            console.log(`\n=== ATTEMPTING TO PARSE ${groupName.toUpperCase()} FROM TABLE ${index} ===`);
                            const parsed = parseGroupFromTable(table, groupName, groupKey);
                            if (parsed && parsed.teams && parsed.teams.length > 0) {
                                // Check if we got actual data (not all zeros)
                                const hasData = parsed.teams.some(team => team.pld > 0 || team.pts > 0);
                                const teamCount = parsed.teams.length;
                                
                                console.log(`Parsed result: ${teamCount} teams, hasData: ${hasData}`);
                                
                                if (hasData || teamCount >= 2) {
                                    parsedData[groupKey] = parsed;
                                    console.log(`✓✓✓ SUCCESS! Parsed ${groupName} with ${teamCount} teams and stored in parsedData`);
                                    console.log(`Teams:`, parsed.teams.map(t => `${t.name} (Pld:${t.pld}, Pts:${t.pts})`).join(', '));
                                } else {
                                    console.log(`⚠ Parsed ${groupName} but all values are zero, skipping`);
                                }
                            } else {
                                console.log(`✗ Failed to parse ${groupName} from table ${index}`);
                            }
                            console.log(`=== END PARSE ATTEMPT FOR ${groupName.toUpperCase()} ===\n`);
                        }
                    }
                }
            }
        });
    }
    
    console.log('\n=== PARSING SUMMARY ===');
    console.log('Groups successfully parsed from website:', Object.keys(parsedData).filter(key => {
        const group = parsedData[key];
        return group && group.teams && group.teams.length > 0 && 
               group.teams.some(team => team.pld > 0 || team.pts > 0);
    }));
    console.log('All groups found:', Object.keys(parsedData));
    console.log('========================\n');
    
    // Fill in missing groups with default data
    const defaultData = JSON.parse(JSON.stringify(tournamentData));
    Object.keys(defaultData).forEach(key => {
        if (!parsedData[key]) {
            console.log(`⚠ Using default data for ${key} (not found on website)`);
            parsedData[key] = defaultData[key];
        } else {
            // Check if parsed data has actual stats
            const group = parsedData[key];
            const hasRealData = group && group.teams && group.teams.length > 0 && 
                               group.teams.some(team => team.pld > 0 || team.pts > 0);
            if (!hasRealData) {
                console.log(`⚠ Parsed ${key} but it has no game data, keeping parsed structure`);
            }
        }
    });
    
    // Update all flag paths to use local flags
    updateFlagPaths(parsedData);
    
    return parsedData;
}

// Parse a group from its header element
function parseGroupFromHeader(doc, header, groupName, groupKey) {
    console.log(`Parsing ${groupName} (${groupKey})`);
    
    // Find the next table after this header - search more thoroughly
    let currentElement = header.nextElementSibling;
    let table = null;
    
    // Search for the table (might be in next few siblings or parent containers)
    let attempts = 0;
    while (currentElement && attempts < 30) {
        if (currentElement.tagName === 'TABLE') {
            table = currentElement;
            console.log(`Found table as direct sibling at attempt ${attempts}`);
            break;
        }
        // Check children for table
        const childTable = currentElement.querySelector('table');
        if (childTable) {
            table = childTable;
            console.log(`Found table in child at attempt ${attempts}`);
            break;
        }
        currentElement = currentElement.nextElementSibling;
        attempts++;
    }
    
    // If still no table, try searching parent's siblings
    if (!table && header.parentElement) {
        let parentSibling = header.parentElement.nextElementSibling;
        attempts = 0;
        while (parentSibling && attempts < 15) {
            const foundTable = parentSibling.querySelector('table');
            if (foundTable) {
                table = foundTable;
                console.log(`Found table in parent sibling at attempt ${attempts}`);
                break;
            }
            parentSibling = parentSibling.nextElementSibling;
            attempts++;
        }
    }
    
    // Also try searching backwards and forwards from header's parent
    if (!table && header.parentElement) {
        // Search forward from parent
        let searchElement = header.parentElement;
        attempts = 0;
        while (searchElement && attempts < 20) {
            const foundTable = searchElement.querySelector('table');
            if (foundTable && foundTable.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_PRECEDING) {
                table = foundTable;
                console.log(`Found table after searching forward from parent`);
                break;
            }
            searchElement = searchElement.nextElementSibling;
            attempts++;
        }
    }
    
    if (!table) {
        console.warn(`No table found for ${groupName}, using default data`);
        // No table found, return default data for this group
        const defaultData = tournamentData[groupKey];
        if (defaultData) {
            updateFlagPathsForGroup(defaultData);
            return defaultData;
        }
        return null;
    }
    
    console.log(`Found table for ${groupName} with ${table.querySelectorAll('tr').length} rows`);
    
    // Parse teams from table rows
    const teams = [];
    const tbody = table.querySelector('tbody') || table;
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        // Skip header row
        if (row.querySelector('th')) return;
        
        const cells = row.querySelectorAll('td');
        if (cells.length < 2) return;
        
        // Position (first cell) - handle different formats
        const posText = cells[0].textContent.trim();
        let pos = parseInt(posText);
        // If position is not a number, try to extract it or use index
        if (isNaN(pos)) {
            // Try to find a number in the cell
            const posMatch = posText.match(/\d+/);
            pos = posMatch ? parseInt(posMatch[0]) : (teams.length + 1);
        }
        
        // Team name (second cell) - get text but remove flag images
        const teamCell = cells[1];
        // Clone to avoid modifying original
        const teamCellClone = teamCell.cloneNode(true);
        // Remove images from clone
        teamCellClone.querySelectorAll('img').forEach(img => img.remove());
        // Remove any SVG elements
        teamCellClone.querySelectorAll('svg').forEach(svg => svg.remove());
        let teamName = teamCellClone.textContent.trim().replace(/\s+/g, ' ').split('\n')[0].trim();
        
        // Clean up team name - remove extra whitespace and special characters
        teamName = teamName.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
        
        if (!teamName || teamName === '' || teamName.length < 1) {
            console.log(`Skipping row ${index} - no team name found`);
            return;
        }
        
        console.log(`Parsing team: ${teamName}, position: ${pos}, cells: ${cells.length}`);
        
        // Parse stats if available - check for different table structures
        let pld = 0, w = 0, d = 0, l = 0, diff = 0, pts = 0;
        
        // Try different cell positions (some tables might have different structures)
        // Check if we have enough cells for stats
        if (cells.length >= 8) {
            // Standard format: Pos, Team, Pld, W, D, L, Diff, Pts
            const pldText = cells[2]?.textContent.trim() || '0';
            const wText = cells[3]?.textContent.trim() || '0';
            const dText = cells[4]?.textContent.trim() || '0';
            const lText = cells[5]?.textContent.trim() || '0';
            const diffText = cells[6]?.textContent.trim() || '0';
            const ptsText = cells[7]?.textContent.trim() || '0';
            
            pld = parseInt(pldText) || 0;
            w = parseInt(wText) || 0;
            d = parseInt(dText) || 0;
            l = parseInt(lText) || 0;
            diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
            pts = parseInt(ptsText) || 0;
            
            console.log(`  Stats: Pld=${pld}, W=${w}, D=${d}, L=${l}, Diff=${diff}, Pts=${pts}`);
        } else if (cells.length >= 7) {
            // Alternative format - might be missing one column
            pld = parseInt(cells[2]?.textContent.trim()) || 0;
            w = parseInt(cells[3]?.textContent.trim()) || 0;
            d = parseInt(cells[4]?.textContent.trim()) || 0;
            l = parseInt(cells[5]?.textContent.trim()) || 0;
            const diffText = cells[6]?.textContent.trim() || '0';
            diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
            pts = 0; // Points might be calculated
        } else if (cells.length >= 3) {
            // Minimal format - at least try to get position and name
            console.log(`  Minimal format detected, cells: ${cells.length}`);
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
    
    console.log(`Parsed ${teams.length} teams for ${groupName}`);
    
    // Get matches from default data (parsing matches from HTML is complex)
    const defaultData = tournamentData[groupKey];
    const matches = defaultData?.matches || [];
    
    const result = {
        name: groupName,
        teams: teams.length > 0 ? teams : (defaultData?.teams || []),
        matches: matches
    };
    
    // Only return parsed data if we got valid teams
    if (teams.length > 0) {
        console.log(`Successfully parsed ${groupName} with ${teams.length} teams`);
        return result;
    } else {
        console.warn(`No teams parsed for ${groupName}, using default data`);
        return defaultData ? { ...defaultData, name: groupName } : null;
    }
}

// Parse data from Flashscore (better structured)
function parseFlashscoreData(doc, url) {
    console.log('Parsing Flashscore data...');
    const parsedData = {};
    
    // Flashscore typically uses specific class names for standings tables
    // Look for tables with class names like 'table__standings', 'standings', etc.
    const standingsTables = doc.querySelectorAll('table.standings, table.table__standings, .standings table, [class*="standings"] table, table');
    
    console.log(`Found ${standingsTables.length} Flashscore standings tables`);
    
    // Try to determine which group this is based on URL or content
    let groupKey = null;
    let groupName = null;
    
    if (url.includes('KYBijenD')) {
        groupKey = 'main-group-1';
        groupName = 'Main Round Group 1';
    } else if (url.includes('W2tz5f16')) {
        groupKey = 'main-group-2';
        groupName = 'Main Round Group 2';
    }
    
    standingsTables.forEach((table, index) => {
        console.log(`Processing Flashscore table ${index}...`);
        
        const rows = table.querySelectorAll('tr');
        if (rows.length < 2) return;
        
        const teams = [];
        
        rows.forEach((row, rowIndex) => {
            // Skip header row
            if (row.querySelector('th')) return;
            
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;
            
            // Flashscore typically has: Position, Team, Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Diff, Points
            // But structure may vary, so we'll be flexible
            
            const posText = cells[0]?.textContent.trim() || '';
            const pos = parseInt(posText) || (teams.length + 1);
            
            // Team name is usually in second cell
            const teamCell = cells[1];
            const teamCellClone = teamCell.cloneNode(true);
            teamCellClone.querySelectorAll('img, svg, .flag').forEach(el => el.remove());
            let teamName = teamCellClone.textContent.trim();
            
            if (!teamName || teamName.length < 1) return;
            
            // Parse stats - Flashscore usually has more columns
            let pld = 0, w = 0, d = 0, l = 0, diff = 0, pts = 0;
            
            // Try to find stats columns (usually columns 2-8)
            if (cells.length >= 8) {
                pld = parseInt(cells[2]?.textContent.trim()) || 0;
                w = parseInt(cells[3]?.textContent.trim()) || 0;
                d = parseInt(cells[4]?.textContent.trim()) || 0;
                l = parseInt(cells[5]?.textContent.trim()) || 0;
                // Goal difference might be in different positions
                const diffText = cells[6]?.textContent.trim() || cells[7]?.textContent.trim() || '0';
                diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
                pts = parseInt(cells[cells.length - 1]?.textContent.trim()) || 0;
            } else if (cells.length >= 6) {
                // Simpler format
                pld = parseInt(cells[2]?.textContent.trim()) || 0;
                w = parseInt(cells[3]?.textContent.trim()) || 0;
                d = parseInt(cells[4]?.textContent.trim()) || 0;
                l = parseInt(cells[5]?.textContent.trim()) || 0;
                pts = parseInt(cells[cells.length - 1]?.textContent.trim()) || 0;
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
        
        if (teams.length > 0 && groupKey) {
            console.log(`✓ Parsed ${teams.length} teams for ${groupName} from Flashscore`);
            parsedData[groupKey] = {
                name: groupName,
                teams: teams,
                matches: tournamentData[groupKey]?.matches || []
            };
        }
    });
    
    // Fill in other groups from default data
    const defaultData = JSON.parse(JSON.stringify(tournamentData));
    Object.keys(defaultData).forEach(key => {
        if (!parsedData[key]) {
            parsedData[key] = defaultData[key];
        }
    });
    
    updateFlagPaths(parsedData);
    return parsedData;
}

// Alternative parsing function that works directly with a table element
function parseGroupFromTable(table, groupName, groupKey) {
    console.log(`Parsing ${groupName} directly from table`);
    console.log(`Table has ${table.querySelectorAll('tr').length} rows`);
    
    const teams = [];
    const tbody = table.querySelector('tbody') || table;
    const rows = tbody.querySelectorAll('tr');
    
    console.log(`Processing ${rows.length} rows...`);
    
    rows.forEach((row, index) => {
        // Skip header row
        if (row.querySelector('th')) {
            console.log(`  Row ${index}: Skipping header row`);
            return;
        }
        
        const cells = row.querySelectorAll('td');
        console.log(`  Row ${index}: Found ${cells.length} cells`);
        
        if (cells.length < 2) {
            console.log(`  Row ${index}: Not enough cells, skipping`);
            return;
        }
        
        // Log cell contents for debugging
        if (index <= 3) { // Log first few rows
            console.log(`  Row ${index} cells:`, Array.from(cells).map((c, i) => `[${i}]: "${c.textContent.trim().substring(0, 20)}"`).join(', '));
        }
        
        // Position (first cell)
        const posText = cells[0].textContent.trim();
        let pos = parseInt(posText);
        if (isNaN(pos)) {
            const posMatch = posText.match(/\d+/);
            pos = posMatch ? parseInt(posMatch[0]) : (teams.length + 1);
        }
        
        // Team name (second cell)
        const teamCell = cells[1];
        const teamCellClone = teamCell.cloneNode(true);
        teamCellClone.querySelectorAll('img, svg').forEach(el => el.remove());
        let teamName = teamCellClone.textContent.trim().replace(/\s+/g, ' ').split('\n')[0].trim();
        teamName = teamName.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
        
        if (!teamName || teamName === '' || teamName.length < 1) {
            console.log(`  Row ${index}: No team name found, skipping`);
            return;
        }
        
        // Parse stats - try different cell positions
        let pld = 0, w = 0, d = 0, l = 0, diff = 0, pts = 0;
        
        // Try standard format first (Pos, Team, Pld, W, D, L, Diff, Pts)
        if (cells.length >= 8) {
            const pldText = cells[2]?.textContent.trim() || '0';
            const wText = cells[3]?.textContent.trim() || '0';
            const dText = cells[4]?.textContent.trim() || '0';
            const lText = cells[5]?.textContent.trim() || '0';
            const diffText = cells[6]?.textContent.trim() || '0';
            const ptsText = cells[7]?.textContent.trim() || '0';
            
            pld = parseInt(pldText) || 0;
            w = parseInt(wText) || 0;
            d = parseInt(dText) || 0;
            l = parseInt(lText) || 0;
            diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
            pts = parseInt(ptsText) || 0;
            
            if (index <= 2) {
                console.log(`  Row ${index} stats: Pld=${pld}, W=${w}, D=${d}, L=${l}, Diff=${diff}, Pts=${pts}`);
            }
        } else if (cells.length >= 7) {
            // Alternative format
            pld = parseInt(cells[2]?.textContent.trim()) || 0;
            w = parseInt(cells[3]?.textContent.trim()) || 0;
            d = parseInt(cells[4]?.textContent.trim()) || 0;
            l = parseInt(cells[5]?.textContent.trim()) || 0;
            const diffText = cells[6]?.textContent.trim() || '0';
            diff = parseInt(diffText.replace(/[^\d-]/g, '')) || 0;
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
    
    console.log(`Parsed ${teams.length} teams from table`);
    
    const defaultData = tournamentData[groupKey];
    const matches = defaultData?.matches || [];
    
    if (teams.length > 0) {
        console.log(`✓ Successfully parsed ${groupName} with ${teams.length} teams from table`);
        return {
            name: groupName,
            teams: teams,
            matches: matches
        };
    }
    
    console.log(`✗ No teams parsed, returning default data`);
    return defaultData ? { ...defaultData, name: groupName } : null;
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

    // Render matches if available and if fixtures are enabled
    if (shouldShowFixtures() && group.matches && group.matches.length > 0) {
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
        matchesContainer.style.display = shouldShowFixtures() ? 'block' : 'none';
    }

    // Add fade-in animation
    tableContainer.classList.remove('fade-in');
    setTimeout(() => tableContainer.classList.add('fade-in'), 10);
    if (matchesContainer.innerHTML) {
        matchesContainer.classList.remove('fade-in');
        setTimeout(() => matchesContainer.classList.add('fade-in'), 10);
    }
}

// Get current selected group
function getCurrentGroup() {
    const activeOption = document.querySelector('.group-option.active');
    if (activeOption && activeOption.dataset.group) {
        return activeOption.dataset.group;
    }
    const groupSelect = document.getElementById('group-select');
    if (groupSelect && groupSelect.value) {
        return groupSelect.value;
    }
    return 'main-group-1'; // Default to main group 1
}

// Select group from column options
function selectGroup(groupKey) {
    // Update active state
    document.querySelectorAll('.group-option').forEach(option => {
        option.classList.remove('active');
    });
    const selectedOption = document.querySelector(`[data-group="${groupKey}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // Update hidden select for compatibility
    const groupSelect = document.getElementById('group-select');
    if (groupSelect) {
        groupSelect.value = groupKey;
    }
    
    // Save and render
    localStorage.setItem('selectedGroup', groupKey);
    renderGroup(groupKey);
}

// Manual refresh function
function manualRefresh() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }
    
    console.log('Manual refresh triggered');
    fetchTournamentData();
}

// Check if fixtures should be shown (stored in localStorage)
function shouldShowFixtures() {
    const saved = localStorage.getItem('showFixtures');
    return saved === 'true';
}

// Save fixtures preference
function setShowFixtures(show) {
    localStorage.setItem('showFixtures', show ? 'true' : 'false');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load default data first for immediate display
    displayData = JSON.parse(JSON.stringify(tournamentData));
    updateFlagPaths(displayData);
    
    // Get saved group preference or default to main-group-1
    const savedGroup = localStorage.getItem('selectedGroup') || 'main-group-1';
    
    // Set active state on column options
    selectGroup(savedGroup);
    
    // Render the initial group
    renderGroup(savedGroup);
    
    // Then fetch fresh data from website
    fetchTournamentData();

    // Auto-refresh every 10 seconds to get latest data from website
    setInterval(function() {
        fetchTournamentData();
    }, 10000); // Refresh every 10 seconds for more frequent updates
});