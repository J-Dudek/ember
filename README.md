# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---
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

---