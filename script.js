(function(){
'use strict';

var MEMBERS_DATA = [
  {
    id:"001",
    name:"やまだ",
    title_ja:"総統",
    title_en:"Führer",
    role:"president",
    description:"N帝国の創設者、指導者。",
    color:"#00e0ff",
    img:"assets/members/やまだ.png"
  },
  {
    id:"002",
    name:"みとうと",
    title_ja:"執権",
    title_en:"Behörde",
    role:"authority",
    description:"総統の代わりに動く",
    color:"#00e0ff",
    img:"assets/members/みとうと.png"
  }
]

var NEWS_DATA = [
  {
    date:"2026-05-04",
    title:"帝国樹立",
    content:"N帝国の創設者であるやまだが、新たな国家の誕生を宣言しました。"
  },
];

})();

var allNews = NEWS_DATA.slice();
var newsDisplayCount = 5;

function initBoot(){
  var screen = document.getElementById('boot-screen');
  var logEl = document.getElementById('boot-log');
  var bar = document.getElementById('boot-bar-fill');
  var statusEl = document.getElementById('boot-status');
  if(!screen) return Promise.resolve();

  var lines = [
    ["<span style='color:#00e0ff'>[0.01]</span>","ESTABLISHING SECURE CHANNEL..."],
    ["<span style='color:#00e0ff'>[0.14]</span>","HANDSHAKE // TK-NULL-0001"],
    ["<span style='color:#00e0ff'>[0.29]</span>","<b>AUTH GRANTED</b>"],
    ["<span style='color:#00e0ff'>[0.43]</span>","LOADING NULL_OS v9.7.4"],
    ["<span style='color:#00e0ff'>[0.61]</span>","DECRYPTING MEMBER ROSTER..."],
    ["<span style='color:#00e0ff'>[0.78]</span>","SYNCING IMPERIAL TRANSMISSIONS..."],
    ["<span style='color:#00e0ff'>[0.93]</span>","<b>READY</b> <i>// ALL SYSTEMS OPERATIONAL.</i>"]
  ];

  return new Promise(function(resolve){
    var i = 0;
    function step(){
      if(i >= lines.length){
        bar.style.width = '100%';
        if(statusEl) statusEl.textContent = 'BOOT SEQUENCE COMPLETE';
        setTimeout(function(){
          screen.classList.add('hidden');
          setTimeout(resolve, 500);
        }, 420);
        return;
      }
      var entry = lines[i];
      logEl.innerHTML += entry[0] + ' ' + entry[1] + '\n';
      bar.style.width = Math.round(((i+1)/lines.length)*100) + '%';
      if(statusEl && i === Math.floor(lines.length/2)) statusEl.textContent = 'LOADING CORE MODULES...';
      i++;
      setTimeout(step, 160 + Math.random()*200);
    }
    step();
  });
}

