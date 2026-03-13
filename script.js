document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Anchor Links
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

    // 2. Navbar Scroll & Glass Effect
    const nav = document.querySelector('nav');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Navbar background effect
        if (currentScrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // Mobile Menu Toggle
    const toggleMenu = (isOpen) => {
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn?.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // 3. Scroll Reveal Animations with Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.reveal-y, .reveal-left, .reveal-right, .about-photo-reveal').forEach(el => revealObserver.observe(el));


    // 4. Active Scroll Navigation + Sliding Indicator
    const navLinks     = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const desktopLinks = Array.from(document.querySelectorAll('#nav-links .nav-link'));
    const indicator    = document.getElementById('nav-indicator');
    const navLinksContainer = document.getElementById('nav-links');
    const sections     = Array.from(document.querySelectorAll('section[id]'));

    function moveIndicator(activeLink) {
        if (!indicator || !activeLink || !navLinksContainer) return;
        const containerRect = navLinksContainer.getBoundingClientRect();
        const linkRect      = activeLink.getBoundingClientRect();
        indicator.style.left    = (linkRect.left - containerRect.left) + 'px';
        indicator.style.width   = linkRect.width + 'px';
        indicator.style.opacity = '1';
    }

    function setActiveNav() {
        const scrollMid = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0];
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollMid) current = sec;
        });
        const activeHref = `#${current.id}`;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activeHref);
        });
        // Move sliding indicator to active desktop link
        const activeDesktopLink = desktopLinks.find(l => l.getAttribute('href') === activeHref);
        if (activeDesktopLink) moveIndicator(activeDesktopLink);
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });
    // Run after fonts/layout settle
    requestAnimationFrame(() => { setActiveNav(); });
    window.addEventListener('resize', setActiveNav);


    
    // 5. Futuristic AI Analytics HUD Visualization
    class HeroVisualization {
        constructor() {
            this.canvas = document.getElementById('heroCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.time = 0;
            this.heroSection = document.getElementById('hero');
            this.init();
            this.animate();
            window.addEventListener('resize', () => this.init());
        }

        init() {
            this.canvas.width = this.heroSection.offsetWidth;
            this.canvas.height = this.heroSection.offsetHeight;
            this.cw = this.canvas.width;
            this.ch = this.canvas.height;
            
            // Grid background
            this.gridSpacing = 50;
            
            // Floating Data Particles
            this.particles = Array.from({length: 80}, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: Math.random() * 2 + 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random()
            }));
            
            // Glowing Line Charts
            this.cx = this.cw / 2;
            this.cy = this.ch / 2;
            this.lineCharts = [
                { color: '#0ea5e9', points: [], yBase: this.cy - 60, amplitude: 50, speed: 0.02, phase: 0 },
                { color: '#14b8a6', points: [], yBase: this.cy + 60, amplitude: 35, speed: 0.03, phase: Math.PI }
            ];
            
            // Stock Graphs (animated bars)
            this.stocks = Array.from({length: 16}, (_, i) => ({
                x: -240 + i * 30,
                base: 120,
                val: Math.random() * 60 + 20,
                target: Math.random() * 60 + 20
            }));
        }

        drawGrid() {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.04)';
            this.ctx.lineWidth = 1;
            
            this.ctx.translate(this.cx, this.ch);
            this.ctx.scale(1, 0.25);
            this.ctx.translate(-this.cx, -this.ch);

            this.ctx.beginPath();
            for(let x = 0; x <= this.cw; x += this.gridSpacing) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.ch);
            }
            for(let y = 0; y <= this.ch; y += this.gridSpacing) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.cw, y);
            }
            this.ctx.stroke();
            this.ctx.restore();
        }

        drawParticles() {
            this.particles.forEach(p => {
                p.y -= p.speed;
                if(p.y < 0) { p.y = this.ch; p.x = Math.random() * this.cw; }
                this.ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity * 0.5})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }

        drawCharts() {
            this.ctx.save();
            
            // Glowing line charts
            this.ctx.lineCap = 'round';
            this.lineCharts.forEach(chart => {
                this.ctx.beginPath();
                this.ctx.strokeStyle = chart.color;
                this.ctx.lineWidth = 2.5;
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = chart.color;
                
                for(let x = 0; x < this.cw; x += 15) {
                    let y = chart.yBase + Math.sin(x * 0.01 + this.time * chart.speed + chart.phase) * chart.amplitude;
                    y += Math.sin(x * 0.04 - this.time * 0.02) * 15; // wave interference
                    
                    if(x === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                    
                    if(x % 90 === 0) {
                        this.ctx.fillStyle = '#fff';
                        this.ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
                this.ctx.stroke();
            });
            
            // Animated stock-like graphs
            this.ctx.shadowBlur = 8;
            this.stocks.forEach(stock => {
                stock.val += (stock.target - stock.val) * 0.08;
                if(Math.abs(stock.target - stock.val) < 1) stock.target = Math.random() * 60 + 20;
                
                let isUp = stock.target > stock.val;
                this.ctx.fillStyle = isUp ? 'rgba(20, 184, 166, 0.85)' : 'rgba(14, 165, 233, 0.6)';
                this.ctx.shadowColor = this.ctx.fillStyle;
                
                // wick
                this.ctx.fillRect(this.cx + stock.x + 4, this.cy + stock.base - stock.val - 15, 2, 30 + stock.val * 0.3);
                // body
                this.ctx.fillRect(this.cx + stock.x, this.cy + stock.base - stock.val, 10, stock.val * 0.6 + 5);
            });
            
            // Circular analytics meters
            this.drawMeter(this.cx, this.cy - 120, 50, this.time * 0.02, 0.78, '#0ea5e9');
            this.drawMeter(this.cx - 130, this.cy - 90, 35, -this.time * 0.015, 0.65, '#14b8a6');
            this.drawMeter(this.cx + 130, this.cy - 90, 35, this.time * 0.025, 0.85, '#ffffff'); // white glow
            
            this.ctx.restore();
        }

        drawMeter(x, y, radius, rot, fill, color) {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rot);
            
            // bg track
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // active fill track
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2 * fill);
            this.ctx.strokeStyle = color;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = color;
            this.ctx.stroke();
            
            // dotted inner ring
            this.ctx.beginPath();
            this.ctx.setLineDash([2, 6]);
            this.ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            this.ctx.stroke();
            
            this.ctx.restore();
        }

        drawRoboticHands() {
            this.ctx.save();
            
            const drawArm = (isLeft) => {
                this.ctx.save();
                let sideMult = isLeft ? 1 : -1;
                // Position relative to bottom corners
                this.ctx.translate(isLeft ? -50 : this.cw + 50, this.ch + 50);
                
                let breath = Math.sin(this.time * 0.02) * 15;
                let sway = Math.cos(this.time * 0.015) * 10;
                
                // Advanced robotic arm colors
                this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
                this.ctx.fillStyle = 'rgba(3, 7, 18, 0.95)';
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#0ea5e9';
                
                // Main joints: shoulder, elbow, wrist
                const joints = [
                    {x: 0, y: 0},
                    {x: 150 * sideMult + sway, y: -220 + breath},
                    {x: 350 * sideMult + sway * 1.5, y: -450 + breath * 2}
                ];
                
                // Draw dark structural core
                this.ctx.beginPath();
                this.ctx.moveTo(joints[0].x, joints[0].y);
                this.ctx.lineTo(joints[1].x, joints[1].y);
                this.ctx.lineTo(joints[2].x, joints[2].y);
                this.ctx.lineWidth = 15;
                this.ctx.strokeStyle = 'rgba(10, 20, 40, 0.8)';
                this.ctx.shadowBlur = 0;
                this.ctx.stroke();
                
                // Glowing energetic wires layering
                this.ctx.beginPath();
                this.ctx.moveTo(joints[0].x, joints[0].y);
                this.ctx.lineTo(joints[1].x, joints[1].y);
                this.ctx.lineTo(joints[2].x, joints[2].y);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#0ea5e9';
                this.ctx.shadowBlur = 8;
                this.ctx.stroke();
                
                // Circular metallic joint covers
                joints.forEach(j => {
                    this.ctx.beginPath();
                    this.ctx.arc(j.x, j.y, 14, 0, Math.PI*2);
                    this.ctx.fill();
                    this.ctx.stroke();
                    
                    this.ctx.beginPath();
                    this.ctx.arc(j.x, j.y, 5, 0, Math.PI*2);
                    this.ctx.fillStyle = '#14b8a6'; // inner core light
                    this.ctx.fill();
                });
                
                // Draw Robotic Fingers
                const handCenter = joints[2];
                const fingers = [
                    { dx: 40 * sideMult, dy: -90, len: 1 },
                    { dx: 70 * sideMult, dy: -40, len: 1.1 },
                    { dx: 90 * sideMult, dy: 10, len: 0.9 },
                    { dx: 30 * sideMult, dy: 50, len: 0.7 } // Thumb
                ];
                
                fingers.forEach((f, idx) => {
                    let flex = Math.sin(this.time * 0.04 + idx * 0.5) * 15;
                    let midX = handCenter.x + (f.dx * 0.5) + (idx===3? flex : 0);
                    let midY = handCenter.y + (f.dy * 0.5) + (idx!==3? flex : 0);
                    let tipX = handCenter.x + f.dx + (idx===3? flex*1.5 : 0);
                    let tipY = handCenter.y + f.dy + (idx!==3? flex*1.5 : 0);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(handCenter.x, handCenter.y);
                    this.ctx.lineTo(midX, midY);
                    this.ctx.lineTo(tipX, tipY);
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.7)';
                    this.ctx.stroke();
                    
                    // Fingertip glowing sensor point
                    this.ctx.beginPath();
                    this.ctx.arc(tipX, tipY, 5, 0, Math.PI*2);
                    this.ctx.fillStyle = '#fff';
                    this.ctx.shadowColor = '#fff';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fill();
                    
                    // Laser data transfer visually linking hand to dashboard center
                    this.ctx.beginPath();
                    this.ctx.moveTo(tipX, tipY);
                    this.ctx.lineTo(this.cx + (Math.random()-0.5)*50 * sideMult, this.cy + (Math.random()-0.5)*50);
                    this.ctx.strokeStyle = `rgba(20, 184, 166, ${0.1 + Math.random()*0.1})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                });
                
                this.ctx.restore();
            };
            
            drawArm(true);  // Render left AI hand
            drawArm(false); // Render right AI hand
            
            this.ctx.restore();
        }

        animate() {
            this.time += 1;
            
            // Clear with dark tech background
            this.ctx.fillStyle = '#030712';
            this.ctx.fillRect(0, 0, this.cw, this.ch);
            
            // Ambient glowing radial aura in the center
            let grad = this.ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.cw * 0.6);
            grad.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
            grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.cw, this.ch);

            this.drawGrid();
            this.drawParticles();
            this.drawCharts();
            this.drawRoboticHands();

            requestAnimationFrame(() => this.animate());
        }
    }

    new HeroVisualization();

    // 5. Skill Bars Animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress;
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress').forEach(bar => skillObserver.observe(bar));

    // 6. Vanilla Typing Effect
    const typedTextSpan = document.querySelector("#typed-text");
    const phrases = ['Aspiring Data Analyst', 'Pattern Seeker', 'Insight Creator', 'Problem Solver'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    
    if(typedTextSpan) type();

    // 7. Data Insights Dashboard Chart
    const initCharts = () => {
        const ctx = document.getElementById('mainDashboardChart');
        if (!ctx) return;

        // Custom Gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Anomaly Detection Score',
                    data: [65, 59, 80, 81, 56, 85, 95],
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    tension: 0.4,
                    shadowBlur: 15,
                    shadowColor: 'rgba(59, 130, 246, 0.5)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleFont: { family: 'Outfit', size: 14 },
                        bodyFont: { family: 'Inter', size: 12 },
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)',
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'Inter', size: 11 }, stepSize: 20 }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    };

    // Trigger charts on reveal
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                initCharts();
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        observer.observe(dashboardSection);
    }

    // 8. Interactive Mouse Mesh Follow
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        const mesh = document.querySelector('.mesh-gradient');
        if (mesh) {
            mesh.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
        }
    });

    // 9. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-white/10', 'active');
                b.classList.add('bg-white/5');
            });
            btn.classList.remove('bg-white/5');
            btn.classList.add('bg-white/10', 'active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Ensure default transition properties if not defined
                card.style.transition = 'opacity 0.3s ease';
                
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        if(card.style.opacity === '0') card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

});
