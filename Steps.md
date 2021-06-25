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

- Création de `app/templates/index.hbs` , l'application affiche directement le contenu de la page, le Routeur inclus dans ember génére 