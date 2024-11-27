// Importar el diccionario
import { dictionary } from './dictionary.js';

// Selección de elementos del DOM
const wordInput = document.getElementById("wordInput");
const translateButton = document.getElementById("translateButton");
const translationResult = document.getElementById("translationResult");
const wordList = document.getElementById("wordList");
const sortAZButton = document.getElementById("sortAZButton");
const sortZAButton = document.getElementById("sortZAButton");
const categoryRadios = document.getElementsByName("category");
const addWordForm = document.getElementById("addWordForm");
const newWordEn = document.getElementById("newWordEn");
const newWordEs = document.getElementById("newWordEs");
const exampleInput = document.getElementById("example");
const categorySelect = document.getElementById("categorySelect");
const toggleDictionaryButton = document.getElementById("toggleDictionaryButton");
const dictionarySection = document.getElementById("dictionary");

// Función para mostrar u ocultar el diccionario
function toggleDictionary() {
    dictionarySection.style.display = dictionarySection.style.display === "none" ? "block" : "none";
}

// Función para traducir palabras
function translateWord() {
    const input = wordInput.value.trim().toLowerCase();
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    let translation = "";

    for (const category in dictionary.category) {
        const words = dictionary.category[category];
        const word = words.find(w => w[selectedLanguage] && w[selectedLanguage].toLowerCase() === input);

        if (word) {
            translation = selectedLanguage === "es" ? `${word.english} → ${word.spanish}` : `${word.spanish} → ${word.english}`;
            translation += ` (Ejemplo: ${word.example})`;
            break;
        }
    }

    translationResult.textContent = translation || "Palabra no encontrada en el diccionario.";
}

// Función para mostrar palabras en la lista
function displayWords(words) {
    wordList.innerHTML = "";
    words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = `${word.english} → ${word.spanish} (Ejemplo: ${word.example})`;
        wordList.appendChild(li);
    });
}

// Función para obtener palabras filtradas por categoría
function getFilteredWords() {
    const selectedCategory = Array.from(categoryRadios).find(radio => radio.checked).value;
    if (selectedCategory === "all") {
        return Object.values(dictionary.category).flat();
    } else {
        return dictionary.category[selectedCategory] || [];
    }
}

// **Nueva función** para manejar el cambio de categoría
function handleCategoryChange() {
    const filteredWords = getFilteredWords(); // Obtener palabras filtradas
    displayWords(filteredWords); // Mostrar las palabras filtradas inmediatamente
}

// Función para ordenar palabras de A-Z
function sortWordsAZ() {
    const words = getFilteredWords();
    words.sort((a, b) => a.english.localeCompare(b.english));
    displayWords(words);
}

// Función para ordenar palabras de Z-A
function sortWordsZA() {
    const words = getFilteredWords();
    words.sort((a, b) => b.english.localeCompare(a.english));
    displayWords(words);
}

// Función para añadir nuevas palabras al diccionario
function addNewWord(event) {
    event.preventDefault();

    const newWord = {
        id: Date.now(),
        english: newWordEn.value.trim(),
        spanish: newWordEs.value.trim(),
        example: exampleInput.value.trim(),
    };

    const selectedCategory = categorySelect.value;

    if (!dictionary.category[selectedCategory]) {
        dictionary.category[selectedCategory] = [];
    }

    dictionary.category[selectedCategory].push(newWord);

    // Limpiar formulario
    newWordEn.value = "";
    newWordEs.value = "";
    exampleInput.value = "";
    categorySelect.value = "fruits";

    // Actualizar lista de palabras
    displayWords(getFilteredWords());
}

// **Eventos**
translateButton.addEventListener("click", translateWord);
sortAZButton.addEventListener("click", sortWordsAZ);
sortZAButton.addEventListener("click", sortWordsZA);
addWordForm.addEventListener("submit", addNewWord);
toggleDictionaryButton.addEventListener("click", toggleDictionary);
categoryRadios.forEach(radio => {
    radio.addEventListener("change", handleCategoryChange); // **Actualizar lista al cambiar categoría**
});

// Inicializar la lista de palabras al cargar la página
window.onload = () => {
    dictionarySection.style.display = "none"; // **Ocultar el diccionario inicialmente**
    handleCategoryChange(); // **Mostrar palabras iniciales**
};