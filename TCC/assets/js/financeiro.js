const URL2 = "http://localhost:3005/pessoas/";
const URL3 = "http://localhost:3005/veiculos/";
var pessoasData = {};
var veiculosData = {};
var usuarioId = localStorage.getItem("id");
// lendo dados URL2
lerPessoas();

function lerPessoas() {
  fetch(URL2 + usuarioId)
    .then(response => response.json())
    .then(data => {
      data.forEach(pessoa => {
        pessoasData[pessoa.name] = { id: pessoa.id, veiculos: [] };
        console.log(pessoasData)
      });
      lerVeiculos();
    })
    .catch(error => {
      console.error("Error fetching data from URL2:", error);
    });
}
//lendo dados URL3
function lerVeiculos() {
  fetch(URL3 + usuarioId)
    .then(response => response.json())
    .then(data => {
      data.forEach(veiculo => {
        const pessoaId = veiculo.pessoaId;  
        const pessoaNome = Object.keys(pessoasData).find(
          name => pessoasData[name].id === pessoaId
        );

        if (pessoaNome) {
          pessoasData[pessoaNome].veiculos.push({
            id: veiculo.id,
            placa: veiculo.placa,
            modelo: veiculo.modelo,
          });
        }
      });
      populatePlacasSelect();
    })
    .catch(error => {
      console.error("Error fetching data from URL3:", error);
    });
}
//Pesquisando Placa por pessoa
function populatePlacasSelect() {
  const nomeInput = document.getElementById("nome");
  const placaSelect = document.getElementById("placa");
  const veiculoInput = document.getElementById("veiculo");
  const selectedName = nomeInput.value.trim();

  placaSelect.innerHTML = "";
  veiculoInput.value = "";

  const defaultOption = document.createElement("option");
  defaultOption.text = "Selecione";
  placaSelect.add(defaultOption);

  const person = pessoasData[selectedName];
  if (person && person.veiculos.length > 0) {
    person.veiculos.forEach(veiculo => {
      const option = document.createElement("option");
      option.text = veiculo.placa;
      placaSelect.add(option);
    });
      const modelos = person.veiculos.map(veiculo => veiculo.modelo);
      veiculoInput.value = modelos.join(", "); // Preenche o input com os modelos separados por vírgula
  } else {
    const option = document.createElement("option");
    option.text = "Sem Placa";
    placaSelect.add(option);
  }
}
const nomeInput = document.getElementById("nome");
nomeInput.addEventListener("input", populatePlacasSelect);

const placaSelect = document.getElementById("placa");
placaSelect.addEventListener("change", function() {
  const selectedPlaca = placaSelect.value;
  const veiculoInput = document.getElementById("veiculo");

  const person = pessoasData[nomeInput.value.trim()];

  if (person && person.veiculos.length > 0) {
    const selectedVeiculo = person.veiculos.find(veiculo => veiculo.placa === selectedPlaca);
    if (selectedVeiculo) {
      veiculoInput.value = selectedVeiculo.modelo; // Preenche o campo de input do veiculo com o modelo correspondente
    } else {
      veiculoInput.value = "Sem Veiculo"; // Limpa o campo de input do veiculo se não houver modelo correspondente
    }
  } else {
    veiculoInput.value = "Sem Veiculo"; // Limpa o campo de input do veiculo se não houver veículos associados à pessoa selecionada
  }
});
//fim pesquisa placa por pessoa

//Inicio sistema financeiro
const URL = "http://localhost:3005/historicos/";
idHistorico = null;

