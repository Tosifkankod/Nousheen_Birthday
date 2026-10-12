// ============================================================================
// DAY 12 DATA: TOSIF'S HEARTFELT MESSAGE & "A THOUSAND YEARS" FOR NOUSHEEN 🤍
// ============================================================================

export const DAY12_DATA = {
  // Video sources to check (in order of priority - textmatchcut first)
  videoSources: [
    '/videos/textmatchcut.mp4',
    '/videos/textmatchcut',
    '/videos/day12.mp4',
    '/images/day9/tosif_portrait.mp4'
  ],

  // Tosif's exact message
  message: {
    heading: "From My Heart, Nousheen 🤍",
    paragraphs: [
      "Sorry Nousheen If I hurted you by any means, I love u a lot. and sorry I dont have any thing special today beacuse whatever happened yesterday because of that my mind is not working because I have't slept and eaten anything excel some banana and 2 eggs.",
      "nousheen keep this in mind I loved u and u also know that clearly and I'll not betray u by bacha.",
      "I love u and there's one song that I wanna dedicate to you that I love a lot. I love you thousand years I love you for a thousand more.",
      "I love this song I wanna dedicate it to you, please listen it fully"
    ],
    songDedicationPrompt: "I love this song I wanna dedicate it to you, please listen it fully 🤍"
  },

  // The ONE dedicated song: A Thousand Years by Christina Perri
  // Timestamps perfectly aligned with vocals starting at 00:26.5
  song: {
    id: 'a-thousand-years',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    url: '/music/thousandyears.mp3',
    fallbackUrl: '/music/a-thousand-years.mp3',
    lyrics: [
      { time: 0.0, text: "♪ (Piano plays softly...) ♪" },
      { time: 26.5, text: "Heart beats fast..." },
      { time: 30.2, text: "Colors and promises" },
      { time: 34.8, text: "How to be brave?" },
      { time: 37.5, text: "How can I love when I'm afraid to fall?" },
      { time: 44.8, text: "But watching you stand alone..." },
      { time: 49.5, text: "All of my doubt suddenly goes away somehow" },
      { time: 59.2, text: "One step closer..." },
      { time: 66.8, text: "I have died everyday waiting for you" },
      { time: 71.8, text: "Darling, don't be afraid I have loved you" },
      { time: 76.8, text: "For a thousand years" },
      { time: 81.8, text: "I'll love you for a thousand more 🤍" },
      { time: 89.0, text: "And all along I believed I would find you" },
      { time: 94.5, text: "Time has brought your heart to me" },
      { time: 99.2, text: "I have loved you for a thousand years" },
      { time: 104.5, text: "I'll love you for a thousand more 🤍" },
      { time: 113.8, text: "One step closer..." },
      { time: 119.5, text: "One step closer..." },
      { time: 126.8, text: "I have died everyday waiting for you" },
      { time: 131.8, text: "Darling, don't be afraid I have loved you" },
      { time: 136.8, text: "For a thousand years" },
      { time: 141.8, text: "I'll love you for a thousand more 🤍" },
      { time: 148.5, text: "I have loved you for a thousand years..." },
      { time: 154.5, text: "I'll love you for a thousand more 🤍" },
      { time: 160.0, text: "♪ (Music gently fades away...) ♪" }
    ]
  },

  // Question / Input tag at the end
  inputSection: {
    heading: "Do you wanna say something? Please go ahead.",
    placeholder: "Write whatever is on your mind or in your heart, Nousheen… I'm listening. 🤍",
    buttonText: "SEND TO TOSIF 🤍",
    confirmation: "Your words have been sent to Tosif, bachaa. Thank you for listening to my heart. 🤍"
  }
};
