// ==========================================
// 1. NEURAL NETWORK CANVAS ANIMATION
// ==========================================
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 65; // Optimized for performance on mid-tier/i3 setups

// Set Canvas Size
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();

// Track Mouse Movement
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Schema Template
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Screen boundary rebound checks
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Subtle interactive mouse repulsion logic
        if (mouse.x != null && mouse.y != null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x += (dx / distance) * force * 2;
                this.y += (dy / distance) * force * 2;
            }
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Build internal array index pool
function populateParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
populateParticles();

// Compute dynamic distance mapping lines between points
function connectLines() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                opacityValue = 1 - (distance / 110);
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Main Draw Loop Engine
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Handle browser window dynamic resizing cleanly
window.addEventListener('resize', () => {
    initCanvas();
    populateParticles();
});


// ==========================================
// 2. AI ORB INTERACTIVE MOUSE-FOLLOW EFFECTS
// ==========================================
const aiOrb = document.getElementById('aiOrb');

if (aiOrb) {
    window.addEventListener('mousemove', (e) => {
        const amountX = (window.innerWidth / 2 - e.pageX) * 0.03;
        const amountY = (window.innerHeight / 2 - e.pageY) * 0.03;
        aiOrb.style.transform = `translate(${amountX}px, ${amountY}px)`;
    });
}


// ==========================================
// 3. ARCHITECTURE PROGRESS TRACKING
// ==========================================
const pipelineCards = document.querySelectorAll('.pipeline-card');
const pipelineProgress = document.getElementById('pipelineProgress');

function updatePipelineHeight() {
    if (!pipelineCards.length || !pipelineProgress) return;

    let activeCardsCount = 0;
    const triggerBottom = window.innerHeight * 0.8;

    pipelineCards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerBottom) {
            activeCardsCount++;
        }
    });

    // Translate active element counters straight into dynamic progress calculations
    const percentage = ((activeCardsCount) / pipelineCards.length) * 100;
    pipelineProgress.style.height = `${Math.min(percentage, 100)}%`;
}

window.addEventListener('scroll', updatePipelineHeight);
window.addEventListener('load', updatePipelineHeight);


// ==========================================
// 4. AGENT LOOP INTERACTIVE HOVER TELEMETRY
// ==========================================
const loopNodes = document.querySelectorAll('.loop-node');
const loopDescBox = document.getElementById('loopDesc');

const nodeDefaultMessage = "Hover over any node in the system telemetry network cycle above to watch the agent execution cascade sequence update live.";

loopNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
        const contextText = node.getAttribute('data-desc');
        loopDescBox.style.opacity = 0;
        
        setTimeout(() => {
            loopDescBox.innerHTML = `<strong>${node.innerText}:</strong> ${contextText}`;
            loopDescBox.style.borderColor = 'var(--cyan)';
            loopDescBox.style.color = 'var(--white)';
            loopDescBox.style.opacity = 1;
        }, 120);
    });

    node.addEventListener('mouseleave', () => {
        loopDescBox.style.opacity = 0;
        
        setTimeout(() => {
            loopDescBox.innerText = nodeDefaultMessage;
            loopDescBox.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            loopDescBox.style.color = 'var(--text-muted)';
            loopDescBox.style.opacity = 1;
        }, 120);
    });
});