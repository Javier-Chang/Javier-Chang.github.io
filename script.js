const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sticky-nav a');
const backToTop = document.getElementById('backToTop');

// 全新追加：Apple 商品櫥窗箭頭點擊滾動控制函式
function scrollCarousel(trackId, direction) {
  const trackContainer = document.getElementById(trackId)?.closest('.carousel-track-container');
  if (trackContainer) {
    const scrollAmount = 300 * direction;
    trackContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}

// 清除所有連結的 active 狀態與顏色 class
function clearNavStyles() {
  navLinks.forEach(link => {
    link.classList.remove('active');
    link.className = link.className.split(' ').filter(c => !c.startsWith('color-')).join(' ');
  });
}

// 替特定 Link 加上 active 與專屬色，並在手機上自動將標籤捲動到可見範圍
function activateNavLink(link, sectionId) {
  link.classList.add('active');
  link.classList.add(`color-${sectionId}`);
  
  if (window.innerWidth <= 850 && link) {
    link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function onScroll() {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  
  if (backToTop) {
    if (scrollPos > 400) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }

  /* 💡 核心修正：解決頁面初始化未完全展開導致 offset 計算錯誤與字體隱形 bug 
     當網頁處於最頂端附近（scrollPos < 60），強制將第一個 Summary 點亮藍色背景 */
  if (scrollPos < 60) {
    clearNavStyles();
    const firstLink = document.querySelector('.sticky-nav a[href="#summary"]');
    if (firstLink) activateNavLink(firstLink, 'summary');
    return;
  }

  // 1. 特殊判定：觸底強制亮最後一區 (publications)
  if (scrollPos + windowHeight >= docHeight - 20) {
    clearNavStyles();
    const lastLink = document.querySelector('.sticky-nav a[href="#publications"]');
    if (lastLink) activateNavLink(lastLink, 'publications');
    return;
  }

  // 2. 一般區間滾動判斷
  sections.forEach(section => {
    const top = section.offsetTop - 160; /* 微調至 160 緩衝，滾動切換更精準絲滑 */
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      clearNavStyles();
      const currentLink = document.querySelector(`.sticky-nav a[href="#${section.id}"]`);
      if (currentLink) {
        activateNavLink(currentLink, section.id);
      }
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
document.addEventListener('DOMContentLoaded', onScroll);

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 燈箱控制邏輯
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('img');
  const lightboxTxt = lightbox.querySelector('p');

  document.querySelectorAll('.zoom-gallery img').forEach(img => {
    img.addEventListener('click', () => {
      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxTxt) lightboxTxt.textContent = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; 
  });
}