// 1. Espera o DOM estar pronto antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Chama a função para carregar e exibir os itens do carrinho
    exibirItensCarrinho();

    // 3. Configura o "ouvinte" para o formulário
    configurarFormulario();
});

/**
 * Função principal para ler o localStorage e exibir na tela
 */
function exibirItensCarrinho() {
    // 4. Busca o carrinho salvo no localStorage
    const carrinhoAtual = JSON.parse(localStorage.getItem('grillMarmitexCart')) || [];
    
    // 5. Encontra os containers no HTML
    const listaCarrinhoDiv = document.getElementById('lista-carrinho');
    const valorTotalSpan = document.getElementById('valor-total');
    
    // 6. Limpa o container
    listaCarrinhoDiv.innerHTML = '';

    let total = 0;

    // 7. Verifica se o carrinho está vazio
    if (carrinhoAtual.length === 0) {
        listaCarrinhoDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
        valorTotalSpan.textContent = '0,00';
        return; // Para a execução da função aqui
    }

    // 8. Se tiver itens, faz um loop (forEach) e cria o HTML
    carrinhoAtual.forEach(item => {
        // 9. Cria o elemento HTML para cada item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-carrinho'; // Classe para estilizar
        itemDiv.innerHTML = `
            <h4>${item.nome}</h4>
            <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
        `;
        
        // 10. Adiciona o item na tela
        listaCarrinhoDiv.appendChild(itemDiv);

        // 11. Soma o preço do item ao total
        total += item.preco;
    });

    // 12. Atualiza o valor total na tela
    valorTotalSpan.textContent = total.toFixed(2).replace('.', ',');
}

/**
 * --- NOVO ---
 * Configura a validação e envio do formulário
 */
function configurarFormulario() {
    const form = document.getElementById('form-checkout');
    
    // 13. Ouve o evento "submit" (envio) do formulário
    form.addEventListener('submit', (event) => {
        // 14. Previne o comportamento padrão do HTML (que é recarregar a página)
        event.preventDefault(); 
        
        // 15. Validação de Formulário (usando sua skill de JS)
        const nome = document.getElementById('nome').value;
        const endereco = document.getElementById('endereco').value;

        if (nome === '' || endereco === '') {
            alert('Por favor, preencha seu nome e endereço.');
            return; // Para o envio se a validação falhar
        }

        // 16. Se a validação passar, montamos a mensagem do WhatsApp
        enviarPedidoWhatsApp(nome, endereco);
    });
}

/**
 * --- NOVO ---
 * Monta a mensagem e redireciona para o WhatsApp
 */
function enviarPedidoWhatsApp(nome, endereco) {
    const carrinhoAtual = JSON.parse(localStorage.getItem('grillMarmitexCart')) || [];
    let total = 0;
    
    // Cria a lista de itens para a mensagem
    let mensagemPedido = 'Olá Grill Marmitex, gostaria de fazer o seguinte pedido:\n\n';
    
    carrinhoAtual.forEach(item => {
        mensagemPedido += `- ${item.nome} (R$ ${item.preco.toFixed(2).replace('.', ',')})\n`;
        total += item.preco;
    });

    mensagemPedido += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    mensagemPedido += `*Dados de Entrega:*\n`;
    mensagemPedido += `Nome: ${nome}\n`;
    mensagemPedido += `Endereço: ${endereco}`;

    // 17. Substitua este número pelo número do WhatsApp da marmitaria
    const numeroWhatsApp = '5519999999999'; 

    // 18. Codifica a mensagem para uma URL
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemPedido)}`;

    // 19. Limpa o carrinho (localStorage) após o pedido ser feito
    localStorage.removeItem('grillMarmitexCart');

    // 20. Redireciona o usuário para o WhatsApp
    window.location.href = linkWhatsApp;
}