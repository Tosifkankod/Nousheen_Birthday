// 14 Little Things — Day Content Configuration
// Fill in YOUR actual memories, songs, and details here!

export const DAYS = [
  {
    day: 1,
    date: '2026-10-01',
    title: 'The Beginning',
    emoji: '🌱',
    type: 'intro',
    unlocked: true,
  },
  {
    day: 2,
    date: '2026-10-02',
    title: 'A Little Game & A Promise',
    emoji: '💌',
    type: 'interactive-letter',
    unlocked: true,
  },
  {
    day: 3,
    date: '2026-10-03',
    title: 'This Song',
    emoji: '🎧',
    type: 'song',
    unlocked: false,
  },
  {
    day: 4,
    date: '2026-10-04',
    title: 'Our Timeline',
    emoji: '📸',
    type: 'timeline',
    unlocked: false,
  },
  {
    day: 5,
    date: '2026-10-05',
    title: 'How Well Do You Know Me?',
    emoji: '🧩',
    type: 'quiz',
    unlocked: false,
  },
  {
    day: 6,
    date: '2026-10-06',
    title: 'Reasons',
    emoji: '🌹',
    type: 'reasons-wall',
    unlocked: false,
  },
  {
    day: 7,
    date: '2026-10-07',
    title: 'Our Album',
    emoji: '🖼️',
    type: 'album',
    unlocked: false,
  },
  {
    day: 8,
    date: '2026-10-08',
    title: 'Behind The Website',
    emoji: '🧑‍💻',
    type: 'terminal',
    unlocked: false,
  },
  {
    day: 9,
    date: '2026-10-09',
    title: 'If We Were...',
    emoji: '💭',
    type: 'if-we-were',
    unlocked: false,
  },
  {
    day: 10,
    date: '2026-10-10',
    title: 'A Letter',
    emoji: '✍️',
    type: 'letter',
    unlocked: false,
  },
  {
    day: 11,
    date: '2026-10-11',
    title: 'Things I Want To Do With You',
    emoji: '🫶',
    type: 'bucket-list',
    unlocked: false,
  },
  {
    day: 12,
    date: '2026-10-12',
    title: 'Mystery Box',
    emoji: '🎁',
    type: 'mystery-box',
    unlocked: false,
  },
  {
    day: 13,
    date: '2026-10-13',
    title: 'Almost There',
    emoji: '🥹',
    type: 'almost-there',
    unlocked: false,
  },
  {
    day: 14,
    date: '2026-10-14',
    title: 'Happy Birthday, Nousheen',
    emoji: '🎂',
    type: 'birthday',
    unlocked: false,
  },
];

// ===== DAY 2: 10 Things I Like About You =====
// Replace these with YOUR actual thoughts about Nousheen
export const TEN_THINGS = [
  {
    number: '01',
    title: 'The way you listen',
    text: "You don't just hear words — you actually listen. Like your full attention is on me. It makes me feel like what I say matters.",
  },
  {
    number: '02',
    title: 'Your laugh',
    text: "When something genuinely gets you, you laugh without thinking about it. That real laugh. I could record it and replay it forever.",
  },
  {
    number: '03',
    title: 'How you care',
    text: "You notice things. Small things. The way you check up on people, the way you remember details — it says a lot about you.",
  },
  {
    number: '04',
    title: 'The way you think',
    text: "Your mind goes to places I didn't expect. I love talking to you because I genuinely don't know what you'll say next.",
  },
  {
    number: '05',
    title: "You're honest",
    text: "You say what you mean. That's rarer than people realize. I trust you because of that.",
  },
  {
    number: '06',
    title: 'How you make things better',
    text: "A day with you in it is just... a better day. I don't know how to explain it more than that.",
  },
  {
    number: '07',
    title: 'Your energy',
    text: "There's something about being around you that makes me feel calm and alive at the same time. I don't fully understand it. I like it.",
  },
  {
    number: '08',
    title: 'That you exist',
    text: "Genuinely. That you exist and somehow ended up in my world — I think about that sometimes and it feels like something I didn't deserve.",
  },
  {
    number: '09',
    title: 'You let me be me',
    text: "With you I don't have to perform or pretend. That's the most comfortable feeling in the world.",
  },
  {
    number: '10',
    title: 'Everything I haven\'t figured out yet',
    text: "I keep noticing new things about you. Which means there's still so much to discover. I like that.",
  },
];

