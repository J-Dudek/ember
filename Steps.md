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

Mapbox fournit une API d'images de carte statique , qui sert des images de carte au format PNG. Cela signifie que nous pouvons générer l'URL appropriée pour les paramètres que nous voulons et afficher la carte à l'aide d'une balise `<img>` standard . Génial!

Si vous êtes curieux, vous pouvez explorer les options disponibles sur Mapbox en utilisant le terrain de jeu interactif .

Une fois que vous vous êtes inscrit au service, récupérez votre jeton public par défaut et collez-le dans `config/environment.js` :

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

Après avoir enregistré les modifications dans notre fichier de configuration, nous devrons redémarrer notre serveur de développement pour récupérer ces modifications de fichier. Contrairement aux fichiers que nous avons édités jusqu'à présent, le `config/environment.js` n'est pas automatiquement rechargé.

### Génération d'un composant avec une classe de composant

Avec la clé API Mapbox en place, générons un nouveau composant pour notre carte.

```bash
$ ember generate component map --with-component-class
installing component
  create app/components/map.js
  create app/components/map.hbs
installing component-test
  create tests/integration/components/map-test.js
```

### Paramétrage des composants avec des arguments

Commençons par notre fichier JavaScript :

```js
//app/components/map.js
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

export default class MapComponent extends Component {
  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

Ici, nous importons le jeton d'accès à partir du fichier de configuration et le renvoyons à partir d'un getter de token. Cela nous permet d'accéder à notre jeton par `this.token` dans le composant `MapComponent` de la classe et dans le modèle du composant. Il est également important d' encoder le jeton en URL , juste au cas où il contiendrait des caractères spéciaux qui ne sont pas sécurisés pour les URL.

### Interpolation des valeurs dans les templates

Passons maintenant du fichier JavaScript au modèle :

```js
//app/components/map.hbs
<div class="map">
  <img
    alt="Map image at coordinates {{@lat}},{{@lng}}"
    ...attributes
    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
    width={{@width}} height={{@height}}
  >
</div>
```

Premièrement, nous avons un élément conteneur à des fins de style.

Ensuite, nous avons une balise `<img>` pour demander et rendre l'image de carte statique à partir de Mapbox.

Notre modèle contient plusieurs valeurs qui n'existent pas encore `@lat`— `@lng`, `@zoom`, `@width`, et `@height`. Ce sont les arguments du composant `<Map>` que nous fournirons lors de son invocation.

En paramétrant notre composant à l'aide d'arguments, nous avons créé un composant réutilisable qui peut être invoqué à partir de différentes parties de l'application et personnalisé pour répondre aux besoins de ces contextes spécifiques. Nous avons déjà vu cela en action lors de l'utilisation du comoposant `<LinkTo>` plus tôt ; nous devions spécifier un argument `@route` pour qu'il sache vers quelle page naviguer.

Nous avons fourni une valeur par défaut raisonnable pour l' altattribut en fonction des valeurs des arguments `@lat` et `@lng`. Vous remarquerez peut-être que nous interpolons directement les valeurs dans la valeur `alt` de l' attribut. Ember concaténera automatiquement ces valeurs interpolées en une valeur de chaîne finale pour nous, y compris en effectuant tout échappement HTML nécessaire.

### Overriding des attributs HTML dans `...attributes`

Ensuite, nous utilisons `...attributes` pour personnaliser davantage la balise `<img>`, par exemple en passant des attributs supplémentaires tels que `class` , ainsi qu'en remplaçant notre altattribut par défaut par un attribut plus spécifique ou plus convivial.

La commande est importante ici ! Ember applique les attributs dans l'ordre dans lequel ils apparaissent. En attribuant d'abord l' altattribut par défaut ( avant ...attributes est appliqué), nous offrons explicitement à l'invocateur la possibilité de fournir un altattribut plus personnalisé en fonction de son cas d'utilisation.

Étant donné que l' attribut `alt` transmis (s'il existe) apparaîtra après le nôtre, il remplacera la valeur que nous avons spécifiée. D'un autre côté, il est important que nous attribuions `src`, `width`, et `height` aprés `...attributes`, afin qu'ils ne soient pas accidentellement écrasés par l'invocateur.

L' attribut `src` interpole tous les paramètres requis dans le format d'URL pour l' API d'image de carte statique de Mapbox , y compris le jeton d'accès avec échappement d'URL de `this.token`.

Enfin, puisque nous utilisons l' image retina `@2x`, nous devons spécifier les attributs `width` et `height`. Sinon, le rendu `<img>` sera deux fois plus grand que ce à quoi nous nous attendions !

Nous venons d'ajouter beaucoup de comportement dans un seul composant, alors écrivons quelques tests ! En particulier, nous devons nous assurer d'avoir une couverture de test pour le comportement des attributs HTML prioritaires dont nous avons parlé ci-dessus.

```js
//tests/integration/components/map-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter'
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter'
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token'
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

