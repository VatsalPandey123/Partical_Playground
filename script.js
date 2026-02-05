class ParticlePlayground {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isMouseDown = false;
        
        // Settings
        this.settings = {
            particleCount: 200,
            particleSize: 3,
            speed: 1,
            connectionDistance: 100,
            colorMode: 'rainbow',
            customColor: '#ff6b6b'
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.setupControls();
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true;
            this.addParticlesAtMouse(10);
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addParticlesAtPosition(x, y, 5);
        });
    }
    
    setupControls() {
        // Particle Count
        const particleCountSlider = document.getElementById('particleCount');
        const countValue = document.getElementById('countValue');
        particleCountSlider.addEventListener('input', (e) => {
            this.settings.particleCount = parseInt(e.target.value);
            countValue.textContent = e.target.value;
            this.createParticles();
        });
        
        // Particle Size
        const particleSizeSlider = document.getElementById('particleSize');
        const sizeValue = document.getElementById('sizeValue');
        particleSizeSlider.addEventListener('input', (e) => {
            this.settings.particleSize = parseFloat(e.target.value);
            sizeValue.textContent = e.target.value;
            this.particles.forEach(p => p.size = this.settings.particleSize);
        });
        
        // Speed
        const speedSlider = document.getElementById('speed');
        const speedValue = document.getElementById('speedValue');
        speedSlider.addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            speedValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        // Connection Distance
        const distanceSlider = document.getElementById('connectionDistance');
        const distanceValue = document.getElementById('distanceValue');
        distanceSlider.addEventListener('input', (e) => {
            this.settings.connectionDistance = parseInt(e.target.value);
            distanceValue.textContent = e.target.value;
        });
        
        // Color Mode
        const colorModeSelect = document.getElementById('colorMode');
        const customColorGroup = document.getElementById('customColorGroup');
        colorModeSelect.addEventListener('change', (e) => {
            this.settings.colorMode = e.target.value;
            customColorGroup.style.display = e.target.value === 'custom' ? 'flex' : 'none';
        });
        
        // Custom Color
        const customColorInput = document.getElementById('customColor');
        customColorInput.addEventListener('input', (e) => {
            this.settings.customColor = e.target.value;
        });
        
        // Reset Button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.createParticles();
        });
        
        // Clear Button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.particles = [];
        });
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.settings.particleSize,
                this.settings.colorMode,
                this.settings.customColor
            ));
        }
    }
    
    addParticlesAtMouse(count) {
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            this.addParticlesAtPosition(this.mouse.x, this.mouse.y, count);
        }
    }
    
    addParticlesAtPosition(x, y, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = Math.random() * 30;
            this.particles.push(new Particle(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                this.settings.particleSize,
                this.settings.colorMode,
                this.settings.customColor
            ));
        }
    }
    
    getColor(particle) {
        switch (this.settings.colorMode) {
            case 'rainbow':
                const hue = (particle.x / this.canvas.width) * 360;
                return `hsl(${hue}, 70%, 60%)`;
            case 'monochrome':
                const brightness = (particle.x / this.canvas.width) * 100;
                return `hsl(0, 0%, ${brightness}%)`;
            case 'fire':
                const fireHue = 20 + (particle.y / this.canvas.height) * 40;
                return `hsl(${fireHue}, 100%, 50%)`;
            case 'ocean':
                const oceanHue = 180 + (particle.y / this.canvas.height) * 60;
                return `hsl(${oceanHue}, 70%, 50%)`;
            case 'custom':
                return this.settings.customColor;
            default:
                return '#667eea';
        }
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.settings.connectionDistance) {
                    const opacity = 1 - (distance / this.settings.connectionDistance);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add particles on mouse drag
        if (this.isMouseDown) {
            this.addParticlesAtMouse(2);
        }
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx -= (dx / distance) * force * 0.5;
                particle.vy -= (dy / distance) * force * 0.5;
            }
            
            particle.update(this.canvas.width, this.canvas.height, this.settings.speed);
            particle.draw(this.ctx, this.getColor(particle));
            
            // Remove particles that are too far off screen
            if (particle.x < -100 || particle.x > this.canvas.width + 100 ||
                particle.y < -100 || particle.y > this.canvas.height + 100) {
                this.particles.splice(index, 1);
            }
        });
        
        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, size, colorMode, customColor) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.colorMode = colorMode;
        this.customColor = customColor;
    }
    
    update(width, height, speed) {
        this.x += this.vx * speed;
        this.y += this.vy * speed;
        
        // Bounce off walls
        if (this.x < 0 || this.x > width) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(width, this.x));
        }
        if (this.y < 0 || this.y > height) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(height, this.y));
        }
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Initialize the playground when the page loads
window.addEventListener('load', () => {
    new ParticlePlayground();
});


