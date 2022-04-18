const getProductsInArray = JSON.parse(localStorage.getItem("products"));

arrayDetails();


/** Afficher les produits du localStorage dans la page cart.html */
async function arrayDetails() {
    const list = await getApiProduct();
        
            getLocalStorage().forEach((productInCart, indexOfProductInCart) => {
            const item = list.find(element => element._id === productInCart.id);
            if(item) {
                const productsArticle = document.createElement("article");
                const articleParent = document.querySelector("#cart__items");
                articleParent.appendChild(productsArticle);
                productsArticle.classList.add("cart__item");
                productsArticle.setAttribute("data-id", productInCart.id);
                productsArticle.setAttribute("data-color", productInCart.color);
                const imgDiv = document.createElement("div");
                productsArticle.appendChild(imgDiv);
                imgDiv.classList.add("cart__item__img");

                const img = document.createElement("img");
                imgDiv.appendChild(img);
                img.src = item.imageUrl;
                img.setAttribute("alt", item.altTxt);

                const content = document.createElement("div");
                productsArticle.appendChild(content);
                content.classList.add("cart__item__content");

                const contentDescription = document.createElement("div");
                content.appendChild(contentDescription);
                contentDescription.classList.add("cart__item__content__description");

                const titlePrice = document.createElement("div");
                contentDescription.appendChild(titlePrice);
                titlePrice.classList.add("cart__item__content__titlePrice");

                const productTitle = document.createElement("h2");
                titlePrice.appendChild(productTitle);
                productTitle.innerText = item.name;

                const productColor = document.createElement("p");
                titlePrice.appendChild(productColor);
                productColor.innerText = productInCart.color;
                
                const productPrice = document.createElement("p");
                const getPrice = item.price;
                titlePrice.appendChild(productPrice);
                const euroFormat = new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(getPrice*(productInCart.quantity));
                productPrice.innerText = euroFormat;

                const settings = document.createElement("div");
                productsArticle.appendChild(settings);
                settings.classList.add("cart__item__content__settings");

                const quantity = document.createElement("div");
                settings.appendChild(quantity);
                quantity.classList.add("cart__item__content__settings__quantity");

                const quantityP = document.createElement("p");
                const quantityDetails = document.createElement("input");
                quantity.appendChild(quantityP);
                quantity.appendChild(quantityDetails);
                quantityP.innerHTML = "Qté :";

                quantityDetails.type = 'number';
                quantityDetails.className = 'itemQuantity';
                quantityDetails.name = 'itemQuantity';
                quantityDetails.min = '1';
                quantityDetails.max = '100';
                quantityDetails.setAttribute("value", productInCart.quantity);

                quantityDetails.addEventListener('change', function (e) {
                    const euroFormat = new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(getPrice*quantityDetails.value)
                    productPrice.innerHTML = euroFormat;
                    getProductsInArray.forEach(element => {
                        if((element.id === productInCart.id) && (element.color === productInCart.color)) {
                            element.quantity = e.target.value;
                        }
                    });
                    localStorage.setItem("products", JSON.stringify(getProductsInArray));
                    totalQuantityAndPrice();
                });

                const deleteProduct = document.createElement("div");
                const deleteProductP = document.createElement("p");
                productsArticle.appendChild(deleteProduct);
                deleteProduct.className = "cart__item__content__settings__delete";
                deleteProduct.appendChild(deleteProductP);
                deleteProductP.className = "deleteItem";
                deleteProductP.innerHTML = "Supprimer";

                const parent = document.getElementById("cart__items");
                deleteProductP.addEventListener("click", () => {
                    parent.removeChild(quantityDetails.closest(".cart__item"));
                    getProductsInArray.splice(indexOfProductInCart, 1);
                    localStorage.setItem("products", JSON.stringify(getProductsInArray));
                    totalQuantityAndPrice();
                })
            }
        })
        totalQuantityAndPrice();
        checkForm();
}


/**Fonctions spécifiques de la page */
/** L'appel à l'API et les actions qui en découlent sont dans une fcontion asynchrone, qui contient un await.
 * L'opération se termine avant d'éxecuter le reste du code.
 *  Le fetch est dans une fonction car utilisée à plus d'un endroit dans le code.
 */
async function getApiProduct() {
    let data = [];
    await fetch(`http://localhost:3000/api/products`)
        .then(function(res) {
            if (res.ok){
                data = res.json();
            }
        })
        
        .catch (() => {
            const errorMessage = document.querySelector("#cart__items");
            errorMessage.innerHTML = "Oups, l'API semble ne pas fonctionner !";
            errorMessage.style.textAlign = "center";
            errorMessage.style.padding = "auto";
        })
    
    return data;
}

