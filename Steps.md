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

## Étape 5 : Components (basic)

- `{{outlet}}` -> Utilisation des templates de l'application
- `{{yield}}` -> Rendement du contenu
  Au cours du développement d'une application, il est assez courant de réutiliser le même élément d'interface utilisateur dans différentes parties de l'application. Par exemple, nous avons utilisé le même en-tête "jumbo" dans les trois pages jusqu'à présent. Sur chaque page, nous avons travaillé pour suivre la même structure de base :

```js
<div class="jumbo">
  <div class="right tomster"></div>
  <!-- page specific content -->
</div>
```

Comme il ne s'agit pas de beaucoup de code, cela peut sembler peu compliqué de dupliquer cette structure sur chaque page. Cependant, si notre concepteur voulait que nous modifiions l'en-tête, nous devions rechercher et mettre à jour chaque copie de ce code. Au fur et à mesure que notre application grandira, cela deviendra encore plus problématique.

Les composants sont la solution parfaite à cela. Dans sa forme la plus basique, un composant n'est qu'un morceau de modèle auquel on peut faire référence par son nom. Commençons par créer un nouveau fichier `app/components/jumbo.hbs` avec un balisage pour l'en-tête "jumbo":

```html
<div class="jumbo">
  <div class="right tomster"></div>
  {{yield}}
</div>
```

### Passer du contenu aux composants avec ```{{yield}}````

Lors de l'appel d'un composant, Ember remplacera la balise du composant par le contenu trouvé dans le modèle du composant. Tout comme les balises HTML classiques, il est courant de transmettre du contenu à des composants, tels que <Jumbo>some content</Jumbo>. Nous pouvons l'activer en utilisant le mot-clé `{{yield}}` , qui sera remplacé par le contenu qui a été passé au composant.

Essayons-le en modifiant le modèle d'index :

```js
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
```

### Écriture de tests de composants

Lancer

```bash
ember generate component-test jumbo
```

Remplaçons le code passe-partout qui a été généré pour nous par notre propre test :

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | jumbo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the content inside a jumbo header with a tomster', async function (assert) {
    await render(hbs`<Jumbo>Hello World</Jumbo>`);

    assert.dom('.jumbo').exists();
    assert.dom('.jumbo').hasText('Hello World');
    assert.dom('.jumbo .tomster').exists();
  });
});
```

### Ajout `<NavBar>`

Nous pouvons créer un <NavBar>composant à `app/components/nav-bar.hbs`
Et nous l'ajoutons ainsi sur chaque page existanteen ajoutant en haut de page :

```js
<NavBar />
```

### Utilisation du modèle d'application et des ```{{outlet}}````

Avant de passer à la fonctionnalité suivante, il y a encore une chose que nous pourrions nettoyer. Étant donné que le composant `<NavBar>`est utilisé pour la navigation à l'échelle du site, il doit vraiment être affiché sur chaque page de l'application. Jusqu'à présent, nous avons ajouté le composant sur chaque page manuellement. C'est un peu sujet aux erreurs, car nous pourrions facilement oublier de le faire la prochaine fois que nous ajouterons une nouvelle page.

Nous pouvons résoudre ce problème en déplaçant la barre de navigation dans un modèle spécial appelé application.hbs. Vous vous souvenez peut-être qu'il a été généré pour nous lorsque nous avons créé l'application pour la première fois, mais nous l'avons supprimé. Maintenant, il est temps pour nous de le ramener!

Ce modèle est spécial en ce qu'il n'a pas sa propre URL et ne peut pas être consulté seul. Il est plutôt utilisé pour spécifier une mise en page commune qui est partagée par chaque page de votre application. C'est un endroit idéal pour mettre des éléments d'interface utilisateur à l'échelle du site, comme une barre de navigation et un pied de page de site.

Pendant que nous y sommes, nous allons également ajouter un élément conteneur qui enveloppe toute la page, comme demandé par notre concepteur à des fins de style.
Nous recréons donc `app/templates/application.hbs` :