// ===== DAY 3: Song =====
// Replace with an actual song that reminds you of Nousheen
export const SONG = {
  title: 'Tum Hi Ho',
  artist: 'Arijit Singh',
  // YouTube embed ID (the part after ?v=)
  youtubeId: 'Umqb9KENgmk',
  message: "I don't know why, but this one always makes me think of you. Every single time.",
};

// ===== DAY 4: Timeline =====
// Replace these with YOUR actual story moments
export const TIMELINE_MOMENTS = [
  {
    emoji: '✨',
    label: 'First conversation',
    description: "I still remember thinking — this person is different.",
  },
  {
    emoji: '😂',
    label: 'The first time we laughed together',
    description: "About something stupid. But I remember exactly what it was.",
  },
  {
    emoji: '🌙',
    label: 'The night everything changed',
    description: "You know which one.",
  },
  {
    emoji: '☕',
    label: 'A normal day',
    description: "That made me realize I want more normal days with you.",
  },
  {
    emoji: '💬',
    label: 'That conversation',
    description: "The long one. The one where I felt like you actually understood me.",
  },
  {
    emoji: '❤️',
    label: 'Today',
    description: "Day 4. 10 days before your birthday. Right here.",
  },
];

// ===== DAY 5: Quiz =====
// Customize with YOUR actual preferences and inside jokes
export const QUIZ_QUESTIONS = [
  {
    question: "What would I choose?",
    options: ["Coffee ☕", "Chai 🫖", "You ❤️"],
    correct: 2,
    funnyExplain: "Obviously you. But honestly... close call with chai.",
  },
  {
    question: "When I'm stressed, what do I do first?",
    options: ["Call you", "Go quiet", "Pretend I'm fine", "Open my laptop"],
    correct: 2,
    funnyExplain: "Yeah. I pretend I'm fine. You always see through it anyway.",
  },
  {
    question: "What's my favorite thing we've talked about?",
    options: ["Everything", "That one night", "The future", "Nothing specific — just you"],
    correct: 3,
    funnyExplain: "It's never about the topic. It's always about who I'm talking to.",
  },
  {
    question: "If I could redo one day, which would it be?",
    options: ["A day where I was off", "A really good day", "A day with you", "None — I'd just add more"],
    correct: 3,
    funnyExplain: "I wouldn't redo anything. I'd just want more days.",
  },
  {
    question: "What do I think about most randomly?",
    options: ["Work stuff", "Things I said 3 years ago", "You", "Food"],
    correct: 2,
    funnyExplain: "You. Unexpectedly. At weird times. A lot.",
  },
];

// ===== DAY 6: Reasons Wall =====
// More reasons you love Nousheen — click to reveal
export const REASONS = [
  "The way you say my name",
  "That you actually respond",
  "Your weird sense of humor",
  "How you look when you're thinking",
  "That you remember small things",
  "You're not afraid to be honest",
  "The way you explain things",
  "How you make me feel heard",
  "That you exist in my world",
  "The energy you bring",
  "Your patience",
  "How you care about people",
  "That laugh. Always that laugh.",
  "You push me to be better",
  "The way you handle hard things",
  "How you make normal moments feel good",
  "That you're actually thoughtful",
  "The way you overthink — same as me",
  "How you show up",
  "Everything I haven't found out yet",
  "The way time goes when we talk",
  "That you're real with me",
  "How you notice things",
  "Your voice when you're excited",
  "The moments when you're completely yourself",
  "How you make me feel calm",
  "That you're kind without trying",
  "The way you see things",
  "All the questions you ask",
  "That you stayed",
];

