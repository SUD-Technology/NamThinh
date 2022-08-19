if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()

}



function ready() {
    // Remove item
    let removeCartButton = document.querySelectorAll('#cart-container table tbody i')
    for (const element of removeCartButton) {
        let button = element;
        button.addEventListener('click', function (event) {
            let buttonClicked = event.target
            buttonClicked.parentElement.parentElement.parentElement.remove()
            updateCartTotal()
        });
    }

    let quantityInput = document.querySelectorAll('.product-quantity')
    for (const input of quantityInput) {
        input.addEventListener('change', quantityChange)
    }
}


// 
function quantityChange(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateProductTotal()
    updateCartTotal()
}
// Update total product
function updateProductTotal() {
    let product = document.querySelectorAll('.product-item')
    for (const element of product) {
        let total = 0
        let cartRow = element
        let priceElement = cartRow.querySelector('.total-product-price').innerText
        let price = Number(priceElement.replace(/[^0-9,-]+/g, ""));
        let quantity = (cartRow.querySelector('.product-quantity').value)
        total += (price * quantity)
        total = total.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        cartRow.querySelector('.total-product').innerText = total
    }
}

updateProductTotal()
updateCartTotal()
// Update total
function updateCartTotal() {
    let product = document.querySelectorAll('.product-item')
    let total = 0
    for (const element of product) {
        let cartRow = element
        let priceElement = cartRow.querySelector('.total-product-price').innerText
        let price = Number(priceElement.replace(/[^0-9,-]+/g, ""));
        let quantity = (cartRow.querySelector('.product-quantity').value)
        total += (price * quantity)
    }
    total = total.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    document.querySelector('#total-cart strong').innerText = 'TỔNG TIỀN THANH TOÁN: ' + total
}



