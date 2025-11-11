// libs/shared/ui-components/src/lib/services/theme.service.ts
import { Injectable, signal, computed } from '@angular/core';

/**
 * Configuración de un tema visual
 */
export interface ThemeConfig {
  name: string;
  title: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  decorativeElements: string[];
  particles: {
    icon: string;
    color: string;
  }[];
  hasSpecialEffects: boolean;
  effectType?: 'snow' | 'hearts' | 'kites' | 'sparkles' | 'pumpkins';
}

/**
 * Servicio de gestión de temas temáticos por mes
 * 
 * Cambia automáticamente el tema de PlaceMy según el mes del año
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  
  // ============================================
  // PRIMERO: Definir los temas (antes del signal)
  // ============================================
  private readonly themes: Record<string, ThemeConfig> = {
    
    base: {
      name: 'base',
      title: 'PlaceMy',
      subtitle: 'Gestión de Restaurantes',
      primaryColor: '#8B2635',
      accentColor: '#FF6B6B',
      backgroundColor: '#0a0a0a',
      decorativeElements: ['🍴', '🍽️', '🥘', '🍷', '🍕', '🍔'],
      particles: [
        { icon: '🍴', color: '#8B2635' },
        { icon: '🍽️', color: '#FF6B6B' },
        { icon: '🥘', color: '#C9975B' },
        { icon: '🍷', color: '#8B2635' }
      ],
      hasSpecialEffects: false
    },

    mothersDay: {
      name: 'mothers-day',
      title: 'PlaceMy Mamá',
      subtitle: 'Celebrando a las Madres',
      primaryColor: '#E91E63',
      accentColor: '#FF4081',
      backgroundColor: '#1a0a14',
      decorativeElements: ['💐', '🌸', '🌺', '💝', '🎀', '🌹', '💕'],
      particles: [
        { icon: '💐', color: '#E91E63' },
        { icon: '🌸', color: '#FF4081' },
        { icon: '🌺', color: '#FF69B4' },
        { icon: '💝', color: '#E91E63' }
      ],
      hasSpecialEffects: true,
      effectType: 'hearts'
    },

    fathersDay: {
      name: 'fathers-day',
      title: 'PlaceMy Papá',
      subtitle: 'Celebrando a los Padres',
      primaryColor: '#1565C0',
      accentColor: '#42A5F5',
      backgroundColor: '#0a0f1a',
      decorativeElements: ['👔', '🎩', '⚽', '🏆', '🎁', '🎯', '💼'],
      particles: [
        { icon: '👔', color: '#1565C0' },
        { icon: '🎩', color: '#42A5F5' },
        { icon: '⚽', color: '#64B5F6' },
        { icon: '🏆', color: '#FFC107' }
      ],
      hasSpecialEffects: false
    },

    colombiaIndependence: {
      name: 'colombia-independence',
      title: 'PlaceMy Colombia',
      subtitle: 'Viva Colombia! 🇨🇴',
      primaryColor: '#FCD116',
      accentColor: '#003893',
      backgroundColor: '#0a0a0a',
      decorativeElements: ['🇨🇴', '☕', '🌺', '🎺', '🎉', '🎊', '🏛️'],
      particles: [
        { icon: '🇨🇴', color: '#FCD116' },
        { icon: '☕', color: '#8B4513' },
        { icon: '🌺', color: '#CE1126' },
        { icon: '🎺', color: '#FCD116' }
      ],
      hasSpecialEffects: true,
      effectType: 'sparkles'
    },

    kites: {
      name: 'kites',
      title: 'PlaceMy Cometas',
      subtitle: 'Festival de Cometas',
      primaryColor: '#00BCD4',
      accentColor: '#FF9800',
      backgroundColor: '#0a1420',
      decorativeElements: ['🪁', '☁️', '🌈', '☀️', '💨', '🎨', '🦋'],
      particles: [
        { icon: '🪁', color: '#00BCD4' },
        { icon: '☁️', color: '#90CAF9' },
        { icon: '🌈', color: '#FF9800' },
        { icon: '☀️', color: '#FFC107' }
      ],
      hasSpecialEffects: true,
      effectType: 'kites'
    },

    loveFriendship: {
      name: 'love-friendship',
      title: 'PlaceMy Amor',
      subtitle: 'Amor y Amistad',
      primaryColor: '#C41E3A',
      accentColor: '#FF1493',
      backgroundColor: '#1a0a0f',
      decorativeElements: ['❤️', '💕', '🌹', '💝', '💘', '💖', '🎈'],
      particles: [
        { icon: '❤️', color: '#C41E3A' },
        { icon: '💕', color: '#FF1493' },
        { icon: '🌹', color: '#DC143C' },
        { icon: '💝', color: '#FF69B4' }
      ],
      hasSpecialEffects: true,
      effectType: 'hearts'
    },

    halloween: {
      name: 'halloween',
      title: 'PlaceMy Spooky',
      subtitle: 'Terror en el Menú',
      primaryColor: '#8B008B',
      accentColor: '#FF8C00',
      backgroundColor: '#0a0014',
      decorativeElements: ['🎃', '👻', '🦇', '🕷️', '🕸️', '💀', '🌙'],
      particles: [
        { icon: '🎃', color: '#FF8C00' },
        { icon: '👻', color: '#F0F0F0' },
        { icon: '🦇', color: '#4B0082' },
        { icon: '🕷️', color: '#8B008B' }
      ],
      hasSpecialEffects: true,
      effectType: 'pumpkins'
    },

    christmas: {
      name: 'christmas',
      title: 'PlaceMy Navidad',
      subtitle: 'Sabores de Temporada',
      primaryColor: '#165B33',
      accentColor: '#BB2528',
      backgroundColor: '#0a0f14',
      decorativeElements: ['🎄', '⛄', '🎅', '🎁', '❄️', '⭐', '🔔'],
      particles: [
        { icon: '❄️', color: '#00BFFF' },
        { icon: '🎄', color: '#165B33' },
        { icon: '🎁', color: '#BB2528' },
        { icon: '⭐', color: '#FFD700' }
      ],
      hasSpecialEffects: true,
      effectType: 'snow'
    }
  };

  // ============================================
  // SEGUNDO: Crear el signal (después de themes)
  // ============================================
  private _currentTheme = signal<ThemeConfig>(this.getThemeByDate());
  public currentTheme = computed(() => this._currentTheme());

  constructor() {
    console.log(`🎨 Tema activo: ${this._currentTheme().name}`);
  }

  private getThemeByDate(): ThemeConfig {
    const month = new Date().getMonth() + 1;

    if (month === 1 || month === 2 || month === 3 || month === 4 || month === 11) {
      return this.themes['base'];
    }
    if (month === 5) return this.themes['mothersDay'];
    if (month === 6) return this.themes['fathersDay'];
    if (month === 7) return this.themes['colombiaIndependence'];
    if (month === 8) return this.themes['kites'];
    if (month === 9) return this.themes['loveFriendship'];
    if (month === 10) return this.themes['halloween'];
    if (month === 12) return this.themes['christmas'];

    return this.themes['base'];
  }

  setTheme(themeName: string): void {
    if (this.themes[themeName]) {
      this._currentTheme.set(this.themes[themeName]);
    }
  }

  getAllThemes(): ThemeConfig[] {
    return Object.values(this.themes);
  }

  refreshTheme(): void {
    this._currentTheme.set(this.getThemeByDate());
  }
}