const URL = "https://despachantemoser.onrender.com/historicos/";
const URL1 = "https://despachantemoser.onrender.com/historicos/total/";
const URL_USER = "https://despachantemoser.onrender.com/user/"

enviaGET(localStorage.getItem('id'))

function enviaGET( id ){
    var header = {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "token":localStorage.getItem('token')
        }
    }
    var status = 0
    fetch(URL_USER+id,header)
        .then(function(response) {
            status = response.status
            return response.json()
    }).then(function(data){
        if (status == 400  || status === 401 || status === 404) {
            var dadosUsuarios = document.getElementById("teste")
            dadosUsuarios.innerHTML = 'Acesso Negado'
            dadosUsuarios.style.color = "red"
            editarDados.style.display = "none";
        }else if(status == 200 ) {

            var dadosUsuarios = document.getElementById("teste")
            var dadosUsuarios2 = document.getElementById("email")
            dadosUsuarios.innerHTML = ''
            dadosUsuarios.innerHTML += `<h3 class="mb-3">Bem Vindo, `+ data.name +`</h3>`
            dadosUsuarios2.innerHTML += `<div>Email do usuário: `+data.email+`</div>`
            localStorage.setItem('nome', data.name)
            localStorage.setItem('email', data.email)
        }
    }).catch(function(err) {
        console.log(err);
    });
}
var editarDados = document.getElementById("editarDados")
editarDados.addEventListener("click", function(){
window.location.href = 'editarDados.html'
})

var usuarioId = localStorage.getItem("id")
fetch(URL1 + usuarioId)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const totalCount = data.length;
    var divCad = document.getElementById("totalCadastro")
    divCad.innerText = totalCount;
  })
  .catch(error => {
    console.error("Erro ao buscar históricos:", error);
  });
  
  function calcularEExibirValor(historicos) {
    let entrada = 0;
    let saida = 0;
  
    historicos.forEach((item) => {
      const historicosHTML = historicos.map((item) => criarLinhaHistorico(item)).join("");
  
      // Suponha que 'tabelaHistorico' é o elemento HTML onde você deseja adicionar as linhas
      const tabelaHistorico = document.getElementById("listaHistorico");
      tabelaHistorico.innerHTML = historicosHTML;
  
      const valor = parseFloat(item.valor);
      const tipo = item.tipo;
  
      if (tipo === "Entrada") {
        entrada += valor;
      } else {
        saida += valor;
      }
    });
  
    const total = entrada - saida;
  
    const divTotalValue = document.getElementById("total");
    divTotalValue.textContent = formatCurrency(total);
  
    const divEntradaValue = document.getElementById("entrada");
    divEntradaValue.textContent = formatCurrency(entrada);
  
    const divSaidaValue = document.getElementById("saida");
    divSaidaValue.textContent = formatCurrency(Math.abs(saida));
  }
  
function formatCurrency(value) {
  return (
    "R$ " +
    value
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
  );
}

window.addEventListener("DOMContentLoaded", atualizarListaHistorico);
async function obterDadosDoServidor() {
  try {
    const response = await fetch(URL+usuarioId);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados do servidor.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do servidor:", error.message);
    return [];
  }
}
async function atualizarListaHistorico() {
  try {
    const dadosDoServidor = await obterDadosDoServidor();
    const historicosMaisRecentes = dadosDoServidor // Limita a 7 itens
    listaHistorico = historicosMaisRecentes;
    calcularEExibirValor(historicosMaisRecentes); // Passa a lista limitada
  } catch (error) {
    // Tratar erros ao atualizar a lista
    console.error("Erro ao atualizar a lista de históricos:", error.message);
  }
}

function criarLinhaHistorico(historicos) {
  const seta =
    historicos.tipo === "Entrada"
      ? '<img src="assets/images/setVerde.png" class="seta" alt="Entrada">'
      : '<img src="assets/images/setVermelha.png" class="seta" alt="Saída">';

  return (
    `<tr id="linhaHistorico">
      <td>
          <div>` + historicos.nome +`</div>
      </td>
      <td class="stat-cell">` +historicos.placa +`</td>
      <td class="stat-cell">
          `+historicos.tipo+` `+seta+`
      </td>
      <td class="stat-cell">R$`+historicos.valor+`</td>
  </tr>
          </tr>`
  );
}