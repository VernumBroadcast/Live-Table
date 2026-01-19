// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const groupSelect = document.getElementById('group-select');
    const tableContainer = document.getElementById('table-container');
    const matchesContainer = document.getElementById('matches-container');

    // Render table and matches
    function renderGroup(groupKey) {
        const group = tournamentData[groupKey];
        if (!group) return;

        const isFinalRanking = groupKey === 'final-ranking';

        // Clear previous content
        tableContainer.innerHTML = '';
        matchesContainer.innerHTML = '';

        // Render table
        let tableHTML = `
            <h2 style="margin-bottom: 20px; color: #667eea; font-size: 1.5em;">${group.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
        `;

        if (!isFinalRanking) {
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

        group.teams.forEach(team => {
            const posClass = team.pos <= 3 ? `pos-${team.pos}` : '';
            tableHTML += `
                <tr>
                    <td>
                        <span class="position ${posClass}">${team.pos}</span>
                    </td>
                    <td>
                        <div class="team-name">
                            <img src="${team.flag}" alt="${team.name}" class="team-flag" 
                                 onerror="this.src='https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg'">
                            <span>${team.name}</span>
                        </div>
                    </td>
            `;

            if (!isFinalRanking) {
                const diffClass = team.diff > 0 ? 'positive' : team.diff < 0 ? 'negative' : '';
                tableHTML += `
                    <td>${team.pld}</td>
                    <td>${team.w}</td>
                    <td>${team.d}</td>
                    <td>${team.l}</td>
                    <td class="stats ${diffClass}">${team.diff > 0 ? '+' : ''}${team.diff}</td>
                    <td class="stats">${team.pts}</td>
                `;
            }

            tableHTML += `
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;

        // Render matches if available
        if (group.matches && group.matches.length > 0) {
            let matchesHTML = `<h2>Matches</h2>`;

            group.matches.forEach(match => {
                matchesHTML += `
                    <div class="match-card">
                        <div class="match-teams">
                            <div class="match-team home">
                                <img src="${match.homeFlag}" alt="${match.home}" class="team-flag"
                                     onerror="this.src='https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg'">
                                <div>
                                    <div class="team-name">${match.home}</div>
                                    <div class="match-date">${match.date}</div>
                                    ${match.time !== 'N/A' ? `<div class="match-time">${match.time}</div>` : ''}
                                </div>
                            </div>
                            <div class="match-score">${match.score}</div>
                            <div class="match-team away">
                                <div>
                                    <div class="team-name">${match.away}</div>
                                </div>
                                <img src="${match.awayFlag}" alt="${match.away}" class="team-flag"
                                     onerror="this.src='https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg'">
                            </div>
                        </div>
                    </div>
                `;
            });

            matchesContainer.innerHTML = matchesHTML;
        }

        // Add fade-in animation
        tableContainer.classList.remove('fade-in');
        setTimeout(() => tableContainer.classList.add('fade-in'), 10);
        if (matchesContainer.innerHTML) {
            matchesContainer.classList.remove('fade-in');
            setTimeout(() => matchesContainer.classList.add('fade-in'), 10);
        }
    }

    // Handle group selection change
    groupSelect.addEventListener('change', function() {
        renderGroup(this.value);
    });

    // Initialize with first group
    renderGroup('group-a');
});