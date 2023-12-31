const URL = "http://localhost:3005/historico/";
const URL1 = "http://localhost:3005/historico/total/";
const URL_USER = "https://localhost:3004/user/"

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

var idUsuario = localStorage.getItem("id")
fetch(URL1 + idUsuario)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const totalCount = data[0]['count(id)'];
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
    const response = await fetch(URL+idUsuario);
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

function criarLinhaHistorico(historico) {
  const seta =
    historico.tipo === "Entrada"
      ? '<img src="assets/images/setVerde.png" class="seta" alt="Entrada">'
      : '<img src="assets/images/setVermelha.png" class="seta" alt="Saída">';

  return (
    `<tr id="linhaHistorico">
      <td>
          <div>` + historico.nome +`</div>
      </td>
      <td class="stat-cell">` +historico.placa +`</td>
      <td class="stat-cell">
          `+historico.tipo+` `+seta+`
      </td>
      <td class="stat-cell">R$`+historico.valor+`</td>
  </tr>
          </tr>`
  );
}