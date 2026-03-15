# PM Internship Hackathon — Multi-Step Registration Form

## Project Context

This is a government/internship portal registration form built as a hackathon project. The goal is to create a clean, human-crafted UI that does NOT look like generic AI-designed interfaces. Think of how a thoughtful product designer at a well-funded Indian startup would approach this — like Zepto, CRED, or Razorpay's internal tools: crisp, functional, honest, and minimal without being sterile.

---

## Design Philosophy

### The "Human-Made" Rule
Every design decision must feel like it was made by a person, not generated:
- No gradient-heavy hero sections
- No glassy cards with heavy blur effects
- No purple/blue gradient on white combos
- No Inter or Roboto — use **Plus Jakarta Sans** for body, **Sora** for headings
- No floating labels that animate weirdly
- Spacing must feel considered — not auto-padded
- Colors should feel grounded: off-whites (#FAFAF9), deep navies (#1C2340), soft slates (#64748B), with one warm accent (#E05C2A — terracotta/burnt orange from the image CTA)

### Design System Rules
- **Primary color**: #1C2340 (deep navy — trustworthy, government-adjacent)
- **Accent color**: #E05C2A (warm terracotta — action buttons, highlights)
- **Background**: #F5F4F2 (off-white, not pure white)
- **Card/surface**: #FFFFFF with a 1px border #E2E0DC, no heavy shadows
- **Text primary**: #1A1A1A
- **Text secondary**: #6B7280
- **Success**: #16A34A
- **Error**: #DC2626
- **Border radius**: 8px for inputs, 12px for cards — consistent, not rounded-pill
- **Font**: Import from Google Fonts — Plus Jakarta Sans (body) + Sora (headings)
- **Input height**: 44px — comfortable but not chunky
- **Label style**: Small uppercase 11px tracking-wide labels ABOVE the input, not inside
- **Required asterisk**: colored #E05C2A, placed after label text

---

## Application Structure

This is a **4-page multi-step form** with a **confirm-then-preview** flow per section.

### Navigation Pattern
- Top progress bar with step indicators (Step 1 of 4, Step 2 of 4, etc.)
- Progress bar fills left-to-right using accent color
- Each step label visible below the progress dots: Personal, Contact, Education, Skills
- "Back" button (text link, no border) + "Continue" / "Confirm" button (filled accent)

### Confirm → Preview Flow (CRITICAL BEHAVIOR)
When user clicks "Confirm" on any section:
1. The form fields **animate out** (fade + slide up)
2. A **preview card** animates in (fade + slide up) showing all entered data in a clean read-only layout
3. The preview card has an **"Edit"** button (top-right, outlined small button) that brings back the form pre-filled
4. "Continue to Next Section" button appears below the preview card
5. This pattern repeats for every section

---

## Page 1 — Personal Details

### Fields (in a 3-column grid on desktop, 1-column on mobile):

**Row 1:**
- Full Name (text input, required) — full width spanning all 3 columns

**Row 2:**
- Date of Birth (date picker styled as DD / MM / YYYY — three separate dropdowns, not a calendar picker, required)
- Gender (radio pill buttons: Male / Female / Other / Prefer not to say — styled as toggleable pill chips, not a dropdown)
- Category (dropdown: General / OBC / SC / ST / EWS — Indian caste-based reservation category, required)

**Row 3:**
- Father's Name (text input)
- Mother's Name (text input)
- Guardian's Name (text input, optional — show only if user clicks "+ Add Guardian")

**Row 4 — Address:**
- Address Line 1 (text, required)
- Address Line 2 (text, optional)
- City (text, required)
- State (dropdown — all Indian states listed, required)
- PIN Code (6-digit number input, required)

**Row 5:**
- Differently Abled? (toggle switch — clean iOS-style switch, default OFF)
  - If ON: reveal a dropdown → Type of Disability (Visual / Hearing / Locomotor / Intellectual / Other)

**Preview Card Layout for Personal:**
Show data in labeled key-value pairs, 2 columns. Group address under a subtle "Address" subheader. Show disability status as a badge (green "No" or amber "Yes — [type]").

---

## Page 2 — Contact Details

### Fields:

**Row 1:**
- Primary Mobile Number (10-digit input with +91 prefix shown as static text to the left, required)
- Alternative Mobile Number (same format, optional)

**Row 2:**
- Email Address (email input, required)
- Alternate Email (email input, optional)

**Validation behavior:**
- Mobile: show inline error immediately if not 10 digits (do NOT wait for submit)
- Email: validate on blur
- Show green checkmark icon inside input on valid entry
- Show red X icon + red border + error text below on invalid

**Preview Card for Contact:**
Show phone numbers with a phone icon prefix, email with email icon. Mask middle 4 digits of phone in preview (e.g., 98****4567) for a polished feel.

---

## Page 3 — Education Qualification

### Layout: Repeatable card system
The user can add multiple education entries. Each entry is a card. First card is always shown. A "+ Add Another Qualification" button appears after saving the first.

### Fields per qualification card (3-column grid):

**Row 1:**
- Qualification (dropdown: 10th / 12th / Diploma / UG / PG / PhD / Other, required)
- Course (dropdown: dynamically changes based on qualification selected — e.g., if UG: B.Tech / B.Sc / B.Com / BA / BCA / BBA etc., required)
- Stream / Specialization (text input — free text, optional)

**Row 2:**
- Name of Board / University (text input, required)
- Name of Institute / School (text input, required)
- Year of Passing (dropdown: last 30 years listed, required)

**Row 3:**
- Marks Obtained — Score Type (dropdown: Percentage / CGPA / Grade, required)
- Score Value (number input — e.g., 87.4 or 8.7 or A+, required)

**NO file upload fields — this is intentional. Do not include any certificate upload anywhere.**

**Adding multiple qualifications:**
- After confirming first entry, show it as a compact preview card
- Below it, show "+ Add Another Qualification" as a dashed-border button
- Each added qualification appears as a stacked preview card
- Each has an Edit and Delete option

**Section-level Confirm Button:**
"Save Education Details" — only enabled when at least 1 qualification is added and confirmed.

---

## Page 4 — Skills, Languages & Experience

### Part A — Skills (Tag/Chip input with autocomplete)

**Behavior:**
- Single text input with label "Add Your Skills"
- As user types, a dropdown appears below showing matching skills from a predefined list (common tech + non-tech skills)
- User can select from dropdown OR press Enter to add a custom skill
- Selected skills appear as **removable chip tags** below the input box
- Chips: filled with #1C2340 background, white text, small × to remove
- Maximum 20 skills allowed — show "(X/20 selected)" counter
- If limit reached, disable input and show "Maximum skills added" message

**Predefined skill list:**
Python, Java, C++, JavaScript, React, Node.js, Excel, PowerPoint, SQL, Machine Learning, Data Analysis, Figma, Photoshop, AutoCAD, Communication, Leadership, Teamwork, Problem Solving, Content Writing, Social Media, Digital Marketing, Project Management, Tally, Accounting, Research, Public Speaking

### Part B — Languages Known (same chip input pattern)
- Label: "Languages Known"
- Maximum **10 languages** — show "(X/10 selected)" counter
- Predefined list: Hindi, English, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Urdu, Odia, Assamese, Sanskrit, French, German, Spanish, Japanese, Chinese, Arabic
- Same chip UI as skills

### Part C — Past Experiences (repeatable entries)
- "+ Add Experience" button
- Each experience entry (inline, not a modal):
  - Organization Name (text, required)
  - Role / Designation (text, required)
  - Type (dropdown: Internship / Full-time / Part-time / Freelance / Volunteer)
  - Duration: From Month+Year to Month+Year (or "Currently Working" checkbox)
  - Brief Description (textarea, max 200 chars, optional)
- After saving, shows as a timeline-style preview card with role, org, and duration
- Can edit or delete each entry

**Section Confirm:**
"Save & Review All" — takes user to a final review page

---

## Final Review Page (Post all 4 sections)

Show all 4 section preview cards stacked vertically, each with an "Edit" button. A final **"Submit Application"** button at the bottom (full-width, accent color, with a subtle loading state on click).

---

## Interaction & Animation Guidelines

- Page transitions: slide-left on "Continue", slide-right on "Back" (CSS transform, 250ms ease)
- Form → Preview: fade out form (200ms), fade in preview card (200ms, 50ms delay)
- Chip tags: scale-in animation on add (transform: scale(0) → scale(1), 150ms)
- Input focus: border color transition from #E2E0DC to #1C2340 (200ms)
- Button hover: slight darken (#C44F24) + translate-y(-1px) with box-shadow
- Error state: input border goes red, error message slides down (max-height animation)
- Progress bar: smooth width transition (400ms ease) on step change

---

## What NOT to Do (Anti-patterns)

1. No modal dialogs — all editing happens inline
2. No floating/animated labels inside inputs
3. No card shadows heavier than `0 1px 3px rgba(0,0,0,0.08)`
4. No purple/indigo color schemes
5. No gradient buttons
6. No skeleton loaders
7. No emoji in UI labels
8. No sticky sidebars or hamburger navs
9. No file upload anywhere — especially NOT on Page 3 (Education)
10. No calendar date pickers — use dropdown day/month/year for DOB

---

## Technical Stack

- **React** (functional components + hooks)
- **Tailwind CSS** (utility-first)
- **Framer Motion** (for page and element transitions)
- State managed via `useState` and `useReducer` — no external state libraries needed
- All form data kept in a single top-level state object passed down via props or context
- No backend required — mock "submit" with a success screen

---

## Component Hierarchy

```
App
├── ProgressBar (step number, step labels, filled track)
├── StepRouter (renders current step)
│   ├── Step1_PersonalDetails
│   │   ├── PersonalForm (form fields)
│   │   └── PersonalPreview (read-only card)
│   ├── Step2_ContactDetails
│   │   ├── ContactForm
│   │   └── ContactPreview
│   ├── Step3_Education
│   │   ├── QualificationCard (repeatable)
│   │   └── EducationPreview (stacked cards)
│   ├── Step4_Skills
│   │   ├── SkillTagInput
│   │   ├── LanguageTagInput
│   │   ├── ExperienceEntry (repeatable)
│   │   └── SkillsPreview
│   └── FinalReview (all previews + submit)
└── NavigationButtons (Back / Continue / Confirm)
```

---

## Accessibility Notes

- All inputs must have associated `<label>` elements (not just placeholder text)
- Error messages linked via `aria-describedby`
- Keyboard navigable chip removal (focus chip → press Backspace or Delete)
- Progress bar has `aria-valuenow` and `aria-valuemax`
- Color alone never used to convey status — always pair with icon or text

---

## Summary Prompt for the AI Building This

You are building a human-crafted, clean, minimal multi-step registration form for an Indian internship/government portal. The aesthetic should feel like it was designed by a careful human designer — not AI-generated. Use Plus Jakarta Sans + Sora fonts, a navy + terracotta color palette on an off-white background.

Every section has a form state and a preview state. The flow is: fill form → click Confirm → see preview → edit if needed → continue to next step.

No file uploads anywhere. The skills and languages use a tag-chip input with autocomplete. Education supports multiple repeatable entries. The entire thing is desktop-first (min-width: 1024px) but should not break on tablet.

Build it in a single React JSX file using Tailwind CSS and Framer Motion.
