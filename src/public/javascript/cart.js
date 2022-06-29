if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // Remove item
    var removeCartButton = document.querySelectorAll('#cart-container table tbody i')
    for (const element of removeCartButton) {
        var button = element;
        button.addEventListener('click', function (event) {
            var buttonClicked = event.target
            buttonClicked.parentElement.parentElement.parentElement.remove()
            updateCartTotal()
        });
    }

    var quantityInput = document.querySelectorAll('.product-quantity')
    for (const input of quantityInput) {
        input.addEventListener('change', quantityChange)
    }
}


// 
function quantityChange(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateProductTotal()
    updateCartTotal()
}
// Update total product
function updateProductTotal() {
    var product = document.querySelectorAll('.product-item')
    for (const element of product) {
        var total = 0
        var cartRow = element
        var priceElement = cartRow.querySelector('.total-product-price').innerText
        var price = Number(priceElement.replace(/[^0-9,-]+/g, ""));
        var quantity = (cartRow.querySelector('.product-quantity').value)
        total += (price * quantity)
        total = total.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        cartRow.querySelector('.total-product').innerText = total
    }
}

updateProductTotal()
updateCartTotal()
// Update total
function updateCartTotal() {
    var product = document.querySelectorAll('.product-item')
    var total = 0
    for (const element of product) {
        var cartRow = element
        var priceElement = cartRow.querySelector('.total-product-price').innerText
        var price = Number(priceElement.replace(/[^0-9,-]+/g, ""));
        var quantity = (cartRow.querySelector('.product-quantity').value)
        total += (price * quantity)
    }
    total = total.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    document.querySelector('#total-cart strong').innerText = 'TỔNG TIỀN THANH TOÁN: ' + total
}

