// Family Signal Words App - Main JavaScript
// Handles UI interactions and integrates with word generation

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const generateUuidBtn = document.getElementById('generate-uuid');
    const existingUuidInput = document.getElementById('existing-uuid-input');
    const useExistingCodeBtn = document.getElementById('use-existing-code');
    const uuidDisplay = document.getElementById('uuid-display');
    const uuidCode = document.getElementById('uuid-code');
    const copyUuidBtn = document.getElementById('copy-uuid');
    const calendarSection = document.getElementById('calendar-section');
    const uuidInput = document.getElementById('uuid-input');
    const generateCalendarBtn = document.getElementById('generate-calendar');
    const calendarPreview = document.getElementById('calendar-preview');
    const wordList = document.getElementById('word-list');
    const downloadIcsBtn = document.getElementById('download-ics');
    const printCalendarBtn = document.getElementById('print-calendar');
    const printCalendarContent = document.getElementById('print-calendar-content');
    const printFamilyCode = document.getElementById('print-family-code');
    const printCalendarTableBody = document.getElementById('print-calendar-table-body');

    let currentUuid = null;
    let currentStartDate = null;
    let currentWords = null;

    // Function to populate print content with calendar data
    function populatePrintContent() {
        // Set family code in print header
        const year = currentStartDate.getFullYear();
        const month = String(currentStartDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentStartDate.getDate()).padStart(2, '0');
        const familyCode = `${currentUuid}-${year}${month}${day}`;
        printFamilyCode.textContent = familyCode;

        // Clear existing table rows
        printCalendarTableBody.innerHTML = '';

        // Populate table with calendar data
        currentWords.forEach(word => {
            const row = document.createElement('tr');

            // Week number
            const weekCell = document.createElement('td');
            weekCell.className = 'week-number';
            weekCell.textContent = `Week ${word.week}`;
            row.appendChild(weekCell);

            // Signal word
            const wordCell = document.createElement('td');
            wordCell.className = 'signal-word';
            wordCell.textContent = word.word.toUpperCase();
            row.appendChild(wordCell);

            // Date range
            const dateCell = document.createElement('td');
            dateCell.className = 'date-range';
            const startDate = new Date(word.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6); // Add 6 days for end of week

            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            };

            dateCell.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            row.appendChild(dateCell);

            printCalendarTableBody.appendChild(row);
        });
    }

    // Generate cryptographically secure UUID v4 with embedded start date
    function generateFamilyCode() {
        // Get the current week's Monday as start date
        const startDate = getCurrentWeekMonday();

        // Format date as YYYYMMDD for embedding
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const day = String(startDate.getDate()).padStart(2, '0');
        const dateString = `${year}${month}${day}`;

        // Generate cryptographically secure UUID v4
        let uuid;
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            // Use cryptographically secure random number generation
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);

            // Set version (4) and variant bits
            array[6] = (array[6] & 0x0f) | 0x40; // Version 4
            array[8] = (array[8] & 0x3f) | 0x80; // Variant 10

            // Convert to hex string
            const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
        } else {
            // Fallback for environments without crypto.getRandomValues (though this shouldn't happen in browsers)
            console.warn('crypto.getRandomValues not available, using Math.random() fallback');
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Return combined code: UUID + encoded date
        return `${uuid}-${dateString}`;
    }

    // Parse family code to extract UUID and start date
    function parseFamilyCode(familyCode) {
        const parts = familyCode.split('-');
        if (parts.length !== 6) {
            throw new Error('Invalid family code format');
        }

        // Last part should be the date (YYYYMMDD)
        const dateString = parts[5];
        if (dateString.length !== 8 || !/^\d{8}$/.test(dateString)) {
            throw new Error('Invalid date format in family code');
        }

        // Extract UUID (first 5 parts)
        const uuid = parts.slice(0, 5).join('-');

        // Parse date
        const year = parseInt(dateString.slice(0, 4));
        const month = parseInt(dateString.slice(4, 6)) - 1; // JS months are 0-indexed
        const day = parseInt(dateString.slice(6, 8));
        const startDate = new Date(year, month, day);

        return { uuid, startDate };
    }

    // Get the Monday of the current week (for consistent start dates)
    function getCurrentWeekMonday() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // If today is Sunday (0), we want last Monday (-6 days)
        // If today is Monday (1), we want today (0 days ago)
        // If today is Tuesday (2), we want Monday (-1 day ago)
        // etc.
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToSubtract);
        monday.setHours(0, 0, 0, 0); // Start of day

        return monday;
    }

    // Copy UUID to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            // Visual feedback
            const originalText = copyUuidBtn.textContent;
            copyUuidBtn.textContent = '✅ Copied!';
            copyUuidBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
            setTimeout(() => {
                copyUuidBtn.textContent = originalText;
                copyUuidBtn.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyUuidBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyUuidBtn.textContent = '📋 Copy UUID';
            }, 2000);
        }
    }

    // Display signal words in a beautiful format
    function displaySignalWords(words) {
        wordList.innerHTML = '';

        words.slice(0, 12).forEach(word => { // Show first 12 weeks as preview
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';

            const weekBadge = document.createElement('span');
            weekBadge.className = 'word-week';
            weekBadge.textContent = `Week ${word.week}`;

            const wordText = document.createElement('span');
            wordText.className = 'word-text';
            wordText.textContent = word.word.toUpperCase();

            const wordDate = document.createElement('span');
            wordDate.className = 'word-date';
            wordDate.textContent = word.startDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            wordItem.appendChild(weekBadge);
            wordItem.appendChild(wordText);
            wordItem.appendChild(wordDate);

            wordList.appendChild(wordItem);
        });

        // Add a "show more" indicator if there are more than 12 weeks
        if (words.length > 12) {
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'word-item';
            moreIndicator.innerHTML = `
                <span class="word-week" style="background: rgba(156, 163, 175, 0.1); color: #9ca3af; border-color: rgba(156, 163, 175, 0.3);">
                    + ${words.length - 12} more weeks
                </span>
                <span class="word-text" style="color: #9ca3af;">Download calendar to see all</span>
            `;
            wordList.appendChild(moreIndicator);
        }
    }

    // Event Listeners
    useExistingCodeBtn.addEventListener('click', function() {
        const familyCode = existingUuidInput.value.trim();

        if (!familyCode) {
            alert('Please enter your family code.');
            return;
        }

        try {
            // Parse the family code to extract UUID and start date
            const { uuid, startDate } = parseFamilyCode(familyCode);

            // Validate the extracted UUID
            if (!validateUUID(uuid)) {
                alert('Invalid family code format. Please check and try again.');
                return;
            }

            // Set current values
            currentUuid = uuid;
            currentStartDate = startDate;

            // Pre-fill the calendar generator input
            uuidInput.value = familyCode;

            // Make calendar section visible now that we have the code
            calendarSection.classList.remove('hidden');

            // Auto-generate the calendar
            currentWords = generateSignalWords(currentUuid, 52, currentStartDate);
            displaySignalWords(currentWords);
            calendarPreview.classList.remove('hidden');

            // Scroll to calendar preview
            calendarPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Error parsing family code:', error);
            alert('Invalid family code format. Please check and try again.');
        }
    });

    generateUuidBtn.addEventListener('click', function() {
        const familyCode = generateFamilyCode();
        const { uuid, startDate } = parseFamilyCode(familyCode);

        currentUuid = uuid;
        currentStartDate = startDate;

        // Update display with the combined family code
        const startDateFormatted = currentStartDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        uuidCode.innerHTML = `
            <div class="mb-2">
                <strong>Your Family Code:</strong><br>
                <code class="text-cyan-300 font-mono text-sm break-all">${familyCode}</code>
            </div>
            <div class="text-green-300 text-sm">
                📅 Calendar starts: ${startDateFormatted}
            </div>
        `;

        uuidDisplay.classList.remove('hidden');

        // Auto-populate the existing code input with the generated code for easy testing
        existingUuidInput.value = familyCode;
    });

    copyUuidBtn.addEventListener('click', function() {
        if (currentUuid && currentStartDate) {
            // Reconstruct the full family code
            const year = currentStartDate.getFullYear();
            const month = String(currentStartDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentStartDate.getDate()).padStart(2, '0');
            const dateString = `${year}${month}${day}`;
            const familyCode = `${currentUuid}-${dateString}`;

            const shareText = `Family Signal Words Code:

${familyCode}

📅 Calendar starts: ${currentStartDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
})}

Share this code securely with your family members!`;
            copyToClipboard(shareText);
        }
    });

    generateCalendarBtn.addEventListener('click', function() {
        const inputCode = uuidInput.value.trim();

        if (!inputCode) {
            alert('Please enter your family code first.');
            return;
        }

        let uuid, startDate;

        try {
            // Try to parse as a full family code first
            const parsed = parseFamilyCode(inputCode);
            uuid = parsed.uuid;
            startDate = parsed.startDate;
        } catch (error) {
            // If parsing fails, check if it's a plain UUID
            if (validateUUID(inputCode)) {
                uuid = inputCode;
                startDate = getCurrentWeekMonday(); // Default to current week
            } else {
                alert('Please enter a valid family code or UUID.');
                return;
            }
        }

        try {
            currentWords = generateSignalWords(uuid, 52, startDate);
            displaySignalWords(currentWords);
            calendarPreview.classList.remove('hidden');

            // Scroll to calendar preview
            calendarPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Error generating calendar:', error);
            alert('Error generating calendar. Please try again.');
        }
    });

    downloadIcsBtn.addEventListener('click', function() {
        if (!currentWords) {
            alert('Please generate your calendar first.');
            return;
        }

        try {
            // This will be implemented in calendar.js
            downloadCalendar(currentWords);
        } catch (error) {
            console.error('Error downloading calendar:', error);
            alert('Error downloading calendar. Please try again.');
        }
    });

    // Print calendar functionality
    printCalendarBtn.addEventListener('click', function() {
        if (!currentWords || !currentUuid || !currentStartDate) {
            alert('Please generate your calendar first.');
            return;
        }

        // Populate print content
        populatePrintContent();

        // Show print content (temporarily)
        printCalendarContent.classList.remove('hidden');

        // Trigger print dialog
        window.print();

        // Hide print content after printing (with small delay to ensure print dialog opens)
        setTimeout(() => {
            printCalendarContent.classList.add('hidden');
        }, 1000);
    });

    // Add some visual enhancements
    generateUuidBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-2px)';
    });

    generateUuidBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });

    // Initialize - hide sections that should be hidden
    uuidDisplay.classList.add('hidden');
    calendarSection.classList.add('hidden');
    calendarPreview.classList.add('hidden');
});
