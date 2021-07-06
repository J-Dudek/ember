# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

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

---