```hbs
<div class='container'>
  <NavBar />
  <div class='body'>{{outlet}}</div>
</div>
```

Et supprimons les `<NavBar />` des autres tempplates.

Le mot-clé `{{outlet}}` désigne l'endroit où les pages de notre site doivent être rendues, similaire au mot-clé `{{yield}}` que nous avons vu plus tôt .

## Étape 6 : Components (Avançé)

### Génération de composants

Commençons par créer le composant `<Rental>`. Cette fois, nous utiliserons le générateur de composants pour créer le modèle et le fichier de test pour nous :

```bash
ember generate component rental
installing component
  create app/components/rental.hbs
  skip app/components/rental.js
  tip to add a class, run `ember generate component-class rental`
installing component-test
  create tests/integration/components/rental-test.js
```

Le générateur a créé deux nouveaux fichiers pour nous, un modèle de composant à `app/components/rental.hbs` et un fichier de test de composant à `tests/integration/components/rental-test.js`

Nous allons commencer par éditer le modèle. Pour l'instant, codons en dur les détails d'un bien locatif et remplaçons-le par les données réelles du serveur plus tard :

```hbs
<article class='rental'>
  <div class='details'>
    <h3>Grand Old Mansion</h3>
    <div class='detail owner'>
      <span>Owner:</span>
      Veruca Salt
    </div>
    <div class='detail type'>
      <span>Type:</span>
      Standalone
    </div>
    <div class='detail location'>
      <span>Location:</span>
      San Francisco
    </div>
    <div class='detail bedrooms'>
      <span>Number of bedrooms:</span>
      15
    </div>
  </div>
</article>
```

Ensuite, nous écrirons un test pour nous assurer que tous les détails sont présents. Nous remplacerons le test standard généré pour nous par nos propres assertions, tout comme nous l'avons fait pour le composant `<Jumbo>` précédemment :

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
  });
});
```

Enfin, invoquons ceci plusieurs fois à partir de notre modèle d'index pour remplir la page sur `app/templates/index.hbs`.

```hbs
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route='about' class='button'>About Us</LinkTo>
</Jumbo>

<div class='rentals'>
  <ul class='results'>
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

### Organisation du code avec des composants avec espace de noms

Ensuite, ajoutons l'image de la propriété locative. Nous utiliserons à nouveau le générateur de composants pour cela :

```bash
$ ember generate component rental/image
installing component
  create app/components/rental/image.hbs
  skip app/components/rental/image.js
  tip to add a class, run `ember generate component-class rental/image`
installing component-test
  create tests/integration/components/rental/image-test.js
```

Cette fois, nous avions un `/` dans le nom du composant. Cela a entraîné la création du composant à `app/components/rental/image.hbs`, qui peut être appelé en tant que `<Rental::Image>`.

Les composants comme ceux-ci sont appelés composants avec espace de noms . L'espacement de noms nous permet d'organiser nos composants par dossiers en fonction de leur objectif. Ceci est complètement facultatif - les composants avec espace de noms ne sont en aucun cas spéciaux.

#### Transfert d'attributs HTML avec `...attributes`

Modifions le modèle du composant :

```js
<div class="image">
  <img ...attributes>
</div>
```

Au lieu de coder en dur des valeurs spécifiques pour les attributs srcet altsur la balise `<img>`, nous avons plutôt opté pour le mot - clé `...attributes`, qui est également parfois appelé syntaxe « splattributes » . Cela permet à des attributs HTML arbitraires d'être transmis lors de l'appel de ce composant, comme ceci `app/components/rental.hbs` :

```hbs
<article class='rental'>
  <Rental::Image
    src='https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
    alt='A picture of Grand Old Mansion'
  />
  <div class='details'>
    <h3>Grand Old Mansion</h3>
    <div class='detail owner'>
      <span>Owner:</span>
      Veruca Salt
    </div>
    <div class='detail type'>
      <span>Type:</span>
      Standalone
    </div>
    <div class='detail location'>
      <span>Location:</span>
      San Francisco
    </div>
    <div class='detail bedrooms'>
      <span>Number of bedrooms:</span>
      15
    </div>
  </div>
</article>
```

