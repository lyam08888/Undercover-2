// ===== UNDERCOVER 2 - APPLICATION PRINCIPALE =====

import { Storage, Sound, Haptics, PersistedState, uid } from './core.js';
import { createGame, assignRoles, nextState, tallyVotes, eliminate } from './gameplay.js';
import { Themes } from './themes.js';
import { Words, getPair } from './words.js';

// État global de l'application
const state = PersistedState({
  theme: 'default',
  players: [],
  currentGame: null,
  lastConfig: { 
    mode: 'classic', 
    clueTime: 45, 
    voteTime: 30, 
    enableSaboteur: false, 
    enableOracle: false, 
    enableGuardian: false, 
    enableChameleon: false 
  },
  history: [],
  settings: {
    sound: true,
    vibration: true,
    theme: 'default'
  }
});

// Sélecteurs DOM
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// ===== GESTION DES ÉCRANS =====
class ScreenManager {
  constructor() {
    this.currentScreen = 'home';
    this.screens = new Map();
    this.initScreens();
  }

  initScreens() {
    $$('.screen').forEach(screen => {
      this.screens.set(screen.id.replace('screen-', ''), screen);
    });
  }

  show(screenName, direction = 'forward') {
    const currentScreen = this.screens.get(this.currentScreen);
    const nextScreen = this.screens.get(screenName);

    if (!nextScreen || currentScreen === nextScreen) return;

    // Animation de sortie
    if (currentScreen) {
      currentScreen.classList.remove('active');
      currentScreen.style.animation = direction === 'forward' ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out reverse';
    }

    // Animation d'entrée
    setTimeout(() => {
      nextScreen.classList.add('active');
      nextScreen.style.animation = direction === 'forward' ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-out reverse';
      this.currentScreen = screenName;
    }, currentScreen ? 150 : 0);

    Sound.play('click');
  }

  getCurrentScreen() {
    return this.currentScreen;
  }
}

// ===== GESTION DES JOUEURS =====
class PlayerManager {
  constructor() {
    this.players = state.get().players || [];
    this.render();
  }

  add(name) {
    if (!name || name.trim() === '') return false;
    
    const player = {
      id: uid(),
      name: name.trim(),
      avatar: name.charAt(0).toUpperCase(),
      role: null,
      word: null,
      eliminated: false,
      votes: 0
    };

    this.players.push(player);
    this.save();
    this.render();
    Sound.play('click');
    Haptics.tap();
    return true;
  }

  remove(id) {
    this.players = this.players.filter(p => p.id !== id);
    this.save();
    this.render();
    Sound.play('eliminate');
    Haptics.fail();
  }

  clear() {
    this.players = [];
    this.save();
    this.render();
  }

  get(id) {
    return this.players.find(p => p.id === id);
  }

  getAll() {
    return [...this.players];
  }

  getAlive() {
    return this.players.filter(p => !p.eliminated);
  }

  save() {
    state.set({ players: this.players });
  }

