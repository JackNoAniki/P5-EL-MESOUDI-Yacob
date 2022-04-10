
let getProductsInArray = JSON.parse(localStorage.getItem("products")); 
let totalQuantityValue = 0;
const totalQuantity = document.getElementById("totalQuantity");

const totalPrice = document.getElementById("totalPrice");
let totalPriceValue = 0;



ArrayDetails();



async function ArrayDetails() {
    const list = await fetch(`http://localhost:3000/api/products`)
        .then(function(res) {
            if (res.ok){
                return res.json();
            }
        })
        
        .catch (() => {
            const errorMessage = document.querySelector("#cart__items");
            errorMessage.innerHTML = "Oups, l'API semble ne pas fonctionner !";
            errorMessage.style.textAlign = "center";
            errorMessage.style.padding = "auto";
        })
        
        getProductsInArray.forEach((productInCart, indexOfProductInCart) => {
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
                    productPrice.innerText = euroFormat;
                    getProductsInArray.forEach(element => {
                        if(element.id === productInCart.id) {
                            element.quantity = e.target.value;
                        }
                    });
                    localStorage.setItem("products", JSON.stringify(getProductsInArray));
                
                quantityDetails.addEventListener("change", () => {
                    const quantityInLs = getProductsInArray.map(ele => ele.quantity);
                    quantityInLs.forEach((quantity) => {
                        totalQuantityValue = totalQuantityValue+parseInt(quantity);
                        totalQuantity.innerHTML = totalQuantityValue;
                    })
                });

                });

                const deleteProduct = document.createElement("div");
                const deleteProductP = document.createElement("p");
                productsArticle.appendChild(deleteProduct);
                deleteProduct.className = "cart__item__content__settings__delete";
                deleteProduct.appendChild(deleteProductP);
                deleteProductP.className = "deleteItem";
                deleteProductP.innerHTML = "Supprimer";

                deleteFromDomAndLs();
                function deleteFromDomAndLs() {
                    const parent = document.getElementById("cart__items");
                    deleteProductP.addEventListener("click", () => {
                        parent.removeChild(quantityDetails.closest(".cart__item"));
                        getProductsInArray.splice(indexOfProductInCart, 1);
                        localStorage.setItem("products", JSON.stringify(getProductsInArray));
                    })
                }
            }
        })


        
        
        /** totalQuantityValue = totalQuantityValue+parseInt(quantityInLs);
        totalQuantity.innerHTML = totalQuantityValue;*/ 
}


/**Fonctions spécifiques de la page */








/** Au clic sur le bouton "Commander !", paramétrage des actions efféctuées en fonction des conditions */
checkForm();

function checkForm() {
/** Cibler les diférents inputs du formulaire */
    const order = document.getElementById("order");
    const firstName = document.getElementById("firstName");
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    const lastName = document.getElementById("lastName");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    const address = document.getElementById("address");
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    const city = document.getElementById("city");
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    const email = document.getElementById("email");
    const emailErrorMsg = document.getElementById("emailErrorMsg");

/** Regex des inputs */
    const validateFirstNameOrLastNameOrCity = /^\w+([-'\s]\w+)?/;
    const validateAdress = /^[0-9]*[\s]\w+([-'\s]\w)?/;
    const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    order.addEventListener('click', (e) => {
        e.preventDefault();
        if(validateFirstNameOrLastNameOrCity.test(firstName.value) == false) {
            firstNameErrorMsg.textContent = "Format du prénom incorrect";
        } 
        else {
            firstNameErrorMsg.textContent = "";
        }
        if(validateFirstNameOrLastNameOrCity.test(lastName.value) == false) {
            lastNameErrorMsg.textContent = "Format du nom incorrect";
        } 
        else {
            lastNameErrorMsg.textContent = "";
        }
        if(validateAdress.test(address.value) == false) {
            addressErrorMsg.textContent = "Format de l'adresse incorrect";
        } 
        else {
            addressErrorMsg.textContent = "";
        }
        if(validateFirstNameOrLastNameOrCity.test(city.value) == false) {
            cityErrorMsg.textContent = "Format de la ville incorrect";
        } 
        else {
            cityErrorMsg.textContent = "";
        }
        if(validateEmail.test(email.value) == false) {
            emailErrorMsg.textContent = "Format de l'email incorrect";
        } 
        else {
            emailErrorMsg.textContent = "";
        }

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


