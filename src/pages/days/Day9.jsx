import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DayNav from '../../components/DayNav';
import ScratchCard from '../../components/ScratchCard';
import { saveResponse } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';

// ============================================================================
// MEDIA CONFIGURATION FOR DAY 09
// Matches files placed directly in `public/images/day9/` and `public/videos/day9/`
// ============================================================================
export const DAY9_MEDIA = {
  // Scratch card double photo (Memory 01)
  scratchPhoto1: '/images/day9/photo1_hijab1.jpg',
  scratchPhoto2: '/images/day9/photo1_hijab2.jpg',

  // Memory 02: Her Hair (Video 2)
  memoryHairVideo: '/images/day9/video2_hair.mp4',

  // Memory 03: Her & the Cat (Video 3)
  memoryCatVideo: '/images/day9/video_cat.mp4',

  // Memory 04: Her Beautiful Eyes in Hijab (Photo)
  memoryEyesPhoto: '/images/day9/photo4_eyes.jpg',

  // Memory 05: Her Smile (Video 5)
  memorySmileVideo: '/images/day9/video_smile.mp4',

  // Memory 06: My Person, My World (Separate Video 6)
  memoryIntimateVideo: '/images/day9/video6_intimate.mp4',

  // Bold Branch Scene 1: Tosif's Portrait Video
  tosifPortrait: '/videos/day9/tosif_portrait.mp4',
};

// ============================================================================
// SCRAPBOOK MEMORIES CONTENT DATA
// ============================================================================
const MEMORIES = [
  {
    id: 'memory-02-hair',
    memoryNumber: '02',
    title: 'HER HAIR',
    type: 'video',
    src: DAY9_MEDIA.memoryHairVideo,
    caption: 'My pretty girl ♡',
    noteTop: 'Memory 02 • October 09',
    letter:
      'Achha meri jaan, ab tumhe aise dekhoon toh kya hi bolun? 😭❤️ You look so beautiful, bachaa. Sometimes I genuinely don\'t know how you manage to look this pretty without even trying. I could look at this picture a hundred times and still smile like an idiot. There\'s something so naturally beautiful about you that I can\'t explain it. And the funniest part? You probably look at yourself and don\'t even realise what I see. Meri gori pari, I wish you could borrow my eyes for just one minute and see yourself the way I see you.',
    endNote: 'How are you even real, bachaa? 😭',
    rotation: -2.5,
    tapeColor: 'rgba(232, 195, 125, 0.45)',
  },
  {
    id: 'memory-03-cat',
    memoryNumber: '03',
    title: 'HER & THE CAT',
    type: 'video',
    src: DAY9_MEDIA.memoryCatVideo,
    caption: 'Excuse me, who\'s that? 👀',
    noteTop: 'Memory 03 • Caught on Camera',
    letter:
      'NOUSHEEN. 😭😂 Bachaa, mujhe ek baat samjhao... tumhare paas mere liye itna pyaar hai, phir yeh cat beech mein kahan se aa gayi? Main yahan tumhe miss kar raha hoon aur tum cats ke saath quality time spend kar rahi ho? 😂 Meri jaan, main toh itna jealous ho jaunga ki billi ko bhi lagega ki usne kya galti kar di. I swear, I can\'t even bear a cat being this close to you. 😭😂 Fine, you can love the cat too... but remember, your pagal Tosif is going to demand extra attention after this.',
    hasCatSticker: true,
    rotation: 2.2,
    tapeColor: 'rgba(242, 141, 121, 0.45)',
  },
  {
    id: 'memory-04-eyes',
    memoryNumber: '04',
    title: 'THOSE EYES IN HIJAB',
    type: 'photo',
    src: DAY9_MEDIA.memoryEyesPhoto,
    caption: 'Those eyes, my noor.',
    noteTop: 'Memory 04 • The Light in Your Eyes',
    letter:
      'Nousheen, your eyes, yaar... ❤️ I don\'t even know how to explain what they do to me. They\'re so beautiful, so deep, and so full of expression. Sometimes I feel like your eyes say things that you don\'t even have to put into words. I could be having the most stressful day, and just seeing your eyes would make me stop for a moment and smile. And those deep, dark eyes of yours? Bachaa, I think I\'ve already fallen into them, and honestly, I don\'t want to find my way out. You have no idea how much I love looking at you. Meri jaan, you are genuinely my favourite sight in this world.',
    highlightLine: 'I fall for you a little more every time I see you.',
    rotation: -1.8,
    tapeColor: 'rgba(201, 169, 110, 0.45)',
  },
  {
    id: 'memory-05-smile',
    memoryNumber: '05',
    title: 'HER SMILE',
    type: 'video',
    src: DAY9_MEDIA.memorySmileVideo,
    caption: 'The smile I\'d choose in every lifetime.',
    noteTop: 'Memory 05 • Pure Joy',
    letter:
      'Mera bachaaaa, just look at that smile. 🥹❤️ Do you even understand what happens to me when I see you smiling like this? Your smile is genuinely one of my favourite things in this entire world. I want to be someone who gives you more reasons to smile, someone who stands beside you when you\'re tired, someone who makes you laugh even when your day has been terrible. I want to work hard, grow, build a beautiful life, and do everything I reasonably can to see that smile on your face. And look at you, meri jaan... that noor on your face. You\'re so, so beautiful. I wish you could see how special you are to me.',
    highlightLine: 'If happiness had a face in my world, it would look a little like you.',
    rotation: 1.5,
    tapeColor: 'rgba(235, 178, 90, 0.45)',
  },
  {
    id: 'memory-06-smile-intimate',
    memoryNumber: '06',
    title: 'MY PERSON, MY WORLD',
    type: 'video',
    src: DAY9_MEDIA.memoryIntimateVideo,
    caption: 'My person. My world. My bachaa.',
    noteTop: 'Memory 06 • A Lifetime Together',
    isDeepMood: true,
    letter:
      'Nousheen, I cannot afford to lose you, bachaa. You have become such an important part of my life that I honestly don\'t know how to explain it properly. You mean everything to me. And listen, you owe me a lifetime of unlimited hugs and kisses that I want to give you, okay? 😭❤️ I love the way you talk, the way you express yourself, the little things you say, and the way even an ordinary conversation with you can make my whole day better. You are my world, meri jaan. Jisko main sajana chahta hoon, jiske saath main apni poori zindagi banana chahta hoon. And those deep, dark eyes of yours... bachaa, I have fallen so deeply for you that sometimes I just sit there smiling while thinking about you.',
    highlightLine: 'I don\'t just want to look at your pictures. One day, I want to look beside me and find you there.',
    rotation: -1.2,
    tapeColor: 'rgba(214, 158, 84, 0.55)',
  },
];

