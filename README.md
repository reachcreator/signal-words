# Family Signal Words 🛡️

A client-side web application that generates weekly rotating "signal words" to help families protect against AI voice impersonation scams. Never again wonder if that call from your spouse, child, or parent is really them!

## 🎯 What This Does

This app creates a **52-week calendar of unique words** that your family uses as authentication codes. When someone calls claiming to be a family member, simply ask them for "this week's signal word" - if they know it, you know it's really them!

**Example:** "Hi Mom, it's me - the signal word this week is 'butterfly'."

## 🚀 Quick Start

1. **Generate your family code** by clicking the "Generate New Family Code" button
2. **Share the code** securely with your family members
3. **Each family member** enters the code and generates their calendar
4. **Add to your calendar app** using the downloaded ICS file
5. **Use the words** whenever you receive suspicious calls

## 🌟 Features

- **Client-side only** - No data stored anywhere, completely private
- **Cryptographically secure** UUID generation using `crypto.getRandomValues()`
- **Deterministic word generation** - Same UUID always produces same words
- **Synchronized calendars** - Family members stay in sync with embedded start dates
- **Universal compatibility** - ICS calendar format works with all major calendar apps
- **Beautiful glassmorphic UI** - Modern, responsive design with dark theme
- **No registration required** - Just share your family code securely
- **52 weeks of unique words** from 5,459-word dictionary

## 🔧 How It Works

### Technical Architecture
- **Seed Generation**: Uses cryptographically secure UUID v4 generation
- **Word Selection**: Deterministic seeded random selection from Google 10,000 English words
- **Calendar Format**: Standard ICS (iCalendar) format for universal compatibility
- **Synchronization**: Family code includes embedded start date (UUID-YYYYMMDD format)

### Security Model
- **UUID Entropy**: 128 bits of randomness makes guessing impossible
- **Large Word Pool**: 5,459 unique words minimize repetition
- **No Server Storage**: Everything runs in your browser
- **Family-Shared Secret**: Only people with your code can generate your words

## 📱 Usage

### For New Families
1. Visit the website
2. Click "Generate New Family Code"
3. Copy the setup instructions
4. Share securely with family (in person, not via text/email)
5. Each family member enters the code and downloads their calendar

### For Existing Families
1. Enter your existing family code
2. Generate and download your calendar
3. Import the ICS file to your preferred calendar app

### Calendar Integration
- **Google Calendar**: File → Import
- **Apple Calendar**: File → Import → From File
- **Outlook**: Open the ICS file directly
- **Other apps**: Import ICS files (most calendar apps support this)

## 🎨 Design Philosophy

- **Glassmorphism**: Modern frosted glass effects for a premium feel
- **Accessibility**: Clear typography and intuitive interface
- **Mobile-first**: Responsive design works on all devices
- **Dark theme**: Easier on eyes and more mysterious vibe
- **No distractions**: Focused on the core functionality

## 🛡️ Security Considerations

- **Share codes in person** - Never send codes via text, email, or any digital means
- **Use strong passwords** - Protect your devices where calendars are stored
- **Regular rotation** - Generate new codes annually or when family changes
- **Backup calendars** - Keep copies in case you lose access
- **Family communication** - Discuss the system so everyone understands how to use it

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browsers with `crypto.getRandomValues()` support.

## 🛠️ Development

This is a vanilla JavaScript application with no build process required:

```
├── index.html    # Main UI
├── styles.css    # Glassmorphic styling
├── app.js        # UI logic and event handling
├── words.js      # Word list and generation logic
├── calendar.js   # ICS calendar generation
└── plan.md       # Project planning document
```

### Local Development
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 🤝 Contributing

This project is open source! Feel free to:

- Report bugs or suggest features
- Improve the UI/UX
- Add translations
- Enhance security features
- Add more word lists for other languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Word list**: Google 10,000 English Words (Medium filter) from [first20hours/google-10000-english](https://github.com/first20hours/google-10000-english)
- **Icons**: Family Signal Words logo and CTM branding
- **Inspiration**: Bank signal numbers and similar authentication systems

## 🆘 Need Help?

If you encounter issues:
1. Check your browser console for errors
2. Ensure you're using a modern browser
3. Try clearing your browser cache
4. Make sure JavaScript is enabled

## 📞 About Confuse The Machine

Made with ❤️ to protect families from AI scams by [Confuse The Machine](https://confusethemachine.com) - fighting AI manipulation and protecting human autonomy.

---

**Remember**: This is a fun, effective way to add an extra layer of verification to your family's communications. While not foolproof, it makes impersonation scams much harder and gives you peace of mind! 🛡️✨
