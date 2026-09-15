var header = document.getElementById('site-header');
  var onScroll = function(){
  if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var scrim = document.getElementById('navScrim');
  function closeNav(){
  if (!toggle || !nav || !scrim) return;
    nav.classList.remove('open'); scrim.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }
if (toggle && nav && scrim) {
  toggle.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    scrim.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  scrim.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
}

  document.querySelectorAll('.step').forEach(function(step){
  var stepHead = step.querySelector('.step-head');
  if (!stepHead) return;
  stepHead.addEventListener('click', function(){
      var wasOpen = step.classList.contains('open');
      document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('open'); });
      if (!wasOpen) step.classList.add('open');
    });
  });

  var dot = document.getElementById('diDot');
  var label = document.getElementById('diLabel');
  var darkSections = Array.prototype.slice.call(document.querySelectorAll('[data-theme="dark"]'));
  function lerpColor(a,b,t){
    var ar=parseInt(a.substr(1,2),16), ag=parseInt(a.substr(3,2),16), ab=parseInt(a.substr(5,2),16);
    var br=parseInt(b.substr(1,2),16), bg=parseInt(b.substr(3,2),16), bb=parseInt(b.substr(5,2),16);
    var r=Math.round(ar+(br-ar)*t), g=Math.round(ag+(bg-ag)*t), bl=Math.round(ab+(bb-ab)*t);
    return 'rgb('+r+','+g+','+bl+')';
  }
  function onDepthScroll(){
    if (!dot || !label) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var frac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var trackHeight = 200;
    dot.style.top = (frac * trackHeight) + 'px';
    label.style.top = (frac * trackHeight - 6) + 'px';
    label.textContent = Math.round(frac * 320) + ' m';
    dot.style.background = lerpColor('#588d43', '#8f5f34', frac);

    var mid = window.innerHeight * 0.5;
    var onDark = darkSections.some(function(sec){
      var r = sec.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    document.body.classList.toggle('on-dark-section', onDark);
  }
  document.addEventListener('scroll', onDepthScroll, {passive:true});
  window.addEventListener('resize', onDepthScroll);
  onDepthScroll();

  var form = document.querySelector('.php-email-form');
  if (form) {
    var emailjsLoaded = false;

    function loadEmailJS(){
      return new Promise(function(resolve, reject){
        if (emailjsLoaded && window.emailjs) {
          resolve();
          return;
        }

        var existingScript = document.querySelector('script[data-emailjs]');
        if (existingScript) {
          existingScript.addEventListener('load', function(){
            if (!window.emailjs) {
              reject(new Error('EmailJS introuvable'));
              return;
            }
            window.emailjs.init('kLZq69eLEqqI1qTL_');
            emailjsLoaded = true;
            resolve();
          }, {once:true});
          existingScript.addEventListener('error', function(){
            reject(new Error('Chargement EmailJS impossible'));
          }, {once:true});
          return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
        script.async = true;
        script.dataset.emailjs = 'true';
        script.onload = function(){
          if (!window.emailjs) {
            reject(new Error('EmailJS introuvable'));
            return;
          }
          window.emailjs.init('kLZq69eLEqqI1qTL_');
          emailjsLoaded = true;
          resolve();
        };
        script.onerror = function(){ reject(new Error('Chargement EmailJS impossible')); };
        document.head.appendChild(script);
      });
    }

    form.addEventListener('focusin', function(){
      loadEmailJS().catch(function(){});
    }, {once:true});

    form.addEventListener('submit', function(event){
      event.preventDefault();

      var loading = form.querySelector('.loading');
      var errorMessage = form.querySelector('.error-message');
      var sentMessage = form.querySelector('.sent-message');

      if (loading) loading.style.display = 'block';
      if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
      }
      if (sentMessage) sentMessage.style.display = 'none';

      loadEmailJS()
        .then(function(){
          var formData = {
            prenom: form.elements.prenom.value,
            nom: form.elements.nom.value,
            email: form.elements.email.value,
            phone: form.elements.phone.value,
            message: form.elements.message.value
          };

          return window.emailjs.send('service_ke7nlrq', 'template_weqg3uf', formData);
        })
        .then(function(){
          if (loading) loading.style.display = 'none';
          if (sentMessage) sentMessage.style.display = 'block';
          form.reset();
        })
        .catch(function(error){
          if (loading) loading.style.display = 'none';
          if (errorMessage) {
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            errorMessage.style.display = 'block';
          }
          console.error('EmailJS Error:', error);
        });
    });
  }
