/* エピソード一覧の動画。
   サムネイルを出しておき、再生ボタンが押されたときだけ YouTube を読み込む。
   最初から埋め込むと、並んだ本数ぶんプレーヤーを読み込むことになるため。 */
document.querySelectorAll('.ep-row .ep-play').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var screen = btn.closest('.screen');
    if (!screen || screen.querySelector('iframe')) return;
    var id = screen.getAttribute('data-video');
    if (!id) return;

    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    f.title = screen.getAttribute('data-title') || 'YouTube';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    screen.appendChild(f);
    screen.classList.add('is-playing');
  });
});
