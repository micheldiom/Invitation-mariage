# Site d'invitation de mariage – Jean-Michel Diom & Christina Malmels (démonstration)

## Lancer
Ouvrir `index.html` dans un navigateur (internet requis : Google Fonts et jsPDF via cdnjs).
Ou : `python3 -m http.server` dans ce dossier, puis http://localhost:8000.

## Fichiers
- `config.js` : `vitrineUrl` = lien du site vitrine (pied de page). **Toutes les données modifiables** (noms, date, lieu, adresse, programme, histoire, photos, endpoint)
- `index.html` : structure ; `style.css` : design (palette en haut) ; `script.js` : comportements
- `assets/images/` : vos photos (licence commerciale vérifiée)

## Modifier le mariage (config.js)
- `date` (format `2027-09-18T16:00:00`), `dateLabel`, `place`, `address` (active « Voir l'itinéraire »), `demo:false` pour retirer la mention « démonstration »
- `gallery` : `["assets/images/photo1.jpg","description"]` ×8 ; `story`, `prog` : textes et horaires
- `g`, `b`, `ini` : noms et initiales du sceau

## Enregistrer les réponses (Google Sheet, gratuit)
Par défaut (`endpoint:""`) : **mode démonstration, rien n'est enregistré**, et la page l'indique.
1. Créer un Google Sheet **privé** (vous seuls y avez accès).
2. Menu *Extensions → Apps Script*, coller le contenu de `backend/apps-script.gs`, enregistrer.
3. *Déployer → Nouveau déploiement → Application Web* : exécuter **en tant que : moi** ; accès : **tout le monde**. Autoriser.
4. Copier l'URL de l'application Web dans `endpoint` (`config.js`).
5. Tester : envoyer une réponse depuis le site ; la ligne apparaît dans l'onglet « Reponses ». Un renvoi de la même soumission ne crée **pas** de doublon.
Protections incluses : validation, dédoublonnage (`id`), champ piège anti-robot, limite de 30 envois/minute, neutralisation des formules.
Après toute modification du script, redéployer (*Gérer les déploiements → Modifier → Nouvelle version*).
Données personnelles : seuls les propriétaires du Sheet les voient ; prévenir les invités de l'usage de leurs réponses et les supprimer après le mariage.

## Publier
Déposer le dossier tel quel sur un hébergeur statique (Netlify, Cloudflare Pages, GitHub Pages…).

## État des fonctionnalités
| Fonction | État |
|---|---|
| Enveloppe, histoire, galerie, programme, agenda `.ics`, compte à rebours | Opérationnel |
| Scène plume / parchemin enroulé / sceau | Opérationnel |
| PDF artistique (canvas + jsPDF) | Opérationnel (dépend du chargement de jsPDF) |
| Itinéraire | Actif seulement si `address` renseignée |
| Enregistrement des réponses | Script fourni (`backend/apps-script.gs`) ; à déployer par vos soins, non testé en conditions réelles |
| Photos | Fonds décoratifs : à remplacer |

## Images
Inspiration Pinterest ≠ libre de droits. Utiliser des images générées pour le projet ou sous licence commerciale. Ne pas utiliser de visuels de prestataires.

## Limites connues
Testé uniquement par simulation sans écran (aucune erreur d'exécution) ; rendu visuel à vérifier sur 320/375/390 px et sur Safari (bords irréguliers du parchemin).

## Mise en ligne (site statique : aucune commande de build)
Le contenu de ce dossier est le site complet. `index.html` doit se trouver **à la racine** du dépôt ou du dossier envoyé.
- **Vercel** (via GitHub) : importer le dépôt, préréglage « Other », aucune commande de build, laisser le dossier de sortie vide. Alternative : `npx vercel` dans ce dossier, puis `npx vercel --prod`. `vercel.json` ajoute deux en-têtes de sécurité simples.
- **Cloudflare Pages / Netlify / GitHub Pages** : même principe, aucune commande de build, dossier de publication = racine.
- **Conditions d'usage** : le plan gratuit de Vercel est réservé à un usage personnel non commercial. Pour un site qui promeut un business, vérifier les conditions de l'hébergeur choisi avant de publier.
- Après publication : renseigner `vitrineUrl` dans `config.js`, puis redéployer. Garder `endpoint` vide pour un site d'exemple.

## Vérifier en local avant d'envoyer
Ouvrir `index.html`, puis faire le parcours complet. Alternative avec serveur local : `python3 -m http.server 8000` dans ce dossier, puis http://localhost:8000.