var botaoAdicionar = document.getElementById("btnNew")
botaoAdicionar.addEventListener("click", function(){
  var id = guardarId;
    var name = document.getElementById("nome").value
    var valor = document.getElementById("valor").value
    var descricao = document.getElementById("descri").value
    var data = document.getElementById("data").value
    var veiculo = document.getElementById("veiculo").value
    var placa = document.getElementById("placa").value
    var tipo = document.getElementById("tipo").value
    
    if(tipo == "Entrada"){
         entrada = document.getElementById("valor").value
    }else{
        saida=document.getElementById("valor").value
    }
    

    if( id != null ){
      if (tipo === "Entrada") {
        saida = 0;
    } else {
        entrada = 0;
    }
        enviaPUT(id, name, valor, descricao, data, veiculo, placa, tipo, entrada, saida, usuarioId)
        location.reload()
    }else{
        enviaPOST(name, valor, descricao, data, veiculo, placa, tipo, entrada, saida, usuarioId)
        // location.reload();
  }
    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("descri").value = "";
    document.getElementById("data").value = "";
    document.getElementById("veiculo").value = "";
    document.getElementById("placa").value = "";
    document.getElementById("tipo").value = "";
})

function enviaPOST(nome, valor, descricao, data, veiculo, placa, tipo, entrada, saida, usuarioId) {
  var header = {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
        nome:nome,
        valor:valor,
        descricao:descricao,
        data:data,
        veiculo:veiculo,
        placa:placa,
        tipo:tipo,
        entrada:entrada,
        saida:saida,
        usuarioId:usuarioId
    })
}
  fetch(URL, header)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      listaHistorico.push(data); // Add the new data to the list
      adicionarHistorico(); // Update the table with the new data
      calcularEExibirValor(); // Recalculate and display the values
      setTimeout(function() {
        location.reload();
    }, 300);
    })
    .catch(function (error) {
      alert("Erro: " + error.message);
    });
}

function enviaPUT(id, nome, valor, descricao, data, veiculo, placa, tipo, entrada, saida, usuarioId) {
  var header = {
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      nome:nome,
      valor:valor,
      descricao:descricao,
      data:data,
      veiculo:veiculo,
      placa:placa,
      tipo:tipo,
      entrada:entrada,
      saida:saida,
      usuarioId:usuarioId
    })
}
  fetch(URL + id, header)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      const index = listaHistorico.findIndex((item) => item.id === id);
      if (index !== -1) {
        listaHistorico[index] = data;
        adicionarHistorico();
        calcularEExibirValor(); // Recalculate and display the values
        handleDataChange();
      }
    })
    .catch(function (error) {
      console.log("erro merda")
    });
}

var listaHistorico = [];
function criarLinhaHistorico(historicos){
  const formattedDate = formatDate(historicos.data);
  const seta = historicos.tipo === 'Entrada' ? '<img src="assets/images/setVerde.png" class="seta" alt="Entrada">' : '<img src="assets/images/setVermelha.png" class="seta" alt="Saída">';

  return (
    `<tr id="linhaHistorico">
            <td class="cell">` +historicos.nome + `</td>
            <td class="cell">` +historicos.valor + `</td>
            <td class="cell">` +historicos.descricao +`</td>
            <td class="cell">`+formattedDate+`</td>
            <td class="cell">` +historicos.veiculo +`</td>
            <td class="cell">` +historicos.placa +`</td>
            <td class="cell">` +historicos.tipo + seta + `</td>
            
            <th class="cell lapis" data-id="`+historicos.id+`" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg></th>
          <th class="cell lixeira" data-id="`+historicos.id+`"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg></th>
        </tr>`
  );
}

function iniciarTabela(){
  return `<tr>
  <th class="cell">Nome/Serviço</th>
  <th class="cell">Valor</th>
  <th class="cell">Descrição</th>
  <th class="cell">Data</th>
  <th class="cell">Veículo</th>
  <th class="cell">Placa</th>
  <th class="cell">Tipo</th>
  <th class="cell"></th>
  <th class="cell"></th>
</tr>`;
}
// Inicialize a variável total como 0 no início do código
var total = 0;
var entrada = 0;
var saida = 0;

