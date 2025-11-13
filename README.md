# Generateur_mdp

Générateur de mots de passe.

## Prérequis

- Python 3.9 ou plus récent

## Installation (optionnelle)

Aucune dépendance supplémentaire n'est requise. Si vous préférez utiliser un environnement
virtuel, créez-le et activez-le comme suit :

```bash
python -m venv .venv
source .venv/bin/activate  # Sous Windows : .venv\\Scripts\\activate
```

## Utilisation

1. Placez-vous dans le dossier du projet.
2. Exécutez le script en précisant, si besoin, la longueur désirée et les types de
   caractères à inclure.

```bash
python password_generator.py --length 20
```

Options disponibles :

- `--length` (ou `-l`) : longueur du mot de passe à générer (16 par défaut).
- `--no-lower` : exclut les minuscules.
- `--no-upper` : exclut les majuscules.
- `--no-digits` : exclut les chiffres.
- `--no-symbols` : exclut les symboles de ponctuation.

### Exemples

Générer un mot de passe de 24 caractères sans symboles :

```bash
python password_generator.py --length 24 --no-symbols
```

Générer un mot de passe de 12 caractères uniquement composé de lettres :

```bash
python password_generator.py --length 12 --no-digits --no-symbols
```

### Résultat affiché

À l'exécution, le programme affiche :

- le mot de passe généré ;
- sa longueur ;
- son entropie estimée en bits ;
- une évaluation textuelle de sa robustesse (`Faible`, `Correcte`, `Forte`, `Très forte`).

Ces informations permettent de vérifier immédiatement si le mot de passe convient à vos
exigences de sécurité.
