const productUrl = window.location.href;
const url = new URL(productUrl);
const id = url.searchParams.get("id");
const quantity = document.getElementById("quantity");
const color = document.getElementById('colors');

    getProduct();


/** Appel à l'API. Récupération de l'id du produit à afficher avec UrlSearchParams. Grâce à cete méthode, l'API 
 * saura quels éléments afficher. Ici, un seul produit à afficher, donc pas besoin de boucle. Importation des différents éléments
 * selon l'id du produit. Exception pour le choix de la couleur, expliqué plus bas.
  */
function getProduct () {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(() => {
            const item = document.querySelector("article");
            item.innerHTML = "Oups, l'API semble ne pas fonctionner !";
            item.style.textAlign = "center";
            item.style.padding = "auto";
        })  

        .then(function(item) {
                const itemImg = document.createElement("img");
                const imgParent = document.querySelector(".item__img");
                imgParent.appendChild(itemImg);
                itemImg.src = item.imageUrl;
                itemImg.setAttribute("alt", item.altTxt);

                const itemTitle = document.getElementById("title");
                itemTitle.innerText = item.name;

                const itemPrice = document.getElementById("price");
                itemPrice.innerText = item.price;

                const itemDescription = document.getElementById("description");
                itemDescription.innerText = item.description;

/** Génération des différentes options de couleur. Boucle efféctuée sur l'array des couleurs, afin d'aficher ces dernières. */
                for (let i = 0; i < item.colors.length; i++) {
                    const colorChoice = document.createElement("option");
                    colorOption = document.getElementById("colors");
                    colorOption.appendChild(colorChoice);
                    colorChoice.setAttribute("value",item.colors[i]);
                    colorChoice.innerText = item.colors[i];
                } 
        });
}

/** Cibler le bouton "ajouter au panier". */
const addToCartBtn = document.getElementById("addToCart");
/** Appel de la fonction addToCrt au clic sur "Ajouter au panier". */
addToCartBtn.onclick = addToCart;

/** Fonction d'ajout de sproduits au panier. Les éléments à envoyer sont d'abord groupés dans un objet,
 * puis poussés dans un array. C'est cet array qui sera envoyé dans le localStorage.
 */
function addToCart() {
        let productsDetails = { 
            id: id, 
            color: color.value, 
            quantity: quantity.value,
        }
        
        let productsArray = [];

/** Avant d'agir, toujours vérifier que le localStorage ne soit pas vide. */
        if(localStorage.getItem("products") !== null) {
            productsArray = JSON.parse(localStorage.getItem("products"));
            
        }
/** Trouver dans le tableau qui va être envoyé au localStorage, un élément qui serait strictement identique à un autre
 * (même canapé et même couleur) via l'index de ce dernier.
*/
        const sameIdAndColor = productsArray.findIndex(function (product) {
            return (product.id === productsDetails.id && product.color === productsDetails.color)
        })
/** Si la constante générée plus haut ne trouve pas ce qui est indiqué en paramètres via l'index, push de l'objet vers l'array.
 * À l'inverse, seulement modifier la quantité du produit trouvé via son index.
 */
        if(sameIdAndColor === -1) {
            productsArray.push(productsDetails); 
        } 
        else {
            productsArray[sameIdAndColor].quantity = productsDetails.quantity;
        }
/** Méthode utilisée sur l'objet produtsDetails. Si l'user ne séléctionne pas de couleur, ou s'il séléctionne
 * une quantité inférieure ou égale à 0, le produit sera supprimé de l'array, il ne sera pas présent dans la page panier.
 */
        const ObjDescriptor = Object.getOwnPropertyDescriptors(productsDetails);
        const colorValue = ObjDescriptor.color.value;
        const quantityValue = ObjDescriptor.quantity.value;
        
        if(colorValue == "") {
            productsArray.pop();
        } 
        else if(quantityValue <= 0) {
            productsArray.pop();
        }
        
        localStorage.setItem("products", JSON.stringify(productsArray));
        
}