Nous avons spécifié ici un `src` et un attribut HTML `alt` , qui seront transmis au composant et attachés à l'élément où `...attributes` est appliqué dans le modèle de composant. Vous pouvez considérer cela comme similaire à `{{yield}}`, mais pour les attributs HTML en particulier, plutôt que pour le contenu affiché. En fait, nous avons déjà utilisé cette fonctionnalité plus tôt lorsque nous avons passé un classattribut à `<LinkTo>`.

En général, c'est une bonne idée d'ajouter `...attributes`à l'élément principal de votre composant. Cela permettra une flexibilité maximale, car l'invocateur peut avoir besoin de transmettre des classes pour le style ou des attributs ARIA pour améliorer l'accessibilité.

Écrivons un test pour notre nouveau composant !

`tests/intégration/composants/location/image-test.js`:

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });
});
```

Enfin, nous devons également mettre à jour les tests du commposant `<Rental> ` pour confirmer que nous avons appelé avec succès `<Rental::Image>`.

On obtient donc `tests/intégration/composants/rental-test.js` :

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
  });
});
```

## Étape 7 : Interactive Components

### Ajout de comportement aux composants avec des classes

Ici, nous allons faire exactement cela! Nous allons implémenter les fonctionnalités "Voir plus grand" et "Voir plus petit", qui permettront à nos utilisateurs de cliquer sur l'image d'une propriété pour voir une version plus grande, et de cliquer à nouveau dessus pour revenir à la version plus petite.

En d'autres termes, nous voulons un moyen de basculer l'image entre l'un des deux états . Pour ce faire, nous avons besoin d'un moyen pour le composant de stocker deux états possibles et de savoir dans quel état il se trouve actuellement.

Ember nous permet éventuellement d'associer du code JavaScript à un composant exactement à cette fin. Nous pouvons ajouter un fichier JavaScript pour notre composant `<Rental::Image>` en exécutant le générateur `component-class` :

```bash
$ ember generate component-class rental/image
installing component-class
  create app/components/rental/image.js
```

Cela a généré un fichier JavaScript portant le même nom que le modèle de notre composant à l'adresse `app/components/rental/image.js`. Il contient une classe JavaScript , héritant de `@glimmer/component`.

Ember créera une instance de la classe chaque fois que notre composant est invoqué. Nous pouvons utiliser cette instance pour stocker notre état :

```js
//app/components/rental/image.js
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
}
```

### Accès aux états d'instance à partir de modèles

Mettons à jour notre modèle pour utiliser cet état que nous venons d'ajouter:

```js
//app/components/rental/image.hbs
{{#if this.isLarge}}
  <div class="image large">
    <img ...attributes>
    <small>View Smaller</small>
  </div>
{{else}}
  <div class="image">
    <img ...attributes>
    <small>View Larger</small>
  </div>
{{/if}}
```

Étant donné que ce modèle d'initialisation des variables d'instance dans le constructeur est assez courant, il se trouve qu'il existe une syntaxe beaucoup plus concise pour cela :

```js
//app/components/rental/image.js
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {
  isLarge = false;
}
```

### Gestion de l'état avec les propriétés suivies

Modifions notre classe pour ajouter une méthode pour basculer la taille :

```js
//app/components/rental/image.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RentalImageComponent extends Component {
  @tracked isLarge = false;

  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}
```

`@tracked` : Cette annotation indique à Ember de surveiller cette variable pour les mises à jour. Chaque fois que la valeur de cette variable change, Ember restituera automatiquement tous les modèles qui dépendent de sa valeur.

Dans notre cas, chaque fois que nous attribuons une nouvelle valeur à this.isLarge, l'annotation `@tracked` obligera Ember à réévaluer le block conditionnel `{{#if this.isLarge}}` dans notre modèle et basculera entre les deux blocs en conséquence.