  render() {
    const container = $('#players-list');
    if (!container) return;

    if (this.players.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem;">
          <p style="color: var(--muted); margin-bottom: 1rem;">Aucun joueur ajouté</p>
          <button class="btn" onclick="playerManager.showAddDialog()">
            Ajouter le premier joueur
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="player-grid">
        ${this.players.map(player => `
          <div class="player-card">
            <div class="avatar">${player.avatar}</div>
            <div class="name">${player.name}</div>
            <button class="btn ghost" onclick="playerManager.remove('${player.id}')" style="padding: 0.5rem; font-size: 0.8rem;">
              Supprimer
            </button>
          </div>
        `).join('')}
      </div>
      <button class="btn ghost" onclick="playerManager.showAddDialog()" style="margin-top: 1rem;">
        + Ajouter un joueur
      </button>
    `;
  }

  showAddDialog() {
    const name = prompt('Nom du joueur :');
    if (name) {
      this.add(name);
    }
  }
}

// ===== GESTION DU JEU =====
class GameManager {
  constructor() {
    this.game = null;
    this.currentPhase = 'setup';
    this.currentPlayer = 0;
    this.timer = null;
    this.timeLeft = 0;
  }

  start(players) {
    if (players.length < 3) {
      this.showModal('Erreur', 'Il faut au moins 3 joueurs pour commencer une partie.');
      return false;
    }

    // Créer une nouvelle partie
    const config = { ...state.get().lastConfig, players: players.map(p => ({ ...p })) };
    this.game = createGame(config);
    
    // Assigner les rôles et les mots
    assignRoles(this.game);
    this.assignWords();
    
    // Sauvegarder l'état
    state.set({ currentGame: this.game });
    
    // Commencer la phase de révélation
    this.currentPhase = 'reveal';
    this.currentPlayer = 0;
    
    screenManager.show('reveal');
    this.renderRevealPhase();
    
    Sound.play('launch');
    Haptics.success();
    
    return true;
  }

  assignWords() {
    const wordPair = getPair();
    const [civilWord, undercoverWord] = Math.random() > 0.5 ? wordPair : [wordPair[1], wordPair[0]];
    
    this.game.players.forEach(player => {
      const role = this.game.roles[player.id];
      player.word = role === 'UNDERCOVER' ? undercoverWord : civilWord;
      player.role = role;
    });
  }

  renderRevealPhase() {
    const container = $('#reveal-content');
    if (!container) return;

    const currentPlayer = this.game.players[this.currentPlayer];
    
    container.innerHTML = `
      <div class="card" style="text-align: center;">
        <h2>Tour de ${currentPlayer.name}</h2>
        <p style="color: var(--muted); margin-bottom: 2rem;">
          Passez le téléphone à ${currentPlayer.name} et touchez la carte pour révéler votre rôle.
        </p>
        
        <div class="reveal-card" onclick="gameManager.revealCard()">
          <div class="card-front">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎭</div>
            <div>Touchez pour révéler</div>
          </div>
          <div class="card-back" style="display: none;">
            <div style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: var(--accent);">
              ${currentPlayer.role === 'UNDERCOVER' ? 'UNDERCOVER' : 'CIVIL'}
            </div>
            <div style="font-size: 1.5rem; font-weight: bold;">
              ${currentPlayer.word}
            </div>
          </div>
        </div>
        
        <button class="btn" onclick="gameManager.nextReveal()" style="margin-top: 2rem; display: none;" id="next-reveal-btn">
          ${this.currentPlayer < this.game.players.length - 1 ? 'Joueur suivant' : 'Commencer la partie'}
        </button>
      </div>
    `;
  }

  revealCard() {
    const cardFront = $('.card-front');
    const cardBack = $('.card-back');
    const nextBtn = $('#next-reveal-btn');
    
    if (cardFront && cardBack && nextBtn) {
      cardFront.style.display = 'none';
      cardBack.style.display = 'block';
      nextBtn.style.display = 'block';
      
      Sound.play('flip');
      Haptics.tap();
    }
  }

  nextReveal() {
    this.currentPlayer++;
    
    if (this.currentPlayer >= this.game.players.length) {
      // Tous les joueurs ont vu leur carte, commencer le jeu
      this.startGameplay();
    } else {
      // Joueur suivant
      this.renderRevealPhase();
    }
    
    Sound.play('click');
  }

  startGameplay() {
    this.currentPhase = 'discussion';
    screenManager.show('game');
    this.renderGamePhase();
  }

  renderGamePhase() {
    const container = $('#game-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="text-align: center;">
        <h2>Phase de discussion</h2>
        <p style="color: var(--muted); margin-bottom: 2rem;">
          Chaque joueur donne un indice sur son mot. Les Undercover doivent se faire passer pour des Civils !
        </p>
        
        <div style="margin: 2rem 0;">
          <div style="font-size: 1.2rem; margin-bottom: 1rem;">Tour ${this.game.round}</div>
          <div style="font-size: 0.9rem; color: var(--muted);">
            Joueurs restants : ${this.game.players.filter(p => !p.eliminated).length}
          </div>
        </div>
        
        <button class="btn" onclick="gameManager.startVoting()">
          Passer au vote
        </button>
      </div>
    `;
  }

  startVoting() {
    this.currentPhase = 'vote';
    screenManager.show('vote');
    this.renderVotePhase();
  }

  renderVotePhase() {
    const container = $('#vote-content');
    if (!container) return;

    const alivePlayers = this.game.players.filter(p => !p.eliminated);
    
    container.innerHTML = `
      <div class="card">
        <h2 style="text-align: center;">Phase de vote</h2>
        <p style="text-align: center; color: var(--muted); margin-bottom: 2rem;">
          Qui pensez-vous être l'Undercover ?
        </p>
        
        <div class="player-grid">
          ${alivePlayers.map(player => `
            <div class="player-card vote-card" onclick="gameManager.vote('${player.id}')" data-player-id="${player.id}">
              <div class="avatar">${player.avatar}</div>
              <div class="name">${player.name}</div>
              <div class="vote-count">0 votes</div>
            </div>
          `).join('')}
        </div>
        
        <button class="btn" onclick="gameManager.processVotes()" style="margin-top: 2rem;">
          Terminer le vote
        </button>
      </div>
    `;
  }

  vote(playerId) {
    // Simulation de vote (dans un vrai jeu, chaque joueur voterait)
    const player = this.game.players.find(p => p.id === playerId);
    if (player) {
      player.votes = (player.votes || 0) + 1;
      
      // Mettre à jour l'affichage
      const voteCard = $(`.vote-card[data-player-id="${playerId}"]`);
      if (voteCard) {
        const voteCount = voteCard.querySelector('.vote-count');
        if (voteCount) {
          voteCount.textContent = `${player.votes} vote${player.votes > 1 ? 's' : ''}`;
        }
        voteCard.style.background = 'var(--accent-glow)';
      }
      
      Sound.play('click');
      Haptics.tap();
    }
  }

  processVotes() {
    // Trouver le joueur avec le plus de votes
    const alivePlayers = this.game.players.filter(p => !p.eliminated);
    let maxVotes = 0;
    let eliminatedPlayer = null;
    
    alivePlayers.forEach(player => {
      if ((player.votes || 0) > maxVotes) {
        maxVotes = player.votes || 0;
        eliminatedPlayer = player;
      }
    });
    
    // Si personne n'a de votes, éliminer aléatoirement
    if (!eliminatedPlayer || maxVotes === 0) {
      eliminatedPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    }
    
    // Éliminer le joueur
    eliminate(this.game, eliminatedPlayer.id);
    eliminatedPlayer.eliminated = true;
    
    // Vérifier les conditions de victoire
    const gameEnd = this.checkGameEnd();
    if (gameEnd) {
      this.endGame(gameEnd);
    } else {
      this.nextRound();
    }
  }

  checkGameEnd() {
    const alivePlayers = this.game.players.filter(p => !p.eliminated);
    const aliveUndercover = alivePlayers.filter(p => p.role === 'UNDERCOVER');
    const aliveCivils = alivePlayers.filter(p => p.role !== 'UNDERCOVER');
    
    if (aliveUndercover.length === 0) {
      return { winner: 'civils', message: 'Les Civils ont gagné ! Tous les Undercover ont été éliminés.' };
    }
    
    if (aliveUndercover.length >= aliveCivils.length) {
      return { winner: 'undercover', message: 'Les Undercover ont gagné ! Ils sont maintenant majoritaires.' };
    }
    
    return null;
  }

  nextRound() {
    this.game.round++;
    
    // Réinitialiser les votes
    this.game.players.forEach(player => {
      player.votes = 0;
    });
    
    // Retourner à la phase de discussion
    this.currentPhase = 'discussion';
    this.renderGamePhase();
    
    Sound.play('event');
  }

  endGame(result) {
    screenManager.show('results');
    this.renderResults(result);
    
    Sound.play(result.winner === 'civils' ? 'win' : 'lose');
    Haptics.success();
  }

  renderResults(result) {
    const container = $('#results-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">
          ${result.winner === 'civils' ? '🏆' : '🎭'}
        </div>
        <h2>${result.message}</h2>
        
        <div style="margin: 2rem 0;">
          <h3>Révélation des rôles :</h3>
          <div class="player-grid" style="margin-top: 1rem;">
            ${this.game.players.map(player => `
              <div class="player-card">
                <div class="avatar">${player.avatar}</div>
                <div class="name">${player.name}</div>
                <div style="font-size: 0.8rem; color: var(--${player.role === 'UNDERCOVER' ? 'danger' : 'success'});">
                  ${player.role === 'UNDERCOVER' ? 'UNDERCOVER' : 'CIVIL'}
                </div>
                <div style="font-size: 0.8rem; color: var(--muted);">
                  "${player.word}"
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn ghost" onclick="gameManager.newGame()">
            Nouvelle partie
          </button>
          <button class="btn" onclick="gameManager.playAgain()">
            Rejouer
          </button>
        </div>
      </div>
    `;
  }

  newGame() {
    this.game = null;
    this.currentPhase = 'setup';
    this.currentPlayer = 0;
    screenManager.show('home');
    Sound.play('click');
  }

  playAgain() {
    if (this.game) {
      // Réinitialiser l'état des joueurs
      this.game.players.forEach(player => {
        player.eliminated = false;
        player.votes = 0;
      });
      
      this.game.round = 1;
      this.game.eliminated = [];
      
      // Réassigner les rôles et mots
      assignRoles(this.game);
      this.assignWords();
      
      // Recommencer
      this.currentPhase = 'reveal';
      this.currentPlayer = 0;
      screenManager.show('reveal');
      this.renderRevealPhase();
      
      Sound.play('launch');
    }
  }

  showModal(title, message, actions = []) {
    const modal = $('#modal-template');
    const modalTitle = $('#modal-title');
    const modalMessage = $('#modal-message');
    const modalActions = $('#modal-actions');
    
    if (modal && modalTitle && modalMessage && modalActions) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      
      modalActions.innerHTML = '';
      if (actions.length === 0) {
        actions = [{ text: 'OK', action: () => modal.close() }];
      }
      
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `btn ${action.class || ''}`;
        btn.textContent = action.text;
        btn.onclick = () => {
          if (action.action) action.action();
          modal.close();
        };
        modalActions.appendChild(btn);
      });
      
      modal.showModal();
      Sound.play('notification');
    }
  }
}

// ===== GESTION DES THÈMES =====
class ThemeManager {
  constructor() {
    this.currentTheme = state.get().settings.theme || 'default';
    this.applyTheme(this.currentTheme);
  }

