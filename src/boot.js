document.documentElement.classList.add('js');
try { if (!sessionStorage.getItem('av-intro-seen') || new URLSearchParams(location.search).has('intro')) document.documentElement.classList.add('intro-ready'); } catch { document.documentElement.classList.add('intro-ready'); }
