US : Réserver une session

En tant que administrateur
Je veux pouvoir créer des sessions de karting,
Pour que les clients puissent réserver des sessions de karting à l'avance.


Scenarios :

Etant donné que je suis un administrateur authentifié
Quand je crée une session de karting avec les informations suivantes :
- Date : 2024-07-01
- Heure : 14:00
- Durée : 30 minutes
- Nombre de places disponibles : 10
- Prix : 20 euros
Alors la session de karting est créée avec succès

Etant donné que je suis un administrateur authentifié
Quand je crée une session de karting avec les informations suivantes :
- Date : 2024-07-01
- Heure : 14:00
- Durée : 30 minutes
- Nombre de places disponibles : 12
- Prix : 20 euros
Alors la session de karting n'est pas créée et un message d'erreur m'informe que le nombre de places disponibles doit être max 10

