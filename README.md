# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

## Étape 12 : Provider Components

### Ajout d'un composant `<Input>`

```hbs
<!-- app/templates/index.hbs -->
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route='about' class='button'>About Us</LinkTo>
</Jumbo>
<div class='rentals'>
  <label>
    <span>Where would you like to stay?</span>
    <input class='light' />
  </label>
  <ul class='results'>
    {{#each @model as |rental|}}
      <li>
        <Rental @rental={{rental}} />
      </li>
    {{/each}}
  </ul>
</div>
```

### Refactorisation du template index dans un composant

Pour que notre champ de recherche fonctionne réellement, nous devrons conserver et stocker le texte que l'utilisateur saisit lorsqu'il utilise le champ de recherche. Ce texte est la requête de recherche, et c'est un élément d' état qui va changer chaque fois que l'utilisateur tape quelque chose dans la zone de recherche.

Mais où allons-nous mettre ce morceau d'État nouvellement introduit? Afin de câbler le champ de recherche, nous avons besoin d'un endroit pour stocker la requête de recherche. Pour le moment, notre champ de recherche réside sur le template `index.hbs` de route, qui n'a pas un bon endroit pour stocker cet état de requête de recherche. Cela serait tellement plus facile à faire si nous avions un composant, car nous pourrions simplement stocker l'état directement sur le composant !

Attendez... pourquoi ne pas simplement refactoriser le champ de recherche dans un composant ? Une fois que nous aurons fait cela, tout sera un peu plus facile - hourra !

Reprenons simplement et commençons notre refactorisation en créant un nouveau modèle pour notre composant, que nous appellerons `rentals.hbs`.

