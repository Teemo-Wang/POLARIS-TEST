const TeemoProjectVideos = document.querySelectorAll("[data-Teemo-project-video]");

if ("IntersectionObserver" in window) {
  const TeemoVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const TeemoVideo = entry.target;

        if (entry.isIntersecting) {
          TeemoVideo.play().catch(() => {});
        } else {
          TeemoVideo.pause();
        }
      });
    },
    {
      rootMargin: "120px 0px",
      threshold: 0.18,
    },
  );

  TeemoProjectVideos.forEach((TeemoVideo) => {
    TeemoVideoObserver.observe(TeemoVideo);
  });
} else {
  TeemoProjectVideos.forEach((TeemoVideo) => {
    TeemoVideo.play().catch(() => {});
  });
}