/** Récupération du localStorage, utilisée plus d'une fois dans le code. */
function getLocalStorage() {
    return JSON.parse(localStorage.getItem("products"));
}


/** Fonction servant à indiquer les totaux des prix et des quantitées, appelée plsuieurs fois dans le code. */
async function totalQuantityAndPrice() {
    let totalQuantityValue = 0;
    let totalPriceValue = 0;
    const totalQuantity = document.getElementById("totalQuantity");
    const totalPrice = document.getElementById("totalPrice"); 

    let apiData = await getApiProduct();

    if(getLocalStorage().length > 0) {
        getLocalStorage().forEach((localStorageProduct) => {
            const item = apiData.find(element => element._id === localStorageProduct.id);
            if(item) {
                totalQuantityValue += parseInt(localStorageProduct.quantity);
                totalPriceValue += parseInt(item.price*localStorageProduct.quantity);

                totalQuantity.innerText = totalQuantityValue;
                totalPrice.innerText = new Intl.NumberFormat("fr-FR", {style: "decimal"}).format(totalPriceValue);
            }

        });

    } else {
        totalQuantity.innerHTML = 0;
        totalPrice.innerHTML = 0;
    }

}


/**Fonction contenant l'ensemble des éléments servant à la vérification du formulaire de contact. */
function checkForm() {
/** Cibler les diférents inputs du formulaire */
    const order = document.getElementById("order");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");

    //objet d'erreurs pour chaque input
    const inputError = {
        firstNameErrorMsg: "Format du prénom inccorect ou mal rempli",
        lastNameErrorMsg: "Format du nom inccorect ou mal rempli",
        addressErrorMsg: "Format de l'adresse inccorect ou mal rempli",
        cityErrorMsg: "Format du nom de ville inccorect ou mal rempli",
        emailErrorMsg: "Format de l'email inccorect ou mal rempli",
    }


/** Regex des inputs */
    const validateTextInput = /^\w+([-'\s]\w+)?/;
    const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/** Au clic sur le bouton "Commander !", paramétrage des actions efféctuées en fonction des conditions */
    order.addEventListener('click', (e) => {
        e.preventDefault();
        
        /** Ensemble des éléments que lequel va itérer la boucle, 
        à savoir les différents formulaires qui seront envoyés */
        const contactForm = document.getElementsByClassName("cart__order__form__question");

        // Itération sur chaque élément form
        for (let i=0; i < contactForm.length; i++) {
            // Récupération de l'élément input dans le formaulaire
            const contactFormInput = contactForm[i].getElementsByTagName("input").item(0);

            // Récupération du texte saisi dans l'input
            const writtenTxtInInput = contactFormInput.value;

            // Récupération de l'élément dans lequel va être affiché le message d'erreur
            const formErrMsgP  = contactForm[i].getElementsByTagName("p").item(0);

            /** Récupération de la valeur de l'id de l'élément dans lequel va être affiché le message d'erreur,
             * à des fins de rapprochements avec le nom de la propriété de l'objet/map "inputError" */
            const formErrMsgPKey = formErrMsgP.attributes["id"].value;

            /** Récupération de la valeur de l'attribut "type" de l'input, afin d'effectuer les différents
             * types de vérification avec les regex.*/
            const contactFormInputType = contactFormInput.attributes["type"].value;

            //Vérification selon le type d'input, ou pour l'adresse, selon l'id de l'input
            if(contactFormInputType === 'text') {
                if(!validateTextInput.test(writtenTxtInInput)) {
                    const message = inputError[formErrMsgPKey];
                    formErrMsgP.textContent = message;
                    return;
                } else {
                    formErrMsgP.textContent = "";
                }

            } else if(contactFormInputType === "email") {
                if(!validateEmail.test(writtenTxtInInput)) {
                    const message = inputError[formErrMsgPKey];
                    formErrMsgP.textContent = message;
                    return;
                } else {
                    formErrMsgP.textContent = "";
                }
            }

        }

/** Constante contenant l'id des produits, et le formlaire de contact. Elle est ensuite 
 * envoyée au back via une requête "POST". */
        const order = {
            contact: {
                firstName:  firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
            },
            products: getProductsInArray.map(ele => ele.id),
        };
        send(order);
    });
}


/** Fonction contenant la requête "POST". Envoi vers l'API de la constante order.*/
function send(order) {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })

    .then((res) => res.json())
    .then((data) => {
        window.location.href = `../html/confirmation.html?id=${data.orderId}`;
    })
    .catch(() => {
        alert("Une erreur est survenue.")
    });

}


