let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let totalComprado = parseInt(localStorage.getItem("totalComprado")) || 0;

function atualizarVisibilidadeCarrinho() {
  if (totalComprado > 0) {
    btnCompra.style.display = "flex";      // mostra o botão do carrinho
    contador.textContent = totalComprado;  // atualiza o contador
  } else {
    btnCompra.style.display = "none";      // esconde o botão
    contador.textContent = "";             // limpa contador
  }
}

document.querySelectorAll('.produtos').forEach(produto => {
  const menosBtn = produto.querySelector('.menos');
  const maisBtn = produto.querySelector('.mais');
  const quantidadeSpan = produto.querySelector('.quantidade');

  let quantidade = 0;

  menosBtn.addEventListener('click', () => {
    if (quantidade > 0) {
      quantidade--;
      quantidadeSpan.textContent = quantidade;
    }
  });

  maisBtn.addEventListener('click', () => {
    quantidade++;
    quantidadeSpan.textContent = quantidade;
  });
});

//Modo Escuro
const toggleSwitch = document.getElementById('switch-shadow');

if(localStorage.getItem('dark-mode') === 'enabled'){
  document.body.classList.add('dark-mode');
  toggleSwitch.checked = true;
}

toggleSwitch.addEventListener('change', () => {
  if(toggleSwitch.checked){
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// Animação
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animar');
      observer.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('.animacao').forEach(el => observer.observe(el));

// Ver mais
const verMaisBtn = document.getElementById('ver-mais');
verMaisBtn.addEventListener('click', () => {
  document.querySelectorAll('.produtos.escondido').forEach(produto => {
    produto.classList.remove('escondido');
  });
  verMaisBtn.style.display = 'none';
});

// Carrinho
const produtos = document.querySelectorAll(".produtos");
const btnCompra = document.getElementById("btn-compra");
const contador = document.getElementById("contador-carrinho");

const modal = document.getElementById("modal-carrinho");
const fecharModal = document.getElementById("fechar-modal");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");  

if (totalComprado > 0) {
  contador.textContent = totalComprado;
  btnCompra.style.display = "flex";
}

produtos.forEach(produto => {
  const btnMais = produto.querySelector(".mais");
  const btnMenos = produto.querySelector(".menos");
  const quantidadeSpan = produto.querySelector(".quantidade");
  const sacola = produto.querySelector(".sacola-compras");
  const nome = produto.querySelector(".nome-produto").textContent;
  const precoTexto = produto.querySelector(".preco-produto").textContent;
  const imagem = produto.querySelector("img").src;

  let quantidade = 0;
  let preco = parseFloat(precoTexto.replace("R$ ", "").replace(",", ".")) || 10;

  btnMais.addEventListener("click", () => {
    quantidade++;
    quantidadeSpan.textContent = quantidade;
  });

  btnMenos.addEventListener("click", () => {
    if (quantidade > 0) {
      quantidade--;
      quantidadeSpan.textContent = quantidade;
    }
  });

  sacola.addEventListener("click", () => {
    if (quantidade > 0) {
      const indexExistente = carrinho.findIndex(item => item.nome === nome);

      if (indexExistente !== -1) {
        carrinho[indexExistente].quantidade += quantidade;
      } else {
        carrinho.push({ nome, imagem, quantidade, preco });
      }

      totalComprado += quantidade;

      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      localStorage.setItem("totalComprado", totalComprado);

      quantidade = 0;
      quantidadeSpan.textContent = 0;

      // 👇 Isso garante que a sacolinha apareça com o número atualizado
      btnCompra.style.display = "flex";
      contador.textContent = totalComprado;
    }
  });
});

// Modal
btnCompra.addEventListener("click", () => {
  const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];
  itensCarrinho.innerHTML = "";
  let total = 0;

  carrinhoSalvo.forEach(item => {
  const subtotal = item.quantidade * item.preco;
  total += subtotal;

  const div = document.createElement("div");
  div.classList.add("item-linha");
  div.innerHTML = `
    <div id="ajustar_img_carrinho"> 
      <img src="${item.imagem}" alt="">
    </div>
    <div>
      <p id="ajustar_nome_carrinho"><strong>${item.nome}</strong></p>
      <p id="ajustar_quantidade_carrinho">${item.quantidade} x R$ ${item.preco.toFixed(2)} = <strong>R$ ${subtotal.toFixed(2)}</strong></p>
      <button class="remover-item" data-nome="${item.nome}">❌ Remover</button>
    </div>
  `;
  itensCarrinho.appendChild(div);
});

// Botão de remover produto do carrinho
itensCarrinho.querySelectorAll(".remover-item").forEach(botao => {
  botao.addEventListener("click", () => {
    const nomeItem = botao.dataset.nome;

    // Cria uma cópia atualizada do carrinho:
    let novoCarrinho = [...carrinho];

    // Procura o índice do item a remover
    const index = novoCarrinho.findIndex(item => item.nome === nomeItem);

    if (index !== -1) {
      if (novoCarrinho[index].quantidade > 1) {
        novoCarrinho[index].quantidade -= 1;
      } else {
        novoCarrinho.splice(index, 1);
      }
    }

    carrinho = novoCarrinho;
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Atualiza totalComprado e localStorage
    totalComprado = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    localStorage.setItem("totalComprado", totalComprado);
    contador.textContent = totalComprado;

    atualizarVisibilidadeCarrinho();

    // Fecha e reabre o modal para atualizar a lista
    modal.style.display = "none";
    setTimeout(() => btnCompra.click(), 100);
  });
});

  if (carrinhoSalvo.length > 0) {
    const frete = 9.90;
    totalCarrinho.innerHTML = `
      <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
      <p><strong>Total geral:</strong> R$ ${(total + frete).toFixed(2)}</p>
    `;
  } else {
    totalCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }
  
  const btnFinalizar = document.getElementById("btn-finalizar");

  if (carrinhoSalvo.length > 0) {
    btnFinalizar.textContent = "Continuar";
    btnFinalizar.onclick = null;
    btnFinalizar.setAttribute("href", "#");
    btnFinalizar.style.color = "#ffffff";
    btnFinalizar.style.backgroundColor = "#28a745"; // verde
  } else {
    btnFinalizar.textContent = "Voltar";
    btnFinalizar.removeAttribute("href");
    btnFinalizar.onclick = () => {
      modal.style.display = "none";
    };
    btnFinalizar.style.color = "#ffffff";
    btnFinalizar.style.backgroundColor = "#dc3545"; // vermelho
  }

  modal.style.display = "block";
});

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
  

const toggle = document.getElementById("switch-shadow");

toggle.addEventListener("change", () => {
  const isDark = toggle.checked;

  document.body.classList.toggle("dark-mode", isDark);

  const logoNavbar = document.querySelector("#logo-header img");
  const logoFooter = document.querySelector("#logo-footer img");
  const logoIntro = document.querySelector(".intro img");

  const logoSrc = isDark ? "imagens/logo_dark-mode.png" : "imagens/logo.png";

  if (logoNavbar) logoNavbar.src = logoSrc;
  if (logoFooter) logoFooter.src = logoSrc;
  if (logoIntro) logoIntro.src = logoSrc;

  [logoIntro, logoNavbar, logoFooter].forEach((logo) => {
    if (!logo) return;

    // Adiciona fade-out
    logo.classList.add("fade-out");

    // Espera o fade-out terminar (300ms), troca a imagem e dá fade-in
    setTimeout(() => {
      logo.src = logoSrc;
      logo.classList.remove("fade-out");
    }, 300);
  });
});

const btnMeuCarrinhoMenu = document.querySelector("#btn_meu_carrinho_nav button");

btnMeuCarrinhoMenu.addEventListener("click", () => {
  btnCompra.click(); 
});


// Mostra as categorias de opções (rações, acessórios e medicamentos) 
// Mostra as categorias de opções (rações, acessórios e medicamentos) 
function mostrarProdutosPorCategoria(categoriaSelecionada) {
    const todosProdutos = document.querySelectorAll(".produtos");

    todosProdutos.forEach(produto => {
      const categoria = produto.dataset.categoria;
      if (categoria === categoriaSelecionada) {
        produto.style.display = "flex"; // ou "block", conforme seu CSS
      } else {
        produto.style.display = "none";
      }
    });
  }

  // Escuta mudanças nos inputs radio
  document.querySelectorAll('input[name="tipo"]').forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) {
        mostrarProdutosPorCategoria(input.id);
      }
    });
  });

  // Exibe "Rações" por padrão ao carregar a página
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("racoes").checked = true;
    mostrarProdutosPorCategoria("racoes");
  });



atualizarVisibilidadeCarrinho();