Notez que l' assistant `hasAttribute` de test de `qunit-dom` prend en charge l'utilisation d' expressions régulières . Nous avons utilisé cette fonctionnalité pour confirmer que l' attribut `src` commence par https://api.mapbox.com/, au lieu d'exiger qu'il corresponde exactement à une chaîne. Cela nous permet d'être raisonnablement sûr que le code fonctionne correctement, sans être trop détaillé dans nos tests

Mise en place dans le template :

```js
//app/components/rental.hbs
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Grand Old Mansion"
  />
</article>
```

Pour faire bonne mesure, nous ajouterons également une assertion aux tests `<Rental>` pour nous assurer que nous avons rendu le composant `<Map>` avec succès.

```js
//tests/intégration/composants/rental-test.js
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
    assert.dom('article .map').exists();
  });
});
```

### Refactoring avec Getters et Auto-track

À ce stade, une grande partie de notre model `<Map>` est consacrée à l' attribut de la balise `<img>` et `src`, qui devient assez long. Une alternative consiste à déplacer ce calcul dans la classe JavaScript à la place.

Depuis notre classe JavaScript, nous avons accès aux arguments de notre composant à l'aide de l'API `this.args.*`. En utilisant cela, nous pouvons déplacer la logique d'URL du modèle vers un nouveau getter.

```js
//app/components/map.js
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

export default class MapComponent extends Component {
  get src() {
    let { lng, lat, width, height, zoom } = this.args;

    let coordinates = `${lng},${lat},${zoom}`;
    let dimensions = `${width}x${height}`;
    let accessToken = `access_token=${this.token}`;

    return `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  }

  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

et

```js
//app/components/map.hbs
<div class="map">
    <img alt="Map image at coordinates {{@lat}},{{@lng}}" ...attributes
        src={{this.src}}
        width={{@width}} height={{@height}}>
</div>
```

Notez que nous n'avons pas marqué notre getter comme `@tracked`. Contrairement aux variables d'instance, les getters ne peuvent pas être "affectés" directement à une nouvelle valeur, il n'est donc pas logique qu'Ember les surveille pour les changements.

Cela étant dit, les valeurs produites par les getters peuvent certainement changer. Dans notre cas, la valeur produite par notre getter `src` dépend des valeurs de `lat`, `lng`, `width`, `height` et `zoom` de `this.args`. Chaque fois que ces dépendances sont mises à jour,
`{{this.src}}` sera mis à jour et notre model en conséquence.

Ember le fait en suivant automatiquement toutes les variables auxquelles on a accédé lors du calcul de la valeur d'un getter. Tant que les dépendances elles-mêmes sont marquées comme `@tracked`, Ember sait exactement quand invalider et restituer tous les modèles pouvant potentiellement contenir des valeurs getter "obsolètes". Cette fonction est également connue sous le nom de suivi automatique . Tous les arguments accessibles à partir de `this.args`(en d'autres termes, `this.args.*`) sont implicitement marqués comme `@tracked` par la superclasse du composant Glimmer. Depuis que nous avons hérité de cette superclasse, tout fonctionne simplement.

### Obtenir des valeurs JavaScript dans le contexte de test

Pour être sûr, nous pouvons ajouter un test pour ce comportement :

```js
//tests/intégration/composants/map-test.js
test('it updates the `src` attribute when the arguments change', async function (assert) {
  this.setProperties({
    lat: 37.7749,
    lng: -122.4194,
    zoom: 10,
    width: 150,
    height: 120,
  });

  await render(hbs`<Map
      @lat={{this.lat}}
      @lng={{this.lng}}
      @zoom={{this.zoom}}
      @width={{this.width}}
      @height={{this.height}}
    />`);

  let img = find('.map img');

  assert.ok(
    img.src.includes('-122.4194,37.7749,10'),
    'the src should include the lng,lat,zoom parameter'
  );

  assert.ok(
    img.src.includes('150x120@2x'),
    'the src should include the width,height and @2x parameter'
  );

  this.setProperties({
    width: 300,
    height: 200,
    zoom: 12,
  });

  assert.ok(
    img.src.includes('-122.4194,37.7749,12'),
    'the src should include the lng,lat,zoom parameter'
  );

  assert.ok(
    img.src.includes('300x200@2x'),
    'the src should include the width,height and @2x parameter'
  );

  this.setProperties({
    lat: 47.6062,
    lng: -122.3321,
  });

  assert.ok(
    img.src.includes('-122.3321,47.6062,12'),
    'the src should include the lng,lat,zoom parameter'
  );

  assert.ok(
    img.src.includes('300x200@2x'),
    'the src should include the width,height and @2x parameter'
  );
});
```

En utilisant l'API `this.setProperties` de test spéciale , nous pouvons transmettre des valeurs arbitraires dans notre composant.

Notez qu'ici la valeur de `this` ne fait pas référence à l'instance du composant. Nous n'accédons ni ne modifions directement les états internes du composant.

