import { createProgress } from '../src/progress.js';
import { createMatch } from '../src/game.js';
import { awardPoint } from '../src/rules.js';
const key = 'juandivoley.qa.progress.v1';
const profile = createProgress({getItem:()=>localStorage.getItem(key),setItem:(_,value)=>localStorage.setItem(key,value)});
let match = createMatch(), id = crypto.randomUUID();
match.phase = 'home';
function show() {
  const p = profile.snapshot();
  document.getElementById('state').textContent = `Saldo: ${p.credits}; reserva salto: ${p.reserve.jump}; fase: ${match.phase}; disponibles salto: ${match.powers.stock.jump}; preparados: ${match.powers.pending.jump}`;
}
document.getElementById('win').onclick = () => {
  match.phase='rally';match.score=[14,0];awardPoint(match,0,'Fixture de victoria');
  profile.reward(id,match.winner);show();
};
document.getElementById('buy').onclick = () => {profile.buy('jump',match.phase);show();};
document.getElementById('start').onclick = () => {
  const reserve=profile.takeReserve();match=createMatch();id=crypto.randomUUID();
  for(const type of ['jump','spike'])match.powers.stock[type]+=reserve[type];show();
};
show();
