# Octopus Expertise Design System

## Direction

Une infrastructure editoriale industrielle claire: surfaces ivoire froid et graphite, typographie massive mais contenue, lignes de flux et images terrain recadrees comme preuves operationnelles. La page publique est expressive; la console privilegie la densite et la vitesse.

## Color

- `ink`: graphite bleute pour texte et console.
- `paper`: blanc froid legerement teinte vers le bleu.
- `electric`: bleu electrique issu du nouveau logo, reserve aux actions et etats actifs.
- `violet`: accent secondaire rare, derive du fond fourni avec le logo.
- `success`, `warning`, `danger`: roles semantiques stables, jamais decoratifs.

Tous les tokens de production utilisent OKLCH. Le texte courant vise au moins 4.5:1 et les grands textes 3:1.

## Typography

Une famille sans variable pour l'interface et les donnees, avec une voix display industrielle obtenue par poids, largeur et rythme plutot que par une seconde police decorative. Titres publics fluides, plafonnes a 6rem et tracking jamais inferieur a -0.04em; console sur echelle fixe.

## Layout

Grille publique asymetrique, largeur de lecture limitee et sections rythmees par densite. Console avec navigation laterale stable sur grand ecran, barre compacte sur mobile et tableaux convertis en lignes lisibles sans panoramique du document.

## Components

Rayon standard 12px, 16px uniquement pour grandes surfaces, pillules uniquement pour tags et actions compactes. Une elevation ou une bordure, pas les deux comme decoration. Etats hover, focus, active, disabled, loading, empty et error obligatoires.

## Motion

Posture polie et expressive sur la page publique, minimale dans la console. Transitions frequentes de 140 a 220 ms; narration rare jusqu'a 700 ms. Transform et opacity en priorite. Aucun contenu ne depend d'une animation pour devenir visible.

## Imagery and logo

Le logo Octopus Expertise doit etre pose sur une surface assurant un contraste net, avec version claire ou decoupee selon le fond. Les images terrain restent locales, approuvees et traitees comme preuves, jamais comme remplissage.
