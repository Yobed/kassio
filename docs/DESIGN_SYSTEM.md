# KASSIO 2.0 — Design system (lot 1)

Source : `v2/assets/kassio.css` (tokens + composants) et `v2/assets/kassio.js` (comportements).
Aucune dépendance externe : pas de framework, pas de GSAP. Polices auto-hébergées dans `v2/fonts/`.

## Tokens de la charte

| Token | Valeur | Usage |
|---|---|---|
| Midnight | `#101827` | sections technologiques, démos, texte principal |
| Navy | `#172A43` | logo, surfaces sombres secondaires |
| Blue | `#3478F6` | accents sur fond sombre, éléments actifs, graphiques |
| Cyan | `#55D6D0` | états particuliers (étape active, « en service ») |
| Pearl | `#F4F5F7` | fond des sections éditoriales |
| White | `#FFFFFF` | cartes |
| Slate | `#64748B` | texte secondaire sur blanc |
| Border | `#E2E8F0` | bordures |
| Success | `#16A34A` | validations |

### Dérivés ajoutés pour l'accessibilité (contraste AA)

Le Blue (`#3478F6`) avec du texte blanc ne donne que 3,9:1, et le Slate sur Pearl 4,4:1. Ces deux combinaisons sont sous le seuil AA. Trois dérivés corrigent ça :

- `--blue-strong #1F5FD6` : fond des boutons principaux (5,6:1 avec du blanc).
- `--blue-ink #1A56C8` : liens et accents texte sur fond clair.
- `--slate-ink #556275` : texte secondaire sur Pearl (5,4:1).

Un thème sombre est fourni par `prefers-color-scheme` et par `data-theme="dark"`. Les sections bleu nuit restent identiques dans les deux thèmes.

## Typographie

- **Sora** (500/600/700) : titres et logo.
- **Inter** (400/500/600) : texte courant, 16 px sur mobile et 17 px sur desktop.
- **JetBrains Mono** (400/500) : étiquettes, données, horodatages.
- H1 : 38–66 px (`clamp`). H2 : 32–50 px.

## Grille et dimensions

| Élément | Valeur |
|---|---|
| Conteneur | 1240 px |
| Navigation | 72 px, et 64 px sur mobile |
| Espacement entre sections | 72–112 px |
| Rayon des cartes | 16 px |
| Rayon des boutons | 10 px |
| Zone tactile | 44 px minimum |

## Composants (classes CSS)

| Composant (cahier) | Classe(s) | États |
|---|---|---|
| Navbar | `.nav`, `.nav-l`, `.menu` (Solutions), `.panel-m` (mobile plein écran) | hover, focus, ouvert ; Échap ferme ; focus piégé dans le panneau |
| Footer | `.foot`, `.foot-g`, `.foot-b` | — |
| ButtonPrimary | `.btn.btn-p` | hover, focus, `[disabled]`, `.is-loading` |
| ButtonSecondary | `.btn.btn-s` (variante `.on-navy`) | hover, focus, disabled |
| WhatsAppButton | `.btn.btn-w`, `.wa-fixe` (fixe sur mobile et tablette) | hover, focus |
| SectionHeader | `.sec-h` (+ `.eyebrow`), variante `.solo` | — |
| ServiceCard | `.div` + `.offre` + `.voir` | hover sur `.voir` |
| ProjectCard | `.pj-real` (cas réel), `.proto` (prototype fictif) | hover |
| MetricCard | `.kpi`, `.hub-k`, `.fiche` | `.flash` à la mise à jour |
| DemoFrame | `.studio`, `.tabs` (ARIA tabs, flèches clavier), `.st-grid` | onglet sélectionné, `.chip:disabled` |
| WorkflowDiagram | `.flux` (SVG sur desktop, `.flux-l` sur mobile) | étape allumée en séquence |
| FAQAccordion | `details.qr` | ouvert / fermé |
| ContactCTA | `.cta-f` | — |
| IndustryCard, TestimonialCard | prévus aux lots 2 et 5 | — |

## Règles

1. Les sections éditoriales sont sur fond clair. Les démonstrations et le contenu technologique sont sur `.navy`.
2. Blue sert aux CTA et aux éléments actifs. Cyan est réservé aux états particuliers.
3. Pas de pastille qui clignote ni de point qui pulse (décision du fondateur).
4. Toute donnée de démonstration porte la mention « fictif » ou « simulation ».
5. Les animations sont désactivées si `prefers-reduced-motion` est actif.
6. Ne jamais inventer d'équipe, de certification, de client ou de chiffre de résultat.
7. Contact : WhatsApp avec un message pré-rempli par point d'entrée (voir `MSG` dans `kassio.js`). Le formulaire avec CRM est prévu au lot 4.

## Langue

Le site est en français uniquement. Pour ajouter l'anglais plus tard :

- dupliquer la page dans `/en/` avec `lang="en"` ;
- traduire les textes du HTML et l'objet `MSG` ;
- ajouter des liens `hreflang` entre les deux versions.