// Função auxiliar para formatar o valor no formato de moeda brasileira
function formatCurrency(value) {
  return "R$ " + value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

function calcularEExibirValor() {
  entrada = 0;
  saida = 0;

  for (let i = 0; i < listaHistorico.length; i++) {
    const historico = listaHistorico[i];
    const valor = parseFloat(historico.valor);
  
    const a = historico.tipo;
    if (a === "Entrada") {
      entrada += valor;
    } else {
      saida += valor;
    }
  }
  
  total = entrada - saida;
  
  const divTotalValue = document.getElementById("totalValue");
  divTotalValue.textContent = formatCurrency(total);

  const divEntradaValue = document.getElementById("incomesValue");
  divEntradaValue.textContent = formatCurrency(entrada);
  
  const divSaidaValue = document.getElementById("expensesValue");
  divSaidaValue.textContent = formatCurrency(Math.abs(saida));
}

async function atualizarListaHistorico() {
  try {
    const dadosDoServidor = await obterDadosDoServidor();
    listaHistorico = dadosDoServidor;
    calcularEExibirValor();
  } catch (error) {
    console.error('Erro ao atualizar a lista de históricos:', error.message);
  }
}

// Chame a função para atualizar a lista de históricos ao carregar a página
window.addEventListener('DOMContentLoaded', atualizarListaHistorico);
async function obterDadosDoServidor() {
  try {
    const response = await fetch(URL + usuarioId);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do servidor.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do servidor:', error.message);
    return [];
  }
}
function formatDate(dateString) {
  const date = new Date(dateString);  
  return date.toLocaleDateString("pt-BR");
}

function adicionarHistorico() {
  
  var tabelaHistorico = document.getElementById("tabelaHistorico");
  tabelaHistorico.innerHTML = "";
  tabelaHistorico.innerHTML += iniciarTabela();
  
  for (let i = 0; i < listaHistorico.length; i++) {
    const historico = listaHistorico[i];
    tabelaHistorico.innerHTML += criarLinhaHistorico(historico);
  }
  cadastrarEventosLapis();
  cadastrarEventosLixeira();
}

fetch(URL + usuarioId).then(function(response) {
  return response.json();
}).then(function(data) {
  listaHistorico = data
  adicionarHistorico()
}).catch(function() {
  console.log("Houve algum problema!");
});


function formatDateForInput(dateString) {
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateString;
}
var guardarId = null;
function cadastrarEventosLapis() {
  var lapis = document.getElementsByClassName("lapis");
  for (let i = 0; i < lapis.length; i++) {
    const l = lapis[i];
    l.addEventListener("click", function (event) {
      guardarId= this.dataset.id
      var name = event.target.parentElement.parentElement.children[0].innerText;
      var valor =event.target.parentElement.parentElement.children[1].innerText;
      var descricao =event.target.parentElement.parentElement.children[2].innerText;
      var data =event.target.parentElement.parentElement.children[3].innerText;
      var veiculo =event.target.parentElement.parentElement.children[4].innerText;
      var tipo =event.target.parentElement.parentElement.children[5].innerText;
      

      document.getElementById("nome").value = name;
      selectedName = name;
      document.getElementById("valor").value = valor;
      document.getElementById("descri").value = descricao;
      document.getElementById("data").value = formatDateForInput(data);
      document.getElementById("veiculo").value = veiculo;
      populatePlacasSelect();
      document.getElementById("tipo").value = tipo;
    });
  }
}
function atualizarTela(id) {
  listaHistorico = listaHistorico.filter((p) => p.id != id);
  var tabelaHistorico = document.getElementById("tabelaHistorico");
  tabelaHistorico.innerHTML = "";
  adicionarHistorico();
}
function cadastrarEventosLixeira() {
  var lixeiras = document.getElementsByClassName("lixeira");
  for (let i = 0; i < lixeiras.length; i++) {
      const l = lixeiras[i];
      l.addEventListener("click", function(event) {
          var id = this.dataset.id;
          realizarExclusao(id);
      });
  }
}

function realizarExclusao(id){
  var header = {
      method:"DELETE"
  }
  fetch(URL+id,header)
  .then(function(response){
      return response.text()
  }).then(function(data){
    atualizarTela(id);
    recalcularValores();
    atualizarValoresNoHTML();
    location.reload();
  }).catch(function(error){
      alert("Erro ao deletar histórico")
  })
}
function recalcularValores() {
  entrada = 0;
  saida = 0;

  for (let i = 0; i < listaHistorico.length; i++) {
    const historico = listaHistorico[i];
    const valor = parseFloat(historico.valor);

    if (historico.tipo === "Entrada") {
      entrada += valor;
    } else {
      saida += valor;
    }
  }

  total = entrada - saida;
}
function atualizarValoresNoHTML() {
  const divTotalValue = document.getElementById("totalValue");
  const divEntradaValue = document.getElementById("incomesValue");
  const divSaidaValue = document.getElementById("expensesValue");

  divTotalValue.textContent = formatCurrency(total);
  divEntradaValue.textContent = formatCurrency(entrada);
  divSaidaValue.textContent = formatCurrency(Math.abs(saida));
}

//Fim sistema Financeiro

async function fetchData() {
  try {
    const response = await fetch(URL + usuarioId);
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();

    // Certifique-se de que data é um array
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}


  async function createChart() {
    const data = await fetchData();
  
    // Transforme o monthlyData em um array de objetos
    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item.data);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
  
      const existingEntry = acc.find(entry => entry.date === monthYear);
  
      if (!existingEntry) {
        acc.push({ date: monthYear, income: 0, expense: 0 });
      }
  
      if (item.tipo === "Entrada") {
        existingEntry ? (existingEntry.income += parseFloat(item.valor)) : (acc[acc.length - 1].income += parseFloat(item.valor));
      } else {
        existingEntry ? (existingEntry.expense += parseFloat(item.valor)) : (acc[acc.length - 1].expense += parseFloat(item.valor));
      }
  
      return acc;
    }, []);
  
    // Ordene o array com base na data
    monthlyData.sort((a, b) => {
      const [aMonth, aYear] = a.date.split('/').map(Number);
      const [bMonth, bYear] = b.date.split('/').map(Number);
  
      if (aYear === bYear) {
        return aMonth - bMonth;
      } else {
        return aYear - bYear;
      }
    });
  
    const labels = monthlyData.map(entry => entry.date);
    const incomeData = monthlyData.map(entry => entry.income);
    const expenseData = monthlyData.map(entry => entry.expense);

  const ctx = document.getElementById("financialChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Entradas",
          data: incomeData,
          backgroundColor: "rgba(54, 162, 235, 0.8)", // Cor das barras
        hoverBackgroundColor: "rgba(54, 162, 235, 1)", // Cor ao passar o mouse
        borderWidth: 0,
        borderRadius: 10, // Cantos arredondados das barras
        categoryPercentage: 0.8, // Espaçamento entre as barras
        shadowOffsetX: 2, // Sombreamento suave
        shadowOffsetY: 2,
        shadowBlur: 5,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        dataLabels: {
          align: "center",
          anchor: "center",
          font: {
            size: 14,
            weight: "bold",
          },
        }
        },
        {
          label: "Saídas",
          data: expenseData,
          backgroundColor: "rgba(255, 65, 65, 0.8)", // Cor das barras
        hoverBackgroundColor: "rgba(245, 0, 0, 0.8)", // Cor ao passar o mouse
        borderWidth: 0,
        borderRadius: 10, // Cantos arredondados das barras
        categoryPercentage: 0.8, // Espaçamento entre as barras
        shadowOffsetX: 2, // Sombreamento suave
        shadowOffsetY: 2,
        shadowBlur: 5,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        dataLabels: {
          align: "center",
          anchor: "center",
          font: {
            size: 14,
            weight: "bold",
          },
        }
      }
      ]
    },
    options: {
      responsive:true,
      plugins: {
        title: {
          display: true,
          text: "Gráfico de Entradas e Saídas Mensais",
          font: {
            size: 16,
            weight: "bold"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            const income = tooltipItem.datasetIndex === 0;
            const value = tooltipItem.formattedValue;
            const label = income ? "Income" : "Expense";
            return `${label}: R$ ${value}`;
          }
        }
      }
    }
  });
}
createChart();


