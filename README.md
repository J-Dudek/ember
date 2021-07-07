# [super-rentals](https://guides.emberjs.com/v3.26.0/tutorial/part-1/)

Projet d'initiation aux bases d'Ember, fait en suivant [ce tutoriel officiel](https://guides.emberjs.com/v3.26.0/tutorial/part-1/).
Liste de l'ensemble des étapes [ICI](./Steps.md)

---

Étape 4 : Tests Autos
Lancer la commande :
ember generate acceptance-test super-rentals
C'est ce qu'on appelle une commande de générateur dans Ember CLI. Les générateurs créent automatiquement des fichiers pour nous en fonction des conventions d'Ember et les remplissent avec le contenu passe-partout approprié, de la même manière que la ember new création initiale d'une application squelette pour nous. Il suit généralement le modèle ember generate <type> <name> , où <type> est le genre de chose que nous générons, et <name> est ce que nous voulons l'appeler.

Dans ce cas, nous avons généré un test d'acceptation situé à tests/acceptance/super-rentals-test.js.

Les générateurs ne sont pas nécessaires ; nous aurions pu créer le fichier nous-mêmes, ce qui aurait fait exactement la même chose. Mais, les générateurs nous évitent certainement beaucoup de frappe. Allez-y et jetez un coup d'œil au fichier de test d'acceptation et voyez par vous-même.

Les tests d'acceptation, également appelés tests d'application , sont l'un des rares types de tests automatisés à notre disposition à Ember. Nous verrons les autres types plus tard, mais ce qui rend les tests d'acceptation uniques, c'est qu'ils testent notre application du point de vue de l'utilisateur. ce dont nous avons besoin.

Ouvrons le fichier de test généré et remplaçons le test standard par le nôtre :

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
Tout d'abord, nous demandons au robot de test de naviguer vers l' URL / de notre application à l'aide de l' visit assistant de test fourni par Ember. Cela revient à taper http://localhost:4200/ dans la barre d'adresse du navigateur et à appuyer sur la touche entrer.

Parce que la page va prendre un certain temps à se charger, c'est ce qu'on appelle une étape async (abréviation de asynchrone ), nous devrons donc dire au robot de test d'attendre en utilisant le mot-clé await de JavaScript . De cette façon, il attendra la fin du chargement de la page avant de passer à l'étape suivante.

C'est presque toujours le comportement que nous voulons, nous utiliserons donc presque toujours await et visit par paire. Cela s'applique également à d'autres types d'interactions simulées, telles que cliquer sur un bouton ou un lien, car elles prennent toutes du temps à se terminer. Même si parfois ces actions peuvent nous sembler imperceptiblement rapides, nous devons nous rappeler que notre robot de test a des mains vraiment, vraiment rapides.

Après avoir navigué vers l' URL / et attendu que les choses se règlent, nous vérifions que l'URL actuelle correspond à l'URL que nous attendons ( /). Nous pouvons utiliser l'annotation currentURL de test ici, ainsi que equal assertion . C'est ainsi que nous encodons notre « liste de contrôle » dans le code : en spécifiant ou en affirmant comment les choses doivent se comporter, nous serons alertés si notre application ne se comporte pas comme prévu.

Ensuite, nous avons confirmé que la page contient une balise <h2> contenant le texte "Bienvenue dans les super locations !". Savoir que cela est vrai signifie que nous pouvons être tout à fait certains que le modèle correct a été rendu, sans erreurs.

Ensuite, nous avons cherché un lien avec le texte About Us, localisé à l'aide du sélecteur CSS .jumbo a.button . C'est la même syntaxe que nous avons utilisée dans notre feuille de style, ce qui signifie "rechercher dans la balise avec la classe jumbo pour une balise <a> avec la classe button". Cela correspond à la structure HTML de notre modèle.

Une fois l'existence de cet élément sur la page confirmée, nous avons dit au robot de test de cliquer sur ce lien. Comme mentionné ci-dessus, il s'agit d'une interaction utilisateur, elle doit donc être en await.

Enfin, nous avons affirmé que cliquer sur le lien devrait nous amener à l'URL /about.

Lancement des tests
Nous pouvons lancer notre test automatisé en exécutant le serveur de test à l'aide de la commande ember test --server , ou ember t -s pour faire court.

Ce serveur se comporte un peu comme le serveur de développement, mais il s'exécute explicitement pour nos tests. Il peut ouvrir automatiquement une fenêtre de navigateur et vous amener à l'interface utilisateur de test, ou vous pouvez l'ouvrir sur http://localhost:7357/.

---
