const URL = "http://localhost:3005/pessoas/"

var idPessoa = null
lerParametros()

function lerParametros(){
    const urlParams = new URLSearchParams(window.location.search);
    idPessoa = urlParams.get("idPessoa")
    if( idPessoa != null) {
        var nomePessoa = urlParams.get("nomePessoa")
        var telefonePessoa = urlParams.get("telefonePessoa")
        var cidadePessoa = urlParams.get("cidadePessoa")
        var estadoPessoa = urlParams.get("estadoPessoa")

    
        //telefonePessoa = telefonePessoa.replace(/\s+/g, '').replace(/-/g, '');
        //telefonePessoa = telefonePessoa.replace(" ", '');
        document.getElementById("inputName").value = nomePessoa
    
        document.getElementById("inputTelefone").value = telefonePessoa
        
        document.getElementById("inputEstado").value = estadoPessoa
        carregarCidades(estadoPessoa)
        setTimeout(function() {
            document.getElementById("inputCity").value = cidadePessoa   
        }, 500);
    }
    
}

function carregarCidades(estadoPessoa){
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoPessoa}/municipios`)
        .then(response => response.json())
        .then(cidades => {
            inputCidade.innerHTML = '<option value=""></option>'; // Limpar e adicionar opção vazia
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                inputCidade.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

var botaoAdicionar = document.getElementById("botaoAdicionar")
botaoAdicionar.addEventListener("click", function(){
    var nomePessoa = document.getElementById("inputName").value
    var TelefonePessoa = document.getElementById("inputTelefone").value
    var cidadePessoa = document.getElementById("inputCity").value
    var estadoPessoa = document.getElementById("inputEstado").value
    var idUsuario = localStorage.getItem("id")
    if( idPessoa != null ){
        enviaPUT(idPessoa, nomePessoa, TelefonePessoa, cidadePessoa, estadoPessoa, idUsuario)
    }else{
        enviaPOST( nomePessoa, TelefonePessoa, cidadePessoa, estadoPessoa, idUsuario)
    } 
})

function enviaPOST( nomePessoa, TelefonePessoa, cidadePessoa, estadoPessoa, idUsuario ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            nome:nomePessoa,
            telefone: TelefonePessoa,
            cidade: cidadePessoa,
            estado:estadoPessoa,
            idUsuario: idUsuario
        })
    }
    fetch(URL,header)
    .then(function(response){
        return response.json()
    }).then(function(data){
        window.location.href = 'listarCli.html';
    }).catch(function(){
        alert("Erro")
    })
}
function enviaPUT( id,nomePessoa, TelefonePessoa, cidadePessoa, estadoPessoa, idUsuario){
    var header = {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            nome:nomePessoa,
            telefone: TelefonePessoa,
            cidade: cidadePessoa,
            estado:estadoPessoa,
            idUsuario: idUsuario
        })
    }
    fetch(URL+id,header)
    .then(function(response){
        return response.json()
    }).then(function(data){
        window.location.href = 'listarCli.html';
    }).catch(function(){
        alert("Erra")
    })
}

const inputEstado = document.getElementById('inputEstado');
const inputCidade = document.getElementById('inputCity');

inputEstado.addEventListener('change', () => {
    const estado = inputEstado.value;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then(response => response.json())
        .then(cidades => {
            inputCidade.innerHTML = '<option value=""></option>'; // Limpar e adicionar opção vazia

            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                inputCidade.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
});