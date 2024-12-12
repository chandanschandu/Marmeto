document.addEventListener('DOMContentLoaded', () => {
    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            const cartItemsContainer = document.getElementById('cart-items');
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');

            let subtotal = 0;

            // Directly use the items from the fetched data
            const items = data.items;

            // Create rows for cart items
            items.forEach((item, index) => {
                const row = document.createElement('tr');

                // Create the product cell
                const productCell = document.createElement('td');
                productCell.innerHTML = `<img src="${item.image}" alt="${item.title}" style="width: 100px; height: auto;"> ${item.title}`;
                row.appendChild(productCell);

                // Create the price cell
                const priceCell = document.createElement('td');
                priceCell.textContent = `Rs. ${(item.price / 100).toFixed(2)}`;
                row.appendChild(priceCell);

                // Create the quantity cell
                const quantityCell = document.createElement('td');
                quantityCell.innerHTML = `<input type="number" value="${item.quantity}" min="1" style="width: 50px;" data-index="${index}">`;
                row.appendChild(quantityCell);

                // Create the subtotal cell with the delete button
                const subtotalCell = document.createElement('td');
                const linePrice = item.price * item.quantity;
                subtotalCell.innerHTML = `Rs. ${(linePrice / 100).toFixed(2)} <button class="delete-btn" data-index="${index}"></button>`;
                row.appendChild(subtotalCell);

                // Append the row to the table body
                cartItemsContainer.appendChild(row);

                // Update subtotal
                subtotal += linePrice;
            });

            // Function to update subtotal and total when quantity changes
            function updateCartTotals() {
                let newSubtotal = 0;
                const quantityInputs = document.querySelectorAll('.cart input[type="number"]');
                quantityInputs.forEach((input, index) => {
                    const item = items[index];
                    const newQuantity = parseInt(input.value);
                    const linePrice = item.price * newQuantity;
                    const subtotalCell = input.closest('tr').querySelector('td:nth-child(4)');
                    subtotalCell.innerHTML = `Rs. ${(linePrice / 100).toFixed(2)} <button class="delete-btn" data-index="${index}">🗑️</button>`;
                    newSubtotal += linePrice;
                });
                subtotalElement.textContent = `Rs. ${(newSubtotal / 100).toFixed(2)}`;
                totalElement.textContent = `Rs. ${(newSubtotal / 100).toFixed(2)}`;
            }

            // Add event listeners for quantity changes
            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('input', updateCartTotals);
            });

            // Function to handle delete button click
            function handleDeleteButtonClick(event) {
                const index = event.target.getAttribute('data-index');
                const quantityInput = document.querySelectorAll('input[type="number"]')[index];
                quantityInput.value = 1; // Set quantity to 1
                updateCartTotals(); // Update the totals after the change
            }

            // Add event delegation for delete button click
            cartItemsContainer.addEventListener('click', function(event) {
                if (event.target && event.target.classList.contains('delete-btn')) {
                    handleDeleteButtonClick(event);
                }
            });

            // Initial update of totals
            updateCartTotals();
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
        });
     function handleDeleteButtonClick(event) {
        const index = event.target.getAttribute('data-index');
        if (confirm('Are you sure you want to delete this item?')) {
            items.splice(index, 1); // Remove item from the array
            renderCartItems(); // Re-render cart items
        }
    }

    // Function to handle quantity change
    function handleQuantityChange(event) {
        const index = event.target.getAttribute('data-index');
        const newQuantity = parseInt(event.target.value, 10);

        if (newQuantity > 0) {
            items[index].quantity = newQuantity; // Update item quantity
            renderCartItems(); // Re-render cart items
        }
    }

    // Function to handle checkout button click
    function handleCheckoutButtonClick() {
        alert('Booking Confirmed');
    }

    // Event delegation for delete buttons and quantity inputs
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            handleDeleteButtonClick(event);
        }
    });

    cartItemsContainer.addEventListener('input', (event) => {
        if (event.target.type === 'number') {
            handleQuantityChange(event);
        }
    });

    // Attach event listener to checkout button
    checkoutButton.addEventListener('click', handleCheckoutButtonClick);

    // Initial render of cart items
    renderCartItems();
});

    

