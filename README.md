# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

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

### Chargement de models dans les routes

Mettons à jour la route index :

```js
//app/routes/index.js
import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  async model() {
    return this.store.findAll('rental');
  }
}
```

Puis la route rental:

```js
//app/routes..rental.js
import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default class RentalRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('rental', params.rental_id);
  }
}
```

Comme mentionné ci-dessus, Ember Data fournit un `service store`, que nous pouvons injecter dans notre itinéraire à l'aide de la déclaration `@service store;`, rendant le magasin Ember Data disponible en tant que fichier `this.store`. Il fournit les méthodes `find` et `findAll` pour le chargement des enregistrements. Plus précisément, la méthode `findRecord` prend un type de modèle ( rental dans notre cas) et un ID de modèle (pour nous, ce serait `params.rental_id` de l'URL) comme arguments et récupère un seul enregistrement du magasin. D'autre part, la méthode `findAll` prend le type de modèle comme argument et récupère tous les enregistrements de ce type dans le magasin.

Le magasin Ember Data agit comme une sorte d'intermédiaire entre notre application et le serveur ; il fait beaucoup de choses importantes, y compris la mise en cache des réponses extraites du serveur. Si nous demandons des enregistrements (instances de classes de modèle) que nous avions déjà récupérés du serveur dans le passé, le magasin d'Ember Data garantit que nous pouvons accéder aux enregistrements immédiatement, sans avoir à les récupérer inutilement et attendre que le serveur réponde. Mais, si nous n'avons pas déjà cette réponse mise en cache dans notre magasin, elle s'éteindra et la récupèrera sur le serveur. Plutôt sympa, non ?

### Utilisation des Adapters et des Serializers

Ember Data utilise une architecture d' adaptateur et de sérialiseur . Les adaptateurs déterminent comment et où Ember Data doit récupérer les données de vos serveurs, par exemple s'il faut utiliser HTTP, HTTPS, WebSockets ou le stockage local, ainsi que les URL, les en-têtes et les paramètres à utiliser pour ces requêtes. D'autre part, les sérialiseurs sont chargés de convertir les données renvoyées par le serveur dans un format que Ember Data peut comprendre.

L'idée est que, à condition que votre backend expose un protocole et un format d'échange cohérents pour accéder à ses données, nous pouvons écrire une seule paire adaptateur-sérialiseur pour gérer toutes les récupérations de données pour l'ensemble de l'application.

Il s'avère que JSON:API se trouve être le protocole de données et le format d'échange par défaut d'Ember Data. Prêt à l'emploi, Ember Data fournit un adaptateur et un sérialiseur JSON:API par défaut. C'est une excellente nouvelle pour nous, car c'est aussi ce que notre serveur a mis en place. Quelle merveilleuse coïncidence !

Cependant, comme mentionné ci-dessus, il existe quelques différences mineures entre le fonctionnement de notre serveur et les hypothèses par défaut d'Ember Data. Nous pouvons personnaliser le comportement par défaut en définissant notre propre adaptateur et sérialiseur :

```js
//app/adapters/application.js
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api';

  buildURL(...args) {
    return `${super.buildURL(...args)}.json`;
  }
}
```

avec

```js
//app/serializers/application.js
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {}
```

Par **_convention_**, les **_adaptateurs_** sont situés à **_app/adapters_**. De plus, l'adaptateur nommé `application` s'appelle l' adaptateur d'application , qui sera utilisé pour récupérer les données de tous les modèles de notre application.

À l'intérieur de ce fichier nouvellement créé, nous avons défini une classe `ApplicationAdapter`, héritant du fichier `JSONAPIAdapter`. Cela nous permet d'hériter de toutes les fonctionnalités JSON:API par défaut, tout en personnalisant les choses qui ne fonctionnaient pas pour nous par défaut. Spécifiquement:

- Nos URL de ressources ont un préfixe `/api` de noms supplémentaire .
- Nos URL de ressources ont une extension `.json` à la fin.
  L'ajout d'un préfixe d'espace de noms est assez courant dans les applications Ember, donc le `JSONAPIAdapter` a une API pour faire exactement cela. Tout ce que nous avons à faire est de définir la propriété `namespace` sur le préfixe que nous voulons, soit `api`dans notre cas.

L'ajout de l'extension `.json` est un peu moins courant et n'a pas sa propre API de configuration déclarative. Au lieu de cela, nous devrons remplacer la méthode `buildURL` d' Ember Data . À l'intérieur de `buildURL`, nous appellerons `super.buildURL(...args)` pour invoquer l'implémentation `JSONAPIAdapter` par défaut de buildURL. Cela nous donnera l'URL que l'adaptateur aurait construit , ce qui serait quelque chose comme `/api/rental` set `/api/rentals/grand-old-mansion` après avoir configuré le namespace. Tout ce que nous avons à faire est d'ajouter `.json` à cette URL et de la renvoyer.

De même, **_les sérialiseurs_** sont situés à **_app/serializers_**. **_Les adaptateurs et les sérialiseurs sont toujours ajoutés par paire._** Nous avons ajouté un adaptateur `application`, nous avons donc également ajouté un sérialiseur correspondant pour l'accompagner. Étant donné que les données JSON renvoyées par notre serveur sont compatibles JSON:API, la valeur par défaut JSONAPISerializer fonctionne parfaitement pour nous sans personnalisation supplémentaire.

---