// ===== DAY 7: Album Photos =====
// Replace these with real photo URLs or import your images
export const ALBUM_PHOTOS = [
  {
    src: null, // Replace with your photo URL
    caption: "That day...",
    note: "This one makes me smile every time.",
    emoji: "☀️",
  },
  {
    src: null,
    caption: "Remember this?",
    note: "I still think about this.",
    emoji: "🌙",
  },
  {
    src: null,
    caption: "Us, being us.",
    note: "My favorite kind of day.",
    emoji: "✨",
  },
  {
    src: null,
    caption: "This moment.",
    note: "I'm glad we have this.",
    emoji: "💕",
  },
];

// ===== DAY 9: If We Were... =====
// Replace with YOUR actual answers
export const IF_WE_WERE = [
  { emoji: '🎬', category: 'a movie', answer: 'A quiet one. The kind where nothing dramatic happens but you cry anyway.' },
  { emoji: '🎵', category: 'a song', answer: 'Something that sounds simple but you keep going back to.' },
  { emoji: '🌆', category: 'a city', answer: 'Istanbul. Old and new at the same time. Complicated and beautiful.' },
  { emoji: '🍕', category: 'a food', answer: 'Biryani. You always want more of it.' },
  { emoji: '🌦️', category: 'weather', answer: 'That exact moment after rain when everything smells clean and the sun comes out.' },
  { emoji: '📚', category: 'a book', answer: 'The one everyone tells you to read. And they\'re right.' },
];

// ===== DAY 10: Letter =====
// Write this yourself. This is the most important one.
export const LETTER = `Nousheen,

I've been trying to figure out how to put everything I feel into words. Which is funny, because I've been working on this website for days and words are kind of the whole point.

But here's the thing —

When I think about you, I don't think in sentences. I think in moments. The specific ones. The quiet ones. The ones that probably seemed small at the time but somehow stayed with me.

I think about the way you talk when you're actually excited about something. The way you sound when you're tired but still showing up. The way you make me feel like myself — not a version of myself I'm performing, just... me.

I don't say this stuff enough. I'm not always good at it. But I feel it.

You deserve to know that.

So for 14 days, starting from today — I tried to show you instead of just saying it.

Not because it's your birthday.

Because you're Nousheen.

And you deserve something that took time.

— Tosif ❤️`;

// ===== DAY 11: Bucket List =====
export const BUCKET_LIST = [
  "Watch the sunrise together",
  "Take a random trip — destination decided last minute",
  "Eat somewhere we've never been",
  "Take 100 stupid pictures in one day",
  "Stay up talking until it's actually morning",
  "Cook something together (even if it goes wrong)",
  "Find a song we both love equally",
  "Have a whole day with no plans",
  "Do something neither of us has done before",
  "Watch all your favorite movies",
  "Take a walk somewhere new",
  "Make a memory good enough to keep talking about for years",
];

// ===== DAY 12: Mystery Box =====
export const MYSTERY_BOXES = [
  { content: "Nope 😭\nSorry. Try another one.", isReal: false, emoji: "😅" },
  { content: "Almost... 👀\nSo close. One more.", isReal: false, emoji: "🙈" },
  {
    content: "You found it ❤️\n\nToday's gift is simple:\n\nYou get to ask me anything.\nOne question. I'll answer honestly.\nNo limits.",
    isReal: true,
    emoji: "✨"
  },
];

// ===== DAY 14: Birthday Surprise =====
// Update with your actual surprise details
export const BIRTHDAY_SURPRISE = {
  location: "Somewhere special 📍",
  time: "7:00 PM",
  hint: "You know where. Dress nicely.",
  note: "Your actual gift is waiting for you. I'll be there too. ❤️",
};
