# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

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

---