const scrollToBottomButton = document.getElementById("scrollToBottomButton");

// Adicione um evento de clique ao botão
scrollToBottomButton.addEventListener("click", () => {
  // Encontre o elemento do final da página (pode ser o rodapé ou qualquer outro elemento)
  const endOfPageElement = document.getElementById("financialChart"); // Substitua "footer" pelo ID do elemento final

  // Role a página até o final
  endOfPageElement.scrollIntoView({ behavior: "smooth" }); // A opção "smooth" fornece uma animação suave
});
// Adicione um evento de clique ao botão "Criar Relatório"
const createReportButton = document.getElementById("createReportButton");
createReportButton.addEventListener("click", () => {
  const reportContainer = document.getElementById("reportContainer");

  // Obtenha os dados do servidor novamente para garantir que você tenha os dados mais atualizados
  fetchData().then(data => {
    // ... (código para criar o relatório)
    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item.data);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }

      acc[monthYear].push(item);

      return acc;
    }, {});

    // Crie o relatório em formato de texto ou HTML
    const reportHTML = Object.keys(monthlyData)
      .map(monthYear => {
        const monthData = monthlyData[monthYear];
        const monthTotal = monthData.reduce((total, item) => {
          const value = parseFloat(item.valor);
          return item.tipo === "Entrada" ? total + value : total - value;
        }, 0);

        return `
          <div class="report-month">
            <h2>Mês: ${monthYear}</h2>
            <table>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
              ${monthData
                .map(item => {
                  const tipo = item.tipo === "Entrada" ? "Entrada" : "Saída";
                  return `
                    <tr>
                      <td>${item.nome}</td>
                      <td>R$ ${item.valor}</td>
                      <td>${tipo}</td>
                    </tr>
                  `;
                })
                .join("")}
            </table>
            <p>Total do mês: R$ ${monthTotal.toFixed(2)}</p>
          </div>
        `;
      })
      .join("");

    // Exiba o relatório no elemento "reportContainer"
    reportContainer.innerHTML = reportHTML;

    // Exiba o botão "Imprimir Relatório" e oculte o botão "Criar Relatório"
    const printReportButton = document.getElementById("printReportButton");
    const createReportButton = document.getElementById("createReportButton");
    printReportButton.style.display = "block";
    createReportButton.style.display = "none";

    // Exibir um alert com a opção de imprimir
    const shouldPrint = confirm("Relatório criado com sucesso! Deseja imprimir o relatório?");
    if (shouldPrint) {
      // Abra uma nova janela do navegador com o conteúdo do relatório
      const newWindow = window.open("", "_blank");
      newWindow.document.write(`<html><link id="theme-style" rel="stylesheet" href="assets/css/financeiro.css"><head><title>Relatório Mensal</title></head><body>${reportContainer.innerHTML}</body></html>`);
      newWindow.document.close();

      // Aguarde um momento para garantir que o conteúdo seja carregado na nova janela
      setTimeout(() => {
        // Chame a função de impressão da nova janela
        newWindow.print();
      }, 500);
    }
  });
});

// Adicione um evento de clique ao botão "Imprimir Relatório"
const printReportButton = document.getElementById("printReportButton");
printReportButton.addEventListener("click", () => {
  // Abra uma nova janela do navegador com o conteúdo do relatório
  const reportContainer = document.getElementById("reportContainer").innerHTML;
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`<html><head><title>Relatório Mensal</title><link id="theme-style" rel="stylesheet" href="assets/css/financeiro.css"></head><body>${reportContainer}</body></html>`);
  newWindow.document.close();

  // Aguarde um momento para garantir que o conteúdo seja carregado na nova janela
  setTimeout(() => {
    // Chame a função de impressão da nova janela
    newWindow.print();
  }, 500);
});

