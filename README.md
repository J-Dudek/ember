# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

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

---
