const introRoot = document.documentElement;
const intro = document.getElementById('intro-loader');
const greeting = document.getElementById('intro-greeting');
const counter = document.getElementById('intro-count');
const introReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const greetings = [
  ['Hello', 'en'], ['नमस्ते', 'hi'], ['Hola', 'es'], ['Bonjour', 'fr'],
  ['こんにちは', 'ja'], ['Ciao', 'it'], ['مرحبا', 'ar'], ['안녕하세요', 'ko']
];
let introTimer = 0;
let introAnimation;
const saveIntroSeen = () => { try { sessionStorage.setItem('av-intro-seen', '1'); } catch { /* Browsers may disable storage. */ } };
const finishIntro = () => {
  clearTimeout(introTimer);
  introAnimation?.cancel();
  intro.classList.add('is-ending');
  saveIntroSeen();
  introTimer = setTimeout(() => {
    introRoot.classList.remove('intro-ready');
    intro.classList.remove('is-ending');
  }, introReduced ? 0 : 600);
};
const showWord = (word, language, index, final = false) => {
  greeting.textContent = word;
  greeting.lang = language;
  greeting.dir = language === 'ar' ? 'rtl' : 'ltr';
  greeting.classList.toggle('is-final', final);
  counter.textContent = `${String(index + 1).padStart(2, '0')} / 09`;
  introAnimation?.cancel();
  if (!introReduced) introAnimation = greeting.animate([
    { opacity: 0, transform: 'translateY(19px) scale(.96)', filter: 'blur(8px)' },
    { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
  ], { duration: final ? 450 : 240, easing: 'cubic-bezier(.18,.8,.2,1)', fill: 'forwards' });
};
const runIntro = () => {
  clearTimeout(introTimer);
  intro.classList.remove('is-ending');
  introRoot.classList.add('intro-ready');
  let index = 0;
  const advance = () => {
    if (index < greetings.length) {
      const [word, language] = greetings[index];
      showWord(word, language, index);
      index++;
      introTimer = setTimeout(advance, introReduced ? 75 : 255);
    } else {
      showWord('My Portfolio', 'en', greetings.length, true);
      introTimer = setTimeout(finishIntro, introReduced ? 350 : 1050);
    }
  };
  advance();
};
document.getElementById('intro-skip').addEventListener('click', finishIntro);
document.getElementById('show-intro').addEventListener('click', runIntro);
if (introRoot.classList.contains('intro-ready')) runIntro();
