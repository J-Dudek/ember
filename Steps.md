# Etapes de réalisation

## Étape 1

Crée un projet ember avec `ember new super-rentals`

Se rendre dans le projet `cd super-rentals`

Pour lancer le server : ` ember serve`

le site est alors disponible sur http://localhost:4200/

## Étape 2

Comme le texte de la page d'accueil l'a souligné, le code source de la page se trouve dans `app/templates/application.hbs`

- En modifiant le contenu on modifie la page d'accueil.

- Suppression de `application.hbs`
  --> l'application ne crash pas ;)

- Création de `app/templates/index.hbs` , l'application affiche directement le contenu de la page, le Routeur inclus dans ember fait le job et renvoi l'index.

- Ajout de style et du Logo.

## Étape 3 : Routes

Nous aimerions que la page soit servie sur l' ```/about``` URL. Pour ce faire, nous devrons informer Ember de notre projet d'ajouter une page à cet emplacement. Sinon, Ember pensera que nous avons visité une URL invalide !

L'endroit pour gérer quelles pages sont disponibles est le routeur . Allez-y, ouvrez ```app/router.js```
```js
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
});
```

Une fois cela en place, nous pouvons créer un nouveau ```app/templates/about.hbs```


