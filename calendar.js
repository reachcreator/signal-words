// Family Signal Words App - Calendar Generation
// Creates ICS files for calendar import

function downloadCalendar(signalWords) {
    if (!signalWords || signalWords.length === 0) {
        throw new Error('No signal words available for calendar generation');
    }

    // Generate ICS content
    let icsContent = generateICSContent(signalWords);

    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-signal-words.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function generateICSContent(signalWords) {
    // ICS file header
    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Family Signal Words//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Family Signal Words
X-WR-CALDESC:Weekly rotating security words to protect against AI voice scams
`;

    // Add each week's event
    signalWords.forEach(word => {
        const eventStart = formatDateForICS(word.startDate);
        const eventEnd = formatDateForICS(new Date(word.startDate.getTime() + 24 * 60 * 60 * 1000)); // Next day

        ics += `BEGIN:VEVENT
UID:${generateEventUID(word)}
DTSTAMP:${formatDateForICS(new Date())}
DTSTART;VALUE=DATE:${eventStart}
DTEND;VALUE=DATE:${eventEnd}
SUMMARY:Signal Word: ${word.word.toUpperCase()}
DESCRIPTION:Family security word for Week ${word.week}. Keep this secret! Only share with trusted family members in person.
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT
`;
    });

    // ICS file footer
    ics += 'END:VCALENDAR\n';

    return ics;
}

function formatDateForICS(date) {
    // Format date as YYYYMMDD for ICS DATE values
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function generateEventUID(word) {
    // Generate a unique ID for each calendar event
    const timestamp = word.startDate.getTime();

    // Use cryptographically secure random for the random part
    let randomPart = '';
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(8);
        crypto.getRandomValues(array);
        randomPart = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
        randomPart = Math.random().toString(36).substring(2, 15);
    }

    return `signal-word-${word.week}-${timestamp}-${randomPart}@family-security.app`;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { downloadCalendar, generateICSContent };
}
