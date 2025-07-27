// Espera o DOM (a estrutura da página) ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Banco de Dados de Produtos (Simulado) ---
    const products = [
        { id: 1, name: 'Action Figure - Kratos', price: 350.00, image: 'https://acdn-us.mitiendanube.com/stores/002/321/455/products/s93472ae422e8487ea6b3bfcc3f5986bea-b01dcba34f4d05696e17253986384217-1024-1024.webp' },
        { id: 2, name: 'Controle PS5 Retrô', price: 499.90, image: 'https://photos.enjoei.com.br/controle-dualsense-ps5-personalizado-63510152/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8yMjIwNTk3NC9hOWU4Nzc2NDQxODM1NzE3ZGE3YWJhY2E3MDhkN2M3Ny5qcGc' },
        { id: 3, name: 'HQ - Crise nas Infinitas Terras', price: 64.90, image: 'https://excelsiorcomics.com.br/loja/wp-content/uploads/2017/11/crise-infinitas-terras-2aserie-02.jpeg' },
        { id: 5, name: 'Camiseta The Legend of Zelda', price: 79.90, image: 'https://www.geekroyal.com.br/cdn/shop/products/Camiseta_B_sica_Preto_Zelda_Spirit_Track.jpg?v=1727719528&width=1946' },
        { id: 8, name: 'Action Figure - Blue Mary', price: 109.90, image: 'https://i.ebayimg.com/images/g/yuoAAOSwwuBj3G01/s-l1200.jpg' },
        { id: 4, name: 'Mega Drive - Sonic Edition', price: 139.90, image: 'https://cdn.awsli.com.br/600x700/17/17021/produto/30046418/69063e82dc.jpg' },
        { id: 7, name: 'Quadro - Castlevania ', price: 59.90, image: 'https://cf.shopee.com.br/file/1007948479874658833e5f207fbfc158' },
        { id: 6, name: 'Caneca Cubo "?" Mario', price: 37.90, image: 'https://d1s5vnzdzzk6v7.cloudfront.net/Custom/Content/Products/11/07/110757_caneca-cubo-mario-star-5795_m3_637945277767990610.webp' },
    ];

    // --- Seletores de Elementos do DOM ---
    const productGrid = document.getElementById('product-grid');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartEmptyMessage = document.querySelector('.cart-empty-message');
    const cartTitle = document.getElementById('cart-title'); // NOVO: Seletor para o título do carrinho

    // --- Estado da Aplicação ---
    // MELHORIA: Carrega o carrinho do localStorage ou inicia um array vazio
    let cart = JSON.parse(localStorage.getItem('geekCart')) || [];

    // --- Funções ---

    function renderProducts() {
        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.05}s`;
            card.dataset.productId = product.id; // Adiciona um data-attribute para fácil seleção
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <button class="add-to-cart-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Adicionar
                </button>
            `;
            productGrid.appendChild(card);
        });
    }

    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
            const cartItem = { ...productToAdd, cartItemId: Date.now() };
            cart.push(cartItem);
            
            // MELHORIA: Feedback visual ao adicionar
            triggerProductHighlight(productId);
            triggerCartShake();
            
            updateCart();
        }
    }

    function removeFromCart(cartItemId) {
        cart = cart.filter(item => item.cartItemId !== cartItemId);
        updateCart();
    }

    /**
     * ATUALIZADO: Agora também salva no localStorage e controla a animação do botão de finalizar.
     */
    function updateCart() {
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.appendChild(cartEmptyMessage);
            checkoutBtn.classList.remove('pulsating-button'); // Remove pulsação se o carrinho estiver vazio
        } else {
            cartEmptyMessage.remove();
            checkoutBtn.classList.add('pulsating-button'); // Adiciona pulsação quando há itens
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="cart-item-info">
                        <span>${item.name}</span>
                        <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button class="remove-from-cart-btn" data-cart-item-id="${item.cartItemId}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                `;
                cartItemsList.appendChild(li);
            });
        }
        
        calculateTotal();
        // MELHORIA: Salva o estado atual do carrinho no localStorage
        localStorage.setItem('geekCart', JSON.stringify(cart));
    }

    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // --- Funções de Feedback Visual ---

    /**
     * NOVO: Ativa o brilho no card do produto.
     */
    function triggerProductHighlight(productId) {
        const card = productGrid.querySelector(`.product-card[data-product-id="${productId}"]`);
        if (card) {
            card.classList.add('product-added-highlight');
            // Remove a classe após a animação para que possa ser reativada
            setTimeout(() => {
                card.classList.remove('product-added-highlight');
            }, 200); // Duração igual à da animação CSS
        }
    }

    /**
     * NOVO: Ativa a animação de tremor no título do carrinho.
     */
    function triggerCartShake() {
        cartTitle.classList.add('cart-title-shake');
        setTimeout(() => {
            cartTitle.classList.remove('cart-title-shake');
        }, 500); // Duração igual à da animação CSS
    }


    // --- Event Listeners ---

    productGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart-btn');
        if (button) {
            // Pega o ID a partir do data-attribute do card pai
            const card = button.closest('.product-card');
            const productId = parseInt(card.dataset.productId, 10);
            addToCart(productId);
        }
    });

    cartItemsList.addEventListener('click', (event) => {
        const button = event.target.closest('.remove-from-cart-btn');
        if (button) {
            const cartItemId = parseInt(button.dataset.cartItemId, 10);
            removeFromCart(cartItemId);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        checkoutBtn.classList.add('clicked');
        alert(`Compra finalizada! Total: ${cartTotalElement.textContent}\nObrigado por comprar na Geek Point!`);
        cart = [];
        updateCart(); // Isso irá limpar o carrinho e o localStorage

        setTimeout(() => {
            checkoutBtn.classList.remove('clicked');
        }, 400);
    });

    // --- Inicialização ---
    renderProducts(); // Renderiza os produtos na tela
    updateCart(); // Carrega o carrinho salvo e atualiza a UI
});
