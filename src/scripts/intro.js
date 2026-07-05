var intro = document.getElementById('intro');
var video = document.getElementById('introVideo');
if (intro && video) {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navType = 'navigate';
  try {
    var ne = performance.getEntriesByType('navigation');
    if (ne && ne[0]) navType = ne[0].type;
  } catch (e) {}
  var internalRef = false;
  try {
    internalRef = document.referrer !== '' && new URL(document.referrer).origin === location.origin;
  } catch (e) {}
  var show = navType === 'reload' || !internalRef;

  var dismiss = function () {
    if (intro.classList.contains('leave') || intro.classList.contains('gone')) return;
    intro.classList.add('leave');
    setTimeout(function () {
      intro.classList.add('gone');
      document.body.style.overflow = '';
    }, 600);
  };

  if (!show || reduced) {
    intro.classList.add('gone');
  } else {
    document.body.style.overflow = 'hidden';
    var portrait = window.matchMedia('(orientation: portrait)').matches;
    var srcMain = portrait ? '/DETOURNE-intro-9x16.mp4' : '/DETOURNE-intro.mp4';
    var srcFallback = '/DETOURNE-intro.mp4';
    video.addEventListener('error', function once() {
      if (video.src.indexOf(srcFallback) === -1) {
        video.src = srcFallback;
        video.play().catch(dismiss);
      } else dismiss();
      video.removeEventListener('error', once);
    });
    video.addEventListener('ended', dismiss);
    video.src = srcMain;
    var p = video.play();
    if (p && p.catch) p.catch(dismiss);
    intro.addEventListener('click', dismiss);
    document.addEventListener('keydown', function once() {
      dismiss();
      document.removeEventListener('keydown', once);
    });
    setTimeout(dismiss, 9000);
  }
}
