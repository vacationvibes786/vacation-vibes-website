(function(){
  // header shrink
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ header.classList.add('shrink'); }
    else{ header.classList.remove('shrink'); }
  });

  // mobile nav
  var burger = document.getElementById('burgerBtn');
  var mnav = document.getElementById('mobileNav');
  var mclose = document.getElementById('mobileNavClose');
  burger.addEventListener('click', function(){ mnav.classList.add('open'); });
  mclose.addEventListener('click', function(){ mnav.classList.remove('open'); });
  mnav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mnav.classList.remove('open'); });
  });

  // reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // testimonial carousel
  var slides = document.querySelectorAll('.testi-slide');
  var dotsWrap = document.getElementById('testiDots');
  var current = 0;
  slides.forEach(function(_, i){
    var b = document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click', function(){ goTo(i); });
    dotsWrap.appendChild(b);
  });
  var dots = dotsWrap.querySelectorAll('button');
  function goTo(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  setInterval(function(){
    goTo((current+1) % slides.length);
  }, 5500);

  // newsletter join (FormSubmit — no backend needed)
  var nForm = document.getElementById('newsletterForm');
  var nMsg = document.getElementById('newsletterMsg');
  if(nForm){
    nForm.addEventListener('submit', function(e){
      e.preventDefault();
      var emailInput = document.getElementById('newsletterEmail');
      var email = emailInput.value.trim();
      var btn = nForm.querySelector('button');
      if(!email){ return; }
      btn.disabled = true;
      nMsg.textContent = 'Joining...';
      nMsg.className = 'newsletter-msg';
      fetch('https://formsubmit.co/ajax/vacationvibes.ks@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          _subject: 'New Vacation Vibes newsletter signup!'
        })
      })
      .then(function(res){ return res.json().then(function(data){ return {ok: res.ok, data: data}; }); })
      .then(function(result){
        if(result.ok){
          nMsg.textContent = "You're in! We'll be in touch.";
          nMsg.className = 'newsletter-msg ok';
          nForm.reset();
        } else {
          throw new Error('submit failed');
        }
      })
      .catch(function(){
        nMsg.textContent = 'Something went wrong — please email us directly instead.';
        nMsg.className = 'newsletter-msg err';
      })
      .finally(function(){
        btn.disabled = false;
      });
    });
  }
})();
