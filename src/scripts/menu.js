var btn = document.getElementById('menuBtn');
var panel = document.getElementById('mobileNav');

if (btn && panel) {
  var open = function () {
    panel.hidden = false;
    // 強制リフローを挟んでからクラスを付ける（rAFだとタブ非表示時に発火せず開かない）
    void panel.offsetHeight;
    panel.classList.add('in');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
  };

  var close = function () {
    panel.classList.remove('in');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!panel.classList.contains('in')) panel.hidden = true;
    }, 500);
  };

  btn.addEventListener('click', function () {
    if (btn.getAttribute('aria-expanded') === 'true') close();
    else open();
  });

  // リンクを踏んだら閉じる（同一ページ内アンカーでも閉じるように）
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close();
  });
}
