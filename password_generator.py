"""Générateur de mots de passe configurable.

Ce module permet de générer un mot de passe en choisissant la longueur
souhaitée et les types de caractères à inclure. Une estimation de la
robustesse du mot de passe généré est ensuite affichée.
"""
from __future__ import annotations

import argparse
import math
import secrets
import string
from dataclasses import dataclass


@dataclass
class PasswordOptions:
    """Options de génération de mot de passe."""

    length: int
    use_lowercase: bool = True
    use_uppercase: bool = True
    use_digits: bool = True
    use_symbols: bool = True

    def build_charset(self) -> str:
        """Construit l'ensemble de caractères disponible."""
        charset_parts = []
        if self.use_lowercase:
            charset_parts.append(string.ascii_lowercase)
        if self.use_uppercase:
            charset_parts.append(string.ascii_uppercase)
        if self.use_digits:
            charset_parts.append(string.digits)
        if self.use_symbols:
            charset_parts.append(string.punctuation)

        charset = "".join(charset_parts)
        if not charset:
            raise ValueError(
                "Au moins un type de caractères doit être sélectionné pour générer un mot de passe."
            )
        return charset


def generate_password(options: PasswordOptions) -> str:
    """Génère un mot de passe aléatoire basé sur les options fournies."""
    if options.length <= 0:
        raise ValueError("La longueur du mot de passe doit être un entier positif.")

    charset = options.build_charset()
    return "".join(secrets.choice(charset) for _ in range(options.length))


def estimate_entropy(password: str) -> float:
    """Estime l'entropie d'un mot de passe en bits."""
    if not password:
        return 0.0

    pool_size = 0
    if any(c.islower() for c in password):
        pool_size += len(string.ascii_lowercase)
    if any(c.isupper() for c in password):
        pool_size += len(string.ascii_uppercase)
    if any(c.isdigit() for c in password):
        pool_size += len(string.digits)
    if any(c in string.punctuation for c in password):
        pool_size += len(string.punctuation)

    if pool_size == 0:
        pool_size = len(set(password)) or 1

    return len(password) * math.log2(pool_size)


def strength_label(entropy: float) -> str:
    """Retourne un label lisible correspondant à une valeur d'entropie."""
    if entropy < 28:
        return "Faible"
    if entropy < 60:
        return "Correcte"
    if entropy < 80:
        return "Forte"
    return "Très forte"


def parse_args() -> PasswordOptions:
    """Analyse les arguments de ligne de commande."""
    parser = argparse.ArgumentParser(
        description="Génère un mot de passe robuste en fonction de vos critères."
    )
    parser.add_argument(
        "-l",
        "--length",
        type=int,
        default=16,
        help="Longueur du mot de passe à générer (par défaut : 16).",
    )
    parser.add_argument(
        "--no-lower",
        dest="use_lowercase",
        action="store_false",
        help="Exclut les lettres minuscules du mot de passe.",
    )
    parser.add_argument(
        "--no-upper",
        dest="use_uppercase",
        action="store_false",
        help="Exclut les lettres majuscules du mot de passe.",
    )
    parser.add_argument(
        "--no-digits",
        dest="use_digits",
        action="store_false",
        help="Exclut les chiffres du mot de passe.",
    )
    parser.add_argument(
        "--no-symbols",
        dest="use_symbols",
        action="store_false",
        help="Exclut les symboles du mot de passe.",
    )

    args = parser.parse_args()
    return PasswordOptions(
        length=args.length,
        use_lowercase=args.use_lowercase,
        use_uppercase=args.use_uppercase,
        use_digits=args.use_digits,
        use_symbols=args.use_symbols,
    )


def main() -> None:
    options = parse_args()
    try:
        password = generate_password(options)
    except ValueError as error:
        raise SystemExit(str(error))

    entropy = estimate_entropy(password)
    label = strength_label(entropy)

    print("Mot de passe généré :", password)
    print(f"Longueur : {len(password)} caractères")
    print(f"Entropie estimée : {entropy:.1f} bits")
    print(f"Robustesse : {label}")


if __name__ == "__main__":
    main()
