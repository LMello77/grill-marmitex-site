// 1. Espera o DOM estar pronto antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // 2. Tenta buscar (fetch) o arquivo JSON na pasta /data
    fetch('data/cardapio.json')
        .then(response => {
            // 3. Se a resposta do servidor for OK (200), converte o JSON
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
            }
            return response.json(); // Converte a resposta em um objeto JS
        })
        .then(data => {
            // 4. Se deu tudo certo, chama a função para exibir os produtos
            exibirProdutos(data);
        })
        .catch(error => {
            // 5. Se deu algum erro na busca ou conversão, mostra no console
            console.error('Houve um problema com a operação fetch:', error);
            // Opcional: Mostrar erro para o usuário na tela
            const listaProdutosDiv = document.getElementById('lista-produtos');
            listaProdutosDiv.innerHTML = '<p>Não foi possível carregar o cardápio. Tente novamente mais tarde.</p>';
        });
});

/**
 * Função para criar e exibir os produtos na tela
 * @param {object} cardapio - O objeto JSON completo do cardápio
 */
function exibirProdutos(cardapio) {
    // 6. Encontra o container no HTML onde os produtos serão inseridos
    const listaProdutosDiv = document.getElementById('lista-produtos');

    // 7. Limpa a mensagem "Carregando cardápio..."
    listaProdutosDiv.innerHTML = ''; 

    // 8. Cria um título para os Pratos Principais
    const tituloPratos = document.createElement('h3');
    tituloPratos.textContent = 'Pratos Principais';
    listaProdutosDiv.appendChild(tituloPratos);

    // 9. Loop (forEach) para criar um card para cada prato principal
    cardapio.pratos_principais.forEach(prato => {
        // 10. Cria o elemento HTML (o card do produto)
        const card = document.createElement('div');
        card.className = 'card-produto'; // Adiciona uma classe CSS para estilizar depois

        // 11. Adiciona o conteúdo HTML dentro do card
        // (Usando Template Literals `` para facilitar)
        card.innerHTML = `
            <img src="${prato.imagem_url}" alt="${prato.nome}">
            <h4>${prato.nome}</h4>
            <p class="descricao">${prato.descricao}</p>
            <p class="preco">R$ ${prato.preco.toFixed(2).replace('.', ',')}</p>
            <button class="btn-adicionar" data-id="${prato.id}">Adicionar</button>
        `;
        
        // 12. Adiciona o card pronto dentro do container no HTML
        listaProdutosDiv.appendChild(card);
    });

    // 13. REPETE O PROCESSO PARA BEBIDAS (Opcional, mas recomendado)
    const tituloBebidas = document.createElement('h3');
    tituloBebidas.textContent = 'Bebidas';
    listaProdutosDiv.appendChild(tituloBebidas);

    cardapio.bebidas.forEach(bebida => {
        const card = document.createElement('div');
        card.className = 'card-produto';
        card.innerHTML = `
            <h4>${bebida.nome}</h4>
            <p class="preco">R$ ${bebida.preco.toFixed(2).replace('.', ',')}</p>
            <button class="btn-adicionar" data-id="${bebida.id}">Adicionar</button>
        `;
        listaProdutosDiv.appendChild(card);
    });
}