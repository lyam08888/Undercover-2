// Undercover 2 - UI et navigation entre écrans
import { PersistedState, Sound, Haptics, uid } from './core.js';
import { createGame, assignRoles, nextState, tallyVotes, eliminate } from './gameplay.js';
import { Themes } from './themes.js';
import { Words } from './words.js';

const state = PersistedState({
  theme: 'default',
  players: [],
  lastConfig: { mode:'classic', clueTime:45, voteTime:30, enableSaboteur:false, enableOracle:false, enableGuardian:false, enableChameleon:false },
  history: []
});

function $(s, r=document){ return r.querySelector(s); }
function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

function renderThemePicker(){
  const root = document.documentElement;
  const saved = state.get().theme || 'default';
  root.className = saved === 'default' ? '' : `theme-${saved}`;
  const list = $('#theme-list'); if(!list) return;
  list.innerHTML = Object.entries(Themes).map(([id,t])=>`<button class="theme-item ${saved===id?'active':''}" data-id="${id}">
    <span class="icon">${t.icon||'🎨'}</span>
    <span class="details"><span class="label">${t.name}</span><span class="description">${t.desc||''}</span></span>
  </button>`).join('');
  list.addEventListener('click', e=>{
    const btn = e.target.closest('[data-id]'); if(!btn) return;
    const id = btn.dataset.id; state.set({theme:id});
    root.className = id==='default'?'':`theme-${id}`;
    Haptics.tap(); Sound.play('click');
    renderThemePicker();
  });
}

function addPlayer(name){
  const p = { id: uid(), name: name || `Joueur ${state.get().players.length+1}`, avatar: '' };
  const players = [...state.get().players, p];
  state.set({ players });
  renderPlayers();
}
function removePlayer(id){ state.set({ players: state.get().players.filter(p=>p.id!==id) }); renderPlayers(); }

function renderPlayers(){
  const container = $('#players'); if(!container) return;
  const arr = state.get().players;
  container.innerHTML = arr.map(p=>`<div class="player-card"><div class="avatar">${p.name[0]||'?'}</div><div>${p.name}</div><button class="btn ghost" data-del="${p.id}">Supprimer</button></div>`).join('');
  container.onclick = e=>{ const id = e.target?.dataset?.del; if(id){ removePlayer(id); Sound.play('eliminate'); Haptics.fail(); } };
}

function startGame(){
  const cfg = state.get().lastConfig;
  const players = state.get().players;
  if(players.length < 3){ alert('Minimum 3 joueurs'); return; }
  const game = createGame({ ...cfg, players });
  assignRoles(game);
  window.__game = game; // debug
  goto('reveal');
}

function goto(screen){
  $all('.screen').forEach(el=>el.classList.remove('active'));
  $(`#screen-${screen}`)?.classList.add('active');
}

function wireHome(){
  $('#btn-add').onclick = ()=>{ addPlayer(prompt('Nom du joueur ?')||''); Sound.play('click'); };
  $('#btn-start').onclick = ()=>{ startGame(); Sound.play('launch'); };
}

window.addEventListener('DOMContentLoaded', ()=>{
  renderThemePicker();
  renderPlayers();
  wireHome();
});