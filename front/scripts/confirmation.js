/** Affichage de l'id de commande dans le DOM via urlSearchParams. Récupération de l'id dans l'url. */
const orderUrl = window.location.href;
const url = new URL(orderUrl); 
const orderId = document.getElementById("orderId");
orderId.innerHTML = url.searchParams.get("id");



