// Sticky header on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // Preloader
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  // Mobile nav toggle
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      mobileNavToggle();
    });
  });

  function mobileNavToggle() {
    document.body.classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  // Hide mobile nav on same-page/hash links
  document.querySelectorAll('#navbar a').forEach(navbarlink => {
    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  // Mobile nav dropdowns
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');
  navDropdowns.forEach(el => {
    el.addEventListener('click', function (event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        const dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    });
  });

  // Scroll top button
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    let ticking = false;

    const toggleScrollTop = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollTop.classList.toggle('active', window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Swiper sliders
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  new Swiper('.slides-2', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
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

  // AOS animation
  window.addEventListener('load', () => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      throttleDelay: 150,
      debounceDelay: 100
    });
  });

});

// Scrollspy for nav active link
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#navbar a");
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop;
          const sectionId = current.getAttribute("id");

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + sectionId) {
                link.classList.add("active");
              }
            });
          }
        });

        scrollTicking = false;
      });

      scrollTicking = true;
    }
  }

  window.addEventListener("scroll", onScroll);
});

// EmailJS contact form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".php-email-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    requestAnimationFrame(() => {
      loading.style.display = "block";
      errorMessage.style.display = "none";
      sentMessage.style.display = "none";
    });

    const formData = {
      prenom: form.prenom.value,
      nom: form.nom.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    emailjs.send("service_gqcoiti", "template_weqg3uf", formData)
      .then(() => {
        requestAnimationFrame(() => {
          loading.style.display = "none";
          sentMessage.style.display = "block";
          form.reset();
        });
      }, (error) => {
        requestAnimationFrame(() => {
          loading.style.display = "none";
          errorMessage.innerText = "Une erreur s'est produite. Veuillez réessayer.";
          errorMessage.style.display = "block";
        });
        console.error("EmailJS Error:", error);
      });
  });
});
