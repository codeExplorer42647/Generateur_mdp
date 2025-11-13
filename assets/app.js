const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

const form = document.getElementById("generator-form");
const lengthInput = document.getElementById("length");
const resultSection = document.getElementById("result");
const passwordValue = document.getElementById("password-value");
const passwordLength = document.getElementById("password-length");
const passwordEntropy = document.getElementById("password-entropy");
const passwordStrength = document.getElementById("password-strength");
const errorMessage = document.getElementById("form-error");
const copyButton = document.getElementById("copy-password");
const copyFeedback = document.getElementById("copy-feedback");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  copyFeedback.textContent = "";

  const length = Number.parseInt(lengthInput.value, 10);
  const useLower = form.elements.namedItem("use-lower").checked;
  const useUpper = form.elements.namedItem("use-upper").checked;
  const useDigits = form.elements.namedItem("use-digits").checked;
  const useSymbols = form.elements.namedItem("use-symbols").checked;

  try {
    const password = generatePassword({
      length,
      useLower,
      useUpper,
      useDigits,
      useSymbols,
    });

    const entropy = estimateEntropy(password);
    const strength = strengthLabel(entropy);

    passwordValue.textContent = password;
    passwordLength.textContent = formatLength(password.length);
    passwordEntropy.textContent = `${entropy.toFixed(1)} bit${entropy >= 2 ? "s" : ""}`;
    passwordStrength.textContent = strength;

    resultSection.hidden = false;
    passwordValue.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    errorMessage.hidden = false;
    errorMessage.textContent = error instanceof Error ? error.message : String(error);
    resultSection.hidden = true;
  }
});

copyButton.addEventListener("click", async () => {
  const password = passwordValue.textContent;
  if (!password) {
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    copyFeedback.textContent = "Mot de passe copié dans le presse-papiers.";
  } catch (error) {
    copyFeedback.textContent =
      "Impossible de copier automatiquement. Sélectionnez et copiez manuellement.";
  }
});

function generatePassword(options) {
  if (!Number.isInteger(options.length) || options.length < 4 || options.length > 128) {
    throw new Error("La longueur doit être un entier compris entre 4 et 128.");
  }

  const charset = buildCharset(options);
  const buffer = new Uint32Array(options.length);
  const passwordChars = [];

  crypto.getRandomValues(buffer);
  for (const value of buffer) {
    passwordChars.push(charset[value % charset.length]);
  }

  return passwordChars.join("");
}

function buildCharset(options) {
  let charset = "";
  if (options.useLower) charset += LOWERCASE;
  if (options.useUpper) charset += UPPERCASE;
  if (options.useDigits) charset += DIGITS;
  if (options.useSymbols) charset += SYMBOLS;

  if (!charset) {
    throw new Error("Sélectionnez au moins un type de caractères.");
  }
  return charset;
}

function estimateEntropy(password) {
  if (!password) {
    return 0;
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += LOWERCASE.length;
  if (/[A-Z]/.test(password)) poolSize += UPPERCASE.length;
  if (/\d/.test(password)) poolSize += DIGITS.length;
  if (/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password)) poolSize += SYMBOLS.length;

  if (poolSize === 0) {
    poolSize = new Set(password).size || 1;
  }

  return password.length * Math.log2(poolSize);
}

function strengthLabel(entropy) {
  if (entropy < 28) return "Faible";
  if (entropy < 60) return "Correcte";
  if (entropy < 80) return "Forte";
  return "Très forte";
}

function formatLength(value) {
  return `${value} caractère${value > 1 ? "s" : ""}`;
}
