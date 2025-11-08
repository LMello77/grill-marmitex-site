// --- JÁ EXISTIA ---
// Espera o DOM estar pronto antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // Tenta buscar (fetch) o arquivo JSON na pasta /data
    fetch('data/cardapio.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
            }
            return response.json(); // Converte a resposta em um objeto JS
        })
        .then(data => {
            // Se deu tudo certo, chama as funções
            exibirProdutos(data);
            
            // --- NOVO ---
            // Configura os botões para adicionar ao carrinho
            configurarEventosCarrinho(data); 
        })
        .catch(error => {
            // Se deu algum erro, mostra no console
            console.error('Houve um problema com a operação fetch:', error);
            const listaProdutosDiv = document.getElementById('lista-produtos');
            listaProdutosDiv.innerHTML = '<p>Não foi possível carregar o cardápio. Tente novamente mais tarde.</p>';
        });
});

/**
 * --- JÁ EXISTIA ---
 * Função para criar e exibir os produtos na tela
 */
function exibirProdutos(cardapio) {
    const listaProdutosDiv = document.getElementById('lista-produtos');
    listaProdutosDiv.innerHTML = ''; 

    // --- Pratos Principais ---
    const tituloPratos = document.createElement('h3');
    tituloPratos.textContent = 'Pratos Principais';
    listaProdutosDiv.appendChild(tituloPratos);

    cardapio.pratos_principais.forEach(prato => {
        const card = document.createElement('div');
        card.className = 'card-produto';
        
        // A ÚNICA MUDANÇA AQUI: Adicionamos o 'data-id' no botão
        card.innerHTML = `
            <img src="${prato.imagem_url}" alt="${prato.nome}">
            <h4>${prato.nome}</h4>
            <p class="descricao">${prato.descricao}</p>
            <p class="preco">R$ ${prato.preco.toFixed(2).replace('.', ',')}</p>
            <button class="btn-adicionar" data-id="${prato.id}">Adicionar</button>
        `;
        
        listaProdutosDiv.appendChild(card);
    });

    // --- Bebidas ---
    const tituloBebidas = document.createElement('h3');
    tituloBebidas.textContent = 'Bebidas';
    listaProdutosDiv.appendChild(tituloBebidas);

    cardapio.bebidas.forEach(bebida => {
        const card = document.createElement('div');
        card.className = 'card-produto';
        
        // A ÚNICA MUDANÇA AQUI: Adicionamos o 'data-id' no botão
        card.innerHTML = `
            <h4>${bebida.nome}</h4>
            <p class="preco">R$ ${bebida.preco.toFixed(2).replace('.', ',')}</p>
            <button class="btn-adicionar" data-id="${bebida.id}">Adicionar</button>
        `;
        listaProdutosDiv.appendChild(card);
    });
}

/**
 * --- NOVO ---
 * Configura os "ouvintes" de clique nos botões "Adicionar"
 * @param {object} cardapioData - Os dados completos do JSON
 */
function configurarEventosCarrinho(cardapioData) {
    const listaProdutosDiv = document.getElementById('lista-produtos');

    // Técnica de "Event Delegation": Ouve cliques no container PAI
    listaProdutosDiv.addEventListener('click', (event) => {
        
        // Verifica se o clique foi em um botão com a classe 'btn-adicionar'
        if (event.target.classList.contains('btn-adicionar')) {
            // Pega o ID do produto, que colocamos no 'data-id' do botão
            const idProduto = event.target.dataset.id;
            
            // Chama a função para adicionar ao carrinho
            adicionarAoCarrinho(idProduto, cardapioData);
        }
    });
}

/**
 * --- NOVO ---
 * A Lógica Principal: Adicionar o item ao localStorage
 * @param {string} id - O ID do produto a adicionar
 * @param {object} cardapioData - Os dados completos do JSON para encontrar o produto
 */
function adicionarAoCarrinho(id, cardapioData) {
    console.log('Adicionando produto ID:', id);

    // 1. Busca o carrinho salvo no localStorage. Se não existir, começa um array vazio [].
    const carrinhoAtual = JSON.parse(localStorage.getItem('grillMarmitexCart')) || [];

    // 2. Encontra os dados do produto que foi clicado
    // Primeiro, procura nos pratos:
    let produtoEncontrado = cardapioData.pratos_principais.find(p => p.id == id);
    
    // Se não achou, procura nas bebidas:
    if (!produtoEncontrado) {
        produtoEncontrado = cardapioData.bebidas.find(b => b.id == id);
    }

    // 3. Se encontrou o produto...
    if (produtoEncontrado) {
        // 4. Adiciona o produto encontrado ao nosso array do carrinho
        carrinhoAtual.push(produtoEncontrado);

        // 5. Salva o array ATUALIZADO de volta no localStorage
        // (JSON.stringify converte o array de volta para texto)
        localStorage.setItem('grillMarmitexCart', JSON.stringify(carrinhoAtual));

        // 6. Dá um feedback (alerta) para o usuário
        alert(`${produtoEncontrado.nome} foi adicionado ao carrinho!`);
    } else {
        console.error('Produto não encontrado com o ID:', id);
    }
}