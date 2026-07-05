var io = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll('.wr,.fr').forEach(function (el) {
  io.observe(el);
});
