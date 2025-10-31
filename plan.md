# Signal Word Family Security App - Implementation Plan

## Overview
A client-side JavaScript application that generates UUID-based seeds for families to create shared "signal words" that rotate weekly. The app creates ICS calendar files that can be imported into any calendar application. No server, no logins, no data storage - completely stateless and secure.

## Core Features
- **Self-contained family code generation**: UUID + embedded start date (format: UUID-YYYYMMDD)
- **Two-column interface**: Generate code vs Enter existing code (always visible)
- Deterministic word generation using UUID as seed with consistent weekly calendars
- ICS calendar file creation with 52 weeks of signal words
- Educational content about AI voice impersonation risks
- Responsive web interface

## Technical Architecture

### Files Structure
```
/signal-word-app/
├── index.html          # Main app interface
├── styles.css          # Responsive styling
├── app.js             # Core application logic
├── words.js           # Word list and generation logic
└── calendar.js        # ICS file generation
```

### Word List Source
**Selected: Google 10,000 English Words (Medium Filter)**
- **Source**: https://github.com/first20hours/google-10000-english
- **Size**: 5,459 words
- **Why this list**:
  - Frequency-based (most common English words)
  - Pre-filtered for no offensive content
  - Real words that families actually know and use
  - High recognition rate (people will remember these words easily)
  - Sufficient entropy: log₂(5459) ≈ 12.4 bits per word
  - One year of weekly words (52) with this list gives ~644 bits of combined entropy

**Technical Details**:
- File: `google-10000-english-usa-no-swears-medium.txt`
- License: MIT (public domain for our use case)
- Words are sorted by frequency of use
- Includes common nouns, verbs, adjectives that are family-appropriate

**Alternative Options Considered**:
1. **SCOWL Word Lists**: More comprehensive but includes technical/rare words
2. **WordNet**: Too academic, many obscure words
3. **Dynamic Generation**: Could create nonsense words, but real words are more memorable

**Implementation**: Include the word list as a static array in `words.js`

## Implementation Steps

### Phase 1: Core Infrastructure
1. Set up basic HTML structure with UUID input/display and existing code option
2. Implement cryptographically secure UUID v4 generation using crypto.getRandomValues()
3. Create deterministic random number generator using UUID as seed
4. Build word selection logic with static word list (no external dependencies)

### Phase 2: Word Generation System
1. Research and curate word list (1500+ words)
2. Implement seeded random word picker
3. Add weekly rotation logic (52 weeks)
4. Handle edge cases (duplicate words, etc.)

### Phase 3: Calendar Integration
1. Implement ICS file format generation
2. Create calendar events for each week
3. Add proper date handling (start from current week)
4. Include signal word in event title/description

### Phase 4: User Interface
1. Design clean, family-friendly UI
2. Add UUID sharing instructions
3. Implement download functionality for ICS files
4. Add educational content section

### Phase 5: Security & Polish
1. Ensure truly random UUID generation
2. Test deterministic reproducibility with synchronized start dates
3. Add input validation
4. Responsive design testing
5. Accessibility considerations
6. Implement animated scroll arrow for better UX

## Key Technical Challenges

### Deterministic Random Generation
- Need a seeded PRNG that produces same sequence from UUID
- JavaScript's Math.random() is not seedable
- Solution: Implement a simple seeded random number generator
- Use murmurhash or similar for UUID → seed conversion

### ICS File Generation
- ICS format specification compliance
- Proper date formatting (ISO 8601)
- Event recurrence handling
- Cross-platform calendar compatibility

### Word List Curation
- Balance between security (unpredictability) and usability (memorability)
- Avoid culturally sensitive words
- Ensure sufficient entropy (1500+ words = ~10.5 bits entropy)

## Security Considerations
- **Cryptographically secure UUIDs**: Generated using `crypto.getRandomValues()` (128 bits of entropy)
- **Static word list**: No external dependencies or API calls that could change
- **Client-side only**: No server storage or transmission of sensitive data
- **Word rotation**: Weekly changes prevent compromise persistence
- **Deterministic generation**: Same UUID always produces same word sequence
- **Educational content**: Raises awareness of AI voice impersonation threats

## Testing Strategy
- Unit tests for random generation determinism
- ICS file validation (import into Google Calendar, Apple Calendar, Outlook)
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility testing

## Deployment
- Static hosting (GitHub Pages, Netlify, Vercel)
- No build process required (vanilla JS)
- CDN for any external resources (if needed)

## Success Metrics
- Families can successfully generate and share UUIDs
- Generated calendars import correctly across platforms
- Signal words are memorable and distinct
- App loads and works offline
- Educational content is clear and compelling
