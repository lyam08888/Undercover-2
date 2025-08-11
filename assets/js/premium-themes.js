// ===== PREMIUM THEMES CONFIGURATION =====

export const PremiumThemes = {
    // Dark Premium (Default)
    darkPremium: {
        name: 'Dark Premium',
        icon: '🌙',
        description: 'Élégant et moderne avec des accents lumineux',
        colors: {
            primary: '#0A0A0F',
            secondary: '#12121A',
            tertiary: '#1A1A25',
            accent: '#6366F1',
            accentSecondary: '#8B5CF6',
            accentTertiary: '#EC4899',
            text: '#FFFFFF',
            textSecondary: '#A1A1AA',
            textMuted: '#71717A',
            success: '#10B981',
            warning: '#F59E0B',
            danger: '#EF4444',
            info: '#3B82F6'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
        },
        effects: {
            blur: '20px',
            glow: 'rgba(99, 102, 241, 0.4)',
            shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }
    },

    // Neon Cyberpunk
    neonCyber: {
        name: 'Neon Cyber',
        icon: '⚡',
        description: 'Ambiance cyberpunk avec des néons éclatants',
        colors: {
            primary: '#0D0208',
            secondary: '#1A0B1A',
            tertiary: '#2D1B2D',
            accent: '#00F5FF',
            accentSecondary: '#FF00FF',
            accentTertiary: '#00FF41',
            text: '#FFFFFF',
            textSecondary: '#B8B8FF',
            textMuted: '#8A8AFF',
            success: '#00FF41',
            warning: '#FFD700',
            danger: '#FF073A',
            info: '#00F5FF'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #00F5FF 0%, #FF00FF 50%, #00FF41 100%)',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 245, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 0, 255, 0.2) 0%, transparent 50%)'
        },
        effects: {
            blur: '15px',
            glow: 'rgba(0, 245, 255, 0.6)',
            shadow: '0 0 30px rgba(0, 245, 255, 0.3)',
            textShadow: '0 0 10px currentColor'
        },
        animations: {
            flicker: true,
            neonGlow: true,
            scanlines: true
        }
    },

    // Sunset Gradient
    sunsetGlow: {
        name: 'Sunset Glow',
        icon: '🌅',
        description: 'Couleurs chaudes inspirées du coucher de soleil',
        colors: {
            primary: '#1A0B0B',
            secondary: '#2D1B1B',
            tertiary: '#3D2B2B',
            accent: '#FF6B6B',
            accentSecondary: '#FFE66D',
            accentTertiary: '#FF8E53',
            text: '#FFF8E1',
            textSecondary: '#FFCC80',
            textMuted: '#FFAB91',
            success: '#81C784',
            warning: '#FFB74D',
            danger: '#E57373',
            info: '#64B5F6'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #FF8E53 100%)',
            background: 'radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255, 230, 109, 0.15) 0%, transparent 60%)'
        },
        effects: {
            blur: '25px',
            glow: 'rgba(255, 107, 107, 0.4)',
            shadow: '0 15px 35px rgba(255, 107, 107, 0.2)'
        },
        animations: {
            warmGlow: true,
            colorShift: true
        }
    },

    // Ocean Deep
    oceanDeep: {
        name: 'Ocean Deep',
        icon: '🌊',
        description: 'Profondeurs océaniques avec des bleus apaisants',
        colors: {
            primary: '#0A1628',
            secondary: '#1E293B',
            tertiary: '#334155',
            accent: '#0EA5E9',
            accentSecondary: '#06B6D4',
            accentTertiary: '#8B5CF6',
            text: '#F1F5F9',
            textSecondary: '#CBD5E1',
            textMuted: '#94A3B8',
            success: '#059669',
            warning: '#D97706',
            danger: '#DC2626',
            info: '#0284C7'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #8B5CF6 100%)',
            background: 'radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)'
        },
        effects: {
            blur: '30px',
            glow: 'rgba(14, 165, 233, 0.4)',
            shadow: '0 25px 50px rgba(14, 165, 233, 0.15)'
        },
        animations: {
            wave: true,
            ripple: true,
            flow: true
        }
    },

    // Forest Mystique
    forestMystic: {
        name: 'Forest Mystique',
        icon: '🌲',
        description: 'Mystère de la forêt avec des verts profonds',
        colors: {
            primary: '#0F1419',
            secondary: '#1B2B1B',
            tertiary: '#2D3D2D',
            accent: '#22C55E',
            accentSecondary: '#84CC16',
            accentTertiary: '#10B981',
            text: '#F0FDF4',
            textSecondary: '#BBF7D0',
            textMuted: '#86EFAC',
            success: '#16A34A',
            warning: '#CA8A04',
            danger: '#DC2626',
            info: '#0891B2'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #22C55E 0%, #84CC16 50%, #10B981 100%)',
            background: 'radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(132, 204, 22, 0.1) 0%, transparent 50%)'
        },
        effects: {
            blur: '20px',
            glow: 'rgba(34, 197, 94, 0.3)',
            shadow: '0 20px 40px rgba(34, 197, 94, 0.1)'
        },
        animations: {
            organic: true,
            growth: true,
            shimmer: true
        }
    },

    // Royal Purple
    royalPurple: {
        name: 'Royal Purple',
        icon: '👑',
        description: 'Élégance royale avec des violets profonds',
        colors: {
            primary: '#1A0A1A',
            secondary: '#2D1B2D',
            tertiary: '#3D2B3D',
            accent: '#8B5CF6',
            accentSecondary: '#A855F7',
            accentTertiary: '#C084FC',
            text: '#FAF5FF',
            textSecondary: '#E9D5FF',
            textMuted: '#C4B5FD',
            success: '#10B981',
            warning: '#F59E0B',
            danger: '#EF4444',
            info: '#3B82F6'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)'
        },
        effects: {
            blur: '25px',
            glow: 'rgba(139, 92, 246, 0.5)',
            shadow: '0 25px 50px rgba(139, 92, 246, 0.2)'
        },
        animations: {
            royal: true,
            elegant: true,
            sparkle: true
        }
    },

    // Minimal Light
    minimalLight: {
        name: 'Minimal Light',
        icon: '☀️',
        description: 'Design épuré avec des tons clairs',
        colors: {
            primary: '#FFFFFF',
            secondary: '#F8FAFC',
            tertiary: '#F1F5F9',
            accent: '#3B82F6',
            accentSecondary: '#6366F1',
            accentTertiary: '#8B5CF6',
            text: '#0F172A',
            textSecondary: '#475569',
            textMuted: '#64748B',
            success: '#059669',
            warning: '#D97706',
            danger: '#DC2626',
            info: '#0284C7'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 60%)'
        },
        effects: {
            blur: '15px',
            glow: 'rgba(59, 130, 246, 0.2)',
            shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        animations: {
            subtle: true,
            clean: true
        }
    },

    // Retro Gaming
    retroGaming: {
        name: 'Retro Gaming',
        icon: '🕹️',
        description: 'Nostalgie des jeux rétro avec des couleurs vives',
        colors: {
            primary: '#1A1A2E',
            secondary: '#16213E',
            tertiary: '#0F3460',
            accent: '#E94560',
            accentSecondary: '#F39C12',
            accentTertiary: '#00D2D3',
            text: '#FFFFFF',
            textSecondary: '#BDC3C7',
            textMuted: '#95A5A6',
            success: '#27AE60',
            warning: '#F39C12',
            danger: '#E74C3C',
            info: '#3498DB'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #E94560 0%, #F39C12 50%, #00D2D3 100%)',
            background: 'linear-gradient(45deg, #1A1A2E 25%, transparent 25%), linear-gradient(-45deg, #1A1A2E 25%, transparent 25%)'
        },
        effects: {
            blur: '10px',
            glow: 'rgba(233, 69, 96, 0.4)',
            shadow: '0 8px 16px rgba(233, 69, 96, 0.2)',
            pixelated: true
        },
        animations: {
            retro: true,
            pixelate: true,
            arcade: true
        }
    }
};

