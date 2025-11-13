# Generateur_mdp

Générateur de mots de passe.

## Prérequis

- Python 3.9 ou plus récent

## Utilisation

```bash
python password_generator.py --length 20
```

Options disponibles :

- `--length` (ou `-l`) : longueur du mot de passe à générer (16 par défaut).
- `--no-lower` : exclut les minuscules.
- `--no-upper` : exclut les majuscules.
- `--no-digits` : exclut les chiffres.
- `--no-symbols` : exclut les symboles de ponctuation.

Le programme affiche le mot de passe généré ainsi qu'une estimation de son entropie et un
indicateur textuel de robustesse.