Avec cela, il est temps de câbler cela dans le modèle :

```js
//app/components/rental/image.hbs
{{#if this.isLarge}}
<button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Smaller</small>
</button>
{{else}}
<button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Larger</small>
</button>
{{/if}}
```

Premièrement, puisque nous voulions rendre notre composant interactif, nous avons basculé la balise conteneur de `<div>` à `<button>` (ceci est important pour des raisons d'accessibilité). En utilisant la balise sémantique correcte, nous obtiendrons également la focalisation et la gestion des interactions au clavier "gratuitement".

Ensuite, nous avons utilisé le modificateur `{{on}}` pour l'attacher en `this.toggleSize` tant que gestionnaire de clic sur le bouton.

Avec cela, nous avons créé notre premier composant interactif .

### Ajout du test sur le clic

```js
//tests/intégration/composants/location/image-test.js

...

test('clicking on the component toggles its size', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom('button.image').exists();

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');

    await click('button.image');

    assert.dom('.image').hasClass('large');
    assert.dom('.image small').hasText('View Smaller');

    await click('button.image');

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');
  });
```

### Nettoyage

Nettoyons notre modèle avant de continuer. Nous avons introduit beaucoup de duplications lorsque nous avons ajouté le conditionnel dans le modèle. Si on regarde de près, les seules choses qui diffèrent entre les deux blocs sont :

La présence de la classe CSS "large" sur la balise `<button>`.
Le texte "Afficher plus grand" et "Afficher plus petit".

Ces changements sont profondément enfouis dans la grande quantité de code dupliqué. Nous pouvons réduire la duplication en utilisant une expression `{{if}}` à la place :

- Étape 1 :
  La version d'expression de `{{if}}` prend deux arguments. Le premier argument est la condition. Le deuxième argument est l'expression qui doit être évaluée si la condition est vraie.

```js
//app/components/rental/image.hbs
<button type="button" class="image {{if this.isLarge " large"}}" {{on "click" this.toggleSize}}>
    <img ...attributes>
    {{#if this.isLarge}}
    <small>View Smaller</small>
    {{else}}
    <small>View Larger</small>
    {{/if}}
</button>
```

- Étape 2:
  Facultativement, `{{if}}`peut prendre un troisième argument pour l'évaluation de l'expression si la condition est fausse. Cela signifie que nous pourrions réécrire l'étiquette du bouton comme suit :

```js
//app/components/rental/image.hbs
<button type="button" class="image {{if this.isLarge " large"}}" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View {{if this.isLarge "Smaller" "Larger"}}</small>
</button>
```

Qu'il s'agisse ou non d'une amélioration de la clarté de notre code est principalement une question de goût. Quoi qu'il en soit, nous avons considérablement réduit la duplication dans notre code et fait ressortir les éléments logiques importants du reste.

## Étape 8 : Reusables Components
### Gestion des configurations au niveau de l'application
Nous utiliserons l' API [Mapbox](https://www.mapbox.com/) pour générer des cartes pour nos propriétés locatives. Vous pouvez vous inscrire gratuitement et sans carte de crédit.

Mapbox fournit une API d'images de carte statique , qui sert des images de carte au format PNG. Cela signifie que nous pouvons générer l'URL appropriée pour les paramètres que nous voulons et afficher la carte à l'aide d'une balise ```<img>``` standard . Génial!

Si vous êtes curieux, vous pouvez explorer les options disponibles sur Mapbox en utilisant le terrain de jeu interactif .

Une fois que vous vous êtes inscrit au service, récupérez votre jeton public par défaut et collez-le dans ```config/environment.js``` :
```js
...

if (environment === 'production') {
    // here you can enable a production-specific feature
  }
  ENV.MAPBOX_ACCESS_TOKEN =
    'Mettre son token ici ;)';
  return ENV;
};
```
