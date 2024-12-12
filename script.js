document.addEventListener('DOMContentLoaded', () => {
    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            const cartItemsContainer = document.getElementById('cart-items');
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');

            let subtotal = 0;
            const items = data.items;

            items.forEach((item, index) => {
                const row = document.createElement('tr');

                const productCell = document.createElement('td');
                productCell.innerHTML = `<img src="${item.image}" alt="${item.title}" style="width: 100px; height: auto;"> ${item.title}`;
                row.appendChild(productCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = `Rs. ${(item.price / 100).toFixed(2)}`;
                row.appendChild(priceCell);

                const quantityCell = document.createElement('td');
                quantityCell.innerHTML = `<input type="number" value="${item.quantity}" min="1" style="width: 50px;" data-index="${index}">`;
                row.appendChild(quantityCell);

                const subtotalCell = document.createElement('td');
                const linePrice = item.price * item.quantity;
                subtotalCell.innerHTML = `Rs. ${(linePrice / 100).toFixed(2)}`;
                row.appendChild(subtotalCell);

                const actionCell = document.createElement('td');
                actionCell.innerHTML = `<button class="delete-btn" data-index="${index}">Delete</button>`;
                row.appendChild(actionCell);

                cartItemsContainer.appendChild(row);

                subtotal += linePrice;
            });

            function updateCartTotals() {
                let newSubtotal = 0;
                const quantityInputs = document.querySelectorAll('.cart input[type="number"]');
                quantityInputs.forEach((input, index) => {
                    const item = items[index];
                    const newQuantity = parseInt(input.value);
                    const linePrice = item.price * newQuantity;
                    const subtotalCell = input.closest('tr').querySelector('td:nth-child(4)');
                    subtotalCell.innerHTML = `Rs. ${(linePrice / 100).toFixed(2)}`;
                    newSubtotal += linePrice;
                });
                subtotalElement.textContent = `Rs. ${(newSubtotal / 100).toFixed(2)}`;
                totalElement.textContent = `Rs. ${(newSubtotal / 100).toFixed(2)}`;
            }

            function handleDeleteButtonClick(event) {
                const index = event.target.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this item?')) {
                    const row = event.target.closest('tr');
                    row.remove();
                    items.splice(index, 1);
                    updateCartTotals();
                }
            }

            cartItemsContainer.addEventListener('click', function(event) {
                if (event.target && event.target.classList.contains('delete-btn')) {
                    handleDeleteButtonClick(event);
                }
            });

            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('input', updateCartTotals);
            });

            const checkoutButton = document.getElementById('checkout-button');
            checkoutButton.addEventListener('click', () => {
                alert('Booking Confirmed');
            });

            updateCartTotals();
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
        });
});
