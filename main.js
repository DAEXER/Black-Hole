const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;

// Partículas del disco de acreción
const particleCount = 400;
let particles = [];

// Función aleatoria
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Crear partículas del disco con gradientes dinámicos
for (let i = 0; i < particleCount; i++) {
    let radius = random(80, 220);
    let angle = random(0, 2 * Math.PI);
    let speed = random(0.003, 0.01);
    let colorHue = random(20, 60);
    particles.push({radius, angle, speed, colorHue});
}

// Fondo estrellado
const starCount = 300;
let stars = [];
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: Math.random()
    });
}

// Chorros relativistas
const jetLength = 300;

function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Función principal de animación
function animate() {
    ctx.clearRect(0, 0, width, height);

    drawStars();

    // Singularidad
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Horizonte de eventos con efecto de lente gravitacional
    let gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 80);
    gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Disco de acreción
    particles.forEach(p => {
        p.angle += p.speed;

        // Oscilación de color para dar gradiente dinámico
        p.colorHue += 0.1;
        if (p.colorHue > 60) p.colorHue = 20;
        let color = `hsl(${p.colorHue}, 100%, 50%)`;

        // Coordenadas de la partícula
        let x = centerX + p.radius * Math.cos(p.angle);
        let y = centerY + p.radius * Math.sin(p.angle);

        // Efecto de distorsión gravitacional (ligera curvatura)
        let dx = x - centerX;
        let dy = y - centerY;
        let dist = Math.sqrt(dx*dx + dy*dy);
        let distortion = 1 + 50 / (dist + 10); // cuanto más cerca, más distorsión
        x = centerX + dx * distortion;
        y = centerY + dy * distortion;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });

    // Chorros relativistas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - jetLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + jetLength);
    ctx.stroke();

    requestAnimationFrame(animate);
}

animate();

// Ajuste al redimensionar ventana
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
