/* 最新エピソード欄の横スライド。
   - 動画は再生ボタンを押したときだけ読み込む（6秒ごとに読み直さないため）
   - 自動送りは「停止理由」を個別に持ち、全部が解除されたときだけ再開する
   - prefers-reduced-motion では自動送りもスライドもしない */
var root = document.querySelector('.ep-carousel');

if (root) {
  var track = root.querySelector('.ep-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.ep-slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.ep-dot'));
  var interval = parseInt(root.getAttribute('data-interval'), 10) || 6000;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;
  var index = 0;
  var timer = null;

  // 停止理由。ひとつでも立っていれば自動送りを止める
  var holds = { hover: false, focus: false, playing: false, hidden: false };
  var isHeld = function () {
    return holds.hover || holds.focus || holds.playing || holds.hidden;
  };

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

  var sync = function () {
    if (isHeld()) {
      if (timer) { clearInterval(timer); timer = null; }
    } else if (!timer && !reduced && slides.length > 1) {
      timer = setInterval(function () { goTo(index + 1); }, interval);
    }
    var bar = dots[index] && dots[index].querySelector('.bar');
    if (bar) bar.style.animationPlayState = isHeld() ? 'paused' : 'running';
  };

  var setHold = function (name, on) {
    if (holds[name] === on) return;
    holds[name] = on;
    sync();
  };

  var apply = function () {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    slides.forEach(function (s, i) {
      var on = i === index;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) s.removeAttribute('inert');
      else { s.setAttribute('inert', ''); unmountVideo(s); }
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    // 再生中のスライドが残っていなければ再生停止扱いに戻す
    if (!root.querySelector('.screen.is-playing')) holds.playing = false;
    restartProgress();
    sync();
  };

  var restartProgress = function () {
    var bar = dots[index] && dots[index].querySelector('.bar');
    if (!bar) return;
    bar.style.animation = 'none';
    void bar.offsetWidth; // 強制リフローでアニメーションを頭から
    bar.style.animation = '';
  };

  var goTo = function (i) {
    index = (i + slides.length) % slides.length;
    apply();
  };

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

  root.querySelectorAll('.ep-play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var screen = btn.closest('.screen');
      if (!screen) return;
      screen.classList.add('is-playing');
      mountVideo(btn.closest('.ep-slide'));
      setHold('playing', true); // 見ているあいだは勝手に送らない
    });
  });

  // ホバーで止めるのはマウスのある環境だけ。
  // タッチ端末では mouseenter だけ発火して mouseleave が来ず、止まったままになる
  if (canHover) {
    root.addEventListener('mouseenter', function () { setHold('hover', true); });
    root.addEventListener('mouseleave', function () { setHold('hover', false); });
  }

  // フォーカスは入ったら止め、出たら必ず戻す
  root.addEventListener('focusin', function () { setHold('focus', true); });
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) setHold('focus', false);
  });

  // 動画(iframe)にフォーカスが移ったら再生中とみなす
  window.addEventListener('blur', function () {
    var el = document.activeElement;
    if (el && el.tagName === 'IFRAME' && root.contains(el)) setHold('playing', true);
  });

  document.addEventListener('visibilitychange', function () {
    setHold('hidden', document.hidden);
  });

  apply();
}
