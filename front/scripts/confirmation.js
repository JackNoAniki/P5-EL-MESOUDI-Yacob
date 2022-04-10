showOrderIdInDom();

function showOrderIdInDom() {
    const orderUrl = window.location.href;
    const url = new URL(orderUrl); 
    const orderId = document.getElementById("orderId");
    orderId.innerHTML = url.searchParams.get("id");

}



