document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.lang');
  const translatable = document.querySelectorAll('[data-vi][data-en]');
  const viPanels = document.querySelectorAll('.vi-panel');
  const enPanels = document.querySelectorAll('.en-panel');

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('kst-language', lang);
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    translatable.forEach(el => {
      const value = el.dataset[lang];
      if (value !== undefined) el.innerHTML = value;
    });
    viPanels.forEach(el => el.hidden = lang !== 'vi');
    enPanels.forEach(el => el.hidden = lang !== 'en');
  }

  buttons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  setLanguage(localStorage.getItem('kst-language') || 'vi');
});