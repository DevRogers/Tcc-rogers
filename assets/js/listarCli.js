const URL = "https://despachantemoser.onrender.com/pessoas/";
const URL2 = "https://despachantemoser.onrender.com/veiculos/";
var listaPessoas = [];

// function iniciarTabela() {
//   return `<tr id="linhaPessoa">
//     <th class="cell">Código</th>                    
//     <th class="cell">Nome</th>
//     <th class="cell">Telefone</th>
//     <th class="cell">Cidade</th>
//     <th class="cell">Estado</th>
//     <th class="cell">Placas</th>
//     <th class="cell"></th>
//     <th class="cell"></th>

// </tr>`;
// }

function criarLinhaPessoa(pessoa) {
  return (
    `<tr id="linhaPessoa">
            <td class="cell">` + pessoa.id + `</td>
            <td class="cell"><span class="truncate">` + pessoa.name + `</span></td>
            <td class="cell">` +pessoa.telefone +`</td>
            <td class="cell">` +pessoa.cidade +`</td>
            <td class="cell">` +pessoa.estado +`</td>
            
            <td class="cell"><button class="btn-sm app-btn-secondary placas">Olhar</button></td>
            <th class="cell lapis" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg></th>
          <th class="cell lixeira" data-id="`+pessoa.id+`"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg></th>
            
        </tr>`
  );
}
function adicionarPessoas() {
 
  var tabelaPessoas = document.getElementById("listaPessoas");
  for (let i = 0; i < listaPessoas.length; i++) {
    const pessoa = listaPessoas[i];
    tabelaPessoas.innerHTML += criarLinhaPessoa(pessoa);
  }
  cadastrarEventosLixeira();
  cadastrarEventosLapis();
  
  cadastrarEventosPlaca();

  $('#minhaTabela').DataTable({
    "language": {
          "lengthMenu": "Mostrando _MENU_ registros por página",
          "zeroRecords": "Nenhum Registro encontrado",
          "loadingRecords": "Carregando...",
          "processing": "Processando...",
          "info": "Mostrando página _PAGE_ de _PAGES_",
          "infoEmpty": "Nenhum registro disponível",
          "infoFiltered": "(filtrado de _MAX_ registros no total)",
          "zeroRecords": "Nenhum registro encontrado",
          "search": "Pesquisar",
          "paginate": {
              "next": "Próximo",
              "previous": "Anterior",
              "first": "Primeiro",
              "last": "Último"
            },
          }
  })
  
}
var usuarioId = localStorage.getItem("id");
fetch(URL + usuarioId)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    listaPessoas = data;
    adicionarPessoas();
  })
  .catch(function () {
    console.log("Houve algum problema");
  });

// function atualizarTela(idPessoa) {
//     listaVeiculos=listaVeiculos.filter(p=>p.idPessoa !=idPessoa)
//     var tabelaPessoas=document.getElementById("tabelaPessoas")
//     tabelaPessoas.innerHTML=""
//     adicionarPessoas()
// }

function realizarExclusao(idPessoa) {
  fetch(URL2 + idPessoa)

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.length)
      if (data.length > 0) {
        alert("Essa pessoa possui veículos associados. Exclua os veículos primeiro.");

      } else {
        var header = {
          method: "DELETE",
        };
        fetch(URL + idPessoa, header)
          .then(function (response) {
            return response.text();
          })
          .then(function (data) {
            //atualizarTela(id);
            location.reload();
          })
          .catch(function (error) {
            alert("Erro ao deletar pessoa");
          });
      }
    })
    .catch(function (error) {
      alert("Erro ao verificar veículos associados");
    });
}
function cadastrarEventosLixeira() {
  var lixeiras = document.getElementsByClassName("lixeira");
  for (let i = 0; i < lixeiras.length; i++) {
      const l = lixeiras[i];
      l.addEventListener("click", function(event) {
          var pessoaId = this.dataset.id;
          realizarExclusao(pessoaId);
      });
  }
}


//EDITAR CADASTROS DE PESSOAS
function editarURL(url, pessoaId, name, telefonePessoa, cidadePessoa, estadoPessoa) {
  return (
    url +"?pessoaId=" +pessoaId +"&nomePessoa=" +name +"&telefonePessoa=" +telefonePessoa +"&cidadePessoa=" +cidadePessoa +"&estadoPessoa=" +estadoPessoa
  );
}
function cadastrarEventosLapis() {
  var lapis = document.getElementsByClassName("lapis");
  for (let i = 0; i < lapis.length; i++) {
    const l = lapis[i];
    l.addEventListener("click", function (event) {
      var pessoaId = event.target.parentElement.parentElement.children[0].innerText;
      var nomePessoa = event.target.parentElement.parentElement.children[1].innerText;
      var telefonePessoa =event.target.parentElement.parentElement.children[2].innerText;
      var cidadePessoa =event.target.parentElement.parentElement.children[3].innerText;
      var estadoPessoa =event.target.parentElement.parentElement.children[4].innerText;
      window.location.href = editarURL("gerenCli.html",pessoaId,nomePessoa,telefonePessoa,cidadePessoa,estadoPessoa);
    });
  }
}


function cadastrarEventosPlaca(){
    var placas = document.getElementsByClassName("placas")
    for (let i = 0; i < placas.length; i++) {
        const l = placas[i];
        l.addEventListener("click",function(event){
            var pessoaId = event.target.parentElement.parentElement.children[0].innerText;
            var nomePessoa = event.target.parentElement.parentElement.children[1].innerText;
            var telefonePessoa =event.target.parentElement.parentElement.children[2].innerText;
            var cidadePessoa =event.target.parentElement.parentElement.children[3].innerText;
            var estadoPessoa =event.target.parentElement.parentElement.children[4].innerText;
            window.location.href = editarURL("listarVei.html",pessoaId,nomePessoa,telefonePessoa,cidadePessoa,estadoPessoa);
        })
    }
}