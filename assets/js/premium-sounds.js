// ===== PREMIUM SOUND SYSTEM =====

class PremiumSoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.7;
        this.initialized = false;
        
        // Sound definitions with Web Audio API synthesis
        this.soundDefinitions = {
            click: {
                type: 'synthesized',
                frequency: 800,
                duration: 0.1,
                volume: 0.3,
                waveType: 'sine'
            },
            hover: {
                type: 'synthesized',
                frequency: 600,
                duration: 0.05,
                volume: 0.2,
                waveType: 'sine'
            },
            flip: {
                type: 'synthesized',
                frequency: 400,
                duration: 0.3,
                volume: 0.4,
                waveType: 'square',
                modulation: true
            },
            start: {
                type: 'synthesized',
                frequency: 523.25, // C5
                duration: 0.5,
                volume: 0.5,
                waveType: 'triangle',
                chord: [523.25, 659.25, 783.99] // C-E-G major chord
            },
            win: {
                type: 'synthesized',
                frequency: 523.25,
                duration: 1.0,
                volume: 0.6,
                waveType: 'sine',
                melody: [523.25, 659.25, 783.99, 1046.50] // C-E-G-C ascending
            },
            eliminate: {
                type: 'synthesized',
                frequency: 200,
                duration: 0.8,
                volume: 0.4,
                waveType: 'sawtooth',
                descending: true
            },
            timer: {
                type: 'synthesized',
                frequency: 1000,
                duration: 0.2,
                volume: 0.3,
                waveType: 'sine',
                repeat: true
            },
            notification: {
                type: 'synthesized',
                frequency: 800,
                duration: 0.3,
                volume: 0.4,
                waveType: 'sine',
                envelope: 'bell'
            },
            error: {
                type: 'synthesized',
                frequency: 150,
                duration: 0.5,
                volume: 0.4,
                waveType: 'square',
                distortion: true
            },
            success: {
                type: 'synthesized',
                frequency: 659.25, // E5
                duration: 0.4,
                volume: 0.5,
                waveType: 'sine',
                harmony: [659.25, 783.99] // E-G
            }
        };
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
            
            this.initialized = true;
            console.log('Premium Sound System initialized');
        } catch (error) {
            console.warn('Could not initialize audio context:', error);
            this.enabled = false;
        }
    }
    
    async play(soundName, options = {}) {
        if (!this.enabled || !this.initialized) return;
        
        try {
            // Resume audio context if suspended (required by browser policies)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const soundDef = this.soundDefinitions[soundName];
            if (!soundDef) {
                console.warn(`Sound "${soundName}" not found`);
                return;
            }
            
            // Merge options with sound definition
            const config = { ...soundDef, ...options };
            
            if (config.type === 'synthesized') {
                this.playSynthesizedSound(config);
            }
            
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }
    
    playSynthesizedSound(config) {
        const now = this.audioContext.currentTime;
        
        if (config.chord) {
            // Play chord
            config.chord.forEach((frequency, index) => {
                this.createOscillator(frequency, config, now, index * 0.05);
            });
        } else if (config.melody) {
            // Play melody
            config.melody.forEach((frequency, index) => {
                this.createOscillator(frequency, config, now + (index * 0.2), 0);
            });
        } else {
            // Play single note
            this.createOscillator(config.frequency, config, now, 0);
        }
    }
    
    createOscillator(frequency, config, startTime, delay = 0) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Configure oscillator
        oscillator.type = config.waveType || 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime + delay);
        
        // Configure envelope
        const attackTime = 0.01;
        const decayTime = config.duration * 0.3;
        const sustainLevel = config.volume * 0.7;
        const releaseTime = config.duration * 0.7;
        
        gainNode.gain.setValueAtTime(0, startTime + delay);
        gainNode.gain.linearRampToValueAtTime(config.volume, startTime + delay + attackTime);
        
        if (config.envelope === 'bell') {
            // Bell-like envelope
            gainNode.gain.exponentialRampToValueAtTime(sustainLevel, startTime + delay + decayTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + delay + config.duration);
        } else {
            // Standard ADSR envelope
            gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + delay + decayTime);
            gainNode.gain.linearRampToValueAtTime(0.01, startTime + delay + config.duration);
        }
        
        // Add modulation effects
        if (config.modulation) {
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.frequency.setValueAtTime(5, startTime + delay); // 5Hz modulation
            lfoGain.gain.setValueAtTime(20, startTime + delay); // Modulation depth
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            
            lfo.start(startTime + delay);
            lfo.stop(startTime + delay + config.duration);
        }
        
        // Add frequency sweep for descending sounds
        if (config.descending) {
            oscillator.frequency.exponentialRampToValueAtTime(
                frequency * 0.3, 
                startTime + delay + config.duration
            );
        }
        
        // Add distortion effect
        if (config.distortion) {
            const waveshaper = this.audioContext.createWaveShaper();
            waveshaper.curve = this.createDistortionCurve(400);
            waveshaper.oversample = '4x';
            
            oscillator.disconnect();
            oscillator.connect(waveshaper);
            waveshaper.connect(gainNode);
        }
        
        // Start and stop oscillator
        oscillator.start(startTime + delay);
        oscillator.stop(startTime + delay + config.duration);
    }
    
    createDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        
        return curve;
    }
    
    // Haptic feedback integration
    vibrate(pattern) {
        if (navigator.vibrate && this.enabled) {
            navigator.vibrate(pattern);
        }
    }
    
    // Sound presets for different game events
    playClick() {
        this.play('click');
        this.vibrate(10);
    }
    
    playHover() {
        this.play('hover');
    }
    
    playCardFlip() {
        this.play('flip');
        this.vibrate([20, 10, 20]);
    }
    
    playGameStart() {
        this.play('start');
        this.vibrate([50, 30, 50, 30, 100]);
    }
    
    playVictory() {
        this.play('win');
        this.vibrate([100, 50, 100, 50, 200]);
    }
    
    playElimination() {
        this.play('eliminate');
        this.vibrate([200, 100, 200]);
    }
    
    playTimer() {
        this.play('timer');
        this.vibrate(50);
    }
    
    playNotification() {
        this.play('notification');
        this.vibrate([30, 20, 30]);
    }
    
    playError() {
        this.play('error');
        this.vibrate([100, 50, 100, 50, 100]);
    }
    
    playSuccess() {
        this.play('success');
        this.vibrate([50, 30, 50]);
    }
    
    // Volume control
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    getVolume() {
        return this.volume;
    }
    
    // Enable/disable sounds
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    isEnabled() {
        return this.enabled;
    }
    
    // Ambient sound effects
    playAmbientLoop(type = 'space') {
        if (!this.enabled || !this.initialized) return;
        
        const ambientConfig = {
            space: {
                frequency: 80,
                duration: 10,
                volume: 0.1,
                waveType: 'sine',
                modulation: true
            },
            underwater: {
                frequency: 60,
                duration: 8,
                volume: 0.15,
                waveType: 'triangle',
                modulation: true
            },
            forest: {
                frequency: 200,
                duration: 12,
                volume: 0.08,
                waveType: 'sawtooth',
                modulation: true
            }
        };
        
        const config = ambientConfig[type];
        if (config) {
            this.playSynthesizedSound(config);
            
            // Loop the ambient sound
            setTimeout(() => {
                if (this.enabled) {
                    this.playAmbientLoop(type);
                }
            }, config.duration * 1000);
        }
    }
    
    // Dynamic music generation
    generateDynamicMusic(mood = 'neutral') {
        if (!this.enabled || !this.initialized) return;
        
        const scales = {
            happy: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88], // C major
            sad: [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16], // C minor
            mysterious: [261.63, 277.18, 311.13, 369.99, 392.00, 415.30, 466.16], // C diminished
            triumphant: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88] // C major
        };
        
        const scale = scales[mood] || scales.neutral;
        const rhythm = [0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 1.0]; // Quarter and half notes
        
        let currentTime = this.audioContext.currentTime;
        
        for (let i = 0; i < 8; i++) {
            const noteIndex = Math.floor(Math.random() * scale.length);
            const frequency = scale[noteIndex];
            const duration = rhythm[Math.floor(Math.random() * rhythm.length)];
            
            this.createOscillator(frequency, {
                waveType: 'sine',
                volume: 0.1,
                duration: duration,
                envelope: 'bell'
            }, currentTime, 0);
            
            currentTime += duration;
        }
    }
}

// Create global instance
const premiumSounds = new PremiumSoundSystem();

// Auto-initialize on first user interaction
document.addEventListener('click', async () => {
    if (!premiumSounds.initialized) {
        await premiumSounds.init();
    }
}, { once: true });

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumSoundSystem;
} else {
    window.PremiumSounds = premiumSounds;
}