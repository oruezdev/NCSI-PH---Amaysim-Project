if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

function ready(){
    var addToCartButtons = document.getElementsByClassName('shop-product-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var removeCartItemButtons = document.getElementsByClassName('btn-remove')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var applyPromoCodeButton = document.getElementsByClassName('btn-apply')
    for (var i = 0; i < applyPromoCodeButton.length; i++) {
        var button = applyPromoCodeButton[i]
        button.addEventListener('click', applyPromoCode)
    }

    document.getElementsByClassName('btn-checkout')[0].addEventListener('click', checkoutClicked)
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var code = shopItem.getElementsByClassName('shop-product-code')[0].innerText
    var title = shopItem.getElementsByClassName('shop-product-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-product-price')[0].innerText
    
    addItemToCart(code, title, price)
    updateCartTotal()
    console.log("added to cart: ", code, title, price);
}

function addItemToCart(code, title, price) {
    var cartRow = document.createElement('tr')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {            
            var value = parseInt(document.getElementsByClassName('cart-quantity-input')[i].value)
            value++;
            document.getElementsByClassName('cart-quantity-input')[i].value = value;
            return     
        }
    }
    
    var cartRowContents = `
        <td><span class="cart-product-code">${code}</span></td>
        <td class="cart-item"><span class="cart-item-title">${title}</span></td>
        <td><span class="cart-price">${price}</span></td>
        <td><input class="cart-quantity-input" type="number" value="1" min="1" max="100" onKeyDown="return false"></td>
        <td><button class="btn-remove" type="button">REMOVE</button></td>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

}

function checkoutClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }

    updateCartTotal()
    console.log("checkoutClicked")
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    updateCartTotal()
    console.log("quantityChanged:", input.value);
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var productCodeElement = cartRow.getElementsByClassName('cart-product-code')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var productCode = productCodeElement.innerText
        var quantity = quantityElement.value

        if(productCode == "ult_medium") {
            buttonClicked.parentElement.parentElement.remove()
            var bundle = document.getElementsByClassName('cart-item-title')[i].innerText
            if (bundle == "1 GB Data-pack (bundle)"){
                document.getElementsByClassName('cart-item-title')[i].parentElement.parentElement.remove()

                console.log("product removed: bundle")
            }
        }
        
        else {
            buttonClicked.parentElement.parentElement.remove()
        }
    }

    updateCartTotal()
    console.log("product removed")
}

function applyPromoCode(event) {
    var buttonClicked = event.target
    var promoCode = document.getElementsByClassName('cart-promo-code')[0].value

    if (promoCode != 'I<3AMAYSIM'){
        alert('Invalid promo code!')
        document.getElementsByClassName('cart-promo-code')[0].value = ""
    }

    else if(promoCode == 'I<3AMAYSIM') {
        alert('Promo code activated!')
        updateCartTotal()

        console.log("promoCode:", promoCode);
    }
    
    console.log("applyPromoCodeButton clicked")
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var discount = 0;
    var promoCode = document.getElementsByClassName('cart-promo-code')[0].value
    var subtotal = 0;
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var productCodeElement = cartRow.getElementsByClassName('cart-product-code')[0]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var productCode = productCodeElement.innerText
        console.log("productCode: " + productCode)
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value

        // We will bundle in a free 1 GB Data-pack free-of-charge with every Unlimited 2GB sold.

        if(productCode == "ult_medium"){
            var val = parseInt(document.getElementsByClassName('cart-quantity-input')[0].value)
            if(quantity <= 2 && quantity % 2 == 0){
                addItemToCart('ult_medium', "1 GB Data-pack (bundle)", "<strike>$9.90</strike> $0.00")
                discount += 9.90

                console.log("quantity <= 2 && quantity % 2 == 0 discount:", discount)
            }
            
            else if(quantity > 2 && quantity % 2 == 0){
                var cartItems = document.getElementsByClassName('cart-items')[0]
                var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
                for (var j = 0; j < cartItemNames.length; j++) {
                    // if(cartItemNames[j].innerText == "1 GB Data-pack (bundle)") {
                        var value = parseInt(document.getElementsByClassName('cart-quantity-input')[i+1].value)
                        value++;
                        document.getElementsByClassName('cart-quantity-input')[i+1].value = value;
                        return     
                    // }
                }
                val = parseInt(document.getElementsByClassName('cart-quantity-input')[i+1].value)
                val++;
                document.getElementsByClassName('cart-quantity-input')[i+1].value = val;
                
                discount += 9.90 * val 
            }

            else if (quantity > 2 && quantity % 2 != 0) {
                ult_medium_val = parseInt(document.getElementsByClassName('cart-quantity-input')[i+1].value)
                discount += 0 + (9.90 * val)
                
                console.log("quantity % 2 != 0", discount)
            }

            else {
                discount += 0
            }

            console.log("ult_medium discount:", discount)
            subtotal = subtotal + (price * quantity)
            document.getElementsByClassName('cart-discount-desc')[0].innerText = 'Free 1 GB Data-pack free-of-charge for every Unlimited 2GB'
        }

        // A 3 for 2 deal on Unlimited 1GB Sims. So for example, if you buy 3 Unlimited 1GB Sims, you will pay the price of 2 only for the first month.
        else if (productCode == "ult_small" && quantity >= 3){
            subtotal = subtotal + (price * quantity)
            discount += (price * quantity) - (price * (quantity - 1))
            document.getElementsByClassName('cart-discount-desc')[0].innerText = 'Enjoy the first 3 Unlimited 1GB Sim for the price of 2!'

            console.log("discount applied: " + discount)
        }

        // The Unlimited 5GB Sim will have a bulk discount applied; whereby the price will drop to $39.90 each for the first month, if the customer buys more than 3.
        else if(productCode == "ult_large" && quantity > 3) {
            var newPrice = 39.90
            var ult_large = price * quantity
            var newSubtotal = subtotal + (39.90 * quantity)
            subtotal = subtotal + ult_large
            
            console.log(subtotal, newSubtotal)
            discount += subtotal - newSubtotal
            
            document.getElementsByClassName('cart-price')[i].innerHTML = `<strike>$` + price.toFixed(2) + `</strike> $` + newPrice.toFixed(2)
            document.getElementsByClassName('cart-discount-desc')[0].innerText = 'Bulk discount applied! Unlimited 5GB price dropped from $44.90 to $39.90 each for 3 or more items purchased'
        }
        
        else {
            subtotal = subtotal + (price * quantity)
        }
    }

    // Adding the promo code 'I<3AMAYSIM' will apply a 10% discount across the board.
    if(promoCode == 'I<3AMAYSIM') {
        discount += 0.10 * subtotal
        document.getElementsByClassName('cart-discount-desc')[0].innerText = 'Enjoy additional 10% discount on your purchase.'

        console.log("discount added:", discount)
    }

    subtotal = (Math.round(subtotal * 100) / 100).toFixed(2)
    document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + subtotal

    discount = (Math.round(discount * 100) / 100).toFixed(2)
    if (discount == 0){
        document.getElementsByClassName('cart-discount-price')[0].innerText = '$0.00'
        document.getElementsByClassName('cart-discount-desc')[0].innerText = ''
    }

    if(discount > 0){
        document.getElementsByClassName('cart-discount-price')[0].innerText = '-$' + discount
    }
    
    total = (Math.round((subtotal - discount) * 100) / 100).toFixed(2)
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}