const planVideo = document.getElementById('plan-video');
const planReplay = document.getElementById('plan-replay');
const planToggle = document.getElementById('plan-toggle');

const syncPlanControl = () => {
  const paused = planVideo.paused;
  planToggle.textContent = paused ? 'Play film ▶' : 'Pause film Ⅱ';
  planToggle.setAttribute('aria-label', paused ? 'Play film' : 'Pause film');
};

planReplay.addEventListener('click', () => {
  planVideo.currentTime = 0;
  planVideo.play().then(syncPlanControl).catch(syncPlanControl);
});

planToggle.addEventListener('click', () => {
  if (planVideo.paused) planVideo.play().then(syncPlanControl).catch(syncPlanControl);
  else { planVideo.pause(); syncPlanControl(); }
});

planVideo.addEventListener('play', syncPlanControl);
planVideo.addEventListener('pause', syncPlanControl);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) planVideo.play().catch(syncPlanControl);
    else planVideo.pause();
  }, { threshold: .15 });
  observer.observe(planVideo);
}
