// DESIGN SYSTEM: Arquivo de Infraestrutura — movimento discreto, informativo e respeitoso à preferência de redução de movimento.
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = document.querySelectorAll(
    ".profile-main, .profile-statement, .projects-intro, .project-card, .experience-header, .timeline-item, .capabilities-top, .capability-columns, .education-content, .contact-body"
  );

  targets.forEach((element) => element.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((element) => observer.observe(element));
});
