document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const header = document.getElementById("header");
  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle("header-scrolled", window.scrollY > 50);
    };

    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  const mobileNavShow = document.querySelector(".mobile-nav-show");
  const mobileNavHide = document.querySelector(".mobile-nav-hide");
  const mobileNavToggles = document.querySelectorAll(".mobile-nav-toggle");

  function mobileNavToggle() {
    document.body.classList.toggle("mobile-nav-active");

    if (mobileNavShow && mobileNavHide) {
      mobileNavShow.classList.toggle("d-none");
      mobileNavHide.classList.toggle("d-none");
      const expanded = !mobileNavShow.classList.contains("d-none");
      mobileNavShow.setAttribute("aria-expanded", String(expanded));
      mobileNavHide.setAttribute("aria-expanded", String(!expanded));
    }
  }

  mobileNavToggles.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      mobileNavToggle();
    });

    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        mobileNavToggle();
      }
    });
  });

  document.querySelectorAll("#navbar a").forEach((navbarLink) => {
    if (!navbarLink.hash) return;
    if (!document.querySelector(navbarLink.hash)) return;

    navbarLink.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  document.querySelectorAll(".navbar .dropdown > a").forEach((el) => {
    el.addEventListener("click", function (event) {
      if (!document.body.classList.contains("mobile-nav-active")) return;

      event.preventDefault();
      this.classList.toggle("active");
      if (this.nextElementSibling) {
        this.nextElementSibling.classList.toggle("dropdown-active");
      }

      const dropDownIndicator = this.querySelector(".dropdown-indicator");
      if (dropDownIndicator) {
        dropDownIndicator.classList.toggle("bi-chevron-up");
        dropDownIndicator.classList.toggle("bi-chevron-down");
      }
    });
  });

  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    let ticking = false;
    const toggleScrollTop = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        scrollTop.classList.toggle("active", window.scrollY > 100);
        ticking = false;
      });
      ticking = true;
    };

    toggleScrollTop();
    window.addEventListener("scroll", toggleScrollTop, { passive: true });

    scrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const lazyBackgrounds = document.querySelectorAll(".lazy-bg[data-bg]");
  if (lazyBackgrounds.length > 0) {
    const applyBackground = (el) => {
      const bg = el.getAttribute("data-bg");
      if (!bg) return;

      el.style.backgroundImage = `url(${bg})`;
      el.removeAttribute("data-bg");
      el.classList.remove("lazy-bg");
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            applyBackground(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: "200px 0px" }
      );

      lazyBackgrounds.forEach((el) => observer.observe(el));
    } else {
      lazyBackgrounds.forEach(applyBackground);
    }
  }

  const initSwiper = (selector, options) => {
    if (typeof window.Swiper !== "function") return;
    if (!document.querySelector(selector)) return;
    new window.Swiper(selector, options);
  };

  initSwiper(".slides-1", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });

  initSwiper(".slides-2", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  if (typeof window.AOS !== "undefined" && document.querySelector("[data-aos]")) {
    window.addEventListener("load", () => {
      window.AOS.init({
        duration: 800,
        easing: "slide",
        once: true,
        mirror: false
      });
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#navbar a");
  if (sections.length > 0 && navLinks.length > 0) {
    let scrollTicking = false;

    const onScroll = () => {
      if (scrollTicking) return;

      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset + 120;

        sections.forEach((current) => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop;
          const sectionId = current.getAttribute("id");

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active");
              }
            });
          }
        });

        scrollTicking = false;
      });

      scrollTicking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const form = document.querySelector(".php-email-form");
  if (!form) return;

  let emailjsLoaded = false;

  const loadEmailJS = () =>
    new Promise((resolve, reject) => {
      if (emailjsLoaded && window.emailjs) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
      script.async = true;
      script.onload = () => {
        if (!window.emailjs) {
          reject(new Error("EmailJS introuvable"));
          return;
        }

        window.emailjs.init("kLZq69eLEqqI1qTL_");
        emailjsLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Chargement EmailJS impossible"));
      document.head.appendChild(script);
    });

  form.addEventListener(
    "focusin",
    () => {
      loadEmailJS().catch(() => {});
    },
    { once: true }
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    if (loading) loading.style.display = "block";
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
    if (sentMessage) sentMessage.style.display = "none";

    try {
      await loadEmailJS();

      const formData = {
        prenom: form.prenom.value,
        nom: form.nom.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
      };

      await window.emailjs.send("service_ke7nlrq", "template_weqg3uf", formData);

      if (loading) loading.style.display = "none";
      if (sentMessage) sentMessage.style.display = "block";
      form.reset();
    } catch (error) {
      if (loading) loading.style.display = "none";
      if (errorMessage) {
        errorMessage.textContent = "Une erreur s'est produite. Veuillez réessayer.";
        errorMessage.style.display = "block";
      }
      console.error("EmailJS Error:", error);
    }
  });
});

