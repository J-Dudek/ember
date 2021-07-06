# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

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

---
