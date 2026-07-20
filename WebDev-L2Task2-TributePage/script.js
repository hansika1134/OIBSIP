// Small progressive enhancement: fade in milestones as they scroll into view.
document.addEventListener('DOMContentLoaded', () => {
  const milestones = document.querySelectorAll('.milestone');
  milestones.forEach(m => {
    m.style.opacity = 0;
    m.style.transform = 'translateY(12px)';
    m.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  milestones.forEach(m => observer.observe(m));
});
