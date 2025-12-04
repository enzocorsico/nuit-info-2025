### Etapes d'installation du template

- Créer un nouveau repository sur GitHub en utilisant ce template

- Ajouter sur GitHub les secrets pour les actions de déploiement en ssh
  - `SERVER_DEPLOY`: l'adresse du serveur de déploiement
  - `USERNAME_DEPLOY`: le nom d'utilisateur pour se connecter au serveur de déploiement
  - `PRIVATE_KEY_DEPLOY`: la clé privée pour se connecter au serveur de déploiement
  - `PORT_DEPLOY`: le port pour se connecter au serveur de déploiement
  - `PATH_DEPLOY`: le chemin vers le dossier de déploiement sur le serveur de déploiement

- Ajouter une protection de branche sur main
  - Require a pull request before merging
  - Require status checks to pass before merging
    - Require branches to be up to date before merging
    - Job: `Build`, `Lint`
  - Do not allow bypassing the above settings