const listaProdutos = document.querySelector('#produtos');
const formularioAdicionarProduto = document.querySelector('#formulario-adicionar-produto');
const formularioAtualizarProduto = document.querySelector('#formulario-atualizar-produto');
const atualizarIdProduto = document.querySelector('#atualizar-id');
const atualizarNomeProduto = document.querySelector('#atualizar-nome');
const atualizarPrecoProduto = document.querySelector('#atualizar-preco');

async function buscarProdutos() {
  const resposta = await fetch('http://18.230.194.98:3000/produtos');
  const produtos = await resposta.json();

  // Limpar lista de produtos
  listaProdutos.innerHTML = '';

  // Adicionar cada produto à lista
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.style.whiteSpace = 'pre-wrap';
    li.innerHTML = `${produto.nome} : <strong>R$${produto.preco}</strong>`;

    // Adicionar botão de deletar para cada produto
    const botaoDeletar = document.createElement('button');
    botaoDeletar.innerHTML = 'Deletar';
    botaoDeletar.addEventListener('click', async () => {
      await deletarProduto(produto.id);
      await buscarProdutos();
    });
    li.appendChild(botaoDeletar);

    // Adicionar botão de atualizar para cada produto
    const botaoAtualizar = document.createElement('button');
    botaoAtualizar.innerHTML = 'Atualizar';
    botaoAtualizar.addEventListener('click', () => {
      atualizarIdProduto.value = produto.id;
      atualizarNomeProduto.value = produto.nome;
      atualizarPrecoProduto.value = produto.preco;
    });
    li.appendChild(botaoAtualizar);

    listaProdutos.appendChild(li);
  });

  formularioAtualizarProduto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = parseInt(atualizarIdProduto.value);
    const nome = atualizarNomeProduto.value;
    const preco = parseFloat(atualizarPrecoProduto.value);
    const dadosAtualizacao = { nome: nome, preco: preco };

    await atualizarProduto(id, dadosAtualizacao);
    await buscarProdutos();
  });
}

// Event listener para o botão de envio do formulário de adicionar produto
formularioAdicionarProduto.addEventListener('submit', async event => {
  event.preventDefault();
  const nome = formularioAdicionarProduto.elements['nome'].value;
  const preco = formularioAdicionarProduto.elements['preco'].value;
  await adicionarProduto(nome, preco);
  formularioAdicionarProduto.reset();
  await buscarProdutos();
});

// Função para adicionar um novo produto
async function adicionarProduto(nome, preco) {
  const resposta = await fetch('http://18.230.194.98:3000/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, preco })
  });
  window.location.reload();
  return resposta.json();
}

// Função para deletar um produto
async function deletarProduto(id) {
  const resposta = await fetch('http://18.230.194.98:3000/produtos/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  window.location.reload();
  return resposta.json();
}

// Função para atualizar um produto
async function atualizarProduto(id, dados) {
  try {
    const resposta = await fetch('http://18.230.194.98:3000/produtos/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) {
      throw new Error('Erro ao atualizar produto.');
    }

    const resultado = await resposta.json();
    console.log(resultado); // Pode ser útil verificar a resposta do servidor

    window.location.reload();
    return resultado;
  } catch (erro) {
    console.error('Erro durante a atualização:', erro.message);
  }
}

// Buscar todos os produtos ao carregar a página
buscarProdutos();