```hbs
<!-- app/components/rentals.hbs -->
<div class='rentals'>
  <label>
    <span>Where would you like to stay?</span>
    <input class='light' />
  </label>

  <ul class='results'>
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

Il y a un changement mineur à noter ici : lors de l'extraction de notre balisage dans un composant, nous avons également renommé l' argument `@model` à la place de `@rentals`, juste afin d'être un peu plus précis sur ce que nous parcourons dans notre boucle `{{#each}}`. Sinon, tout ce que nous faisons ici, c'est copier-coller ce qui se trouvait sur notre page `index.hbs` dans notre nouveau modèle de composant. Il ne nous reste plus qu'à utiliser notre nouveau composant dans le modèle d'index où nous avons commencé tout ce refactor ! Rendons notre composant `<Rentals>` dans notre template `index.hbs`.

```hbs
<!-- app/templates/index.hbs -->
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route='about' class='button'>About Us</LinkTo>
</Jumbo>
<Rentals @rentals={{@model}} />
```

Vous vous souvenez du petit changement que nous avons apporté au balisage lorsque nous avons extrait notre composant `<Rentals>` ? Nous avons renommé l'argument `@model` en `@rentals`. Étant donné que nous avons apporté cette modification à notre composant, nous devons maintenant transmettre l' argument `@model` au composant `<Rentals>` en tant que `@rentals`. Une fois que nous avons fait cela, tout doit être câblé correctement afin que le `@model` soit transmis à `<Rentals>` en tant que `@rentals`, comme nous l'attendions.

```js
//tests/integration/components/rentals-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders all given rental properties by default', async function (assert) {
    this.setProperties({
      rentals: [
        {
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
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });

    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });
});
```

### Fonctions sur l'Input

Maintenant que notre composant est entièrement configuré, nous pouvons enfin connecter notre champ de recherche et stocker notre requête de recherche ! Tout d'abord : créons une classe de composant pour stocker l'état de notre requête.

```js
//app/components/rentals.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class RentalsComponent extends Component {
  @tracked query = '';
}
```

Ensuite, nous allons câbler notre état de requête dans le modèle de composant.

```hbs
<!-- app/components/rentals.hbs-->
<div class='rentals'>
  <label>
    <span>Where would you like to stay?</span>
    <Input @value={{this.query}} class='light' />
  </label>

  <ul class='results'>
    {{#each @rentals as |rental|}}
      <li>
        <Rental @rental={{rental}} />
      </li>
    {{/each}}
  </ul>
</div>
```

Intéressant! Il se passe certaines choses dans ce changement de modèle d'une ligne. Premièrement, nous passons d'une simple balise HTML `<input>` à l'utilisation d'une balise `<Input>` à la place ! En fin de compte, Ember nous fournit un petit composant `<Input>` utile pour ce cas d'utilisation précis. Le composant `<Input>` n'est en fait qu'un wrapper autour de l'élément `<input>`.

Le composant `<Input>` d'Ember est plutôt chouette ; il câblera les choses dans les coulisses de telle sorte que, chaque fois que l'utilisateur tape quelque chose dans la zone de saisie, `this.query` change en conséquence. En d'autres termes, `this.query` est maintenu en phase avec la valeur de ce qui est recherché ; nous avons enfin le moyen idéal de stocker l'état de notre requête de recherche !

### `<Rentals::Filter>` Provider Component

Maintenant que notre requête de recherche est connectée à notre composant `<Rentals>`, nous pouvons entrer dans les choses vraiment amusantes ! À savoir, nous pouvons filtrer les résultats de nos composants en fonction de notre requête de recherche. Afin d'encapsuler cette fonctionnalité, nous allons créer un autre composant appelé `<Rentals::Filter>`.

```js
//app/components/rentals/filter.js
import Component from '@glimmer/component';

export default class RentalsFilterComponent extends Component {
  get results() {
    let { rentals, query } = this.args;

    if (query) {
      rentals = rentals.filter((rental) => rental.title.includes(query));
    }

    return rentals;
  }
}
```

et

```hbs
<!-- app/components/rentals/filter.hbs -->
{{yield this.results}}
```

Dans la classe `<Rentals::Filter>` nous avons créé un getter pour faire le travail de filtrage de nos locations en fonction de deux arguments : `@rentals` et `@query`. À l'intérieur de notre fonction getter, nous avons ces arguments accessibles à partir de `this.args`.

Dans notre modèle de composant, nous ne rendons pas réellement quoi que ce soit. Au lieu de cela, nous cédons à quelque chose, en utilisant le mot - clé `{{yield}}`, une syntaxe que nous avons déjà vue . Comme nous pouvons nous en souvenir, le but de `{{yield}}` est de rendre le bloc qui est passé par l' appelant du composant , qui est la chose qui appelle le composant actuel (un modèle ou un autre composant, par exemple). Mais dans ce cas précis, nous n'avons pas qu'un mot - clé `{{yield}}`. Au lieu de cela, nous avons `this.results` à l'intérieur de notre mot-clé `{{yield}}`. Qu'est-ce que ça fait, exactement ?

Eh bien, afin de répondre à cette question, regardons comment les données que nous produisons sont utilisées dans le composant `<Rentals>`.

```hbs
<!-- app/components/rentals.hbs -->
<div class='rentals'>
  <label>
    <span>Where would you like to stay?</span>
    <Input @value={{this.query}} class='light' />
  </label>

  <ul class='results'>
    <Rentals::Filter @rentals={{@rentals}} @query={{this.query}} as |results|>
      {{#each results as |rental|}}
        <li>
          <Rental @rental={{rental}} />
        </li>
      {{/each}}
    </Rentals::Filter>
  </ul>
</div>
```

Ici, nous appelons `<Rentals::Filter>` de la même manière que nous avons appelé d'autres composants. Nous passons `@rentals` et `@query` comme arguments, et nous passons également dans un bloc. Le bloc est le contenu qui est placé entre les balises d'ouverture et de fermeture du composant (` <Rentals::Filter>...</Rentals::Filter>`). Nous avons déjà vu les deux.

Cependant, la principale différence ici est l'utilisation de as `|results|` lorsque nous invoquons notre composant `<Rentals::Filter>`. Cette nouvelle syntaxe va de pair avec la syntaxe `{{yield this.results}}` qui nous a été présentée dans le modèle de composant.

La syntaxe `as |results|` peut nous sembler un peu nouvelle, mais ce n'est pas la première fois que nous voyons cette fonctionnalité en action. À l'époque où nous avons découvert pour la première fois la syntaxe `{{#each}}` nous l'utilisons pour parcourir une collection, nous avons écrit quelque chose comme ceci : `{{#each @items as |item|}}...some content here...{{/each}}`.

Lorsque nous utilisons cette syntaxe, nous passons un bloc (le `...some content here...`dans notre exemple) à `{{#each}}`. Ember parcourra le tableau que nous avons fourni ( `@items`) et rendra notre bloc une fois par élément du tableau.

À l'intérieur de notre bloc, nous devons pouvoir accéder à l'élément actuel d'une manière ou d'une autre . La syntaxe `{{#each}}` fournit l'élément à notre bloc via la déclaration `as |item|`, qui crée une variable locale `item`, également appelée paramètre de bloc . En d'autres termes, au fur et à mesure que nous parcourons `@items`, nous aurons accès à l'élément actuel que nous parcourons via le paramètre de bloc ( item). Le paramètre de bloc n'est accessible que depuis l'intérieur du bloc. Ember remplira le paramètre de bloc avec l'élément actuel de l'itération, et il le fera à chaque fois qu'il rendra notre bloc.

La nécessité de fournir des données à un bloc n'est pas unique à la syntaxe `{{#each}}`. Dans ce cas, notre composant `<Rentals::Filter>` souhaite prendre la liste non filtrée des propriétés locatives et les comparer à la requête de l'utilisateur. Une fois que le composant a comparé les locations à la requête, il devra fournir une liste filtrée de propriétés de location à son appelant (le composant `<Rentals>`).

Il s'avère que cette capacité à fournir des paramètres de bloc n'est pas une superpuissance que seules les syntaxes intégrées `{{#each}}` peuvent utiliser. Nous pouvons également le faire avec nos propres composants. En fait, Ember nous permet de passer des données arbitraires aux blocs sous la forme de passer des arguments supplémentaires au mot-clé `{{yield}}`. En effet, c'est exactement ce que nous avons fait avec le composant `<Rentals::Filter>` `{{yield this.results}}` .

Dans notre composant `<Rentals>`, nous avons utilisé la syntaxe `as |results|` lors de l'appel de `<Rentals::Filter>`. Tout comme avec la syntaxe `{{#each}}`, cette syntaxe de paramètre de bloc a permis à notre bloc d'accéder aux données fournies à l'aide de la variable locale results. Les données fournies proviennent de `{{yield this.results}}`, où se `this.results` trouve notre liste filtrée de propriétés locatives.

Fait intéressant, si nous examinons notre template de composant `<Rentals::Filter>`, nous constatons que nous ne restituons aucun contenu. Au lieu de cela, la seule responsabilité de ce composant est de configurer un état ( `this.results`, la liste des propriétés de location filtrées), puis de renvoyer cet état à son appelant ( `<Rentals>`) sous la forme d'un paramètre de bloc ( `as |results|`).

C'est ce qu'on appelle le modèle de composant fournisseur , que nous voyons en action avec un composant fournissant des données à son appelant.

Mettons à jour les tests :

```js
//tests/integration/components/rentals-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.setProperties({
      rentals: [
        {
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
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });
  });

  test('it renders all given rental properties by default', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });

  test('it updates the results according to the search query', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    await fillIn('.rentals input', 'Downtown');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Downtown Charm');

    await fillIn('.rentals input', 'Mansion');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Grand Old Mansion');
  });
});
```

Dans le processus d'ajout de ce test, nous remarquerons que nous avons également extrait notre configuration ( `setProperties`) dans les hooks avant. Nous avons également utilisé l' assistant de test `fillIn` dans notre test nouvellement ajouté.

---