// ============================================================================
// 100 CUTE ROMANCE MOMENTS (ENGLISH TRANSLATION & CURATED EXTENSIONS)
// ============================================================================
export const CUTE_ROMANCE_100 = [
  { id: 1, text: "Getting lost in your deep, dark eyes every single time you look at me.", icon: "👀" },
  { id: 2, text: "Kissing everywhere on your face: your eyes, your nose, your cheeks, your lips, your forehead, and every single inch of your face.", icon: "💋" },
  { id: 3, text: "Cuddling with you under the warm bedsheet while the whole world outside is quiet.", icon: "🫂" },
  { id: 4, text: "Applying mehendi (henna) delicately on your soft hands with all my patience and care.", icon: "🌿" },
  { id: 5, text: "Giving you a gentle, soothing head and hair massage after a long and tiring day.", icon: "💆‍♀️" },
  { id: 6, text: "Doing your makeup lovingly and making goofy faces together in the mirror.", icon: "💄" },
  { id: 7, text: "Gently placing a fresh, fragrant gajra (jasmine flower garland) into your beautiful hair.", icon: "🌸" },
  { id: 8, text: "Sliding glass bangles onto your wrists, hearing them jingle as you smile shyly.", icon: "✨" },
  { id: 9, text: "Lifting you up in my arms like my baby and spinning you around.", icon: "🧸" },
  { id: 10, text: "Drinking warm chai together in the quiet mornings and rainy evenings.", icon: "☕" },
  { id: 11, text: "Cooking delicious meals together in the kitchen, feeding you warm test bites.", icon: "🍳" },
  { id: 12, text: "Feeding each other with our own hands, bite by bite, with all our love.", icon: "🍲" },
  { id: 13, text: "Playing games together and dramatically teasing whoever loses.", icon: "🎮" },
  { id: 14, text: "Chatting late into the night about the most random nonsense until we fall asleep.", icon: "💬" },
  { id: 15, text: "Affectionately annoying and bothering you just to see your adorable dramatic reactions.", icon: "😜" },
  { id: 16, text: "Taking hundreds of candid photos and secret videos of you when you least expect it.", icon: "📸" },
  { id: 17, text: "Leaving little handwritten love letters for you in random places to discover.", icon: "💌" },
  { id: 18, text: "Surprising you with fresh flowers often, just because you exist in my world.", icon: "💐" },
  { id: 19, text: "Slow dancing with you anywhere and everywhere, even without any music playing.", icon: "💃" },
  { id: 20, text: "Giving you gentle shoulder and back massages when you are exhausted.", icon: "🕯️" },
  { id: 21, text: "Planning spontaneous romantic dates often just to take you somewhere magical.", icon: "🌙" },
  { id: 22, text: "Holding your hand tightly in public so everyone knows you are mine.", icon: "🤝" },
  { id: 23, text: "Wrapping you inside my oversized hoodie when you feel a little chilly.", icon: "🧥" },
  { id: 24, text: "Whispering 'I love you, my bachaa' in your ear when you are least expecting it.", icon: "👂" },
  { id: 25, text: "Resting my chin on your head or shoulder while watching you do something you love.", icon: "🥰" },
  { id: 26, text: "Running my fingers gently through your soft hair while you rest against my chest.", icon: "✨" },
  { id: 27, text: "Calling you silly cute nicknames until you laugh and tell me to stop.", icon: "🤭" },
  { id: 28, text: "Gazing at the night sky together, dreaming about our future home and family.", icon: "🌌" },
  { id: 29, text: "Making you hot soup or chocolate when you are feeling under the weather.", icon: "🍵" },
  { id: 30, text: "Stealing quiet glances at you across a crowded room and winking when you notice.", icon: "😉" },
  { id: 31, text: "Hugging you from behind while you are busy getting ready or cooking.", icon: "🫂" },
  { id: 32, text: "Waking up early just to make your morning tea and breakfast in bed.", icon: "🥞" },
  { id: 33, text: "Listening to you rant about your day with full attention while gently stroking your hand.", icon: "👂" },
  { id: 34, text: "Defending you and standing fiercely beside you no matter what the world says.", icon: "🛡️" },
  { id: 35, text: "Matching our outfits on special days just to look ridiculously cute together.", icon: "👗" },
  { id: 36, text: "Singing your favourite romantic songs just for you, even if my voice is terrible.", icon: "🎶" },
  { id: 37, text: "Wrapping you in a warm fluffy towel after you wash your hair and drying it gently.", icon: "🧖‍♀️" },
  { id: 38, text: "Sharing ice cream from the same cup and playfully fighting over the last spoonful.", icon: "🍦" },
  { id: 39, text: "Taking late-night quiet car rides with windows rolled down and soft music playing.", icon: "🚗" },
  { id: 40, text: "Holding you tightly when you get scared during a thunderstorm or a scary movie.", icon: "⚡" },
  { id: 41, text: "Ironing your favourite clothes so you feel pampered, cared for, and special.", icon: "👔" },
  { id: 42, text: "Bringing your favourite snacks and chocolates home without you ever having to ask.", icon: "🍫" },
  { id: 43, text: "Kissing the palm of your hand before letting it go.", icon: "🤲" },
  { id: 44, text: "Brushing your hair gently while you sit comfortably in front of me.", icon: "🪮" },
  { id: 45, text: "Keeping a sacred scrapbook of every ticket, receipt, and wrapper from our dates.", icon: "📖" },
  { id: 46, text: "Giving you a piggyback ride when your feet hurt after shopping or walking.", icon: "🎒" },
  { id: 47, text: "Sending you sweet 'Good morning, my noor' voice notes before you open your eyes.", icon: "🎙️" },
  { id: 48, text: "Buying you sweet little gifts just because they instantly reminded me of you.", icon: "🎁" },
  { id: 49, text: "Tickling you until you are breathless and laughing uncontrollably.", icon: "😆" },
  { id: 50, text: "Praying Salah together side-by-side and making sincere dua for our eternal happiness.", icon: "🤲" },
  { id: 51, text: "Letting you win playful arguments just to see that victorious, radiant smile on your face.", icon: "🏆" },
  { id: 52, text: "Pulling you close under one small umbrella while walking in the pouring rain.", icon: "☔" },
  { id: 53, text: "Taking goofy selfies making funny faces that only the two of us will ever see.", icon: "🤳" },
  { id: 54, text: "Holding you in my arms until your breathing slows down and you fall asleep safely.", icon: "🌙" },
  { id: 55, text: "Remembering every tiny detail, habit, and preference you have ever mentioned.", icon: "🧠" },
  { id: 56, text: "Sitting by the window watching raindrops race while sipping hot tea together.", icon: "🌧️" },
  { id: 57, text: "Kissing the top of your forehead every single time we say hello or goodbye.", icon: "🤍" },
  { id: 58, text: "Talking in silly, playful baby voices when we are alone in our own little world.", icon: "🧸" },
  { id: 59, text: "Helping you choose your outfits and telling you how breathtakingly gorgeous you look.", icon: "👑" },
  { id: 60, text: "Giving you soft butterfly kisses on your eyelashes and cheeks.", icon: "🦋" },
  { id: 61, text: "Reading books or romantic poetry out loud to you until you drift off to sleep.", icon: "📚" },
  { id: 62, text: "Sneaking a sweet, stolen kiss when nobody else is looking.", icon: "🤫" },
  { id: 63, text: "Buying matching rings or bracelets that we keep on ourselves forever.", icon: "💍" },
  { id: 64, text: "Holding your cold feet between my warm hands to warm them up on winter nights.", icon: "❄️" },
  { id: 65, text: "Reminding you every single morning how deeply proud I am of who you are.", icon: "🌟" },
  { id: 66, text: "Going on long peaceful walks holding hands without needing to say a single word.", icon: "🚶‍♂️" },
  { id: 67, text: "Building a cozy blanket fort in the living room and binge-watching movies inside.", icon: "🎪" },
  { id: 68, text: "Doing silly impromptu dance routines in the kitchen while waiting for water to boil.", icon: "💃" },
  { id: 69, text: "Helping you pick out the prettiest hijab colours that make your face glow with noor.", icon: "🧕" },
  { id: 70, text: "Letting you fall asleep peacefully on my lap during long road trips.", icon: "🛣️" },
  { id: 71, text: "Looking at you with pure adoration when you are talking passionately about something.", icon: "😍" },
  { id: 72, text: "Tucking you in with an extra warm blanket when the night turns cold.", icon: "🛏️" },
  { id: 73, text: "Making silly jokes when you are stressed just to see your dimples pop out.", icon: "😄" },
  { id: 74, text: "Taking you to sunset viewpoints to watch the golden light reflect in your eyes.", icon: "🌅" },
  { id: 75, text: "Cleaning the room and making everything smell cozy before you arrive.", icon: "🕯️" },
  { id: 76, text: "Always walking on the roadside of the street to keep you safe on the sidewalk.", icon: "🚶‍♀️" },
  { id: 77, text: "Celebrating every tiny milestone, monthly anniversary, and memory of our journey.", icon: "🎉" },
  { id: 78, text: "Gently wiping away your tears and reminding you that you will never be alone in this world.", icon: "💧" },
  { id: 79, text: "Creating secret inside jokes that make us burst out laughing in public places.", icon: "🤣" },
  { id: 80, text: "Taking you to quiet aesthetic cafes and feeding you warm pastries and cake.", icon: "🍰" },
  { id: 81, text: "Holding you tight and taking deep breaths of your sweet, comforting fragrance.", icon: "🌸" },
  { id: 82, text: "Writing sweet little notes on yellow sticky pads and sticking them on your mirror.", icon: "📝" },
  { id: 83, text: "Bragging to the world about how lucky and blessed I am to have you as my girl.", icon: "💫" },
  { id: 84, text: "Giving you gentle back scratches until you melt into pure, relaxed comfort.", icon: "💆" },
  { id: 85, text: "Baking homemade desserts together and laughing at the funny mess we make.", icon: "🧁" },
  { id: 86, text: "Kissing the tip of your cute little nose whenever you start pouting.", icon: "👃" },
  { id: 87, text: "Carrying all your heavy shopping bags so your hands stay free to hold mine.", icon: "🛍️" },
  { id: 88, text: "Watching romantic films wrapped under one cozy blanket with warm popcorn.", icon: "🍿" },
  { id: 89, text: "Checking in on you during hectic days just to hear your soothing, sweet voice.", icon: "📞" },
  { id: 90, text: "Playing your favourite playlist in the car whenever we go for drives.", icon: "🎵" },
  { id: 91, text: "Hugging you so tightly that you can literally feel my heart racing for you.", icon: "💓" },
  { id: 92, text: "Making you laugh so hard that your stomach hurts and happy tears come out.", icon: "😂" },
  { id: 93, text: "Whispering romantic secrets into your ear with a soft, mischievous smile.", icon: "🤫" },
  { id: 94, text: "Holding you close in the middle of a crowded room like nobody else exists.", icon: "🌆" },
  { id: 95, text: "Gently wiping sauce or ice cream from your chin with my thumb and smiling.", icon: "🍦" },
  { id: 96, text: "Promising you my loyalty, effort, honesty, and protection every single day of our lives.", icon: "💎" },
  { id: 97, text: "Making sincere dua for your health, your peace, your family, and your eternal smile.", icon: "🤲" },
  { id: 98, text: "Kissing your eyes because they reflect my entire world and my whole future.", icon: "👁️" },
  { id: 99, text: "Growing old together, wrinkly and gray, still holding hands and flirting like teenagers.", icon: "👵🧓" },
  { id: 100, text: "Loving you in this life, in every single breath, and dreaming of Jannah together. ❤️", icon: "♾️" },
];