function initHeader(){
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if(!header || !toggle || !nav) return;

  window.addEventListener('scroll', function(){
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, {passive:true});

  toggle.addEventListener('click', function(){
    var isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function(e){
    if(nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)){
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  var sections = [];
  document.querySelectorAll('section[id]').forEach(function(s){
    sections.push({id:s.id, el:s});
  });

  window.addEventListener('scroll', function(){
    var scrollY = window.scrollY + 120;
    var activeId = null;
    for(var si = 0; si < sections.length; si++){
      var s = sections[si];
      var rect = s.el.getBoundingClientRect();
      if(scrollY >= rect.top + window.scrollY - 100 && scrollY < rect.bottom + window.scrollY - 100){
        activeId = s.id;
        break;
      }
    }
    nav.querySelectorAll('a').forEach(function(a){
      var href = a.getAttribute('href');
      if(href === '#' + activeId) a.classList.add('active');
      else a.classList.remove('active');
    });
  }, {passive:true});
}

function renderMembers(){
  var layout = document.getElementById('members-layout');
  if(!layout) return;
  layout.innerHTML = '';

  var leader = MEMBERS_DATA[0];
  var subs = MEMBERS_DATA.slice(1);

  var leaderRow = document.createElement('div');
  leaderRow.className = 'members-leader-row';
  var leaderCard = buildMemberCard(leader, true);
  leaderRow.appendChild(leaderCard);
  layout.appendChild(leaderRow);

  var subRow = document.createElement('div');
  subRow.className = 'members-sub-row';
  subs.forEach(function(m){
    subRow.appendChild(buildMemberCard(m, false));
  });
  layout.appendChild(subRow);

  observeReveals();
}

function buildMemberCard(m, isLeader){
  var card = document.createElement('article');
  card.className = 'member-card reveal' + (isLeader ? ' leader' : '');

  var avatarHTML;
  if(m.img){
    avatarHTML = '<div class="member-avatar"><img src="' + m.img + '" alt="' + m.name + '" loading="lazy"></div>';
  } else {
    avatarHTML = '<div class="member-avatar" style="background:' + m.color + '15;display:grid;place-items:center;font-size:' + (isLeader?'42px':'30px') + ';font-weight:900;font-family:var(--font-en);color:' + m.color + '">' + m.name.charAt(0) + '</div>';
  }

  card.innerHTML =
    '<span class="member-badge">#' + m.id + '</span>' +
    avatarHTML +
    '<div class="member-role">' + m.title_ja + '</div>' +
    '<div class="member-name">' + m.name + '</div>' +
    '<div class="member-desc">' + m.description + '</div>';

  card.addEventListener('click', function(){ openMemberModal(m); });
  return card;
}

function openMemberModal(m){
  var modal = document.getElementById('member-modal');
  var body = document.getElementById('modal-body');
  if(!modal || !body) return;

  var avatarHTML;
  if(m.img){
    avatarHTML = '<div class="modal-avatar"><img src="' + m.img + '" alt="' + m.name + '"></div>';
  } else {
    avatarHTML = '<div class="modal-avatar" style="background:' + m.color + '15;color:' + m.color + '">' + m.name.charAt(0) + '</div>';
  }

  body.innerHTML =
    avatarHTML +
    '<div class="modal-role">' + m.title_ja + ' / ' + m.title_en + '</div>' +
    '<div class="modal-name" style="color:' + m.color + '">' + m.name + '</div>' +
    '<div class="modal-desc">' + m.description + '</div>';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  var modal = document.getElementById('member-modal');
  if(!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function initModal(){
  var modal = document.getElementById('member-modal');
  if(!modal) return;
  modal.querySelectorAll('[data-close]').forEach(function(el){
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
}

function renderNews(){
  var track = document.getElementById('news-track');
  if(!track) return;
  var list = allNews.slice(0, newsDisplayCount);
  track.innerHTML = '';
  if(list.length === 0){
    track.innerHTML = '<div class="news-loading">NO TRANSMISSION FOUND.</div>';
    return;
  }
  list.forEach(function(n, i){
    var c = document.createElement('article');
    c.className = 'news-card reveal';
    c.style.transitionDelay = (i*70) + 'ms';
    c.innerHTML =
      '<div class="news-date">' + formatDate(n.date) + '</div>' +
      '<div class="news-title">' + escapeHTML(n.title || '(無題)') + '</div>' +
      '<div class="news-content">' + escapeHTML(n.content || '') + '</div>';
    c.addEventListener('click', function(){
      showToast('TRANSMISSION', n.title, 'fa-satellite');
    });
    track.appendChild(c);
  });
  observeReveals();

  var moreBtn = document.getElementById('news-more');
  if(moreBtn){
    if(newsDisplayCount >= allNews.length){
      moreBtn.style.display = 'none';
    } else {
      moreBtn.style.display = '';
    }
  }
}

function initNewsControls(){
  var track = document.getElementById('news-track');
  var prevBtn = document.getElementById('news-prev');
  var nextBtn = document.getElementById('news-next');
  var moreBtn = document.getElementById('news-more');

  if(prevBtn && track){
    prevBtn.addEventListener('click', function(){
      track.scrollBy({left: -track.clientWidth*0.8, behavior:'smooth'});
    });
  }
  if(nextBtn && track){
    nextBtn.addEventListener('click', function(){
      track.scrollBy({left: track.clientWidth*0.8, behavior:'smooth'});
    });
  }
  if(moreBtn){
    moreBtn.addEventListener('click', function(){
      newsDisplayCount += 5;
      renderNews();
      showToast('SIGNAL', '追加通達を受信しました。', 'fa-satellite');
    });
  }
}

function formatDate(s){
  if(!s) return '----.--.--';
  var d = new Date(s);
  if(isNaN(d.getTime())) return String(s);
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth()+1)).slice(-2);
  var da = ('0' + d.getDate()).slice(-2);
  return y + '.' + m + '.' + da;
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function observeReveals(){
  var els = document.querySelectorAll('.reveal:not(.visible)');
  if(els.length === 0) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){ e.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, {threshold: .12, rootMargin: '0px 0px -20px 0px'});
  els.forEach(function(e){ io.observe(e); });
}

function initParticles(){
  var canvas = document.getElementById('particles');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h;
  var particles = [];

  function resize(){
    w = canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    h = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  var count = Math.min(80, Math.floor(window.innerWidth/16));
  for(var i = 0; i < count; i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: (Math.random()*1.6+.4) * (window.devicePixelRatio||1),
      vx: (Math.random()-.5)*.3 * (window.devicePixelRatio||1),
      vy: (Math.random()-.5)*.3 * (window.devicePixelRatio||1),
      a: Math.random()*.7+.3,
      hue: Math.random()<.5 ? 190 : 195
    });
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    for(var pi = 0; pi < particles.length; pi++){
      var p = particles[pi];
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
      grad.addColorStop(0, 'hsla(' + p.hue + ',100%,60%,' + p.a + ')');
      grad.addColorStop(1, 'hsla(' + p.hue + ',100%,60%,0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

function initFooter(){
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  var nodeEl = document.getElementById('node-id');
  if(nodeEl){
    var id = '';
    for(var i = 0; i < 6; i++){ id += Math.floor(Math.random()*16).toString(16).toUpperCase(); }
    nodeEl.textContent = 'TK-' + id;
  }

  function updateUptime(){
    var start = Date.now() - (Math.floor(Math.random()*86400*30)*1000);
    setInterval(function(){
      var s = Math.floor((Date.now()-start)/1000);
      var hh = ('0' + Math.floor(s/3600)).slice(-2);
      var mm = ('0' + Math.floor((s%3600)/60)).slice(-2);
      var ss = ('0' + (s%60)).slice(-2);
      var ts = hh + ':' + mm + ':' + ss;
      var upEl = document.getElementById('uptime');
      var fupEl = document.getElementById('footer-uptime');
      if(upEl) upEl.textContent = ts;
      if(fupEl) fupEl.textContent = ts;
    }, 1000);
  }
  updateUptime();
}

function showToast(title, msg, icon){
  icon = icon || 'fa-triangle-exclamation';
  var wrap = document.getElementById('toast-wrap');
  if(!wrap) return;
  var el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<i class="fa-solid ' + icon + '"></i><div><b>' + title + '</b><span>' + msg + '</span></div>';
  wrap.appendChild(el);
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ if(el.parentNode) el.remove(); }, 300); }, 5000);
}

function initHackButton(){
  var btn = document.getElementById('hack-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var original = btn.innerHTML;
    btn.disabled = true;
    var frames = [
      '> INITIATING CONTACT...',
      '> SCANNING HANDSHAKE ▓▓▓░░',
      '> BYPASSING FIREWALL ▓▓▓▓▓',
      '> CHANNEL OPEN',
      '> WELCOME, OPERATIVE.'
    ];
    var i = 0;
    var t = setInterval(function(){
      if(i >= frames.length){
        clearInterval(t);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> CHANNEL ESTABLISHED';
        showToast('CONTACT', '帝国との暗号化通信が確立されました。', 'fa-satellite-dish');
        setTimeout(function(){ btn.innerHTML = original; btn.disabled = false; }, 2400);
        return;
      }
      btn.innerHTML = '<i class="fa-solid fa-terminal"></i> ' + frames[i];
      i++;
    }, 380);
  });
}

function initGlitchScramble(){
  var title = document.querySelector('.hero-title .glitch');
  if(!title) return;
  var original = title.getAttribute('data-text') || title.textContent;
  var chars = '#$%&*@!?01XYZΣΞΔ破壊主義';

  function scramble(){
    var out = '';
    for(var i = 0; i < original.length; i++){
      out += Math.random() < .15 ? chars[Math.floor(Math.random()*chars.length)] : original[i];
    }
    title.textContent = out;
    title.setAttribute('data-text', out);
  }

  setInterval(function(){
    if(Math.random() < .22){
      var count = 0;
      var t = setInterval(function(){
        scramble();
        count++;
        if(count > 5){
          clearInterval(t);
          title.textContent = original;
          title.setAttribute('data-text', original);
        }
      }, 55);
    }
  }, 4200);
}

function initScreenShake(){
  document.addEventListener('click', function(e){
    if(Math.random() < .12){
      var target = e.target.closest('.member-card, .btn, .link-btn');
      if(target){
        document.body.classList.add('screen-shake');
        setTimeout(function(){ document.body.classList.remove('screen-shake'); }, 150);
      }
    }
  });
}

function initGlitchOverlay(){
  var overlay = document.createElement('div');
  overlay.className = 'glitch-overlay';
  document.body.appendChild(overlay);

  setInterval(function(){
    overlay.classList.add('active');
    setTimeout(function(){ overlay.classList.remove('active'); }, 80 + Math.random()*60);
  }, 5000 + Math.random()*8000);
}

function initButtonRipple(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.btn-primary');
    if(!btn) return;
    var rect = btn.getBoundingClientRect();
    btn.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
    btn.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
    btn.classList.add('ripple');
    setTimeout(function(){ btn.classList.remove('ripple'); }, 300);
  });
}

function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href === '#') return;
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 62;
        window.scrollTo({top:top, behavior:'smooth'});
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function(){
  initParticles();
  initHeader();
  initFooter();
  initModal();
  initNewsControls();
  initHackButton();
  initSmoothScroll();
  initScreenShake();
  initGlitchOverlay();
  initButtonRipple();

  renderMembers();
  observeReveals();
  renderNews();
  observeReveals();

  initBoot().then(function(){
    initFakeToasts();
    initGlitchScramble();
    observeReveals();
  });
});
})();
