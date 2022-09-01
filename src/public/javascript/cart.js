// Add to shopping cart
let shoppingCart
if (localStorage.getItem('shopping-cart')) {
    shoppingCart = JSON.parse(localStorage.getItem('shopping-cart'))
} else {
    shoppingCart = JSON.parse(localStorage.setItem('shopping-cart', '[]'))
}

function addToShoppingCart(id, name, img, slug, price, strPrice) {
    console.log('onclick')
    let checkID = shoppingCart.some(item => {
        item = JSON.parse(item)
        return item.id === id
    })
    if (checkID) {
        changeNumberOfUnit('plus', id)
    } else {
        const product = {
            id: id,
            name: name,
            img: img,
            price: price,
            slug: slug
        }
        shoppingCart.push(JSON.stringify({
            ...product,
            numberOfUnit: 1
        }))
    }
    alertAddProduct(name)
    localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart))
}

function changeNumberOfUnit(action, id) {
    shoppingCart = shoppingCart.map(item => {
        item = JSON.parse(item)
        let numberOfUnit = Number(item.numberOfUnit)
        if (item.id === id) {
            if (action == 'minus' && numberOfUnit > 1) {
                numberOfUnit--
            } else if (action == 'plus') {
                numberOfUnit++
            }
        }
        return JSON.stringify({
            ...item,
            numberOfUnit: numberOfUnit
        })
    })
    localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart))
}

function updateShoppingCart() {
    renderProductToCart()
    updateLocalShoppingCart()
}

const bodyCart = document.getElementById('body-cart')
function renderProductToCart() {
    bodyCart.innerHTML = ``
    shoppingCart.forEach(item => {
        item = JSON.parse(item)
        bodyCart.innerHTML += `<tr class="product-item">
            <th scope="row">
                <a href="/cart">
                    <img class="" src="${item.img}" alt="">
                </a>
            </th>
            <td><a href="/cart">
                    ${item.name}</a></td>
            <td class="total-product-price"><strong>${item.price}</strong></td>
            <td>

                <input class="product-quantity w-25 pl-1" value="${item.numberOfUnit}" type="number">
            </td>
            <td><strong class="total-product"></strong></td>
            <td>
                <button class="btn btn-danger" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`
    })
}



function updateLocalShoppingCart() {
    localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart))
}


function alertAddProduct(name) {
    document.getElementById('alert-product').innerHTML =
        `<div style="width: 30%; bottom: 0; position: fixed; z-index: 9999999; " class="alert alert-success alert-dismissible fade show" role="alert">
        Đã thêm <strong>${name}</strong> vào giỏ hàng
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
}