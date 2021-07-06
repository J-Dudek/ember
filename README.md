# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---
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
---