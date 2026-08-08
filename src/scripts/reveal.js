/* .wr は clip-path:inset(0 100% 0 0) で幅0に潰れる。Chromium系(Brave/Chrome)は
   要素自身の clip-path を交差判定に反映するため intersectionRatio が常に0になり、
   閾値付きでは永久に発火しない（WebKit/Safariは反映しないので発生しない）。
   よって threshold は 0 固定とし、発火タイミングは rootMargin の下辺マイナスで作る。 */
var revealTargets = document.querySelectorAll('.wr,.fr');

if (!('IntersectionObserver' in window)) {
  revealTargets.forEach(function (el) {
    el.classList.add('in');
  });
} else {
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' }
  );
  revealTargets.forEach(function (el) {
    io.observe(el);
  });
}
