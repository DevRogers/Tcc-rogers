const URL = "https://despachantemoser.onrender.com/pessoas/"

var pessoaId = null
lerParametros()

function lerParametros(){
    const urlParams = new URLSearchParams(window.location.search);
    pessoaId = urlParams.get("pessoaId")
    if( pessoaId != null) {
        var name = urlParams.get("name")
        var telefonePessoa = urlParams.get("telefonePessoa")
        var cidadePessoa = urlParams.get("cidadePessoa")
        var estadoPessoa = urlParams.get("estadoPessoa")

    
        //telefonePessoa = telefonePessoa.replace(/\s+/g, '').replace(/-/g, '');
        //telefonePessoa = telefonePessoa.replace(" ", '');
        document.getElementById("inputName").value = name
    
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
    var name = document.getElementById("inputName").value
    var TelefonePessoa = document.getElementById("inputTelefone").value
    var cidadePessoa = document.getElementById("inputCity").value
    var estadoPessoa = document.getElementById("inputEstado").value
    var usuarioId = localStorage.getItem("id")
    if( pessoaId != null ){
        enviaPUT(pessoaId, name, TelefonePessoa, cidadePessoa, estadoPessoa, )
    }else{
        enviaPOST( name, TelefonePessoa, cidadePessoa, estadoPessoa, usuarioId)
    } 
})

function enviaPOST( name, TelefonePessoa, cidadePessoa, estadoPessoa, usuarioId ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:name,
            telefone: TelefonePessoa,
            cidade: cidadePessoa,
            estado:estadoPessoa,
            usuarioId: usuarioId
        })
    }
    fetch(URL,header)
    .then(function(response){
        return response.json()
    }).then(function (data) {
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            alert("Erro");
        }
    }).catch(function () {
        alert("Erro");
    });
}
function enviaPUT( id,name, TelefonePessoa, cidadePessoa, estadoPessoa, usuarioId){
    var header = {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:name,
            telefone: TelefonePessoa,
            cidade: cidadePessoa,
            estado:estadoPessoa,
            usuarioId: usuarioId
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