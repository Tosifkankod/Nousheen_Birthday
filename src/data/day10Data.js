// ============================================================================
// DAY 10: A UNIVERSE THAT SPELLS NOUSHEEN ❤️
// Central configuration for all scenes, messages, and interactive stars
// ============================================================================

// Scene 1: Floating handwritten typography phrases
export const DAY10_SCENE1_PHRASES = [
  { text: "Nousheen", size: "3.2rem", font: "'Caveat', cursive", color: "#fbe2a8", delay: 0.1, x: 0, y: 0, rot: -2 },
  { text: "I love you", size: "2.4rem", font: "'Playfair Display', Georgia, serif", color: "#ffffff", delay: 0.8, x: -28, y: -22, rot: 3 },
  { text: "I love you, Nousheen", size: "2.8rem", font: "'Playfair Display', Georgia, serif", color: "#fbe2a8", delay: 1.5, x: 26, y: -18, rot: -1 },
  { text: "Meri jaan", size: "2.2rem", font: "'Caveat', cursive", color: "#f4a7b9", delay: 2.2, x: -24, y: 16, rot: 4 },
  { text: "My bachaaaa", size: "2.5rem", font: "'Caveat', cursive", color: "#fbe2a8", delay: 2.9, x: 22, y: 20, rot: -3 },
  { text: "Mera noor", size: "2.2rem", font: "'Playfair Display', Georgia, serif", color: "#e8c37d", delay: 3.6, x: -18, y: -38, rot: 2 },
  { text: "My Nousheen", size: "2.6rem", font: "'Caveat', cursive", color: "#fdfbf7", delay: 4.3, x: 30, y: -34, rot: -4 },
  { text: "نوشين", size: "5.5rem", font: "'Amiri', serif", color: "#fbe2a8", delay: 5.0, x: 0, y: -8, rot: 0, isArabic: true },
  { text: "I LOVE YOU, NOUSHEEN", size: "2.7rem", font: "'Playfair Display', Georgia, serif", color: "#ffffff", delay: 5.8, x: 0, y: 35, rot: 0 },
  { text: "My favourite person", size: "2.1rem", font: "'Caveat', cursive", color: "#ffd1dc", delay: 6.5, x: -30, y: -6, rot: -5 },
  { text: "Meri paglu", size: "2.2rem", font: "'Caveat', cursive", color: "#fbe2a8", delay: 7.2, x: 28, y: 6, rot: 3 },
  { text: "Forever, inshaAllah", size: "2.3rem", font: "'Playfair Display', Georgia, serif", color: "#e8c37d", delay: 7.9, x: 0, y: -28, rot: 1 },
];

export const DAY10_SCENE1_ENDING = "And after all these words, there is still so much I want to tell you, bachaa.";

// Scene 2: The Personal Letter
export const DAY10_SCENE2_PARAGRAPHS = [
  "Nousheen, I know you will handle the situation. I trust you. Please forgive me if I have hurt you in any way.",
  "Yeah, sometimes I don't take things seriously because I don't want you to take any tension. And sometimes I start overthinking, but that doesn't mean I don't love you or that I'll leave you. Please remove these kinds of thoughts from your mind.",
  "I will marry you, inshaAllah. I have planned my whole future with you. Don't worry, I'm always with you, my bachaa.",
  "I haven't loved you just to leave you alone. You are my world, my wifey, my habiti.",
  "And from now on, I want you to share everything with me, whatever you're thinking or feeling. Even if you're worried, upset, overthinking, or confused, tell me, bachaa. You don't have to keep everything inside.",
  "I want us to understand each other better, even when things are difficult.",
  "My bachaa, I love you 1000 times."
];

// Scene 3: The 6 Interactive Stars in 3D Universe
export const DAY10_STARS = [
  {
    id: 1,
    title: "MY NOUR",
    badge: "STAR 1",
    icon: "✨",
    message: "Tum meri zindagi ka woh noor ho, Nousheen, jiske baare mein soch kar bhi mere chehre pe smile aa jaati hai.",
    coords: { x: -2.8, y: 1.3, z: -0.6 },
    color: "#fbe2a8"
  },
  {
    id: 2,
    title: "MY TRUST",
    badge: "STAR 2",
    icon: "🤍",
    message: "Bachaa, I trust you. And I want you to feel safe enough with me to tell me anything that's on your mind. You don't have to pretend you're okay with me.",
    coords: { x: 2.6, y: 1.5, z: -1.2 },
    color: "#ffffff"
  },
  {
    id: 3,
    title: "EVEN WHEN I OVERTHINK",
    badge: "STAR 3",
    icon: "🌙",
    message: "Sometimes I overthink, meri jaan. Sometimes I don't know how to express everything properly. But please don't mistake my overthinking for a lack of love. You mean so much to me.",
    coords: { x: -2.3, y: -0.5, z: -0.2 },
    color: "#e8c37d"
  },
  {
    id: 4,
    title: "MY FUTURE",
    badge: "STAR 4",
    icon: "🏡",
    message: "I don't just imagine beautiful moments with you. I imagine the ordinary days too. The conversations, the chai, the laughter, the difficult days, and the little things that will make our life ours.",
    coords: { x: 2.2, y: -0.4, z: -1.5 },
    color: "#ffd699"
  },
  {
    id: 5,
    title: "MY PROMISE",
    badge: "STAR 5",
    icon: "🤝",
    message: "I want to keep working towards the future we talk about, inshaAllah. I know words alone aren't enough. I want my actions to show you how much you matter to me.",
    coords: { x: -0.6, y: 2.0, z: -1.0 },
    color: "#f4a7b9"
  },
  {
    id: 6,
    title: "MY BACHAA",
    badge: "STAR 6",
    icon: "❤️",
    message: "My bachaa, meri jaan, mera noor, meri wifey, meri habiti… I love you 1000 times. And if I could give you one thing, it would be the ability to see yourself through my eyes.",
    coords: { x: 0.5, y: -0.7, z: -0.4 },
    color: "#ff8fa3"
  }
];

// Scene 4: Two Lights, One Story
export const DAY10_TWO_LIGHTS_LINES = [
  "One light is me.",
  "One light is you.",
  "Right now, there is distance between us.",
  "There are things we can only imagine doing together.",
  "There are days when we miss each other.",
  "But there is also a future we're trying to build, one step at a time."
];

// Scene 5: A Little Glimpse of Our Future
export const DAY10_FUTURE_LINES = [
  "One day, inshaAllah, I don't want to imagine these moments through a screen anymore.",
  "I want to sit beside you, listen to you talk about your day, make you laugh, annoy you a little, and make ordinary moments special with you.",
  "I don't need every day to be perfect, bachaa. I want us to keep choosing each other, understanding each other, and building our future together.",
  "Until then, you're in my duas, my thoughts, and the future I keep working towards."
];

// Scene 6: The Final Message
export const DAY10_FINAL_SECTION = {
  arabic: "نوشين",
  greeting: "My bachaaaa.",
  lines: [
    "I know words alone cannot remove every doubt. But I want to keep showing you, through my actions, that you're important to me.",
    "You can always talk to me, meri jaan. Even when something is difficult. Especially then.",
    "I love you 1000 times."
  ],
  tag: "DAY 10 COMPLETE 🤍",
  button: "COME BACK TO OUR UNIVERSE"
};
