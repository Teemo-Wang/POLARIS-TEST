const TeemoHeroVideo = document.querySelector("[data-Teemo-hero-video]");
const TeemoProjectVideos = [...document.querySelectorAll("[data-Teemo-project-video]")];
const TeemoConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const TeemoShouldWarmVideos =
  !TeemoConnection?.saveData && !["slow-2g", "2g"].includes(TeemoConnection?.effectiveType);

if ("IntersectionObserver" in window) {
  const TeemoPrepareVideo = (TeemoVideo) => {
    if (TeemoVideo.dataset.teemoPrepared === "true") {
      return;
    }

    TeemoVideo.dataset.teemoPrepared = "true";
    TeemoVideo.preload = "auto";
    TeemoVideo.load();
  };

  const TeemoPreloadObserver = new IntersectionObserver(
    (entries, TeemoObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        TeemoPrepareVideo(entry.target);
        TeemoObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "1400px 0px",
      threshold: 0.01,
    },
  );

  const TeemoPlaybackObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const TeemoVideo = entry.target;

        if (entry.isIntersecting && document.visibilityState === "visible") {
          TeemoPrepareVideo(TeemoVideo);
          TeemoVideo.play().catch(() => {});
        } else {
          TeemoVideo.pause();
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.18,
    },
  );

  TeemoProjectVideos.forEach((TeemoVideo) => {
    TeemoPreloadObserver.observe(TeemoVideo);
    TeemoPlaybackObserver.observe(TeemoVideo);
  });

  if (TeemoHeroVideo) {
    const TeemoHeroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && document.visibilityState === "visible") {
          TeemoHeroVideo.play().catch(() => {});
        } else {
          TeemoHeroVideo.pause();
        }
      },
      { threshold: 0.08 },
    );

    TeemoHeroObserver.observe(TeemoHeroVideo);
  }

  if (TeemoShouldWarmVideos) {
    let TeemoWarmIndex = 0;

    const TeemoWarmNextVideo = () => {
      const TeemoVideo = TeemoProjectVideos[TeemoWarmIndex];

      if (!TeemoVideo) {
        return;
      }

      TeemoPrepareVideo(TeemoVideo);
      TeemoWarmIndex += 1;
      window.setTimeout(TeemoWarmNextVideo, 1600);
    };

    const TeemoScheduleWarmup = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(TeemoWarmNextVideo, { timeout: 1200 });
      } else {
        window.setTimeout(TeemoWarmNextVideo, 500);
      }
    };

    if (TeemoHeroVideo?.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      TeemoScheduleWarmup();
    } else if (TeemoHeroVideo) {
      TeemoHeroVideo.addEventListener("canplay", TeemoScheduleWarmup, { once: true });
    } else {
      TeemoScheduleWarmup();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      TeemoHeroVideo?.pause();
      TeemoProjectVideos.forEach((TeemoVideo) => TeemoVideo.pause());
      return;
    }

    const TeemoVisibleVideo = [TeemoHeroVideo, ...TeemoProjectVideos].find((TeemoVideo) => {
      if (!TeemoVideo) {
        return false;
      }

      const TeemoBounds = TeemoVideo.getBoundingClientRect();
      return TeemoBounds.bottom > 0 && TeemoBounds.top < window.innerHeight;
    });

    TeemoVisibleVideo?.play().catch(() => {});
  });
} else {
  TeemoProjectVideos.forEach((TeemoVideo) => {
    TeemoVideo.preload = "auto";
    TeemoVideo.play().catch(() => {});
  });
}