Au lieu de cela, `this` fait référence à un objet de contexte de test spécial , auquel nous avons accès à l'intérieur de l'assistant `render`. Cela nous fournit un "pont" pour passer des valeurs dynamiques, sous forme d'arguments, dans notre invocation du composant. Cela nous permet de mettre à jour ces valeurs au besoin à partir de la fonction de test.

## Étape 9 : Working with data

### Fichier de route

Jusqu'à présent, nous avons tout codé en dur dans notre composant `<Rental>`. Mais ce n'est probablement pas très durable, puisque finalement, nous voulons plutôt que nos données proviennent d'un serveur. Allons de l'avant et déplaçons certaines de ces valeurs codées en dur hors du composant en vue de cela.

Nous voulons commencer à travailler vers un endroit où nous pouvons éventuellement récupérer les données du serveur, puis restituer les données demandées sous forme de contenu dynamique à partir des modèles. Pour ce faire, nous aurons besoin d'un endroit où nous pouvons écrire le code pour récupérer les données et les charger dans les routes.

Dans Ember, les fichiers de route sont l'endroit pour le faire. Nous n'en avons pas encore eu besoin, car toutes nos routes ne font essentiellement que rendre des pages statiques jusqu'à présent, mais nous sommes sur le point de changer cela.

Commençons par créer un fichier de route pour la route d'index. Nous allons créer un nouveau fichier `app/routes/index.js` avec le contenu suivant :

```js
import Route from '@ember/routing/route'; //<- import classe route

export default class IndexRoute extends Route {
  async model() {
    return {
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Estate',
      type: 'Standalone',
      bedrooms: 15,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description:
        'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    };
  }
}
```

Nous importons la classe Route dans le fichier. Cette classe est utilisée comme point de départ pour ajouter des fonctionnalités à un itinéraire, comme le chargement de données.

Ensuite, nous étendons la classe Route dans notre propre `IndexRoute` , que nous avons également `export` pour que le reste de l'application puisse l'utiliser.

Nous avons implémenté une méthode asynchrone appelée `model()`. Cette méthode est également connue sous le nom de `model hook`.

Ember appellera automatiquement ce hook lors de la saisie d'un itinéraire, afin que vous puissiez avoir la possibilité d'exécuter votre propre code pour obtenir les données dont vous avez besoin. L'objet renvoyé par ce hook est connu comme le modèle de l'itinéraire.

Étant donné que la récupération de données est généralement une opération asynchrone, le hook de modèle est marqué comme async. Cela nous donne la possibilité d'utiliser le mot-clé await pour attendre la fin des opérations de récupération des données. (Dans cette étape on laisse les données en dur et nous reviendrons sur le await plus tard).

### Utiliser les data venants du model hook de la route

Dans les modèles de route, nous pouvons accéder au modèle de la route en tant que `@model`. Dans notre cas, cela contiendrait le POJO renvoyé par notre hook de modèle.

Au lieu de coder explicitement en dur les informations de location dans notre composant `<Rental>`, nous pouvons plutôt transmettre l'objet modèle à notre composant.

```js
//app/templates/index.hbs
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
<div class="rentals">
  <ul class="results">
      <li>
          <Rental @rental={{@model}} />
      </li>
      <li>
          <Rental @rental={{@model}} />
      </li>
      <li>
          <Rental @rental={{@model}} />
      </li>
  </ul>
</div>
```

En passant `@model` dans le composant `<Rental>` comme argument `@rental`, nous aurons accès à notre objet de modèle "Grand Old Mansion" dans le modèle du composant `<Rental>` ! Maintenant, nous pouvons remplacer nos valeurs codées en dur dans ce composant en utilisant les valeurs qui vivent sur notre model `@rental`.

```js
//app/components/rental.hbs
<article class="rental">
    <Rental::Image src={{@rental.image}}
    alt="A picture of {{@rental.title}}" />
    <div class="details">
        <h3>{{@rental.title}}</h3>
        <div class="detail owner">
            <span>Owner:</span> {{@rental.owner}}
        </div>
        <div class="detail type">
            <span>Type:</span> {{@rental.type}}
        </div>
        <div class="detail location">
            <span>Location:</span> {{@rental.city}}
        </div>
        <div class="detail bedrooms">
            <span>Number of bedrooms:</span> {{@rental.bedrooms}}
        </div>
    </div>
    <Map @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}} @zoom="9" @width="150" @height="150" alt="A map of {{@rental.title}}" />
</article>
```

Une mise à jour des tests est alors nécessaire :

```js
//tests/intégration/composants/rental-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    this.setProperties({
      rental: {
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

### Moock d'appel API

On va ici simuler l'appel d'une API afin de rentre tout ça réaliste et dynamique.

Nous ajoutons des `json` afin de simuler l'appel à une API extérieure et modifions le fichier `ìndex.js` afin de manipuler ces données:

```js
//app/routes/index.js
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { type, ...attributes };
    });
  }
}
```

Après avoir analysé les données JSON, nous avons extrait l' objet `attributes` imbriqué , rajouté l'attribut `type` manquant manuellement, puis l' avons renvoyé à partir du hook de modèle. De cette façon, le reste de notre application n'aura aucune idée que cette différence a déjà existé.

Afin que le template affiche toutes le données nou le modifions également :

```js
//app/templates/index.hbs
<Jumbo>
    <h2>Welcome to Super Rentals!</h2>
    <p>We hope you find exactly what you're looking for in a place to stay.</p>
    <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
