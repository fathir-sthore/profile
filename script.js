// ========================================
// MOBILE MENU TOGGLE
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// ACTIVE NAVIGATION INDICATOR
// ========================================

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

updateActiveNav();

// ========================================
// SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card, .service-card, .friend-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// MUSIC PLAYER (PLAYLIST)
// ========================================

const playlist = [
    { title: 'Astaga Bercanda', src: 'assets/audio/music.mp3' },
    { title: 'Cincin', src: 'assets/audio/cincin.m4a' },
    { title: 'MMG - My Mine Gueh', src: 'assets/audio/mmg-my-mine-gueh.m4a' },
    { title: 'Teh Hijau', src: 'assets/audio/teh-hijau.m4a' }
];
let currentTrack = 0;

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.querySelector('.progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volumeControl');
const songTitleEl = document.getElementById('songTitle');
const songIndexEl = document.getElementById('songIndex');
const playlistEl = document.getElementById('playlist');

function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = '';
    playlist.forEach((track, index) => {
        const item = document.createElement('button');
        item.className = 'playlist-item';
        item.textContent = track.title;
        if (index === currentTrack) item.classList.add('active');
        item.addEventListener('click', () => loadTrack(index, true));
        playlistEl.appendChild(item);
    });
}

function loadTrack(index, autoplay) {
    currentTrack = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrack];
    audioPlayer.pause();
    audioPlayer.src = track.src;
    audioPlayer.load();
    songTitleEl.textContent = track.title;
    songIndexEl.textContent = `${currentTrack + 1} / ${playlist.length}`;
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    renderPlaylist();
    if (autoplay) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.classList.add('playing');
                playBtn.textContent = '⏸';
            }).catch((err) => {
                console.error('Playback failed:', err);
                playBtn.classList.remove('playing');
                playBtn.textContent = '▶';
            });
        }
    } else {
        playBtn.classList.remove('playing');
        playBtn.textContent = '▶';
    }
}

if (audioPlayer && playBtn) {
    renderPlaylist();

    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.classList.add('playing');
            playBtn.textContent = '⏸';
        } else {
            audioPlayer.pause();
            playBtn.classList.remove('playing');
            playBtn.textContent = '▶';
        }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => loadTrack(currentTrack + 1, true));
    if (prevBtn) prevBtn.addEventListener('click', () => loadTrack(currentTrack - 1, true));

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });

    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value / 100;
        });
        audioPlayer.volume = 0.7;
    }

    audioPlayer.addEventListener('ended', () => {
        loadTrack(currentTrack + 1, true);
    });
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// BUTTON HOVER EFFECTS
// ========================================

document.querySelectorAll('.btn, .contact-btn, .friend-link').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// SKILL CARD ANIMATIONS
// ========================================

const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
    card.style.animationDelay = (index * 0.1) + 's';
});

// ========================================
// PROJECT CARD HOVER EFFECTS
// ========================================

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// PROJECT IMAGE FALLBACK
// ========================================

document.querySelectorAll('.project-img').forEach((img, index) => {
    img.addEventListener('error', function () {
        const fallbackColors = ['#c0392b', '#d4af37', '#b0b0b0', '#8b1a1a', '#a8842a', '#7a7a7a'];
        const fallback = document.createElement('div');
        fallback.textContent = this.alt || `PROJECT ${index + 1}`;
        fallback.style.width = '100%';
        fallback.style.height = '100%';
        fallback.style.background = fallbackColors[index % fallbackColors.length];
        fallback.style.border = 'none';
        fallback.style.display = 'flex';
        fallback.style.alignItems = 'center';
        fallback.style.justifyContent = 'center';
        fallback.style.color = '#f5c542';
        fallback.style.fontSize = '1.1rem';
        fallback.style.fontWeight = '900';
        fallback.style.textTransform = 'uppercase';
        fallback.style.letterSpacing = '1px';
        fallback.style.textAlign = 'center';
        fallback.style.padding = '1rem';
        this.replaceWith(fallback);
    });
});

// ========================================
// QR IMAGE FALLBACK
// ========================================

const qrImage = document.getElementById('qrImage');
if (qrImage) {
    qrImage.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.textContent = 'QR';
        fallback.style.width = '100%';
        fallback.style.height = '100%';
        fallback.style.background = '#d4af37';
        fallback.style.border = '3px solid #0a0a0a';
        fallback.style.display = 'flex';
        fallback.style.alignItems = 'center';
        fallback.style.justifyContent = 'center';
        fallback.style.color = '#0a0a0a';
        fallback.style.fontSize = '32px';
        fallback.style.fontWeight = '900';
        qrImage.replaceWith(fallback);
    });
}

// ========================================
// INITIALIZE
// ========================================

console.log('FATHIR Portfolio loaded — Dark Red × Silver × Gold theme');