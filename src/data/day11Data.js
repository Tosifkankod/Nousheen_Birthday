// ============================================================================
// DAY 11 DATA: THE FIVE-PAGE HANDWRITTEN LETTER & TWO IMPORTANT QUESTIONS 🤍
// ============================================================================

export const DAY11_LETTER_PAGES = [
  {
    pageNumber: 1,
    title: "Page 1 of 5",
    header: "Nousheen 💜",
    image: "/day11/page1.jpeg",
    fallbackImage: "/images/day11/page1.jpeg",
    accentNote: "“Nousheen, this is the name I've said so many times...”",
    transcript: [
      "Nousheen 💜",
      "Nousheen, this is the name I've said so many times compared to any other name all day long. Nousheen, Nousheen, Nousheen.",
      "I really love writing letters to you like old school.",
      "I love you Nousheen, I love you so much. I know I've probably gotten bored of this word myself. But I can't find another word to describe my love for you. May be I annoy you so much with this, but I don't care because I love you.",
      "You're “Mine”, my Wifey, My Habibti."
    ],
    get paragraphs() { return this.transcript; }
  },
  {
    pageNumber: 2,
    title: "Page 2 of 5",
    header: "Last Night...",
    image: "/day11/page2.jpeg",
    fallbackImage: "/images/day11/page2.jpeg",
    accentNote: "“Keep smiling, bachaa...”",
    transcript: [
      "Last night, the way you talked to me, I was just adoring you so much. Keep smiling, bachaa. And the message you sent me, I literally cried. Sorry I'm a little bit emotional! I don't know why.",
      "I love talking to you. And it doesn't matter how you look or what your past is. I don't literally care about any of that. But obviously, your past has had some effect on your life, and that's justified. (Yeah, I know a little bit more about it).",
      "And I'm really sorry that I don't make you blindly trust me. It was my bad, wallahi. But I'll try my best."
    ],
    get paragraphs() { return this.transcript; }
  },
  {
    pageNumber: 3,
    title: "Page 3 of 5",
    header: "Mera Bachaa 💜",
    image: "/day11/page3.jpeg",
    fallbackImage: "/images/day11/page3.jpeg",
    accentNote: "“For you, I have got a lot of Sabr...”",
    transcript: [
      "Yeah sometimes I start thinking, like how did I get so obsessed with you? But I don't care in the end because I enjoy it, and I am happy 😊 💜",
      "Mera bachaa, it will be so difficult for you, I know. I know in the beginning I used to feel sad, and you told me, “I am always with you”, and you really are. Because of you, I've gained so much confidence & strength. I love you. 💜",
      "“Hath dukh gaya likhte likhte 😅” 💜",
      "And I want you to do the same, yes. I guess it will take some time for you to trust me, and I'll wait. For you, I have got a lot of Sabr. You are my habibti, bachaa."
    ],
    get paragraphs() { return this.transcript; }
  },
  {
    pageNumber: 4,
    title: "Page 4 of 5",
    header: "Dua & Our Future",
    image: "/day11/page4.jpeg",
    fallbackImage: "/images/day11/page4.jpeg",
    accentNote: "“It will be totally worth it...”",
    transcript: [
      "I know you've gone through a lot of problems over the past few months, and you don't talk openly to anyone except me. That shows me that you have a little bit of trust in me, and I am good to go with that.",
      "And I'll make Dua that my love for you never changes. And it won't, wallahi. It will get even stronger, day by day.",
      "And sometimes I think about how after everything we've been through, after all these difficult situations, when we finally get married and I hug you in front of everyone, it will be totally worth it. We'll laugh about how we managed to get through everything."
    ],
    get paragraphs() { return this.transcript; }
  },
  {
    pageNumber: 5,
    title: "Page 5 of 5",
    header: "When I Finally Hug You",
    image: "/day11/page5.jpeg",
    fallbackImage: "/images/day11/page5.jpeg",
    accentNote: "“Suno ek baat aur: I Love U 😊”",
    transcript: [
      "Just thinking about it makes me so excited, and then our journey begins. 💜",
      "And I know your moods change, and I'm really ready to deal with them. Nousheen just stay strong, stay strong. Just imagine, after all of these when I finally get to hug you in real life, how will it feel? 💜",
      "With that I'll end, fir bologe, “Kitna pakata hai ye aadmi” 😅",
      "Nousheen, suno ek baat aur, which is very important: “I Love U” lol 😊",
      "♡ Tosif & Nousheen ♡"
    ],
    get paragraphs() { return this.transcript; }
  }
];

export const DAY11_QUESTIONS = {
  mainHeading: "Before you close our little book, bachaa… I have two things to ask you.",
  part1: {
    badge: "PART 1",
    heading: "Tell me the promises you want from me.",
    message: [
      "Nousheen, my bachaa, I know that love isn't only about the promises I make. It's also about the things you need from me, the way you want to be loved, and the things that make you feel safe and happy.",
      "So tell me, meri jaan. What promises do you want from me? What do you expect from me as your future husband? Is there anything you want me to do, understand, change, or always remember?",
      "I want to hear it from you."
    ],
    placeholder: "Write all the promises you want from me here, bachaa…",
    subNote: "I'll read every word carefully.",
    promiseHighlight: "And remember, Nousheen… I'm a man of my words.",
    signature: "— Your Tosif 🤍"
  },
  part2: {
    badge: "PART 2 · COMPULSORY",
    heading: "Send something compulsory",
    message: [],
    placeholder: "Write something here, bachaa… 🤍",
    validationError: "Bachaa, please write something here. It's compulsory. 🤍"
  },
  completion: {
    savedConfirmation: "Your words have a place in our little book now, bachaa.",
    trustMessage: "Thank you for trusting me with your thoughts, Nousheen.",
    openHeartMessage: "I'll read your words with an open heart, meri jaan.",
    completeTitle: "DAY 11 COMPLETE 🤍"
  }
};
