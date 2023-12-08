const URL = "https://despachantemoser.onrender.com/veiculos/";
lerParametros1();
var listaHistorico = [];

function lerParametros1() {
  const urlParams = new URLSearchParams(window.location.search);
  pessoaId = urlParams.get("pessoaId");
  nomePessoa = urlParams.get("nomePessoa");
  telefonePessoa = urlParams.get("telefonePessoa");
  cidadePessoa = urlParams.get("cidadePessoa");
  estadoPessoa = urlParams.get("estadoPessoa");
  document.getElementById("nome").textContent = nomePessoa;
  document.getElementById("telefone").textContent = telefonePessoa;
  document.getElementById("cidade").textContent = cidadePessoa;
  document.getElementById("estado").textContent = estadoPessoa;

}

function iniciarTabela() {
  return `<tr id="linhaVeiculo">
    <th class="cell">Código</th>                    
    <th class="cell">Placa</th>
    <th class="cell">Renavam</th>
    <th class="cell">Modelo</th>
    <th class="cell">Cidade</th>
    <th class="cell">Estado</th>
    <th class="cell"></th>
    <th class="cell"></th>

</tr>`;
}

function criarLinhaVeiculos(veiculo) {
  return (
    `<tr id="linhaVeiculo">
        <td class="cell">` +
    veiculo.id +
    `</td>
        <td class="cell">` +
    veiculo.placa +
    `</td>
        <td class="cell">` +
    veiculo.renavam +
    `</td>
        <td class="cell">` +
    veiculo.modelo +
    `</td>
        <td class="cell">` +
    veiculo.cidade +
    `</td>
        <td class="cell">` +
    veiculo.estado +
    `</td>
        <th class="cell lapis" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg></th>
          <th class="cell lixeira" data-id="`+veiculo.id+`"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg></th>
    </tr> `
  );
}

function adicionarVeiculos() {
  var tabelaVeiculos = document.getElementById("tabelaVeiculos");
  tabelaVeiculos.innerHTML += iniciarTabela();
  for (let i = 0; i < listaHistorico.length; i++) {
    const veiculo = listaHistorico[i];
    tabelaVeiculos.innerHTML += criarLinhaVeiculos(veiculo);
  }
  cadastrarEventosLapis();
  cadastrarEventosLixeira();
}
var usuarioId = localStorage.getItem("id");
fetch(`${URL}${pessoaId}/${usuarioId}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    listaHistorico = data;
    adicionarVeiculos();
  })
  .catch(function () {
    console.log("Houve algum problema!");
  });

var botaoAdicionar = document.getElementById("add");
botaoAdicionar.addEventListener("click", function () {
  window.location.href = "gerenVei.html?pessoaId=" + pessoaId + "&nomePessoa="+nomePessoa+"&telefonePessoa="+telefonePessoa+"&cidadePessoa="+cidadePessoa+"&estadoPessoa="+estadoPessoa;
});

function atualizarTela(id) {
  listaHistorico = listaHistorico.filter((p) => p.id != id);
  var tabelaVeiculos = document.getElementById("tabelaVeiculos");
  tabelaVeiculos.innerHTML = "";
  adicionarVeiculos();
}

function realizarExclusao(id) {
  var header = {
    method: "DELETE",
  };
  fetch(URL + id, header)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      atualizarTela(id);
      // location.reload()
    })
    .catch(function (error) {
      alert("Erro ao deletar veiculo");
    });
}

function cadastrarEventosLixeira() {
  var lixeiras = document.getElementsByClassName("lixeira");
  for (let i = 0; i < lixeiras.length; i++) {
    const l = lixeiras[i];
    l.addEventListener("click", function (event) {
      var id = this.dataset.id;
      realizarExclusao(id);
    });
  }
}

function cadastrarEventosLapis() {
  var lapis = document.getElementsByClassName("lapis");
  for (let i = 0; i < lapis.length; i++) {
    const l = lapis[i];
    l.addEventListener("click", function (event) {
      var id = event.target.parentElement.parentElement.children[0].innerText;
      var placa =event.target.parentElement.parentElement.children[1].innerText;
      var renavam =event.target.parentElement.parentElement.children[2].innerText;
      var modelo =event.target.parentElement.parentElement.children[3].innerText;
      var cidade =event.target.parentElement.parentElement.children[4].innerText;
      var estado =event.target.parentElement.parentElement.children[5].innerText;
      window.location.href = editarURL(
        "gerenVei.html?pessoaId="+pessoaId+"&nomePessoa="+nomePessoa+"&telefonePessoa="+telefonePessoa+"&cidadePessoa="+cidadePessoa+"&estadoPessoa="+estadoPessoa, 
        id,
        placa,
        renavam,
        modelo,
        cidade,
        estado
      );
    });
  }
}

function editarURL(url, id, placa, renavam, modelo, cidade, estado) {
  return (
    url +
    "&id=" +
    id +
    "&placa=" +
    placa +
    "&renavam=" +
    renavam +
    "&modelo=" +
    modelo +
    "&cidade=" +
    cidade +
    "&estado=" +
    estado
  );
}
