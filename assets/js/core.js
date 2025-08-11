// Undercover 2 - coeur de l'app (état, persistance, utilitaires)
export const Storage = {
  key: 'undercover2:save',
  save(data){ localStorage.setItem(this.key, JSON.stringify(data)); },
  load(){ try{ return JSON.parse(localStorage.getItem(this.key)) || null; }catch{ return null } },
  clear(){ localStorage.removeItem(this.key); }
};

export const Sound = (()=>{
  const ids = ['click','flip','event','eliminate','timer','launch','win','lose'];
  const cache = Object.fromEntries(ids.map(id => [id, new Audio(`assets/${id}.ogg`)]));
  let muted = false;
  function play(id, {volume=1, rate=1}={}){
    try{
      if(muted) return; const a = cache[id]; if(!a) return; a.pause(); a.currentTime=0; a.volume=volume; a.playbackRate=rate; a.play();
    }catch{}
  }
  function toggle(){ muted = !muted; return muted; }
  function set(value){ muted = !!value; }
  return { play, toggle, set };
})();

export const Haptics = {
  tap(){ if(navigator.vibrate) navigator.vibrate(10); },
  success(){ if(navigator.vibrate) navigator.vibrate([20,50,20]); },
  fail(){ if(navigator.vibrate) navigator.vibrate([60,20,60]); }
};

export function uid(){ return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

export const PersistedState = (initial)=>{
  const s = Storage.load() || initial;
  const subs = new Set();
  function set(part){ Object.assign(s, part); Storage.save(s); subs.forEach(fn=>fn(s)); }
  function get(){ return s; }
  function subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); }
  return { get, set, subscribe };
};