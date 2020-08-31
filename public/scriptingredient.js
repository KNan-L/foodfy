function addIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")

    //Realiza um clone do ultimo ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    //Não adiciona um novo input se o ultimo tem um valor vazio
    if (newField.children[0].value == "") return false

    //Deixa um valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

document
    .querySelector(".add-ingredient")
    .addEventListener("click", addIngredient)

/// === Modo de preparo ///

function addPreparo() {
    const preparos = document.querySelector("#preparos")
    const fieldContainer = document.querySelectorAll(".preparo")

    //Realiza um clone do ultimo ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    //Não adiciona um novo input se o ultimo tem um valor vazio
    if (newField.children[0].value == "") return false

    //Deixa um valor do input vazio
    newField.children[0].value = ""
    preparos.appendChild(newField)
}

document
    .querySelector(".add-preparo")
    .addEventListener("click", addPreparo)