  applyTheme(themeName) {
    document.body.className = themeName === 'default' ? '' : `theme-${themeName}`;
    this.currentTheme = themeName;
    
    // Sauvegarder
    const settings = state.get().settings;
    settings.theme = themeName;
    state.set({ settings });
  }

  getAvailableThemes() {
    return {
      default: { name: 'Sombre moderne', icon: '🌙' },
      neon: { name: 'Néon', icon: '⚡' },
      retro: { name: 'Rétro', icon: '🕹️' },
      cyber: { name: 'Cyber', icon: '🤖' },
      minimal: { name: 'Minimal', icon: '⚪' }
    };
  }

  showThemeSelector() {
    const themes = this.getAvailableThemes();
    const themeOptions = Object.entries(themes).map(([key, theme]) => 
      `<button class="btn ${key === this.currentTheme ? '' : 'ghost'}" onclick="themeManager.applyTheme('${key}')" style="margin: 0.25rem;">
        ${theme.icon} ${theme.name}
      </button>`
    ).join('');

    gameManager.showModal('Choisir un thème', '', [
      { text: 'Fermer', class: 'ghost' }
    ]);

    // Remplacer le contenu du message par les options de thème
    const modalMessage = $('#modal-message');
    if (modalMessage) {
      modalMessage.innerHTML = `<div style="display: flex; flex-direction: column; gap: 0.5rem;">${themeOptions}</div>`;
    }
  }
}

// ===== INITIALISATION =====
const screenManager = new ScreenManager();
const playerManager = new PlayerManager();
const gameManager = new GameManager();
const themeManager = new ThemeManager();

// Rendre les managers globalement accessibles
window.screenManager = screenManager;
window.playerManager = playerManager;
window.gameManager = gameManager;
window.themeManager = themeManager;

// ===== ÉVÉNEMENTS GLOBAUX =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les particules
  if (window.tsParticles) {
    tsParticles.load("tsparticles", {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 }
        }
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: 1,
          straight: false
        },
        number: {
          density: { enable: true, area: 800 },
          value: 80
        },
        opacity: { value: 0.1 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } }
      },
      detectRetina: true
    });
  }

  // Gestionnaires d'événements pour les boutons principaux
  const startGameBtn = $('#start-game-btn');
  if (startGameBtn) {
    startGameBtn.onclick = () => {
      if (playerManager.getAll().length === 0) {
        gameManager.showModal('Aucun joueur', 'Ajoutez au moins 3 joueurs pour commencer une partie.');
        return;
      }
      screenManager.show('setup');
    };
  }

  const playBtn = $('#play-btn');
  if (playBtn) {
    playBtn.onclick = () => {
      const players = playerManager.getAll();
      if (gameManager.start(players)) {
        // Jeu démarré avec succès
      }
    };
  }

  const settingsBtn = $('#settings-btn');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      themeManager.showThemeSelector();
    };
  }

  // Gestionnaire pour le bouton de retour
  $$('.back-btn').forEach(btn => {
    btn.onclick = () => {
      screenManager.show('home', 'backward');
    };
  });

  console.log('🎮 Undercover 2 initialisé avec succès !');
});

// ===== EXPORT POUR MODULES =====
export { screenManager, playerManager, gameManager, themeManager };