<div class="rentals">
    <ul class="results">
        {{#each @model as |rental|}}
        <li>
            <Rental @rental={{rental}} />
        </li>
        {{/each}}
    </ul>
</div>
```

Nous pouvons utiliser la syntaxe `{{#each}}...{{/each}}` pour itérer et parcourir le tableau renvoyé par le hook de modèle. Pour chaque itération dans le tableau, pour chaque élément du tableau, nous afficherons une fois le bloc qui lui est transmis. Dans notre cas, le bloc est notre comopasant `<Rental>` , entouré de balises `<li>`.

A l' intérieur du bloc , nous avons accès à l'élément de l'itération avec la variable `{{rental}}`. Mais pourquoi rental? Eh bien, parce que nous l'avons nommé ainsi ! Cette variable provient de la déclaration `as |rental|` de la boucle `each`. Nous aurions pu tout aussi bien l'appeler autrement, comme `as |koala|`, auquel cas nous aurions dû accéder à l'élément courant via la variable `{{koala}}`.

## Étape 10 : Dynamic Segment

### Ajout route dynamique au routeur

Nous allons créer une page par location, pour cela commençons à ajouter la route au routeur :

```js
//app/router.js
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
  this.route('rental', { path: '/rentals/:rental_id' });
});
```

### Cr&ation de lien dynamique

Maintenant que nous avons cet itinéraire en place, nous pouvons mettre à jour notre composant `<Rental>` pour qu'il soit réellement lié à chacun de nos biens locatifs détaillés !

```js
//app/components/rental.hbs
<article class="rental">
    <Rental::Image src={{@rental.image}}
    alt="A picture of {{@rental.title}}" />
    <div class="details">
        <h3>
            <LinkTo @route="rental" @model={{@rental}}>
                {{@rental.title}}
            </LinkTo>
        </h3>
        <div class="detail owner">
            <span>Owner:</span> {{@rental.owner}}
        </div>
        <div class="detail type">
            <span>Type:</span> {{@rental.type}}
        </div>
        <div class="detail location">
            <span>Location:</span> {{@rental.city}}
        </div>
        <div class="detail bedrooms">
            <span>Number of bedrooms:</span> {{@rental.bedrooms}}
        </div>
    </div>
    <Map @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}} @zoom="9" @width="150" @height="150" alt="A map of {{@rental.title}}" />
</article>
```

Puisque nous savons que nous sommes liés à l' itinéraire `rental` que nous venons de créer, nous savons également que cet itinéraire nécessite un segment dynamique. Ainsi, nous devons passer un argument `@model` pour que le composant `<LinkTo>` puisse générer l'URL appropriée pour ce modèle.

Si nous regardons les données JSON (`/public/api/rentals.json`), nous pouvons voir que l' `id` est inclus juste à côté de la clé `attributes`. Nous avons donc accès à ces données ; le seul problème est que nous ne l'incluons pas dans notre modèle ! Modifions notre hook de modèle dans la route `index` afin qu'il inclue le fichier id.

```js
//app/routes/index.js
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { id, type, ...attributes };
    });
  }
}
```

### Mise à jour des tests avec liens dynamique

```js
//tests/intégration/composants/rental-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert
      .dom('article h3 a')
      .hasAttribute('href', '/rentals/grand-old-mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

### Creation de la route dynamique `Rental`

```js
//app/routes/rental.js
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Community';
    } else {
      type = 'Standalone';
    }

    return { id, type, ...attributes };
  }
}
```

Contrairement à la route `Index`, nous avons un objet `params` passé dans notre hook de modèle. En effet, nous devons extraire nos données du `/api/rentals/${id}.json` cible, et non du `/api/rentals.json` global que nous utilisions auparavant. Nous savons déjà que les points de terminaison de location individuels récupèrent un seul objet de location, plutôt qu'un tableau d'entre eux, et que l'itinéraire utilise un segment dynamique `/:rental_id` pour déterminer quel objet de location nous essayons de récupérer sur le serveur.

### Affichage des details du modèle avec un paramètre

Ensuite, créons un composant `<Rental::Detailed>` :

```bash
$ ember generate component rental/detailed
installing component
  create app/components/rental/detailed.hbs
  skip app/components/rental/detailed.js
  tip to add a class, run `ember generate component-class rental/detailed`
installing component-test
  create tests/integration/components/rental/detailed-test.js
```

et complétons le :

```hbs
<!-- app/components/rental/detailed.hbs -->
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
  <a
    href='#'
    target='_blank'
    rel='external nofollow noopener noreferrer'
    class='share button'
  >
    Share on Twitter
  </a>
</Jumbo>

<article class='rental detailed'>
  <Rental::Image src={{@rental.image}} alt='A picture of {{@rental.title}}' />

  <div class='details'>
    <h3>About {{@rental.title}}</h3>

    <div class='detail owner'>
      <span>Owner:</span>
      {{@rental.owner}}
    </div>
    <div class='detail type'>
      <span>Type:</span>
      {{@rental.type}}
      –
      {{@rental.category}}
    </div>
    <div class='detail location'>
      <span>Location:</span>
      {{@rental.city}}
    </div>
    <div class='detail bedrooms'>
      <span>Number of bedrooms:</span>
      {{@rental.bedrooms}}
    </div>
    <div class='detail description'>
      <p>{{@rental.description}}</p>
    </div>
  </div>

  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom='12'
    @width='894'
    @height='600'
    alt='A map of {{@rental.title}}'
    class='large'
  />
</article>
```

Ce composant est similaire à notre composant `<Rental>`, à l'exception des différences suivantes.

- Il affiche une bannière avec un bouton de partage en haut (Implémentation à venir plus tard).
- Il affiche une image plus grande par défaut, avec des informations détaillées supplémentaires.
- Il montre une carte plus grande.
- Il affiche une description.

### Test du composant

```js
//tests/intégration/composants/location/detailed-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/detailed', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });
  });

  test('it renders a header with a share button', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom('.jumbo').exists();
    assert.dom('.jumbo h2').containsText('Grand Old Mansion');
    assert
      .dom('.jumbo p')
      .containsText('a nice place to stay near San Francisco');
    assert.dom('.jumbo a.button').containsText('Share on Twitter');
  });

  test('it renders detailed information about a rental property', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').containsText('About Grand Old Mansion');
    assert.dom('article .detail.owner').containsText('Veruca Salt');
    assert.dom('article .detail.type').containsText('Standalone – Estate');
    assert.dom('article .detail.location').containsText('San Francisco');
    assert.dom('article .detail.bedrooms').containsText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

Nous pouvons utiliser le hook `beforeEach` pour partager du code passe-partout, ce qui nous permet d'avoir deux tests qui se concentrent chacun sur un aspect différent et unique du composant.

### Ajout du Template pour affichage

```hbs
<!-- app/templates/rental.hbs -->
<Rental::Detailed @rental={{@model}} />
```

Et, dans la logique ajout du test à

```js
//tests/acceptation/super-rentals-test.js
[...]
 test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.equal(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.equal(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Grand Old Mansion');
    assert.dom('.rental.detailed').exists();
  });
[...]
```

## Étape 10 : Service Injection

### Splattributes et l' attributclass

Générons un composant `share-button`

```bash
$ ember generate component share-button --with-component-class
installing component
  create app/components/share-button.js
  create app/components/share-button.hbs
installing component-test
  create tests/integration/components/share-button-test.js
```

Commençons par le modèle qui a été généré pour ce composant. Nous avons déjà un balisage pour le bouton de partage dans le composant `<Rental::Detailed>` que nous avons créé plus tôt, alors copions-le simplement dans notre nouveau composant `<ShareButton>`.

```hbs
<!--app/components/share-button.hbs-->
<a
  ...attributes
  href={{this.shareURL}}
  target='_blank'
  rel='external nofollow noopener noreferrer'
  class='share button'
>
  {{yield}}
</a>
```

Notez que nous avons ajouté `...attributes` à notre balise `<a>`. Comme nous l'avons appris plus tôt en travaillant sur notre composant `<Map>`, l'ordre d' `...attributes` par rapport aux autres attributs est important. Nous ne voulons pas autoriser `href`, `target`, ou `rel` d' être remplacés par l'invocateur, nous avons donc spécifié ces attributs après `...attributes`.

Mais qu'arrive-t-il à l'attrivut `class`? Eh bien, il s'avère que l' attribut `class` est la seule exception à la façon dont ces attributs de composant sont remplacés ! Alors que tous les autres attributs HTML suivent la règle "La dernière écriture gagne", les valeurs de l'attribut `class` sont fusionnées (concaténées) à la place. Il y a une bonne raison à cela : cela permet au composant de spécifier les classes dont il a besoin, tout en permettant aux invocateurs du composant d'ajouter librement toutes les classes supplémentaires dont ils ont besoin à des fins de style.

Nous avons également un `{{yield}}` à l'intérieur de notre balise `<a>` afin que nous puissions personnaliser le texte du lien plus tard lors de l'appel du composant `<ShareButton>`.

### Accéder à l'URL actuelle

```js
//app/components/share-button.js
import Component from '@glimmer/component';

const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButtonComponent extends Component {
  get currentURL() {
    return window.location.href;
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

La fonctionnalité clé de cette classe est de créer l'URL appropriée pour l'API d'appel Web Twitter, qui est exposée au modèle via le getter`this.shareURL`. Cela implique principalement de "coller" les arguments du composant et de définir les paramètres de requête appropriés sur l'URL résultante. De manière pratique, le navigateur fournit une classe `URL` pratique qui gère l'échappement et la jonction des paramètres de requête pour nous.

L'autre fonctionnalité notable de cette classe concerne l'obtention de l'URL de la page actuelle et son ajout automatique à l'URL d'appel Twitter. Pour ce faire, nous avons défini un getter `currentURL` qui utilisait simplement l' objet global `Locationo` du navigateur , auquel nous pouvions accéder via `window.location`. Entre autres choses, il a une propriété `href` ( window.location.href) qui rapporte l'URL de la page actuelle.

Mettons ce composant à profit en l'invoquant depuis le composant `<Rental::Detailed>` :

```js
//app/components/rental/detailed.hbs
<Jumbo>
    <h2>{{@rental.title}}</h2>
    <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
    <ShareButton @text="Check out {{@rental.title}} on Super Rentals!"
        @hashtags="vacation,travel,authentic,blessed,superrentals" @via="emberjs">
        Share on Twitter
    </ShareButton>
</Jumbo>

<article class="rental detailed">
    <Rental::Image src={{@rental.image}} alt="A picture of {{@rental.title}}" />

    <div class="details">
        <h3>About {{@rental.title}}</h3>

        <div class="detail owner">
            <span>Owner:</span> {{@rental.owner}}
        </div>
        <div class="detail type">
            <span>Type:</span> {{@rental.type}} – {{@rental.category}}
        </div>
        <div class="detail location">
            <span>Location:</span> {{@rental.city}}
        </div>
        <div class="detail bedrooms">
            <span>Number of bedrooms:</span> {{@rental.bedrooms}}
        </div>
        <div class="detail description">
            <p>{{@rental.description}}</p>
        </div>
    </div>

    <Map @lat={{@rental.location.lat}} @lng={{@rental.location.lng}} @zoom="12" @width="894" @height="600"
        alt="A map of {{@rental.title}}" class="large" />
</article>
```

### Ajout des tests

```js
//tests/acceptance/super-rentals-test.js
import { module, test } from 'qunit';
import { click, find, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.equal(currentURL(), '/about');
  });

  test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.equal(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.equal(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Grand Old Mansion');
    assert.dom('.rental.detailed').exists();
    assert.dom('.share.button').hasText('Share on Twitter');

    let button = find('.share.button');

    let tweetURL = new URL(button.href);
    assert.equal(tweetURL.host, 'twitter.com');

    assert.equal(
      tweetURL.searchParams.get('url'),
      `${window.location.origin}/rentals/grand-old-mansion`
    );
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.equal(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.equal(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.equal(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.equal(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.equal(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.equal(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.equal(currentURL(), '/');
  });
});
```

Après execution : les tests ne passent pas!

En regardant de près l'échec, le problème semble être que le composant a capturé http://localhost:4200/tests comme "l'URL de la page actuelle". Le problème ici est que le composant `<ShareButton>` utilise `window.location.href` pour capturer l'URL actuelle. Parce que nous effectuons nos tests à http://localhost:4200/tests, c'est ce que nous avons. Techniquement, ce n'est pas faux, mais ce n'est certainement pas ce que nous voulions dire.

Cela soulève une question intéressante : pourquoi l' assistant de test `currentURL()` n'a-t-il pas le même problème ? Dans notre test, nous avons écrit des assertions comme `assert.equal(currentURL(), '/about');`, et ces assertions n'ont pas échoué.

Il s'avère que c'est quelque chose que le routeur d'Ember a géré pour nous. **_Dans une application Ember, le routeur est responsable de la gestion de la navigation et de la maintenance de l'URL_**. Par exemple, lorsque vous cliquez sur un composant `<LinkTo>`, il demandera au routeur d'exécuter une transition de route . **_Normalement, le routeur est configuré pour mettre à jour la barre d'adresse du navigateur chaque fois qu'il passe à une nouvelle route. De cette façon, vos utilisateurs pourront utiliser le bouton de retour et la fonctionnalité de signet du navigateur comme n'importe quelle autre page Web._**

Cependant, **_lors des tests, le routeur est configuré pour conserver l'URL « logique » en interne, sans mettre à jour la barre d'adresse et les entrées d'historique du navigateur._** De cette façon, le routeur ne confondra pas le navigateur et son bouton de retour avec des centaines d'entrées d'historique pendant que vous effectuez vos tests. Le `currentURL()` puise dans cet élément d'état interne du routeur, au lieu de vérifier directement l'URL réelle dans la barre d'adresse à l'aide de `window.location.href`.

### Routeur service

Pour résoudre notre problème, nous aurions besoin de faire la même chose. Ember expose cet état interne via le service routeur , que nous pouvons injecter dans notre composant :

```js
//app/components/share-button.js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButtonComponent extends Component {
  @service router;
  get currentURL() {
    return new URL(this.router.currentURL, window.location.origin);
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

Ici, nous avons ajouté la déclaration `@service router;` à notre classe de composant. Cela **_injecte le service de routeur dans le composant, le rendant disponible en tant que fichier `this.router`._** Le service de routeur a une propriété `currentURL`, fournissant l'URL "logique" actuelle telle que vue par le routeur d'Ember. Semblable à l'assistant de test du même nom, il s'agit d'une URL relative, nous devrons donc la joindre `window.location.origin` pour obtenir une URL absolue que nous pouvons partager.

Avec ce changement, tout fonctionne maintenant comme nous l'avions prévu.

### Ember Service vs Variables Globales

Dans Ember, les services jouent un rôle similaire aux variables globales, en ce sens qu'ils sont facilement accessibles par n'importe quelle partie de votre application. Par exemple, nous pouvons injecter n'importe quel service disponible dans les composants, au lieu de les faire passer en argument. Cela permet aux composants profondément imbriqués de "sauter" les couches et d'accéder à des éléments logiquement globaux à l'ensemble de l'application, tels que le routage, l'authentification, les sessions utilisateur, les préférences utilisateur, etc. Sans services, chaque composant devrait passer par beaucoup des mêmes arguments dans chaque composant qu'il invoque.

Une différence majeure entre les services et les variables globales est que les services sont limités à votre application, au lieu de tout le code JavaScript qui s'exécute sur la même page. Cela vous permet d'exécuter plusieurs scripts sur la même page sans interférer les uns avec les autres.

Plus important encore, les services sont conçus pour être facilement échangeables . Dans notre classe de composants, tout ce que nous avons fait était de demander à Ember d'injecter le service nommé `router`, sans spécifier d'où vient ce service. Cela nous permet de remplacer le service de routeur d'Ember par un objet différent au moment de l'exécution.

### Moock des Services dans les tests

Utilisation de Service dans les tests :

```js
//tests/intégration/composants/share-button-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);
  });
  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);
    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute(
        'href',
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          new URL('/foo/bar?baz=true#some-section', window.location.origin)
        )}`
      )
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');
  });
});
```

Dans ce test de composant, nous avons enregistré notre propre service de routeur avec Ember dans le hook `beforeEach`. Lorsque notre composant est rendu et demande que le service de routeur soit injecté, il obtiendra une instance de notre `MockRouterServic` au lieu du service de routeur intégré.

Il s'agit d'une technique de test assez courante appelée **_mocking ou stubing_** . Notre `MockRouterService` implémente la même interface que le service de routeur intégré – la partie qui nous intéresse de toute façon ; c'est-à-dire qu'il a une propriété `currentURL` qui rapporte l'URL "logique" actuelle. Cela nous permet de fixer l'URL à une valeur prédéterminée, ce qui permet de tester facilement notre composant sans avoir à naviguer vers une autre page. Pour autant que notre composant puisse le dire, nous sommes actuellement sur la page `/foo/bar/baz?some=page#anchor`, car c'est le résultat qu'il obtiendrait en interrogeant le service de routeur.

