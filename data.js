// Tournament data structure
const tournamentData = {
    'group-a': {
        name: 'Group A',
        teams: [
            { pos: 1, name: 'Qatar', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Qatar.svg', pld: 1, w: 1, d: 0, l: 0, diff: 12, pts: 2 },
            { pos: 2, name: 'Republic of Korea', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Republic-of-Korea.svg', pld: 1, w: 1, d: 0, l: 0, diff: 5, pts: 2 },
            { pos: 3, name: 'Oman', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', pld: 2, w: 0, d: 0, l: 2, diff: -17, pts: 0 }
        ],
        matches: [
            { date: '16 January 2026', time: 'N/A', home: 'Oman', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', away: 'Qatar', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Qatar.svg', score: '15 - 27' },
            { date: '18 January 2026', time: 'N/A', home: 'Republic of Korea', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Republic-of-Korea.svg', away: 'Oman', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', score: '29 - 24' },
            { date: '20 January 2026', time: '18:00', home: 'Qatar', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Qatar.svg', away: 'Republic of Korea', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Republic-of-Korea.svg', score: 'TBD' }
        ]
    },
    'group-b': {
        name: 'Group B',
        teams: [
            { pos: 1, name: 'Bahrain', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Bahrain.svg', pld: 2, w: 2, d: 0, l: 0, diff: 22, pts: 4 },
            { pos: 2, name: 'Iraq', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Iraq.svg', pld: 2, w: 2, d: 0, l: 0, diff: 10, pts: 4 },
            { pos: 3, name: 'P. R. China', flag: 'https://asianhandball.org/wp-content/uploads/2022/02/China.svg', pld: 2, w: 0, d: 0, l: 2, diff: -16, pts: 0 },
            { pos: 4, name: 'Jordan', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Jordan.svg', pld: 2, w: 0, d: 0, l: 2, diff: -16, pts: 0 }
        ],
        matches: [
            { date: '16 January 2026', time: 'N/A', home: 'Jordan', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Jordan.svg', away: 'Bahrain', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Bahrain.svg', score: '21 - 32' },
            { date: '16 January 2026', time: 'N/A', home: 'P. R. China', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/China.svg', away: 'Iraq', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Iraq.svg', score: '22 - 27' },
            { date: '18 January 2026', time: 'N/A', home: 'Jordan', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Jordan.svg', away: 'Iraq', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Iraq.svg', score: '21 - 26' },
            { date: '18 January 2026', time: 'N/A', home: 'P. R. China', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/China.svg', away: 'Bahrain', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Bahrain.svg', score: '29 - 40' },
            { date: '20 January 2026', time: '14:00', home: 'Jordan', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Jordan.svg', away: 'P. R. China', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/China.svg', score: 'TBD' },
            { date: '20 January 2026', time: '16:00', home: 'Iraq', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Iraq.svg', away: 'Bahrain', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Bahrain.svg', score: 'TBD' }
        ]
    },
    'group-c': {
        name: 'Group C',
        teams: [
            { pos: 1, name: 'Kuwait', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Kuwait.svg', pld: 2, w: 2, d: 0, l: 0, diff: 48, pts: 4 },
            { pos: 2, name: 'United Arab Emirates', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/United-Arab-Emirates.svg', pld: 2, w: 2, d: 0, l: 0, diff: 37, pts: 4 },
            { pos: 3, name: 'Hong Kong-China', flag: 'https://asianhandball.org/wp-content/uploads/2022/02/Hong-Kong-China.svg', pld: 2, w: 0, d: 0, l: 2, diff: -29, pts: 0 },
            { pos: 4, name: 'India', flag: 'https://asianhandball.org/wp-content/uploads/2023/08/India.svg', pld: 2, w: 0, d: 0, l: 2, diff: -56, pts: 0 }
        ],
        matches: [
            { date: '15 January 2026', time: 'N/A', home: 'Hong Kong-China', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Hong-Kong-China.svg', away: 'United Arab Emirates', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/United-Arab-Emirates.svg', score: '21 - 36' },
            { date: '15 January 2026', time: 'N/A', home: 'India', homeFlag: 'https://asianhandball.org/wp-content/uploads/2023/08/India.svg', away: 'Kuwait', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Kuwait.svg', score: '12 - 46' },
            { date: '17 January 2026', time: 'N/A', home: 'India', homeFlag: 'https://asianhandball.org/wp-content/uploads/2023/08/India.svg', away: 'United Arab Emirates', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/United-Arab-Emirates.svg', score: '21 - 43' },
            { date: '17 January 2026', time: 'N/A', home: 'Hong Kong-China', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Hong-Kong-China.svg', away: 'Kuwait', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Kuwait.svg', score: '25 - 39' },
            { date: '19 January 2026', time: '16:00', home: 'India', homeFlag: 'https://asianhandball.org/wp-content/uploads/2023/08/India.svg', away: 'Hong Kong-China', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Hong-Kong-China.svg', score: 'TBD' },
            { date: '19 January 2026', time: '18:00', home: 'United Arab Emirates', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/United-Arab-Emirates.svg', away: 'Kuwait', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Kuwait.svg', score: 'TBD' }
        ]
    },
    'group-d': {
        name: 'Group D',
        teams: [
            { pos: 1, name: 'Saudi Arabia', flag: 'https://asianhandball.org/wp-content/uploads/2022/02/Saudi-Arabia-KSA.svg', pld: 2, w: 2, d: 0, l: 0, diff: 5, pts: 4 },
            { pos: 2, name: 'I. R. Iran', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Islamic-Republic-of-Iran.svg', pld: 2, w: 1, d: 0, l: 1, diff: 24, pts: 2 },
            { pos: 3, name: 'Japan', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Japan.svg', pld: 2, w: 1, d: 0, l: 1, diff: 19, pts: 2 },
            { pos: 4, name: 'Australia', flag: 'https://asianhandball.org/wp-content/uploads/2022/02/Australia.svg', pld: 2, w: 0, d: 0, l: 2, diff: -48, pts: 0 }
        ],
        matches: [
            { date: '15 January 2026', time: 'N/A', home: 'Australia', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Australia.svg', away: 'Japan', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Japan.svg', score: '23 - 45' },
            { date: '15 January 2026', time: 'N/A', home: 'Saudi Arabia', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Saudi-Arabia-KSA.svg', away: 'I. R. Iran', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Islamic-Republic-of-Iran.svg', score: '24 - 22' },
            { date: '17 January 2026', time: 'N/A', home: 'Australia', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Australia.svg', away: 'I. R. Iran', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Islamic-Republic-of-Iran.svg', score: '13 - 39' },
            { date: '17 January 2026', time: 'N/A', home: 'Saudi Arabia', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Saudi-Arabia-KSA.svg', away: 'Japan', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Japan.svg', score: '27 - 24' },
            { date: '19 January 2026', time: '14:00', home: 'Australia', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Australia.svg', away: 'Saudi Arabia', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/02/Saudi-Arabia-KSA.svg', score: 'TBD' },
            { date: '19 January 2026', time: '20:00', home: 'I. R. Iran', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Islamic-Republic-of-Iran.svg', away: 'Japan', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Japan.svg', score: 'TBD' }
        ]
    },
    'cup-group-3': {
        name: 'Cup Group 3',
        teams: [
            { pos: 1, name: '3C', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '4B', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: 'Oman', flag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 }
        ],
        matches: [
            { date: '22 January 2026', time: '12:00', home: '4B', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: 'Oman', awayFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', score: 'TBD' },
            { date: '23 January 2026', time: '12:00', home: '3C', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '4B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '12:00', home: 'Oman', homeFlag: 'https://asianhandball.org/wp-content/uploads/2025/06/Oman.svg', away: '3C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' }
        ]
    },
    'cup-group-4': {
        name: 'Cup Group 4',
        teams: [
            { pos: 1, name: '3B', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '3D', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '4C', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '4D', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 }
        ],
        matches: [
            { date: '22 January 2026', time: '14:00', home: '4C', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '3D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '22 January 2026', time: '16:00', home: '4D', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '3B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '14:00', home: '4D', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '3D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '16:00', home: '4C', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '3B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '14:00', home: '4C', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '4D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '16:00', home: '3B', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '3D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' }
        ]
    },
    'main-group-1': {
        name: 'Main Round Group 1',
        teams: [
            { pos: 1, name: '1A', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '1C', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '2B', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '2D', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 }
        ],
        matches: [
            { date: '22 January 2026', time: '12:00', home: '1A', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '22 January 2026', time: '16:00', home: '2B', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '12:00', home: '1A', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '16:00', home: '2D', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '12:00', home: '2B', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '16:00', home: '1A', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' }
        ]
    },
    'main-group-2': {
        name: 'Main Round Group 2',
        teams: [
            { pos: 1, name: '1B', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '1D', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '2A', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 },
            { pos: 1, name: '2C', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', pld: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 }
        ],
        matches: [
            { date: '22 January 2026', time: '14:00', home: '2C', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '22 January 2026', time: '18:00', home: '1D', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2A', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '14:00', home: '2A', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1B', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '23 January 2026', time: '18:00', home: '1D', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '14:00', home: '2A', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '2C', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' },
            { date: '25 January 2026', time: '18:00', home: '1B', homeFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', away: '1D', awayFlag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg', score: 'TBD' }
        ]
    },
    'final-ranking': {
        name: 'Final Ranking',
        teams: [
            { pos: 1, name: '*', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 2, name: '*', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 3, name: '*', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 4, name: '*', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 5, name: '5', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 6, name: '6', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 7, name: '7', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 8, name: '8', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 9, name: '9', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 10, name: '10', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 11, name: '11', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 12, name: '12', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 13, name: '13', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 14, name: '14', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' },
            { pos: 15, name: '15', flag: 'https://asianhandball.org/wp-content/uploads/2022/06/White-Flag.svg' }
        ],
        matches: []
    }
};