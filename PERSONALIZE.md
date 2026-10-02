# 14 Little Things — Your Personalization Guide
## Everything to customize for Nousheen, bro

> One file to rule them all: src/data/days.js

---

## How the unlock system works
- Days unlock automatically based on the real current date
- Oct 1 = Day 1, Oct 2 = Day 2, ... Oct 14 = Birthday
- Today is Oct 2, so Days 1 and 2 are already unlocked
- No config needed — it just works

---

## What to personalize

### Day 2 — TEN_THINGS array
Replace the 10 items with YOUR actual memories about Nousheen.
Each card has `title` (shown after click) and `text` (the personal message).

### Day 3 — SONG object
```js
export const SONG = {
  title: 'Your Song Title',
  artist: 'Artist Name',
  youtubeId: 'VIDEO_ID_HERE',  // just the part after ?v=
  message: "Why this song makes you think of her..."
};
```

### Day 4 — TIMELINE_MOMENTS array
Replace with real moments from your relationship story.

### Day 5 — QUIZ_QUESTIONS array
Make it actually about YOU. Add inside jokes.
`correct` is the 0-based index of the right answer.

### Day 6 — REASONS array
More reasons you love Nousheen — they reveal one at a time randomly.
The more specific and real, the better.

### Day 7 — ALBUM_PHOTOS array
Add real photos:
- Put them in the `public/` folder
- Reference as `src: '/photo.jpg'`

### Day 9 — IF_WE_WERE array
Your actual answers. Be specific, be funny, be honest.

### Day 10 — LETTER string (MOST IMPORTANT)
Write this yourself. No AI. This is the one she'll remember.
The template is there, just replace it word by word.

### Day 11 — BUCKET_LIST array
Real things you want to do together.

### Day 12 — MYSTERY_BOXES (index 2 is the real gift)
Update the `content` of the third box with your actual message.

### Day 14 — BIRTHDAY_SURPRISE object
```js
export const BIRTHDAY_SURPRISE = {
  location: "The actual place",
  time: "7:00 PM",
  hint: "Dress nicely. I'll be there.",
  note: "Your personal note to her here."
};
```

---

## Deploying to Vercel

1. Push this folder to GitHub
2. Go to vercel.com
3. Import the repo — it auto-detects Vite
4. Deploy

She'll get a link like `nousheen.vercel.app`

---

## Daily Link Schedule

| Date | Send her |
|------|----------|
| Oct 1 | yoursite.com/day/1 |
| Oct 2 | yoursite.com/day/2 |
| ... | ... |
| Oct 14 | yoursite.com/day/14 |

The site blocks future days automatically — she can't cheat and skip ahead.

---

Made with love, by Tosif, for Nousheen. October 2026.