En utilisant des injections de service et des simulations, Ember nous permet de créer des composants faiblement couplés qui peuvent chacun être testés isolément, tandis que les tests d'acceptation fournissent une couverture de bout en bout qui garantit que ces composants fonctionnent bien ensemble.

Pendant que nous y sommes, ajoutons quelques tests supplémentaires pour les différentes fonctionnalités du composant `<ShareButton>` :

```js
//tests/intégration/composants/share-button-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);
    this.tweetParam = (param) => {
      let link = find('a');
      let url = new URL(link.href);
      return url.searchParams.get(param);
    };
  });
  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);
    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/)
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');
    assert.equal(
      this.tweetParam('url'),
      new URL('/foo/bar?baz=true#some-section', window.location.origin)
    );
  });

  test('it supports passing @text', async function (assert) {
    await render(
      hbs`<ShareButton @text="Hello Twitter!">Tweet this!</ShareButton>`
    );

    assert.equal(this.tweetParam('text'), 'Hello Twitter!');
  });

  test('it supports passing @hashtags', async function (assert) {
    await render(
      hbs`<ShareButton @hashtags="foo,bar,baz">Tweet this!</ShareButton>`
    );

    assert.equal(this.tweetParam('hashtags'), 'foo,bar,baz');
  });

  test('it supports passing @via', async function (assert) {
    await render(hbs`<ShareButton @via="emberjs">Tweet this!</ShareButton>`);
    assert.equal(this.tweetParam('via'), 'emberjs');
  });

  test('it supports adding extra classes', async function (assert) {
    await render(
      hbs`<ShareButton class="extra things">Tweet this!</ShareButton>`
    );

    assert
      .dom('a')
      .hasClass('share')
      .hasClass('button')
      .hasClass('extra')
      .hasClass('things');
  });

  test('the target, rel and href attributes cannot be overridden', async function (assert) {
    await render(
      hbs`<ShareButton target="_self" rel="" href="/">Not a Tweet!</ShareButton>`
    );

    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/);
  });
});
```

