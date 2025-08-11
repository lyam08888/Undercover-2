// Undercover 2 - Listes de mots et gestion simple (placeholder)
export const Words = {
  general: [
    ['pomme','poire'],['voiture','camion'],['plage','rivière'],['chocolat','vanille'],['lion','tigre'],
    ['radio','télé'],['basket','football'],['python','javascript'],['stylo','crayon'],['montagne','colline']
  ]
};

export function getPair(){
  const pack = Words.general;
  return pack[Math.floor(Math.random()*pack.length)];
}