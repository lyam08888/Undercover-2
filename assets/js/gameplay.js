// Undercover 2 - logique de jeu (rôles, états, timers)
import { uid } from './core.js';

export const Roles = {
  UNDERCOVER:'UNDERCOVER', MR_WHITE:'MR_WHITE', SABOTEUR:'SABOTEUR', ORACLE:'ORACLE', DUO:'DUO', GARDIEN:'GARDIEN', CAMELEON:'CAMELEON'
};

export function createGame(config){
  return {
    id: uid(),
    config,
    players: config.players.map(p=>({...p})),
    roles: {},
    state: 'reveal', // 'reveal'|'clue'|'vote'|'result'
    round: 1,
    eliminated: [],
    history: [],
    timers: { clue: config.clueTime || 45, vote: config.voteTime || 30 },
    events: []
  };
}

export function assignRoles(game){
  const ids = game.players.map(p=>p.id);
  // baseline: 1 Undercover + 1 MrWhite si >=6 joueurs; options avancées activables depuis config
  const shuffled = ids.sort(()=>Math.random()-0.5);
  const roles = {};
  roles[shuffled[0]] = Roles.UNDERCOVER;
  if(ids.length >= 6) roles[shuffled[1]] = Roles.MR_WHITE;
  if(game.config.enableSaboteur) roles[shuffled[2]||shuffled[0]] = Roles.SABOTEUR;
  if(game.config.enableOracle) roles[shuffled[3]||shuffled[1]] = Roles.ORACLE;
  if(game.config.enableGuardian) roles[shuffled[4]||shuffled[2]] = Roles.GARDIEN;
  if(game.config.enableChameleon) roles[shuffled[5]||shuffled[3]] = Roles.CAMELEON;
  game.roles = roles; return roles;
}

export function nextState(game){
  if(game.state==='reveal') game.state='clue';
  else if(game.state==='clue') game.state='vote';
  else if(game.state==='vote') game.state='result';
  else { game.round++; game.state='reveal'; }
  return game.state;
}

export function isAlive(game, pid){ return !game.eliminated.includes(pid); }

export function eliminate(game, pid){
  if(!isAlive(game, pid)) return;
  game.eliminated.push(pid);
  game.history.push({t:'eliminate', pid, round: game.round});
}

export function tallyVotes(votes){
  // votes: { voterId: targetId|null }
  const count = {};
  for(const v of Object.values(votes)){
    if(!v) continue; count[v] = (count[v]||0)+1;
  }
  let max=0, top=[];
  for(const [pid,c] of Object.entries(count)){
    if(c>max){ max=c; top=[pid]; }
    else if(c===max){ top.push(pid); }
  }
  return { count, top, max };
}