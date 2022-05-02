# zone-selection

Permet de sélectionner une zone au laçot dans une zone souhaitée.


## Installation

Simplement ajouter le fichier `zone-selection.js` à votre projet.


## Utilisation
### initialisation de la classe

voisi un exemple d'utilisation de la classe `ZoneSelect` pour une div dont l'id est `zone-tampon`
```js
const tampon = new ZoneSelect('zone-tampon');
```
L'utilisateur pourra alors sélectionner une zone souhaitée dans les limites de l'élément renseigné.

### Récupération des coordonnées de la zone sélectionnée

Pour récupérer les données de la zone sélectionnée par l'utilisateur, il suiffit simplement d'appeler la propriété `getData` :
```js
let zoneSelectionnee = tampon.getData
```

Cette propriété vour retournera alors un objet sous la forme suivante :
```js
zoneSelectionnee = 
{
    start:{
        x: 0,
        y: 0
    },
    end:{
        x: 0,
        y: 0
    },
    width: 0,
    height: 0
}
```

### Supprimer la zone sélectionée

Pour supprimer la zone sélectionnée au lassot (reset), il vous suffit d'appeler la méthode `deleteSelectedZoneIfExists`:
```js
tampon.deleteSelectedZoneIfExists()
```
*Cette méthode est également appelée dans le destructeur `destroy`*