L'objectif principal ici est de tester les fonctionnalités clés du composant individuellement. De cette façon, si l'une de ces caractéristiques régresse à l'avenir, ces tests peuvent nous aider à identifier la source du problème. Parce que beaucoup de ces tests nécessitent l'analyse de l'URL et l'accès à ses paramètres de requête, nous configurons notre propre fonction d'assistance de test `this.tweetParam` dans le hook `beforeEach`. Ce modèle nous permet de partager facilement des fonctionnalités entre les tests. Nous avons même pu refactoriser le test précédent en utilisant ce nouvel assistant !

## Étape 11 : Ember Data

Ember Data est construit autour de l'idée d'organiser les données de votre application en objets de modèle . Ces objets représentent des unités d'informations que notre application présente à l'utilisateur. Par exemple, les données sur les propriétés locatives avec lesquelles nous avons travaillé seraient un bon candidat.

```js
//app/models/rental.js
import Model, { attr } from '@ember-data/model';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalModel extends Model {
  @attr title;
  @attr owner;
  @attr city;
  @attr location;
  @attr category;
  @attr image;
  @attr bedrooms;
  @attr description;

  get type() {
    if (COMMUNITY_CATEGORIES.includes(this.category)) {
      return 'Community';
    } else {
      return 'Standalone';
    }
  }
}
```