// Theme Manager Class
export class PremiumThemeManager {
    constructor() {
        this.currentTheme = 'darkPremium';
        this.themes = PremiumThemes;
        this.customThemes = {};
        
        // Load saved theme
        this.loadSavedTheme();
    }
    
    // Apply theme to document
    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.customThemes[themeName];
        if (!theme) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }
        
        const root = document.documentElement;
        
        // Apply color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${this.camelToKebab(key)}`, value);
        });
        
        // Apply gradient variables
        if (theme.gradients) {
            Object.entries(theme.gradients).forEach(([key, value]) => {
                root.style.setProperty(`--gradient-${this.camelToKebab(key)}`, value);
            });
        }
        
        // Apply effect variables
        if (theme.effects) {
            Object.entries(theme.effects).forEach(([key, value]) => {
                root.style.setProperty(`--effect-${this.camelToKebab(key)}`, value);
            });
        }
        
        // Apply theme class to body
        document.body.className = `theme-${this.camelToKebab(themeName)}`;
        
        // Apply special animations
        this.applyThemeAnimations(theme);
        
        this.currentTheme = themeName;
        this.saveTheme();
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, config: theme }
        }));
    }
    
    // Apply theme-specific animations
    applyThemeAnimations(theme) {
        if (!theme.animations) return;
        
        const animationStyles = [];
        
        if (theme.animations.flicker) {
            animationStyles.push(`
                .animate-flicker {
                    animation: flicker 2s ease-in-out infinite alternate;
                }
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
            `);
        }
        
        if (theme.animations.neonGlow) {
            animationStyles.push(`
                .animate-neon-glow {
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }
                @keyframes neonGlow {
                    from { 
                        text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
                        box-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
                    }
                    to { 
                        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
                        box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
                    }
                }
            `);
        }
        
        if (theme.animations.wave) {
            animationStyles.push(`
                .animate-wave {
                    animation: wave 3s ease-in-out infinite;
                }
                @keyframes wave {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `);
        }
        
        if (theme.animations.sparkle) {
            animationStyles.push(`
                .animate-sparkle::before {
                    content: '✨';
                    position: absolute;
                    animation: sparkle 2s linear infinite;
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                }
            `);
        }
        
        // Apply animation styles
        if (animationStyles.length > 0) {
            let styleElement = document.getElementById('theme-animations');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'theme-animations';
                document.head.appendChild(styleElement);
            }
            styleElement.textContent = animationStyles.join('\n');
        }
    }
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Get theme configuration
    getThemeConfig(themeName = null) {
        const name = themeName || this.currentTheme;
        return this.themes[name] || this.customThemes[name];
    }
    
    // Get all available themes
    getAllThemes() {
        return { ...this.themes, ...this.customThemes };
    }
    
    // Create custom theme
    createCustomTheme(name, config) {
        this.customThemes[name] = config;
        this.saveCustomThemes();
    }
    
    // Delete custom theme
    deleteCustomTheme(name) {
        delete this.customThemes[name];
        this.saveCustomThemes();
    }
    
    // Save current theme to localStorage
    saveTheme() {
        localStorage.setItem('undercover-premium-theme', this.currentTheme);
    }
    
    // Load saved theme from localStorage
    loadSavedTheme() {
        const saved = localStorage.getItem('undercover-premium-theme');
        if (saved && (this.themes[saved] || this.customThemes[saved])) {
            this.currentTheme = saved;
        }
        this.loadCustomThemes();
    }
    
    // Save custom themes to localStorage
    saveCustomThemes() {
        localStorage.setItem('undercover-custom-themes', JSON.stringify(this.customThemes));
    }
    
    // Load custom themes from localStorage
    loadCustomThemes() {
        const saved = localStorage.getItem('undercover-custom-themes');
        if (saved) {
            try {
                this.customThemes = JSON.parse(saved);
            } catch (error) {
                console.warn('Could not load custom themes:', error);
            }
        }
    }
    
    // Utility: Convert camelCase to kebab-case
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }
    
    // Auto-detect preferred theme based on system
    detectPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'darkPremium';
        } else {
            return 'minimalLight';
        }
    }
    
    // Initialize theme system
    init() {
        // Apply current theme
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme(e.matches ? 'darkPremium' : 'minimalLight');
                }
            });
        }
    }
}

// Create global theme manager instance
export const themeManager = new PremiumThemeManager();