# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

## Étape 2

Comme le texte de la page d'accueil l'a souligné, le code source de la page se trouve dans `app/templates/application.hbs`

- En modifiant le contenu on modifie la page d'accueil.

- Suppression de `application.hbs`
  --> l'application ne crash pas ;)

- Création de `app/templates/index.hbs` , l'application affiche directement le contenu de la page, le Routeur inclus dans ember fait le job et renvoi l'index.

- Ajout de style et du Logo.

## Étape 3 : Routes - Templates

### Route "classique"

Nous aimerions que la page soit servie sur l' `/about` URL. Pour ce faire, nous devrons informer Ember de notre projet d'ajouter une page à cet emplacement. Sinon, Ember pensera que nous avons visité une URL invalide !

L'endroit pour gérer quelles pages sont disponibles est le routeur . Allez-y, ouvrez `app/router.js`

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

Une fois cela en place, nous pouvons créer un nouveau `app/templates/about.hbs`

### Routes avec chemins perso

Cette fois, les choses sont un peu différentes. Tout le monde dans l'entreprise appelle cela la page "contact". Cependant, l'ancien site Web que nous remplaçons possède déjà une page similaire, qui est diffusée à l'ancienne URL `/getting-in-touch`.

Nous voulons conserver les URL existantes pour le nouveau site Web, mais nous ne voulons pas avoir à taper `getting-in-touch` partout dans la nouvelle base de code ! Heureusement, nous pouvons avoir le meilleur des deux mondes :

```js
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});
```

Ici, nous avons ajouté la `contact` route, mais avons explicitement spécifié un chemin pour la route. Cela nous permet de conserver l'URL héritée, mais d'utiliser le nouveau nom plus court pour la route, ainsi que le nom de fichier du modèle.

Ember est livré avec des conventions solides et des valeurs par défaut sensées - si nous partions de zéro, l' URL `/contact` par défaut ne nous dérangerait pas . Cependant, si les paramètres par défaut ne fonctionnent pas pour nous, il n'y a aucun problème à personnaliser Ember pour nos besoins !

### `<linkTo>`

Nous avons mis tellement d'efforts à créer ces pages, nous devons nous assurer que les gens peuvent les trouver ! La façon dont nous le faisons sur le Web consiste à utiliser des hyperliens , ou des liens en abrégé.

Comme Ember offre une excellente prise en charge des URL prêtes à l'emploi , nous pourrions simplement lier nos pages ensemble en utilisant la `<a>` balise avec le href. Cependant, cliquer sur ces liens nécessiterait que le navigateur effectue une actualisation de la page entière , ce qui signifie qu'il devrait retourner au serveur pour récupérer la page, puis tout charger à nouveau à partir de zéro.

Avec Ember, on peut faire mieux que ça ! Au lieu de l'ancienne `<a>` balise ordinaire , Ember fournit une alternative appelée `<LinkTo>`. Par exemple, voici comment vous l'utiliseriez sur les pages que nous venons de créer

```js
<LinkTo @route="about" class="button">About</LinkTo>
```

Nous permet de créer un bouton amenant à la route `/about`.

`<LinkTo>` est un exemple de composant dans Ember - vous pouvez les distinguer des balises HTML classiques car elles commencent par une lettre majuscule. Avec les balises HTML classiques, les composants sont un élément clé que nous pouvons utiliser pour créer l'interface utilisateur d'une application.

Nous aurons beaucoup plus à dire sur les composants plus tard, mais pour l'instant, vous pouvez les considérer comme un moyen de fournir des balises personnalisées pour compléter celles intégrées au navigateur.

La partie `@route=...` est la façon dont nous passons les arguments dans le composant. Ici, nous utilisons cet argument pour spécifier à quelle route nous voulons nous lier. (Notez que cela devrait être le nom de la route, pas le chemin, c'est pourquoi nous avons spécifié "about"au lieu de "/about", et "contact"au lieu de "/getting-in-touch".)

En plus des arguments, les composants peuvent également prendre les attributs HTML habituels. Dans notre exemple, nous avons ajouté une "button" classe à des fins de style, mais nous pourrions également spécifier d'autres attributs comme bon nous semble, tels que l' attribut `ARIA` .

Sous le capot, le composant `<LinkTo> ` génère une balise `<a>` régulière pour nous avec le `href` approprié pour l'itinéraire spécifique. Cette balise `<a>` fonctionne parfaitement avec les lecteurs d'écran , et permet à nos utilisateurs de marquer le lien ou de l'ouvrir dans un nouvel onglet.

Cependant, lorsque vous cliquez sur l'un de ces liens spéciaux, Ember intercepte le clic, affiche le contenu de la nouvelle page et met à jour l'URL, le tout effectué localement sans avoir à attendre le serveur, évitant ainsi une actualisation complète de la page.

---