export default function Day9() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const id = getOrCreateSessionId(9);
    setSessionId(id);
  }, []);
  const navigate = useNavigate();

  // Experience Phases:
  // 1. 'intro': Black screen opening lines
  // 2. 'scratch': Interactive black scratch paper for Memory 01
  // 3. 'scrapbook': Sequential Instax pages (Memories 2-6 with scratch layers)
  // 4. 'closing': Scrapbook closes, heartfelt black-screen message
  // 5. 'chat': Animated WhatsApp conversation & Cute/Bold choice
  // 6. 'bold-flow': Full 5-Scene Bold confession continuation
  const [phase, setPhase] = useState('intro');

  // Intro line sequence
  const [introStep, setIntroStep] = useState(0);

  // Scratch card state for Memory 01
  const [isScratch1Complete, setIsScratch1Complete] = useState(false);

  // Scrapbook memory page (0 to 4 => Memory 2 to Memory 6)
  const [currentMemoryIdx, setCurrentMemoryIdx] = useState(0);

  // Cat sticker poll choice
  const [catChoice, setCatChoice] = useState(() => {
    try {
      return localStorage.getItem('day9_cat_choice') || null;
    } catch {
      return null;
    }
  });

  // Closing lines step
  const [closingStep, setClosingStep] = useState(0);

  // Chat sequence state
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [choiceInput, setChoiceInput] = useState('');
  const [choiceError, setChoiceError] = useState('');
  const [savedChoice, setSavedChoice] = useState(() => {
    try {
      return localStorage.getItem('day9_choice') || null;
    } catch {
      return null;
    }
  });

  // Cute Romance 100 reveal state
  const [revealedCuteCount, setRevealedCuteCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem('day9_cute_revealed_count') || '1', 10);
    } catch {
      return 1;
    }
  });
  const [cuteViewMode, setCuteViewMode] = useState('spotlight'); // 'spotlight' or 'list'

  const handleRevealNextCute = () => {
    setRevealedCuteCount((prev) => {
      const next = Math.min(prev + 1, 100);
      try {
        localStorage.setItem('day9_cute_revealed_count', String(next));
      } catch {}
      return next;
    });
  };

  const handleReveal10Cute = () => {
    setRevealedCuteCount((prev) => {
      const next = Math.min(prev + 10, 100);
      try {
        localStorage.setItem('day9_cute_revealed_count', String(next));
      } catch {}
      return next;
    });
  };

  const handleRevealAllCute = () => {
    setRevealedCuteCount(100);
    try {
      localStorage.setItem('day9_cute_revealed_count', '100');
    } catch {}
  };

  // ==========================================================================
  // BOLD BRANCH CONTINUATION STATE (SCENES 1 TO 5)
  // ==========================================================================
  // boldScene:
  // 1: Tosif's Photo & Level Up
  // 2: "Woh Wala" chat meaning
  // 3: Romantic Future Moments (1 to 5)
  // 4: Important Check-in
  // 5: Final Sacred Confession
  const [boldScene, setBoldScene] = useState(1);
  const [boldScene1TextStep, setBoldScene1TextStep] = useState(0);
  const [boldScene2ChatStep, setBoldScene2ChatStep] = useState(0);
  const [boldScene2Typing, setBoldScene2Typing] = useState(false);
  const [boldMomentIdx, setBoldMomentIdx] = useState(1); // 1 to 5
  const [boldFallbackCute, setBoldFallbackCute] = useState(false);
  const [boldScene5Step, setBoldScene5Step] = useState(0);

  const [dayCompleted, setDayCompleted] = useState(() => {
    try {
      return localStorage.getItem('day9_completed') === 'true';
    } catch {
      return false;
    }
  });

  // Nousheen End Note State
  const [nousheenNote, setNousheenNote] = useState(() => {
    try {
      return localStorage.getItem('day9_nousheen_note') || '';
    } catch {
      return '';
    }
  });
  const [isNoteSaved, setIsNoteSaved] = useState(() => {
    try {
      return !!localStorage.getItem('day9_nousheen_note');
    } catch {
      return false;
    }
  });

  const handleSaveNote = () => {
    if (!nousheenNote.trim()) return;
    try {
      localStorage.setItem('day9_nousheen_note', nousheenNote);
    } catch {}
    setIsNoteSaved(true);

    saveResponse({
      sessionId: sessionId || getOrCreateSessionId(9),
      day: 9,
      questionId: 'day9_nousheen_end_note',
      question: "Nousheen's Final Note to Tosif (Day 9)",
      optionId: 'end_note',
      answer: nousheenNote,
      customText: nousheenNote,
    });
  };

  // --------------------------------------------------------------------------
  // Phase 1: Intro lines timing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'intro') return;
    const timers = [
      setTimeout(() => setIntroStep(1), 800),   // "DAY 09"
      setTimeout(() => setIntroStep(2), 2200),  // "Nousheen..."
      setTimeout(() => setIntroStep(3), 3800),  // "Today, I don't want to give you..."
      setTimeout(() => setIntroStep(4), 5600),  // "I want to show you something..."
      setTimeout(() => setIntroStep(5), 7600),  // "Something that makes my heart..."
      setTimeout(() => setIntroStep(6), 9600),  // "Today, you're the memory."
      setTimeout(() => setIntroStep(7), 11200), // Show "OPEN YOUR SCRAPBOOK ♡"
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // --------------------------------------------------------------------------
  // Phase 4: Closing lines timing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'closing') return;
    const timers = [
      setTimeout(() => setClosingStep(1), 1200),
      setTimeout(() => setClosingStep(2), 2600),
      setTimeout(() => setClosingStep(3), 4200),
      setTimeout(() => setClosingStep(4), 6000),
      setTimeout(() => setClosingStep(5), 7800),
      setTimeout(() => setClosingStep(6), 9800),
      setTimeout(() => setClosingStep(7), 12000),
      setTimeout(() => setClosingStep(8), 14200),
      setTimeout(() => setClosingStep(9), 16400),
      setTimeout(() => setClosingStep(10), 18600),
      setTimeout(() => setClosingStep(11), 20600), // Continue to Chat button
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // --------------------------------------------------------------------------
  // Phase 5: Chat animation sequence
  // Dialogue:
  // 1. Nousheen: "App romance feel karne wale wild romance karte yah"
  // 2. Nousheen: "Aisi bass naam ka romance ?"
  // 3. Tosif: "I'll do everything u need"
  // 4. Nousheen: "jaise"
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'chat') return;
    // Message 1 (Nousheen)
    const t1 = setTimeout(() => setChatStep(1), 900);
    // Message 2 (Nousheen)
    const t2 = setTimeout(() => setChatStep(2), 2400);
    // Tosif is typing before Message 3
    const t3 = setTimeout(() => setIsTyping(true), 3800);
    // Message 3 (Tosif)
    const t4 = setTimeout(() => {
      setIsTyping(false);
      setChatStep(3);
    }, 5400);
    // Message 4 (Nousheen)
    const t5 = setTimeout(() => setChatStep(4), 7000);
    // Show Choice section
    const t6 = setTimeout(() => setChatStep(5), 8400);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [phase]);

  // --------------------------------------------------------------------------
  // Bold Branch: Scene 1 text pacing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'bold-flow' || boldScene !== 1) return;
    const timers = [
      setTimeout(() => setBoldScene1TextStep(1), 600),   // "Achha bachaa..."
      setTimeout(() => setBoldScene1TextStep(2), 1800),  // "Ab meri baari. ❤️"
      setTimeout(() => setBoldScene1TextStep(3), 3200),  // "I've shown you how beautiful..."
      setTimeout(() => setBoldScene1TextStep(4), 5000),  // "But there's something I want you to know..."
      setTimeout(() => setBoldScene1TextStep(5), 6800),  // Reveal Photo & letter
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, boldScene]);

  // --------------------------------------------------------------------------
  // Bold Branch: Scene 2 chat pacing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'bold-flow' || boldScene !== 2) return;
    const timers = [
      setTimeout(() => setBoldScene2ChatStep(1), 800),   // "Imagine..."
      setTimeout(() => setBoldScene2ChatStep(2), 2200),  // "woh wala wild romance ?"
      setTimeout(() => setBoldScene2Typing(true), 3600), // Typing dots
      setTimeout(() => {
        setBoldScene2Typing(false);
        setBoldScene2ChatStep(3);                        // "Yes, woh wala."
      }, 4800),
      setTimeout(() => setBoldScene2ChatStep(4), 6200),  // Explanation & Reflection
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, boldScene]);

  // --------------------------------------------------------------------------
  // Bold Branch: Scene 5 final confession lines pacing
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'bold-flow' || boldScene !== 5) return;
    const timers = [
      setTimeout(() => setBoldScene5Step(1), 1000),  // "Nousheen..."
      setTimeout(() => setBoldScene5Step(2), 2400),  // "I really, really, really love you."
      setTimeout(() => setBoldScene5Step(3), 4000),  // "I'm not kidding, meri jaan."
      setTimeout(() => setBoldScene5Step(4), 5800),  // "I want to see you happy..."
      setTimeout(() => setBoldScene5Step(5), 8200),  // "I dream about holding you close..."
      setTimeout(() => setBoldScene5Step(6), 10600), // "You're not just someone I want to romance."
      setTimeout(() => setBoldScene5Step(7), 12800), // "You're someone I want to understand..."
      setTimeout(() => setBoldScene5Step(8), 15000), // "I want to give you my affection..."
      setTimeout(() => setBoldScene5Step(9), 17400), // "You're my world, meri Nousheen..."
      setTimeout(() => setBoldScene5Step(10), 19800),// "Allah kare..."
      setTimeout(() => setBoldScene5Step(11), 22200),// Final Button
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, boldScene]);

  // Handle Cat Choice Selection
  const handleCatChoice = (choice) => {
    setCatChoice(choice);
    try {
      localStorage.setItem('day9_cat_choice', choice);
    } catch {}
    saveResponse({
      sessionId: sessionId || getOrCreateSessionId(9),
      day: 9,
      questionId: 'day9_cat_choice',
      question: 'Chat Category Selection',
      optionId: choice,
      answer: choice === 'bold' ? 'Bold Romance' : 'Cute Romance',
    });
  };

  // Handle Cute vs Bold Form Submission
  const handleChoiceSubmit = (e) => {
    e.preventDefault();
    const clean = choiceInput.trim().toLowerCase();

    if (clean === 'cute') {
      setChoiceError('');
      setSavedChoice('cute');
      setPhase('cute-flow');
      try {
        localStorage.setItem('day9_choice', 'cute');
      } catch {}
      saveResponse({
        sessionId: sessionId || getOrCreateSessionId(9),
        day: 9,
        questionId: 'day9_branch_choice',
        question: 'Typed Choice: Cute vs Bold',
        optionId: 'cute',
        answer: 'Cute (100 Cute Moments)',
        customText: choiceInput,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (clean === 'bold') {
      setChoiceError('');
      setSavedChoice('bold');
      try {
        localStorage.setItem('day9_choice', 'bold');
      } catch {}
      saveResponse({
        sessionId: sessionId || getOrCreateSessionId(9),
        day: 9,
        questionId: 'day9_branch_choice',
        question: 'Typed Choice: Cute vs Bold',
        optionId: 'bold',
        answer: 'Bold (The Wild Romance Flow)',
        customText: choiceInput,
      });
    } else {
      setChoiceError('Please type either "Cute" or "Bold", meri jaan ❤️');
      saveResponse({
        sessionId: sessionId || getOrCreateSessionId(9),
        day: 9,
        questionId: 'day9_branch_choice_invalid_attempt',
        question: 'Typed Other Text in Cute/Bold Prompt',
        optionId: 'custom_input',
        answer: choiceInput,
        customText: choiceInput,
      });
    }
  };

  const handleMarkComplete = () => {
    setDayCompleted(true);
    try {
      localStorage.setItem('day9_completed', 'true');
    } catch {}
    saveResponse({
      sessionId: sessionId || getOrCreateSessionId(9),
      day: 9,
      questionId: 'day9_status',
      question: 'Day 9 Completion',
      optionId: 'completed',
      answer: 'Completed Day 09',
    });
  };

  return (
    <div
      className="page day-9-scrapbook"
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: phase === 'intro' || phase === 'closing' ? '#000000' : '#0a0807',
        color: '#f5f0eb',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: phase === 'intro' ? '2rem' : 'max(4.5rem, calc(env(safe-area-inset-top) + 3rem))',
        paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))',
        paddingLeft: 'max(1rem, calc(env(safe-area-inset-left) + 0.5rem))',
        paddingRight: 'max(1rem, calc(env(safe-area-inset-right) + 0.5rem))',
        transition: 'background-color 1.2s ease',
      }}
    >
      {/* Navigation on top */}
      {phase !== 'intro' && phase !== 'closing' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900 }}>
          <DayNav dayNumber={9} />
        </div>
      )}

      {/* Atmospheric warm candlelight & desk background glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: phase === 'intro' || phase === 'closing' ? 0 : 0.65,
          transition: 'opacity 1.5s ease',
          background:
            'radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.12) 0%, rgba(74, 25, 15, 0.06) 50%, rgba(0, 0, 0, 0.95) 100%)',
        }}
      />

      {/* Subtle Dust & Film Grain */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          backgroundImage:
            'radial-gradient(1px 1px at 30px 40px, rgba(235, 195, 130, 0.25), rgba(0,0,0,0)), radial-gradient(1px 1px at 180px 220px, rgba(255, 255, 255, 0.15), rgba(0,0,0,0)), radial-gradient(1.2px 1.2px at 340px 140px, rgba(201, 169, 110, 0.2), rgba(0,0,0,0))',
          backgroundSize: '320px 320px',
          opacity: 0.5,
        }}
      />

      {/* Main Experience Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* PART 1 — THE OPENING (CINEMATIC BLACK SCREEN) */}
          {/* ================================================================ */}
          {phase === 'intro' && (
            <motion.div
              key="phase-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.4 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.2rem',
              }}
            >
              {introStep >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(235, 195, 130, 0.7)',
                    textTransform: 'uppercase',
                    marginBottom: '2rem',
                  }}
                >
                  DAY 09
                </motion.p>
              )}

              {introStep >= 2 && (
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.8rem, 6vw, 2.6rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    marginBottom: '1.8rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  Nousheen...
                </motion.h1>
              )}

              {introStep >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.05rem, 3.8vw, 1.35rem)',
                    color: 'rgba(245, 240, 235, 0.85)',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    marginBottom: '1rem',
                  }}
                >
                  Today, I don't want to give you something new.
                </motion.p>
              )}

              {introStep >= 4 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.05rem, 3.8vw, 1.35rem)',
                    color: 'rgba(245, 240, 235, 0.85)',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    marginBottom: '1rem',
                  }}
                >
                  I want to show you something you already are...
                </motion.p>
              )}

              {introStep >= 5 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1rem, 3.6vw, 1.25rem)',
                    color: 'rgba(245, 240, 235, 0.7)',
                    fontStyle: 'italic',
                    lineHeight: 1.65,
                    marginBottom: '2rem',
                  }}
                >
                  Something that makes my heart feel things I can't explain properly.
                </motion.p>
              )}

              {introStep >= 6 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.4 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.2rem, 4.2vw, 1.6rem)',
                    color: '#f5c67d',
                    fontStyle: 'italic',
                    marginBottom: '3rem',
                  }}
                >
                  "Today, you're the memory."
                </motion.p>
              )}

              {introStep >= 7 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPhase('scratch')}
                  style={{
                    padding: '0.9rem 2.4rem',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, rgba(232, 195, 125, 0.25) 0%, rgba(201, 169, 110, 0.1) 100%)',
                    border: '1.5px solid rgba(232, 195, 125, 0.5)',
                    color: '#fbe2a8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 0 35px rgba(232, 195, 125, 0.3)',
                  }}
                >
                  OPEN YOUR SCRAPBOOK ♡
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* PART 2 — THE FIRST TWO PHOTOS: THE BLACK SCRATCH PAPER */}
          {/* ================================================================ */}
          {phase === 'scratch' && (
            <motion.div
              key="phase-scratch"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem 0 2rem',
              }}
            >
              {/* Instructions */}
              <div style={{ textAlign: 'center', marginBottom: '1.8rem', maxWidth: '580px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    color: '#e8c37d',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Memory 01 • Secret Reveal
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    lineHeight: 1.35,
                    marginBottom: '0.4rem',
                  }}
                >
                  "There's something underneath this page, bachaa..."
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(0.95rem, 3.2vw, 1.1rem)',
                    color: 'rgba(245, 240, 235, 0.65)',
                    fontStyle: 'italic',
                  }}
                >
                  Use your finger to scratch it away.
                </p>
              </div>

              {/* Combined Memory Scratch Card Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '520px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1b1614 0%, #110d0c 100%)',
                  padding: '16px',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(201, 169, 110, 0.12)',
                  border: '1px solid rgba(232, 195, 125, 0.25)',
                  overflow: 'hidden',
                }}
              >
                {/* Washi Tape Graphic */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-1deg)',
                    width: '110px',
                    height: '24px',
                    background: 'rgba(232, 195, 125, 0.45)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '2px',
                    zIndex: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                />

                <ScratchCard
                  aspectRatio="4 / 3"
                  watermark="✦ Scratch with your finger to reveal ✦"
                  onRevealed={() => setIsScratch1Complete(true)}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#14100e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '8px',
                    }}
                  >
                    {/* Left Photo (Polaroid Style) */}
                    <div
                      style={{
                        flex: 1,
                        height: '100%',
                        background: '#fff',
                        padding: '8px 8px 24px 8px',
                        borderRadius: '8px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                        transform: 'rotate(-2deg)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          background: '#1a1614',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={DAY9_MEDIA.scratchPhoto1}
                          alt="Nousheen in hijab"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>

                    {/* Right Photo (Polaroid Style) */}
                    <div
                      style={{
                        flex: 1,
                        height: '100%',
                        background: '#fff',
                        padding: '8px 8px 24px 8px',
                        borderRadius: '8px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                        transform: 'rotate(2.5deg)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          background: '#1a1614',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={DAY9_MEDIA.scratchPhoto2}
                          alt="Nousheen in hijab"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </div>
                </ScratchCard>
              </div>

              {/* Caption and Letter below revealed photos */}
              <AnimatePresence>
                {isScratch1Complete && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{
                      width: '100%',
                      maxWidth: '580px',
                      textAlign: 'center',
                      marginTop: '1.6rem',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.2rem, 4vw, 1.55rem)',
                        color: '#fbe2a8',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        marginBottom: '1.4rem',
                      }}
                    >
                      "My beautiful girl. My noor. My Nousheen."
                    </p>

                    <div
                      style={{
                        padding: '1.6rem 1.8rem',
                        borderRadius: '16px',
                        background: 'rgba(18, 14, 12, 0.85)',
                        border: '1px solid rgba(232, 195, 125, 0.22)',
                        backdropFilter: 'blur(12px)',
                        textAlign: 'left',
                        marginBottom: '1.6rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(0.95rem, 3.2vw, 1.08rem)',
                          color: 'rgba(245, 240, 235, 0.9)',
                          lineHeight: 1.8,
                          fontWeight: 300,
                        }}
                      >
                        Nousheen, mera bachaaaa... I love you in your hijab. You genuinely look like the most beautiful person in the entire world to me. There's something about seeing you like this that makes my heart feel so peaceful. You're not just someone I love, you're someone whose imaan I want to protect, respect, and grow alongside. I want to be someone who brings you closer to Allah, someone who supports you when life gets difficult, and someone who makes you feel safe enough to be completely yourself. You mean everything to me, literally. Your beauty is one thing, but your heart, your values, and the person you are mean even more to me. Allah has given you a noor that I can't properly explain, meri jaan. If I ever get the chance to call you my wife, I want to spend my life loving you in a way that brings peace to your heart and barakah into our lives.
                      </p>
                    </div>

                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: '#f5c67d',
                        fontStyle: 'italic',
                        marginBottom: '2rem',
                      }}
                    >
                      "And bachaa... this is only the first page. ♡"
                    </p>

                    <button
                      onClick={() => {
                        setPhase('scrapbook');
                        setCurrentMemoryIdx(0);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.8rem 2.2rem',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(232, 176, 104, 0.35)',
                      }}
                    >
                      <span>TURN THE PAGE →</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* PART 3 — THE INSTAX PHOTO SCRAPBOOK (MEMORIES 02 TO 06) */}
          {/* ================================================================ */}
          {phase === 'scrapbook' && (
            <motion.div
              key={`phase-scrapbook-${currentMemoryIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem 0 2rem',
              }}
            >
              {(() => {
                const currentMem = MEMORIES[currentMemoryIdx];
                return (
                  <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Top Page Progress Indicator */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: '1.4rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          letterSpacing: '0.18em',
                          color: '#e8c37d',
                          textTransform: 'uppercase',
                        }}
                      >
                        {currentMem.noteTop}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'rgba(245, 240, 235, 0.45)',
                        }}
                      >
                        Page {currentMemoryIdx + 2} / 6
                      </span>
                    </div>

                    {/* Instax Polaroid Frame Card */}
                    <motion.div
                      initial={{ scale: 0.95, rotate: 0 }}
                      animate={{ scale: 1, rotate: currentMem.rotation }}
                      transition={{ duration: 0.6 }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '420px',
                        background: '#fbf9f5',
                        borderRadius: '12px',
                        padding: '16px 16px 36px 16px',
                        boxShadow: currentMem.isDeepMood
                          ? '0 25px 65px rgba(0,0,0,0.9), 0 0 35px rgba(201, 169, 110, 0.15)'
                          : '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(232, 195, 125, 0.12)',
                        marginBottom: '2rem',
                      }}
                    >
                      {/* Washi Tape on top */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%) rotate(1deg)',
                          width: '95px',
                          height: '22px',
                          background: currentMem.tapeColor,
                          backdropFilter: 'blur(4px)',
                          borderRadius: '2px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          zIndex: 10,
                        }}
                      />

                      <ScratchCard
                        aspectRatio="4 / 5"
                        watermark="✦ Scratch to reveal memory ✦"
                      >
                        {currentMem.type === 'photo' ? (
                          <img
                            src={currentMem.src}
                            alt={currentMem.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
                            <video
                              src={currentMem.src}
                              controls
                              playsInline
                              preload="metadata"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                      </ScratchCard>

                      {/* Handwritten Caption at bottom of Polaroid */}
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          color: '#2a1f1b',
                          textAlign: 'center',
                          marginTop: '16px',
                          marginBottom: '2px',
                          fontStyle: 'italic',
                          fontWeight: 500,
                        }}
                      >
                        {currentMem.caption}
                      </p>
                    </motion.div>

                    {/* Letter & Message Container */}
                    <div
                      style={{
                        width: '100%',
                        padding: '1.8rem 1.8rem',
                        borderRadius: '18px',
                        background: currentMem.isDeepMood
                          ? 'linear-gradient(135deg, rgba(22, 16, 14, 0.95) 0%, rgba(12, 10, 10, 0.98) 100%)'
                          : 'rgba(18, 14, 12, 0.85)',
                        border: '1px solid rgba(232, 195, 125, 0.22)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                        marginBottom: '1.6rem',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(0.98rem, 3.2vw, 1.1rem)',
                          color: 'rgba(245, 240, 235, 0.92)',
                          lineHeight: 1.85,
                          fontWeight: 300,
                        }}
                      >
                        {currentMem.letter}
                      </p>

                      {currentMem.endNote && (
                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.05rem',
                            color: '#f5c67d',
                            fontStyle: 'italic',
                            marginTop: '1.2rem',
                            textAlign: 'right',
                          }}
                        >
                          "{currentMem.endNote}"
                        </p>
                      )}

                      {currentMem.highlightLine && (
                        <div
                          style={{
                            marginTop: '1.4rem',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(232, 195, 125, 0.1)',
                            borderLeft: '3px solid #e8c37d',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.05rem',
                              color: '#fbe2a8',
                              fontStyle: 'italic',
                              margin: 0,
                            }}
                          >
                            "{currentMem.highlightLine}"
                          </p>
                        </div>
                      )}

                      {/* Interactive Cat Attention Sticker (Memory 03) */}
                      {currentMem.hasCatSticker && (
                        <div
                          style={{
                            marginTop: '1.6rem',
                            padding: '1.2rem',
                            borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px dashed rgba(232, 195, 125, 0.35)',
                            textAlign: 'center',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1rem',
                              color: '#fdfbf7',
                              marginBottom: '0.8rem',
                              fontWeight: 500,
                            }}
                          >
                            Who gets more attention? 👀
                          </p>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleCatChoice('tosif')}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '100px',
                                background:
                                  catChoice === 'tosif'
                                    ? 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)'
                                    : 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(232, 195, 125, 0.4)',
                                color: catChoice === 'tosif' ? '#110b06' : '#f5f0eb',
                                fontWeight: catChoice === 'tosif' ? 600 : 400,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              Tosif, obviously ❤️
                            </button>
                            <button
                              onClick={() => handleCatChoice('cat')}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '100px',
                                background:
                                  catChoice === 'cat'
                                    ? 'linear-gradient(135deg, #f28d79 0%, #d46b57 100%)'
                                    : 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(242, 141, 121, 0.4)',
                                color: catChoice === 'cat' ? '#110b06' : '#f5f0eb',
                                fontWeight: catChoice === 'cat' ? 600 : 400,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              The cat... maybe 😂
                            </button>
                          </div>
                          {catChoice && (
                            <p
                              style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '0.82rem',
                                color: '#fbe2a8',
                                marginTop: '0.6rem',
                                fontStyle: 'italic',
                              }}
                            >
                              {catChoice === 'tosif'
                                ? 'Hehehe, good answer bachaa! ❤️'
                                : 'Achaaa?! Billi jeet gayi? I want compensation! 😂❤️'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Page Turn Controls */}
                    <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => {
                          if (currentMemoryIdx > 0) {
                            setCurrentMemoryIdx((prev) => prev - 1);
                          } else {
                            setPhase('scratch');
                          }
                        }}
                        style={{
                          padding: '0.65rem 1.2rem',
                          borderRadius: '100px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'rgba(245, 240, 235, 0.7)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        ← Previous
                      </button>

                      <button
                        onClick={() => {
                          if (currentMemoryIdx < MEMORIES.length - 1) {
                            setCurrentMemoryIdx((prev) => prev + 1);
                          } else {
                            setPhase('closing');
                          }
                        }}
                        style={{
                          padding: '0.65rem 1.6rem',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 20px rgba(232, 176, 104, 0.3)',
                        }}
                      >
                        {currentMemoryIdx === MEMORIES.length - 1 ? 'CLOSE SCRAPBOOK →' : 'Next Page →'}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* PART 4 — THE SCRAPBOOK CLOSES (BLACK SCREEN CONFESSION) */}
          {/* ================================================================ */}
          {phase === 'closing' && (
            <motion.div
              key="phase-closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 1.5 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.2rem',
              }}
            >
              <div style={{ maxWidth: '620px', margin: '0 auto' }}>
                {closingStep >= 1 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.6rem, 5vw, 2.3rem)',
                      color: '#fdfbf7',
                      fontWeight: 400,
                      marginBottom: '1.4rem',
                    }}
                  >
                    Nousheen...
                  </motion.h2>
                )}

                {closingStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.1rem, 3.8vw, 1.4rem)',
                      color: '#fbe2a8',
                      fontStyle: 'italic',
                      marginBottom: '0.8rem',
                    }}
                  >
                    "I really love you."
                  </motion.p>
                )}

                {closingStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.1rem, 3.8vw, 1.4rem)',
                      color: '#f5c67d',
                      fontStyle: 'italic',
                      marginBottom: '0.8rem',
                    }}
                  >
                    "Really, really, really love you."
                  </motion.p>
                )}

                {closingStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.98rem',
                      color: 'rgba(245, 240, 235, 0.7)',
                      marginBottom: '1.8rem',
                    }}
                  >
                    I'm not kidding, bachaa.
                  </motion.p>
                )}

                {closingStep >= 5 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 3.4vw, 1.15rem)',
                      color: 'rgba(245, 240, 235, 0.85)',
                      lineHeight: 1.6,
                      marginBottom: '0.8rem',
                    }}
                  >
                    I want to keep making you happy.
                  </motion.p>
                )}

                {closingStep >= 6 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 3.4vw, 1.15rem)',
                      color: 'rgba(245, 240, 235, 0.85)',
                      lineHeight: 1.6,
                      marginBottom: '0.8rem',
                    }}
                  >
                    I want to keep working on myself, on my future, and on the life I hope we can build together.
                  </motion.p>
                )}

                {closingStep >= 7 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 3.4vw, 1.15rem)',
                      color: 'rgba(245, 240, 235, 0.85)',
                      lineHeight: 1.6,
                      marginBottom: '2rem',
                    }}
                  >
                    I want to be someone who gives you a thousand reasons to smile.
                  </motion.p>
                )}

                {closingStep >= 8 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.1rem, 3.8vw, 1.35rem)',
                      color: '#fdfbf7',
                      fontStyle: 'italic',
                      marginBottom: '1rem',
                    }}
                  >
                    Please don't give up on us easily, meri jaan.
                  </motion.p>
                )}

                {closingStep >= 9 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.05rem, 3.6vw, 1.25rem)',
                      color: 'rgba(245, 240, 235, 0.85)',
                      marginBottom: '1.4rem',
                    }}
                  >
                    I want to keep choosing you, and I hope we keep choosing each other.
                  </motion.p>
                )}

                {closingStep >= 10 && (
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.4 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.3rem, 4.5vw, 1.8rem)',
                      color: '#fbe2a8',
                      letterSpacing: '0.02em',
                      marginBottom: '2.5rem',
                    }}
                  >
                    "I love you, my noor."
                  </motion.h3>
                )}

                {closingStep >= 11 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPhase('chat')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0.85rem 2.2rem',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, rgba(232, 195, 125, 0.25) 0%, rgba(201, 169, 110, 0.1) 100%)',
                      border: '1.5px solid rgba(232, 195, 125, 0.5)',
                      color: '#fbe2a8',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 0 30px rgba(232, 195, 125, 0.25)',
                    }}
                  >
                    <span>A memory from our chat 💬</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* PART 5 — THE CHAT ANIMATION & CHOICE (CUTE OR BOLD) */}
          {/* ================================================================ */}
          {phase === 'chat' && (
            <motion.div
              key="phase-chat"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem 0 2rem',
              }}
            >
              {/* Chat Phone / App Wrapper */}
              <div
                style={{
                  width: '100%',
                  borderRadius: '24px',
                  background: '#0e0b0a',
                  border: '1px solid rgba(232, 195, 125, 0.22)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Chat Top Bar */}
                <div
                  style={{
                    padding: '12px 18px',
                    background: 'rgba(22, 16, 14, 0.95)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #c9a96e 0%, #e8b068 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#110b06',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    T
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#fdfbf7' }}>
                      Tosif ❤️
                    </p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(235, 195, 130, 0.7)', fontFamily: 'var(--font-mono)' }}>
                      online • a real conversation
                    </p>
                  </div>
                </div>

                {/* Chat Bubbles Stream */}
                <div
                  style={{
                    padding: '1.4rem 1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '280px',
                    background: 'radial-gradient(circle at 50% 50%, #15100e 0%, #0a0807 100%)',
                  }}
                >
                  {/* Message 1 (Nousheen) */}
                  {chatStep >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        alignSelf: 'flex-end',
                        maxWidth: '82%',
                        padding: '10px 15px',
                        borderRadius: '16px 16px 4px 16px',
                        background: 'linear-gradient(135deg, #78202d 0%, #52151e 100%)',
                        border: '1px solid rgba(245, 198, 125, 0.4)',
                        color: '#fdfbf7',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                        boxShadow: '0 4px 15px rgba(120, 32, 45, 0.35)',
                      }}
                    >
                      App romance feel karne wale wild romance karte yah
                    </motion.div>
                  )}

                  {/* Message 2 (Nousheen) */}
                  {chatStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        alignSelf: 'flex-end',
                        maxWidth: '82%',
                        padding: '10px 15px',
                        borderRadius: '16px 16px 4px 16px',
                        background: 'linear-gradient(135deg, #78202d 0%, #52151e 100%)',
                        border: '1px solid rgba(245, 198, 125, 0.4)',
                        color: '#fdfbf7',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                        boxShadow: '0 4px 15px rgba(120, 32, 45, 0.35)',
                      }}
                    >
                      Aisi bass naam ka romance ?
                    </motion.div>
                  )}

                  {/* Message 3 (Tosif) */}
                  {chatStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        alignSelf: 'flex-start',
                        maxWidth: '82%',
                        padding: '10px 14px',
                        borderRadius: '16px 16px 16px 4px',
                        background: '#241a16',
                        border: '1px solid rgba(232, 195, 125, 0.25)',
                        color: '#fbe2a8',
                        fontSize: '0.92rem',
                        fontWeight: 500,
                        lineHeight: 1.45,
                      }}
                    >
                      I'll do everything u need
                    </motion.div>
                  )}

                  {/* Message 4 (Nousheen) */}
                  {chatStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        alignSelf: 'flex-end',
                        maxWidth: '75%',
                        padding: '10px 18px',
                        borderRadius: '16px 16px 4px 16px',
                        background: 'linear-gradient(135deg, #78202d 0%, #52151e 100%)',
                        border: '1.5px solid rgba(245, 198, 125, 0.5)',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 18px rgba(120, 32, 45, 0.45)',
                      }}
                    >
                      jaise
                    </motion.div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '8px 14px',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center',
                      }}
                    >
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Her Interactive Choice Section (Appears after chat finishes) */}
              {chatStep >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    width: '100%',
                    marginTop: '1.8rem',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: '#fbe2a8',
                      marginBottom: '0.4rem',
                      fontWeight: 500,
                    }}
                  >
                    "Achha bachaa... ab tum batao. 👀❤️"
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'rgba(245, 240, 235, 0.65)',
                      letterSpacing: '0.1em',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Select anyone, meri jaan. (Type: <strong>Cute</strong> or <strong>Bold</strong>)
                  </p>

                  {/* Choice Form */}
                  {!savedChoice ? (
                    <form
                      onSubmit={handleChoiceSubmit}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        maxWidth: '360px',
                        margin: '0 auto',
                      }}
                    >
                      <input
                        type="text"
                        value={choiceInput}
                        onChange={(e) => {
                          setChoiceInput(e.target.value);
                          setChoiceError('');
                        }}
                        placeholder="Type Cute or Bold..."
                        style={{
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: '100px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1.5px solid rgba(232, 195, 125, 0.4)',
                          color: '#fdfbf7',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          outline: 'none',
                        }}
                      />

                      {choiceError && (
                        <p style={{ color: '#f28d79', fontSize: '0.75rem', margin: 0 }}>
                          {choiceError}
                        </p>
                      )}

                      <button
                        type="submit"
                        style={{
                          padding: '10px 24px',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 20px rgba(232, 176, 104, 0.35)',
                        }}
                      >
                        SUBMIT ♡
                      </button>
                    </form>
                  ) : (
                    /* Display Selected Branch */
                    <div>
                      {savedChoice === 'cute' ? (
                        /* BRANCH A: CUTE CONFIRMATION CARD */
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            padding: '2rem 1.8rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(28, 20, 16, 0.95) 0%, rgba(15, 12, 10, 0.98) 100%)',
                            border: '1.5px solid rgba(232, 195, 125, 0.4)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                            textAlign: 'center',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
                              color: '#fbe2a8',
                              fontWeight: 500,
                              marginBottom: '0.8rem',
                            }}
                          >
                            "Awww, my bachaa chose cute! 🥹❤️"
                          </h3>

                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1rem',
                              color: 'rgba(245, 240, 235, 0.88)',
                              lineHeight: 1.65,
                              marginBottom: '1.8rem',
                            }}
                          >
                            I have prepared 100 little cute things and romantic moments for us...
                          </p>

                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setPhase('cute-flow');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{
                                padding: '12px 26px',
                                borderRadius: '100px',
                                background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                                color: '#120b06',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(232, 176, 104, 0.35)',
                              }}
                            >
                              ENTER OUR CUTE WORLD →
                            </button>

                            <button
                              onClick={() => {
                                setSavedChoice(null);
                                setChoiceInput('');
                              }}
                              style={{
                                padding: '12px 20px',
                                borderRadius: '100px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: 'rgba(245, 240, 235, 0.7)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              Change Choice
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        /* BRANCH B: BOLD CONFIRMATION SCREEN */
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                          style={{
                            padding: '2rem 1.8rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(28, 16, 16, 0.95) 0%, rgba(14, 10, 10, 0.98) 100%)',
                            border: '1.5px solid rgba(242, 141, 121, 0.45)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                            textAlign: 'center',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
                              color: '#f28d79',
                              fontWeight: 500,
                              marginBottom: '0.8rem',
                            }}
                          >
                            "Ohooo, bachaa... you chose bold? 👀"
                          </h3>

                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.05rem',
                              color: 'rgba(245, 240, 235, 0.85)',
                              lineHeight: 1.6,
                              marginBottom: '1rem',
                            }}
                          >
                            Are you sure you want to see the wilder side of our romance?
                          </p>

                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.1rem',
                              color: '#fbe2a8',
                              fontStyle: 'italic',
                              marginBottom: '2rem',
                            }}
                          >
                            "And one more thing... you won't judge me for what I wrote, okay?"
                          </p>

                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              onClick={() => {
                                setPhase('bold-flow');
                                setBoldScene(1);
                              }}
                              style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: 'linear-gradient(135deg, #f28d79 0%, #d46b57 100%)',
                                color: '#120b06',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 18px rgba(242, 141, 121, 0.35)',
                              }}
                            >
                              YES, SHOW ME ❤️
                            </button>
                            <button
                              onClick={() => {
                                setSavedChoice(null);
                                setChoiceInput('');
                              }}
                              style={{
                                padding: '10px 20px',
                                borderRadius: '100px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: 'rgba(245, 240, 235, 0.7)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                              }}
                            >
                              NO, NOT YET
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* DEDICATED FULL-PAGE CUTE FLOW (100 CUTE ROMANCE MOMENTS) */}
          {/* ================================================================ */}
          {phase === 'cute-flow' && (
            <motion.div
              key="phase-cute-flow"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%',
                maxWidth: '680px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem 0 3rem',
              }}
            >
              <div
                style={{
                  width: '100%',
                  padding: '2.4rem 1.8rem',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(28, 20, 16, 0.97) 0%, rgba(15, 12, 10, 0.99) 100%)',
                  border: '1.5px solid rgba(232, 195, 125, 0.45)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                  textAlign: 'left',
                }}
              >
                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      color: '#e8c37d',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    100 Little Things • Cute Romance
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.4rem, 4.2vw, 1.8rem)',
                      color: '#fbe2a8',
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    "For my Nousheen, my forever bachaa. 🥹❤️"
                  </h3>
                </div>

                {/* Personal Letter Intro */}
                <div
                  style={{
                    padding: '1.4rem 1.4rem',
                    borderRadius: '16px',
                    background: 'rgba(232, 195, 125, 0.06)',
                    border: '1px solid rgba(232, 195, 125, 0.2)',
                    marginBottom: '1.8rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(0.98rem, 3.2vw, 1.1rem)',
                      color: 'rgba(245, 240, 235, 0.95)',
                      lineHeight: 1.85,
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    "For me, living with you is so much more than ordinary romance. I can't even explain it to you... sometimes I get bored with the word <em>'love'</em> because love doesn't even begin to hold the vast amount of affection and obsession I have towards you. For me, cute romance is a lifetime of these moments with you..."
                  </p>
                </div>

                {/* 100 Things Progress Tracker */}
                <div style={{ marginBottom: '1.6rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: '#f5c67d',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Discovered Moments: {revealedCuteCount} / 100
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'rgba(245, 240, 235, 0.6)',
                      }}
                    >
                      {Math.round((revealedCuteCount / 100) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar line */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ width: `${(revealedCuteCount / 100) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #c9a96e 0%, #f5c67d 100%)',
                        boxShadow: '0 0 10px rgba(245, 198, 125, 0.5)',
                      }}
                    />
                  </div>
                </div>

                {/* Active Spotlight Card */}
                {revealedCuteCount > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`cute-card-${revealedCuteCount}`}
                      initial={{ opacity: 0, y: 15, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.97 }}
                      transition={{ duration: 0.45 }}
                      style={{
                        padding: '1.8rem 1.6rem',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(38, 26, 20, 0.95) 0%, rgba(22, 16, 12, 0.98) 100%)',
                        border: '1.5px solid rgba(245, 198, 125, 0.5)',
                        boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
                        marginBottom: '1.8rem',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '1rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            background: 'rgba(232, 195, 125, 0.15)',
                            border: '1px solid rgba(232, 195, 125, 0.3)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            color: '#fbe2a8',
                            letterSpacing: '0.1em',
                          }}
                        >
                          CUTE MOMENT #{CUTE_ROMANCE_100[revealedCuteCount - 1]?.id} OF 100
                        </span>

                        <span style={{ fontSize: '1.6rem' }}>
                          {CUTE_ROMANCE_100[revealedCuteCount - 1]?.icon}
                        </span>
                      </div>

                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.1rem, 3.8vw, 1.35rem)',
                          color: '#fdfbf7',
                          lineHeight: 1.6,
                          margin: 0,
                          fontWeight: 400,
                        }}
                      >
                        "{CUTE_ROMANCE_100[revealedCuteCount - 1]?.text}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Reveal Buttons Controls */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                    marginBottom: '1.8rem',
                  }}
                >
                  {revealedCuteCount < 100 && (
                    <button
                      onClick={handleRevealNextCute}
                      style={{
                        flex: '1 1 200px',
                        padding: '12px 22px',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(232, 176, 104, 0.35)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      Reveal Next Moment ✨ (#{revealedCuteCount + 1})
                    </button>
                  )}

                  {revealedCuteCount < 100 && (
                    <button
                      onClick={handleReveal10Cute}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '100px',
                        background: 'rgba(232, 195, 125, 0.12)',
                        border: '1px solid rgba(232, 195, 125, 0.35)',
                        color: '#fbe2a8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      +10 More 💌
                    </button>
                  )}

                  {revealedCuteCount < 100 && (
                    <button
                      onClick={handleRevealAllCute}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'rgba(245, 240, 235, 0.75)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reveal All 100 📜
                    </button>
                  )}
                </div>

                {/* Toggle View Full List */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <button
                    onClick={() => setCuteViewMode(cuteViewMode === 'list' ? 'spotlight' : 'list')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f5c67d',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    {cuteViewMode === 'list'
                      ? '▲ Switch to Single Card View'
                      : `▼ View All Revealed Moments (${revealedCuteCount})`}
                  </button>
                </div>

                {/* Full Revealed List Accordion View */}
                {cuteViewMode === 'list' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      maxHeight: '420px',
                      overflowY: 'auto',
                      paddingRight: '6px',
                      marginBottom: '2rem',
                    }}
                  >
                    {CUTE_ROMANCE_100.slice(0, revealedCuteCount).map((item) => (
                      <div
                        key={`cute-list-${item.id}`}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(232, 195, 125, 0.15)',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: '#e8c37d',
                            minWidth: '32px',
                          }}
                        >
                          #{item.id}
                        </span>
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.94rem',
                            color: 'rgba(245, 240, 235, 0.9)',
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Completion Banner when all 100 are discovered */}
                {revealedCuteCount >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      padding: '1.6rem 1.4rem',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, rgba(232, 195, 125, 0.15) 0%, rgba(201, 169, 110, 0.08) 100%)',
                      border: '1.5px solid rgba(232, 195, 125, 0.5)',
                      textAlign: 'center',
                      marginBottom: '1.8rem',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>
                      👑💖✨
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.3rem',
                        color: '#fbe2a8',
                        margin: '0 0 0.5rem 0',
                      }}
                    >
                      "100 Little Promises for My Nousheen ♡"
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.96rem',
                        color: 'rgba(245, 240, 235, 0.85)',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        margin: 0,
                      }}
                    >
                      And remember bachaa... this is just 100 out of a million moments I want to live with you.
                    </p>
                  </motion.div>
                )}

                {/* Private End Note Input for Nousheen */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '100%',
                    maxWidth: '540px',
                    margin: '2rem auto 1.5rem',
                    background: 'linear-gradient(145deg, rgba(24, 18, 16, 0.95) 0%, rgba(14, 10, 10, 0.98) 100%)',
                    border: '1.5px solid rgba(232, 195, 125, 0.35)',
                    borderRadius: '20px',
                    padding: '1.6rem',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>✍️❤️</span>
                    <h4
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        color: '#fbe2a8',
                        fontWeight: 600,
                      }}
                    >
                      Kuch bolna hai Tosif ko?
                    </h4>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.9rem',
                      color: 'rgba(245, 240, 235, 0.8)',
                      margin: '0 0 1rem 0',
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}
                  >
                    "Whatever is in your heart right now, meri jaan... type it here. I'll read and treasure every single word."
                  </p>

                  <textarea
                    value={nousheenNote}
                    onChange={(e) => {
                      setNousheenNote(e.target.value);
                      setIsNoteSaved(false);
                    }}
                    placeholder="Type your message here, my bachaa... ♡"
                    rows={4}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(232, 195, 125, 0.25)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: '#fdfbf7',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      marginBottom: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <button
                      onClick={handleSaveNote}
                      disabled={!nousheenNote.trim()}
                      style={{
                        padding: '11px 26px',
                        borderRadius: '100px',
                        background: isNoteSaved
                          ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                          : 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: isNoteSaved ? '#052e16' : '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        border: 'none',
                        cursor: nousheenNote.trim() ? 'pointer' : 'not-allowed',
                        opacity: !nousheenNote.trim() ? 0.45 : 1,
                        boxShadow: '0 4px 18px rgba(232, 176, 104, 0.35)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isNoteSaved ? '✓ SAVED IN TOSIF’S HEART' : 'SEND TO TOSIF ❤️'}
                    </button>

                    {isNoteSaved && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: '#4ade80',
                          letterSpacing: '0.04em',
                        }}
                      >
                        ✓ Synced to Excel & Tosif's heart
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Completion / Day Button */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  {!dayCompleted ? (
                    <button
                      onClick={handleMarkComplete}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 6px 25px rgba(232, 176, 104, 0.4)',
                      }}
                    >
                      DAY 09 COMPLETE ❤️
                    </button>
                  ) : (
                    <div
                      style={{
                        color: '#fbe2a8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      ✦ Day 09 Completed • See you tomorrow, Nousheen ♡ ✦
                    </div>
                  )}

                  {/* Option to return to chat choice */}
                  <div style={{ marginTop: '1.2rem' }}>
                    <button
                      onClick={() => {
                        setPhase('chat');
                        setSavedChoice(null);
                        setChoiceInput('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(245, 240, 235, 0.45)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Return to Chat & Choose Again
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* BOLD BRANCH FLOW (SCENES 1 TO 5) */}
          {/* ================================================================ */}
          {phase === 'bold-flow' && (
            <motion.div
              key={`bold-scene-${boldScene}-${boldMomentIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem 0 2rem',
              }}
            >
              {/* ------------------------------------------------------------ */}
              {/* BOLD SCENE 1 — TOSIF'S PHOTO & LEVEL UP */}
              {/* ------------------------------------------------------------ */}
              {boldScene === 1 && (
                <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>
                  {boldScene1TextStep >= 1 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)',
                        color: '#fbe2a8',
                        fontStyle: 'italic',
                        marginBottom: '0.4rem',
                      }}
                    >
                      "Achha bachaa..."
                    </motion.p>
                  )}

                  {boldScene1TextStep >= 2 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.6rem, 5vw, 2.3rem)',
                        color: '#fdfbf7',
                        fontWeight: 400,
                        marginBottom: '1.2rem',
                      }}
                    >
                      "Ab meri baari. ❤️"
                    </motion.h2>
                  )}

                  {boldScene1TextStep >= 3 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.85 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.85)',
                        lineHeight: 1.6,
                        marginBottom: '0.4rem',
                      }}
                    >
                      I've shown you how beautiful you are to me.
                    </motion.p>
                  )}

                  {boldScene1TextStep >= 4 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.85 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.85)',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                      }}
                    >
                      But there's something I want you to know about myself, too.
                    </motion.p>
                  )}

                  {boldScene1TextStep >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.9 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Instax Polaroid Frame for Tosif's Photo */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          maxWidth: '380px',
                          background: '#fbf9f5',
                          borderRadius: '12px',
                          padding: '16px 16px 36px 16px',
                          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(232, 195, 125, 0.2)',
                          transform: 'rotate(-1.5deg)',
                          marginBottom: '2rem',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '4 / 5',
                            background: '#151110',
                            borderRadius: '6px',
                            overflow: 'hidden',
                          }}
                        >
                          <video
                            src={DAY9_MEDIA.tosifPortrait}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div
                            style={{
                              display: 'none',
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              background: 'linear-gradient(135deg, #251614 0%, #110d0b 100%)',
                              color: '#f0c88b',
                              padding: '16px',
                            }}
                          >
                            <span style={{ fontSize: '2.5rem' }}>🧑‍💻💪</span>
                            <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-serif)', marginTop: '8px' }}>
                              Tosif's Photo
                            </span>
                          </div>
                        </div>

                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.15rem',
                            color: '#2a1f1b',
                            textAlign: 'center',
                            marginTop: '16px',
                            marginBottom: '2px',
                            fontStyle: 'italic',
                            fontWeight: 500,
                          }}
                        >
                          For my Nousheen ♡
                        </p>
                      </div>

                      {/* Personal Message */}
                      <div
                        style={{
                          padding: '1.8rem 1.8rem',
                          borderRadius: '18px',
                          background: 'rgba(18, 14, 12, 0.85)',
                          border: '1px solid rgba(232, 195, 125, 0.22)',
                          backdropFilter: 'blur(12px)',
                          textAlign: 'left',
                          marginBottom: '1.8rem',
                          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(0.98rem, 3.2vw, 1.1rem)',
                            color: 'rgba(245, 240, 235, 0.92)',
                            lineHeight: 1.85,
                            fontWeight: 300,
                          }}
                        >
                          Nousheen, meri jaan, I have to level myself up for you. I want to keep improving myself, becoming stronger, and becoming the man I want to be for our future. I want to build my body, take care of myself, and become someone who makes you feel proud and safe beside him. And haan, bachaa, I want to get stronger so that one day I can hold you close, lift you up if you want me to, and give you the kind of romantic moments we've talked about. 😂❤️ I'm working on myself, not because you aren't enough for me, but because I want to keep growing into the person I hope to be for you.
                        </p>

                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.05rem',
                            color: '#f5c67d',
                            fontStyle: 'italic',
                            marginTop: '1.2rem',
                            textAlign: 'right',
                          }}
                        >
                          "Gym bhi, growth bhi... sab tumhari yaad mein, paglu. 😂❤️"
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setBoldScene(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '0.85rem 2.2rem',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 6px 25px rgba(232, 176, 104, 0.35)',
                        }}
                      >
                        CONTINUE, MY PAGLU →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* BOLD SCENE 2 — WHAT DID "WOH WALA" MEAN? */}
              {/* ------------------------------------------------------------ */}
              {boldScene === 2 && (
                <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Chat Re-creation */}
                  <div
                    style={{
                      width: '100%',
                      borderRadius: '24px',
                      background: '#0e0b0a',
                      border: '1px solid rgba(232, 195, 125, 0.22)',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                      overflow: 'hidden',
                      marginBottom: '1.8rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 18px',
                        background: 'rgba(22, 16, 14, 0.95)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #c9a96e 0%, #e8b068 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#110b06',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        T
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#fdfbf7' }}>
                          Tosif ❤️
                        </p>
                        <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(235, 195, 130, 0.7)', fontFamily: 'var(--font-mono)' }}>
                          that night • a special memory
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '1.4rem 1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minHeight: '260px',
                        background: 'radial-gradient(circle at 50% 50%, #15100e 0%, #0a0807 100%)',
                      }}
                    >
                      {boldScene2ChatStep >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            alignSelf: 'flex-start',
                            maxWidth: '82%',
                            padding: '10px 14px',
                            borderRadius: '16px 16px 16px 4px',
                            background: '#241a16',
                            border: '1px solid rgba(232, 195, 125, 0.2)',
                            color: '#f5f0eb',
                            fontSize: '0.9rem',
                          }}
                        >
                          Imagine...
                        </motion.div>
                      )}

                      {boldScene2ChatStep >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            alignSelf: 'flex-start',
                            maxWidth: '82%',
                            padding: '10px 14px',
                            borderRadius: '16px 16px 16px 4px',
                            background: '#241a16',
                            border: '1px solid rgba(232, 195, 125, 0.2)',
                            color: '#f5f0eb',
                            fontSize: '0.9rem',
                          }}
                        >
                          woh wala wild romance ?
                        </motion.div>
                      )}

                      {boldScene2ChatStep >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            alignSelf: 'flex-end',
                            maxWidth: '75%',
                            padding: '10px 18px',
                            borderRadius: '16px 16px 4px 16px',
                            background: 'linear-gradient(135deg, #78202d 0%, #52151e 100%)',
                            border: '1.5px solid rgba(245, 198, 125, 0.5)',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 18px rgba(120, 32, 45, 0.45)',
                          }}
                        >
                          Yes, woh wala.
                        </motion.div>
                      )}

                      {boldScene2Typing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            alignSelf: 'flex-end',
                            padding: '8px 14px',
                            borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center',
                          }}
                        >
                          <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                          <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                          <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8c37d' }} />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Explanatory Context & Emotional Build-up */}
                  {boldScene2ChatStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9 }}
                      style={{ textAlign: 'center', width: '100%' }}
                    >
                      <div
                        style={{
                          padding: '1.2rem 1.6rem',
                          borderRadius: '14px',
                          background: 'rgba(232, 195, 125, 0.08)',
                          border: '1px solid rgba(232, 195, 125, 0.25)',
                          marginBottom: '1.6rem',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.98rem',
                            color: '#fbe2a8',
                            fontStyle: 'italic',
                            margin: 0,
                            lineHeight: 1.6,
                          }}
                        >
                          "By 'woh wala,' we meant the deepest level of physical intimacy between two people who love each other."
                        </p>
                      </div>

                      <div
                        style={{
                          padding: '1.8rem 1.8rem',
                          borderRadius: '18px',
                          background: 'rgba(18, 14, 12, 0.85)',
                          border: '1px solid rgba(232, 195, 125, 0.2)',
                          backdropFilter: 'blur(12px)',
                          textAlign: 'left',
                          marginBottom: '2rem',
                        }}
                      >
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fdfbf7', marginBottom: '0.8rem' }}>
                          See, Nousheen...
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#fbe2a8', fontStyle: 'italic', marginBottom: '1rem' }}>
                          "I love you a lot. A lot, a lot."
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.8, marginBottom: '1rem' }}>
                          I genuinely want to love you in a way that feels special to you, meri jaan.
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                          No one can promise you a perfect life, but I can promise to keep trying, to listen to you, to respect you, and to make our relationship something we both feel safe and happy in.
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#f5c67d', fontStyle: 'italic', margin: 0 }}>
                          "Now... imagine a future where we're finally together. ❤️"
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setBoldScene(3);
                          setBoldMomentIdx(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '0.85rem 2.4rem',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 6px 25px rgba(232, 176, 104, 0.35)',
                        }}
                      >
                        LET ME IMAGINE →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* BOLD SCENE 3 — A ROMANTIC FUTURE, JUST US (MOMENTS 1 TO 5) */}
              {/* ------------------------------------------------------------ */}
              {boldScene === 3 && (
                <div style={{ width: '100%', maxWidth: '620px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Moment Step Badge */}
                  <div style={{ marginBottom: '1.4rem', textAlign: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.2em',
                        color: '#e8c37d',
                        textTransform: 'uppercase',
                      }}
                    >
                      A Romantic Future • Moment {boldMomentIdx} of 5
                    </span>
                  </div>

                  {/* Moment Content Card with Warm Moonlight Atmosphere */}
                  <motion.div
                    key={boldMomentIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    style={{
                      width: '100%',
                      padding: '2.2rem 2rem',
                      borderRadius: '24px',
                      background: 'linear-gradient(145deg, rgba(20, 16, 18, 0.95) 0%, rgba(10, 8, 12, 0.98) 100%)',
                      border: '1.5px solid rgba(232, 195, 125, 0.28)',
                      boxShadow: '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 45px rgba(201, 169, 110, 0.1)',
                      textAlign: 'left',
                      marginBottom: '1.8rem',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Atmospheric Moonlight Glow in background */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(140, 180, 245, 0.12) 0%, rgba(0,0,0,0) 70%)',
                        filter: 'blur(30px)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* MOMENT 1: CLOSE */}
                    {boldMomentIdx === 1 && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', fontWeight: 500, marginBottom: '1.4rem' }}>
                          Moment 1 — Close
                        </h3>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'rgba(245, 240, 235, 0.95)', lineHeight: 1.85, fontWeight: 300, marginBottom: '1.2rem' }}>
                          "Imagine me standing in front of you, meri jaan..."
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.85, fontWeight: 300 }}>
                          "I'd gently hold your face in both my hands, look into your eyes, and smile because I'd finally have you standing right there in front of me."
                        </p>
                      </div>
                    )}

                    {/* MOMENT 2: CLOSER */}
                    {boldMomentIdx === 2 && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', fontWeight: 500, marginBottom: '1.4rem' }}>
                          Moment 2 — Closer
                        </h3>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'rgba(245, 240, 235, 0.95)', lineHeight: 1.85, fontWeight: 300, marginBottom: '1.2rem' }}>
                          "I'd come a little closer, slowly, giving you time to look at me and smile that beautiful smile of yours."
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.85, fontWeight: 300 }}>
                          "I'd pull you into a warm hug, hold you close, and let that moment last."
                        </p>
                      </div>
                    )}

                    {/* MOMENT 3: THE KISS */}
                    {boldMomentIdx === 3 && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', fontWeight: 500, marginBottom: '1.4rem' }}>
                          Moment 3 — The Kiss
                        </h3>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'rgba(245, 240, 235, 0.95)', lineHeight: 1.85, fontWeight: 300, marginBottom: '1.2rem' }}>
                          "And if we both wanted it, I'd kiss you so lovingly that it would become one of those memories we smile about for years."
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.85, fontWeight: 300 }}>
                          "Maybe we'd forget what we were talking about. Maybe you'd start laughing in the middle of it. And maybe I'd pull you close again because I still wouldn't want the moment to end. ❤️"
                        </p>
                      </div>
                    )}

                    {/* MOMENT 4: JUST US */}
                    {boldMomentIdx === 4 && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', fontWeight: 500, marginBottom: '1.4rem' }}>
                          Moment 4 — Just Us
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontFamily: 'var(--font-serif)', fontSize: '1.02rem', color: 'rgba(245, 240, 235, 0.92)', lineHeight: 1.85, fontWeight: 300 }}>
                          <p>
                            "I imagine us spending hours together, talking, laughing, being affectionate, and discovering all the little things that make being together feel different from missing each other through a screen."
                          </p>
                          <p>
                            "I want our closeness to be something we both enjoy, where neither of us has to pretend, rush, or be afraid to say what we feel."
                          </p>
                          <p style={{ color: '#fbe2a8', fontStyle: 'italic' }}>
                            "I'll smell the fragrance of your body and your hair, then I'll hug you so hard"
                          </p>
                          <p style={{ color: '#fbe2a8', fontStyle: 'italic' }}>
                            “I’ll lay you down on the bed, kiss your feet, and slowly make my way upward until I reach your upper body.”
                          </p>
                          <p>
                            "I’ll look deep into your eyes and feel like I’m looking at my entire world, meri jaan. ❤️🔥 Then, when we’re alone together and we both want it, we’ll slowly take our clothes off, and I’ll admire your beautiful hourglass figure, making you feel like the most gorgeous girl in the world. I’ll pull you closer by your waist, kiss you passionately, and gently explore every part of you with affection and tenderness, making sure you feel loved, desired, and comfortable with me. 💋❤️🔥"
                          </p>
                          <p>
                            "Then we’ll enjoy the whole night together, kissing, cuddling, teasing each other, and doing all the things we both want to do, with nothing held back as long as we’re both comfortable. And when the night gets quieter, we’ll lie naked together under the blanket, your body close to mine, my arms wrapped tightly around you. I’ll gently move your hair away from your beautiful face, look into your eyes, kiss your forehead, and sing a song just for you while you rest against my chest. 🫂❤️"
                          </p>
                          <p>
                            "I’ll hug you one more time, even tighter, pull you closer to me, run my fingers through your hair, and whisper how much you mean to me until your eyes slowly close and we both fall asleep in each other’s arms. And honestly, bachaa, I could live for moments like these every single day. 😭❤️🔥"
                          </p>
                          <p>
                            "And all of this happens with your consent, always, because I want you to feel safe, loved, and wanted with me. 😂❤️ I’ll do everything I can to make you smile so hard that your cheeks hurt. I don’t care how difficult life gets or what happens around us; I just want to be the reason behind that beautiful smile of yours. I want to love you passionately, make you laugh like a little kid, spoil you with affection, and give you a thousand reasons to feel happy. I don't just want your nights, meri jaan; I want all my tomorrows with you, too. 🥹💋❤️🔥"
                          </p>
                          <p style={{ background: 'rgba(232, 195, 125, 0.08)', padding: '14px', borderRadius: '12px', borderLeft: '3px solid #e8c37d' }}>
                            "And bachaa, there's one more thing on our checklist 😂❤️🔥 We’re definitely taking a bath together! Just you and me, stealing glances, teasing each other, splashing water, hugging each other from behind, and sharing slow kisses while you laugh and tell me to stop disturbing you. 😭💋 I'll gently move your wet hair away from your face, pull you into a warm hug, and kiss your forehead. We'll probably spend more time laughing, cuddling, and annoying each other than actually bathing. 😂❤️ And when we're done, I'll wrap you in a soft towel, pull you close, and tell you how ridiculously beautiful you look. Meri jaan, even the simplest things would feel magical with you. 🫂💕"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* MOMENT 5: THE QUIET AFTER */}
                    {boldMomentIdx === 5 && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', fontWeight: 500, marginBottom: '1.4rem' }}>
                          Moment 5 — The Quiet After
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'rgba(245, 240, 235, 0.92)', lineHeight: 1.85, fontWeight: 300 }}>
                          <p>
                            "And later, when the whole world feels quiet, I'd want you beside me, safe in my arms, while I play or sing a song for you."
                          </p>
                          <p>
                            "Maybe I'd move your hair gently away from your face. Maybe you'd tell me to stop singing because I'm terrible. 😂"
                          </p>
                          <p>
                            "And then we'd laugh, hold each other close, and fall asleep feeling grateful that, for once, we don't have to say goodnight through a phone."
                          </p>
                          <div style={{ marginTop: '1rem', padding: '12px 16px', borderRadius: '12px', background: 'rgba(232, 195, 125, 0.1)', border: '1px solid rgba(232, 195, 125, 0.3)' }}>
                            <p style={{ color: '#fbe2a8', fontStyle: 'italic', margin: 0, fontSize: '1.1rem' }}>
                              "That's the kind of closeness I dream about, my bachaa. Not just one night... but a lifetime of moments with you."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Navigation Buttons for Moments */}
                  <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => {
                        if (boldMomentIdx > 1) {
                          setBoldMomentIdx((p) => p - 1);
                        } else {
                          setBoldScene(2);
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.65rem 1.2rem',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: 'rgba(245, 240, 235, 0.7)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() => {
                        if (boldMomentIdx < 5) {
                          setBoldMomentIdx((p) => p + 1);
                        } else {
                          setBoldScene(4);
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.65rem 1.6rem',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(232, 176, 104, 0.3)',
                      }}
                    >
                      {boldMomentIdx === 5 ? 'CONTINUE →' : 'Next Moment →'}
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* BOLD SCENE 4 — AN IMPORTANT CHECK-IN */}
              {/* ------------------------------------------------------------ */}
              {boldScene === 4 && (
                <div style={{ width: '100%', maxWidth: '540px', textAlign: 'center' }}>
                  {!boldFallbackCute ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        padding: '2.5rem 2rem',
                        borderRadius: '24px',
                        background: 'linear-gradient(145deg, rgba(22, 16, 16, 0.95) 0%, rgba(12, 10, 10, 0.98) 100%)',
                        border: '1.5px solid rgba(232, 195, 125, 0.35)',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.35rem, 4.5vw, 1.8rem)',
                          color: '#fbe2a8',
                          fontWeight: 500,
                          marginBottom: '1.2rem',
                        }}
                      >
                        "Ek baat, meri jaan. ❤️"
                      </h3>

                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'rgba(245, 240, 235, 0.92)', lineHeight: 1.8, marginBottom: '1rem' }}>
                        I want our romance to be something we both genuinely want.
                      </p>

                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.02rem', color: 'rgba(245, 240, 235, 0.88)', lineHeight: 1.8, marginBottom: '1rem' }}>
                        You can always tell me what you like, what you don't like, what feels comfortable, and when you want to slow down.
                      </p>

                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#f5c67d', fontStyle: 'italic', marginBottom: '2rem' }}>
                        "Your comfort matters to me just as much as my feelings do."
                      </p>

                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fdfbf7', marginBottom: '1.8rem', letterSpacing: '0.05em' }}>
                        Are you comfortable continuing with this romantic imagination?
                      </p>

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            saveResponse({
                              sessionId: sessionId || getOrCreateSessionId(9),
                              day: 9,
                              questionId: 'day9_comfort_checkin',
                              question: 'Day 9 Scene 4 Comfort Check-in',
                              optionId: 'yes_continue',
                              answer: 'YES, CONTINUE (Comfortable with Bold Flow)',
                            });
                            setBoldScene(5);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '100px',
                            background: 'linear-gradient(135deg, #f28d79 0%, #d46b57 100%)',
                            color: '#120b06',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 18px rgba(242, 141, 121, 0.4)',
                          }}
                        >
                          YES, CONTINUE ❤️
                        </button>
                        <button
                          onClick={() => {
                            saveResponse({
                              sessionId: sessionId || getOrCreateSessionId(9),
                              day: 9,
                              questionId: 'day9_comfort_checkin',
                              question: 'Day 9 Scene 4 Comfort Check-in',
                              optionId: 'keep_it_cute',
                              answer: "LET'S KEEP IT CUTE (Switched from Bold to Cute)",
                            });
                            setBoldFallbackCute(true);
                          }}
                          style={{
                            padding: '12px 22px',
                            borderRadius: '100px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fdfbf7',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          LET'S KEEP IT CUTE 🤍
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Wholesome fallback when she chooses to keep it cute */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        padding: '2.5rem 2rem',
                        borderRadius: '24px',
                        background: 'linear-gradient(145deg, rgba(20, 16, 14, 0.95) 0%, rgba(12, 10, 10, 0.98) 100%)',
                        border: '1.5px solid rgba(232, 195, 125, 0.35)',
                        textAlign: 'center',
                      }}
                    >
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbe2a8', marginBottom: '1rem' }}>
                        "Of course, bachaa. ❤️"
                      </h3>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', color: 'rgba(245, 240, 235, 0.92)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        We don't have to go any further. Come here, meri jaan. A big warm hug for you. 🫂❤️ Let's look at all the cute moments waiting for us.
                      </p>

                      <button
                        onClick={() => {
                          setPhase('cute-flow');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '12px 28px',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 6px 25px rgba(232, 176, 104, 0.4)',
                        }}
                      >
                        SEE OUR 100 CUTE LITTLE MOMENTS →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* BOLD SCENE 5 — THE FINAL CONFESSION */}
              {/* ------------------------------------------------------------ */}
              {boldScene === 5 && (
                <div style={{ width: '100%', maxWidth: '620px', textAlign: 'center', padding: '1rem 0' }}>
                  {boldScene5Step >= 1 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                        color: '#fdfbf7',
                        fontWeight: 400,
                        marginBottom: '1.2rem',
                      }}
                    >
                      Nousheen...
                    </motion.h2>
                  )}

                  {boldScene5Step >= 2 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.15rem, 4vw, 1.45rem)',
                        color: '#fbe2a8',
                        fontStyle: 'italic',
                        marginBottom: '0.6rem',
                      }}
                    >
                      "I really, really, really love you."
                    </motion.p>
                  )}

                  {boldScene5Step >= 3 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1rem',
                        color: 'rgba(245, 240, 235, 0.75)',
                        marginBottom: '1.8rem',
                      }}
                    >
                      I'm not kidding, meri jaan.
                    </motion.p>
                  )}

                  {boldScene5Step >= 4 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.9)',
                        lineHeight: 1.8,
                        marginBottom: '1rem',
                      }}
                    >
                      I want to see you happy. I want to see you smile. I want to keep becoming a better version of myself, and I want us to build something beautiful together.
                    </motion.p>
                  )}

                  {boldScene5Step >= 5 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.9)',
                        lineHeight: 1.8,
                        marginBottom: '1.6rem',
                      }}
                    >
                      I dream about holding you close, laughing with you, kissing your forehead, annoying you, listening to you talk, and making ordinary days feel special.
                    </motion.p>
                  )}

                  {boldScene5Step >= 6 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.12rem',
                        color: '#f5c67d',
                        fontStyle: 'italic',
                        marginBottom: '0.8rem',
                      }}
                    >
                      "You're not just someone I want to romance."
                    </motion.p>
                  )}

                  {boldScene5Step >= 7 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.9)',
                        lineHeight: 1.8,
                        marginBottom: '1.2rem',
                      }}
                    >
                      You're someone I want to understand, respect, protect, and grow old with.
                    </motion.p>
                  )}

                  {boldScene5Step >= 8 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        color: 'rgba(245, 240, 235, 0.9)',
                        lineHeight: 1.8,
                        marginBottom: '2rem',
                      }}
                    >
                      I want to give you my affection, my effort, my honesty, my time, and the kind of love that keeps showing up long after the butterflies settle.
                    </motion.p>
                  )}

                  {boldScene5Step >= 9 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        padding: '1.6rem',
                        borderRadius: '16px',
                        background: 'rgba(232, 195, 125, 0.08)',
                        border: '1px solid rgba(232, 195, 125, 0.25)',
                        marginBottom: '2rem',
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fbe2a8', marginBottom: '0.4rem' }}>
                        "You're my world, meri Nousheen."
                      </p>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#fdfbf7', fontStyle: 'italic', marginBottom: '0.4rem' }}>
                        Jisko main sajana chahta hoon.
                      </p>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#fdfbf7', fontStyle: 'italic', margin: 0 }}>
                        Jiske saath main apni zindagi banana chahta hoon.
                      </p>
                    </motion.div>
                  )}

                  {boldScene5Step >= 10 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.08rem',
                        color: '#f5c67d',
                        lineHeight: 1.85,
                        fontStyle: 'italic',
                        marginBottom: '2rem',
                      }}
                    >
                      "Allah kare, one day we get to turn all these imagined moments into real memories, in a relationship filled with love, respect, and barakah."
                    </motion.p>
                  )}

                  {boldScene5Step >= 11 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
                          color: '#fbe2a8',
                          marginBottom: '1rem',
                        }}
                      >
                        "I love you, my bachaa. ❤️"
                      </h3>

                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.05rem',
                          color: 'rgba(245, 240, 235, 0.9)',
                          lineHeight: 1.7,
                          fontStyle: 'italic',
                          marginBottom: '2rem',
                        }}
                      >
                        "And meri jaan... I've also written down 100 little cute things I dream of living with you. ♡"
                      </p>

                      <button
                        onClick={() => {
                          setPhase('cute-flow');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '13px 32px',
                          borderRadius: '100px',
                          background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                          color: '#120b06',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 30px rgba(232, 176, 104, 0.45)',
                        }}
                      >
                        SEE OUR 100 CUTE LITTLE MOMENTS →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer "09 / 14" Subtle Badge */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 20,
          paddingTop: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            color: 'rgba(235, 195, 130, 0.4)',
          }}
        >
          09 / 14
        </span>

        {phase === 'scrapbook' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'rgba(245, 240, 235, 0.35)',
            }}
          >
            ✦ handmade with love for Nousheen
          </span>
        )}
      </div>
    </div>
  );
}
