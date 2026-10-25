/**
 * Réception des confirmations de présence – Google Apps Script lié à un Google Sheet PRIVÉ.
 * Le client envoie un POST (JSON en text/plain) et attend {"ok":true}.
 * Protections : validation, dédoublonnage sur "id", champ piège (hp), limite globale par minute,
 * neutralisation des formules de tableur. Aucun secret n'est exposé dans le site.
 */
const FEUILLE = 'Reponses';
const MAX_PAR_MINUTE = 30;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = JSON.parse(e.postData.contents);
    if (p.hp) return sortie({ ok: true });                       // robot : on fait semblant
    const net = (v, n) => { let s = String(v == null ? '' : v).trim().slice(0, n || 300);
      return /^[=+\-@]/.test(s) ? "'" + s : s; };                // anti-injection de formule
    const id = String(p.id || '');
    if (!/^[\w-]{8,64}$/.test(id)) return sortie({ ok: false });
    const nom = net(p.nom, 120);
    if (nom.length < 2) return sortie({ ok: false });
    const presence = p.pr === 'oui' ? 'oui' : 'non';
    const nb = Math.max(1, Math.min(10, parseInt(p.nb, 10) || 1));

    const classeur = SpreadsheetApp.getActive();
    const sh = classeur.getSheetByName(FEUILLE) || classeur.insertSheet(FEUILLE);
    if (sh.getLastRow() === 0) sh.appendRow(['id', 'reçu le', 'civilité', 'nom', 'présence', 'personnes', 'régime', 'message']);

    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().flat() : [];
    if (ids.includes(id)) return sortie({ ok: true, doublon: true }); // même soumission renvoyée

    const cache = CacheService.getScriptCache(), cle = 'n' + Math.floor(Date.now() / 60000);
    const c = parseInt(cache.get(cle) || '0', 10);
    if (c >= MAX_PAR_MINUTE) return sortie({ ok: false, erreur: 'trop de demandes' });
    cache.put(cle, String(c + 1), 120);

    sh.appendRow([id, new Date(), net(p.civ, 20), nom, presence, nb, net(p.regime, 200), net(p.ms, 1000)]);
    return sortie({ ok: true });
  } catch (err) {
    return sortie({ ok: false });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
function sortie(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
