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

## Étape 4 : Tests Autos

- Lancer la commande :

```bash
ember generate acceptance-test super-rentals
```

C'est ce qu'on appelle une commande de générateur dans Ember CLI. Les générateurs créent automatiquement des fichiers pour nous en fonction des conventions d'Ember et les remplissent avec le contenu passe-partout approprié, de la même manière que la `ember new` création initiale d'une application squelette pour nous. Il suit généralement le modèle ` ember generate <type> <name>` , où `<type>` est le genre de chose que nous générons, et `<name>` est ce que nous voulons l'appeler.

Dans ce cas, nous avons généré un test d'acceptation situé à `tests/acceptance/super-rentals-test.js`.

Les générateurs ne sont pas nécessaires ; nous aurions pu créer le fichier nous-mêmes, ce qui aurait fait exactement la même chose. Mais, les générateurs nous évitent certainement beaucoup de frappe. Allez-y et jetez un coup d'œil au fichier de test d'acceptation et voyez par vous-même.

Les tests d'acceptation, également appelés tests d'application , sont l'un des rares types de tests automatisés à notre disposition à Ember. Nous verrons les autres types plus tard, mais ce qui rend les tests d'acceptation uniques, c'est qu'ils testent notre application du point de vue de l'utilisateur. ce dont nous avons besoin.

Ouvrons le fichier de test généré et remplaçons le test standard par le nôtre :

```js
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.equal(currentURL(), '/about');
  });
});
```

Tout d'abord, nous demandons au robot de test de naviguer vers l' URL `/` de notre application à l'aide de l' visit assistant de test fourni par Ember. Cela revient à taper http://localhost:4200/ dans la barre d'adresse du navigateur et à appuyer sur la touche entrer.

Parce que la page va prendre un certain temps à se charger, c'est ce qu'on appelle une étape async (abréviation de asynchrone ), nous devrons donc dire au robot de test d'attendre en utilisant le mot-clé await de JavaScript . De cette façon, il attendra la fin du chargement de la page avant de passer à l'étape suivante.

C'est presque toujours le comportement que nous voulons, nous utiliserons donc presque toujours `await` et `visit` par paire. Cela s'applique également à d'autres types d'interactions simulées, telles que cliquer sur un bouton ou un lien, car elles prennent toutes du temps à se terminer. Même si parfois ces actions peuvent nous sembler imperceptiblement rapides, nous devons nous rappeler que notre robot de test a des mains vraiment, vraiment rapides.

Après avoir navigué vers l' URL `/` et attendu que les choses se règlent, nous vérifions que l'URL actuelle correspond à l'URL que nous attendons ( /). Nous pouvons utiliser l'annotation `currentURL` de test ici, ainsi que equal assertion . C'est ainsi que nous encodons notre « liste de contrôle » dans le code : en spécifiant ou en affirmant comment les choses doivent se comporter, nous serons alertés si notre application ne se comporte pas comme prévu.

Ensuite, nous avons confirmé que la page contient une balise `<h2>` contenant le texte "Bienvenue dans les super locations !". Savoir que cela est vrai signifie que nous pouvons être tout à fait certains que le modèle correct a été rendu, sans erreurs.

Ensuite, nous avons cherché un lien avec le texte About Us, localisé à l'aide du sélecteur CSS `.jumbo a.button` . C'est la même syntaxe que nous avons utilisée dans notre feuille de style, ce qui signifie "rechercher dans la balise avec la classe jumbo pour une balise `<a>` avec la classe button". Cela correspond à la structure HTML de notre modèle.

Une fois l'existence de cet élément sur la page confirmée, nous avons dit au robot de test de cliquer sur ce lien. Comme mentionné ci-dessus, il s'agit d'une interaction utilisateur, elle doit donc être en await.

Enfin, nous avons affirmé que cliquer sur le lien devrait nous amener à l'URL `/about`.

### Lancement des tests

Nous pouvons lancer notre test automatisé en exécutant le serveur de test à l'aide de la commande `ember test --server `, ou `ember t -s` pour faire court.

Ce serveur se comporte un peu comme le serveur de développement, mais il s'exécute explicitement pour nos tests. Il peut ouvrir automatiquement une fenêtre de navigateur et vous amener à l'interface utilisateur de test, ou vous pouvez l'ouvrir sur http://localhost:7357/.