Ici, nous avons créé une class `RentalModel` qui étend la super classe `Model` d' Ember Data . Lors de la récupération des données de l'annonce sur le serveur, chaque propriété locative individuelle sera représentée par une instance (également connue sous le nom d' enregistrement de notre classe `RentalModel`.

Nous avons utilisé le décorateur `@attr` pour déclarer les attributs d'un bien locatif. Ces attributs correspondent directement aux données `attributes` que nous attendons du serveur dans ses réponses :

```json
//public/api/rentals/grand-old-mansion.json
{
  "data": {
    "type": "rentals",
    "id": "grand-old-mansion",
    "attributes": {
      "title": "Grand Old Mansion",
      "owner": "Veruca Salt",
      "city": "San Francisco",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194
      },
      "category": "Estate",
      "bedrooms": 15,
      "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
      "description": "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
    }
  }
}
```

Nous pouvons accéder à ces attributs pour une utilisation d'instance `RentalModel` par la notation par points standard, telle que `model.title` ou `model.location.lat`. En plus des attributs que nous avons déclarés ici, **_il y aura toujours un attribut id implicite_** , qui est utilisé pour identifier de manière unique l'objet modèle et auquel on peut accéder à l'aide de `model.id`.

Les classes de modèles dans Ember Data ne sont pas différentes des autres classes avec lesquelles nous avons travaillé jusqu'à présent, en ce sens qu'elles permettent un endroit pratique pour ajouter un comportement personnalisé. Nous avons profité de cette fonctionnalité pour déplacer notre typelogique (qui est une source majeure de duplication inutile dans nos gestionnaires de routes) dans un getter sur notre classe de modèle. Une fois que tout fonctionnera ici, nous y retournerons pour le nettoyer.

Les attributs déclarés avec le décorateur `@attr`d fonctionnent avec la fonction de suivi automatique (dont nous avons appris dans un chapitre précédent ). Par conséquent, nous sommes libres de référencer n'importe quel attribut de modèle dans notre getter ( this.category), et Ember saura quand invalider son résultat.

### Test de modèle

Création du fichier de test :

```bash
ember generate model-test rental
installing model-test
  create tests/unit/models/rental-test.js
```

Que nous alllons remplir ainsi:

```js
//tests/unit/models/rental-test.js
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | rental', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it has the right type', function (assert) {
    let store = this.owner.lookup('service:store');
    let rental = store.createRecord('rental', {
      id: 'grand-old-mansion',
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Estate',
      bedrooms: 15,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description:
        'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    });

    assert.equal(rental.type, 'Standalone');

    rental.category = 'Condo';
    assert.equal(rental.type, 'Community');

    rental.category = 'Townhouse';
    assert.equal(rental.type, 'Community');

    rental.category = 'Apartment';
    assert.equal(rental.type, 'Community');

    rental.category = 'Estate';
    assert.equal(rental.type, 'Standalone');
  });
});
```

Ce test de modèle est également appelé test unitaire . Contrairement à tous les autres tests que nous avons écrits jusqu'à présent, ce test ne rend rien. Il instancie simplement l'objet modèle de location et teste l'objet modèle directement, en manipulant ses attributs et en affirmant leur valeur.

Il convient de souligner qu'Ember Data fournit un service `store` , également connu sous le nom de magasin Ember Data. Dans notre test, nous avons utilisé l'API `this.owner.lookup('service:store')` pour accéder au magasin Ember Data. Le magasin fournit une méthode `createRecord` pour instancier notre objet modèle pour nous.
