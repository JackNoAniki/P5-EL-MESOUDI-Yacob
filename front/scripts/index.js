
allProducts();

/** Appel à l'API. La fonction va boucler sur le fichier json afin d'importer tous les éléments nécessaires 
 * au bon affichage de la page index.html, à savoir les éléments des produits (images, noms, descriptions).
*/
function allProducts () {
    fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(() => {
            const items = document.querySelector(".items");
            items.innerHTML = "Oups ! Une erreur s'est produite !";
            items.style.textAlign = "center";
            items.style.padding = "auto";
        })
        
        .then(function(products) {
            for(let product in products) {
                const itemLink = document.createElement("a");
                document.querySelector("#items").appendChild(itemLink);
                itemLink.href = `./product.html?id=${products[product]._id}`;
                
                const productArticle = document.createElement("article");
                itemLink.appendChild(productArticle);

                const productImg = document.createElement("img");
                productArticle.appendChild(productImg);
                productImg.src = products[product].imageUrl;
                productImg.setAttribute("alt", products[product].altTxt);

                const productTitle = document.createElement("h3");
                productArticle.appendChild(productTitle);
                productTitle.classList.add("productName");
                productTitle.src = products[product].name;
                productTitle.innerText = productTitle.src;

                const productDescription = document.createElement("p");
                productArticle.appendChild(productDescription);
                productDescription.classList.add("productDescription");
                productDescription.src = products[product].description;
                productDescription.innerText = productDescription.src;
            }
        });

}