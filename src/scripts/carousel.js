/* 最新エピソード欄の横スライド。
   - 動画はアクティブなスライドにだけ差し込む（YouTubeの読み込みを1本に抑える）
   - 自動送りは、ホバー・キーボード操作・動画再生中・タブ非表示のあいだ止める
   - prefers-reduced-motion では自動送りもスライドもしない */
var root = document.querySelector('.ep-carousel');

if (root) {
  var track = root.querySelector('.ep-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.ep-slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.ep-dot'));
  var interval = parseInt(root.getAttribute('data-interval'), 10) || 6000;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var timer = null;
  var held = false; // 再生中などで自動送りを止めている状態

  root.style.setProperty('--ep-interval', interval + 'ms');

  var mountVideo = function (slide) {
    var screen = slide.querySelector('.screen');
    if (!screen) return;
    var id = screen.getAttribute('data-video');
    if (!id || screen.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    f.title = screen.getAttribute('data-title') || 'YouTube';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    screen.appendChild(f);
  };

  var unmountVideo = function (slide) {
    var screen = slide.querySelector('.screen');
    if (!screen) return;
    var f = screen.querySelector('iframe');
    if (f) f.parentNode.removeChild(f); // 離れたスライドの再生は止める
    screen.classList.remove('is-playing');
  };

  var apply = function () {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    slides.forEach(function (s, i) {
      var on = i === index;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) { s.removeAttribute('inert'); }
      else { s.setAttribute('inert', ''); unmountVideo(s); }
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    restartProgress();
  };

  var restartProgress = function () {
    var bar = dots[index] && dots[index].querySelector('.bar');
    if (!bar) return;
    bar.style.animation = 'none';
    void bar.offsetWidth; // 強制リフローでアニメーションを頭から
    bar.style.animation = '';
    bar.style.animationPlayState = held ? 'paused' : 'running';
  };

  var goTo = function (i) {
    index = (i + slides.length) % slides.length;
    apply();
  };

  var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

  var start = function () {
    stop();
    if (reduced || slides.length < 2 || held) return;
    timer = setInterval(function () { goTo(index + 1); }, interval);
  };

  var hold = function (on) {
    held = on;
    var bar = dots[index] && dots[index].querySelector('.bar');
    if (bar) bar.style.animationPlayState = on ? 'paused' : 'running';
    if (on) stop(); else start();
  };

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); hold(false); });
  });

  // 再生ボタン：動画を前面に出し、自動送りを止める
  root.querySelectorAll('.ep-play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var screen = btn.closest('.screen');
      if (!screen) return;
      screen.classList.add('is-playing');
      mountVideo(btn.closest('.ep-slide'));
      hold(true); // 見ているあいだは勝手に送らない
    });
  });

  root.addEventListener('mouseenter', function () { hold(true); });
  root.addEventListener('mouseleave', function () {
    var inside = root.querySelector('.screen.is-playing');
    if (!inside) hold(false);
  });
  root.addEventListener('focusin', function () { hold(true); });

  // 動画(iframe)にフォーカスが移ったら再生中とみなして止める
  window.addEventListener('blur', function () {
    var el = document.activeElement;
    if (el && el.tagName === 'IFRAME' && root.contains(el)) hold(true);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else if (!held) start();
  });

  apply();
  start();
}
