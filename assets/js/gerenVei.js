const URL = "https://despachantemoser.onrender.com/veiculos/";

var idVeiculo = null
var pessoaId = null
lerParametros();


function lerParametros() {
    const urlParams = new URLSearchParams(window.location.search);
    idVeiculo = urlParams.get("id")
    const placa = urlParams.get('placa');
    const renavam = urlParams.get('renavam');
    const modelo = urlParams.get('modelo');
    const cidade = urlParams.get('cidade');
    const estado = urlParams.get('estado');


    pessoaId = urlParams.get('pessoaId');
    nomePessoa = urlParams.get('nomePessoa');
    telefonePessoa = urlParams.get('telefonePessoa');
    cidadePessoa = urlParams.get('cidadePessoa');
    estadoPessoa = urlParams.get('estadoPessoa');

    document.getElementById("inputPlaca").value = placa
    document.getElementById("inputRenavam").value = renavam
    document.getElementById("inputModelo").value = modelo

    document.getElementById("inputEstado").value = estado


    carregarCidades(estado);

    setTimeout(function() {
        document.getElementById("inputCidade").value = cidade   
    }, 500);

      
        

}

function carregarCidades(estado){
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
   
}

var botaoAdicionar = document.getElementById("botaoAdicionar")
botaoAdicionar.addEventListener("click", function(){

    var placa = document.getElementById("inputPlaca").value
    var renavam = document.getElementById("inputRenavam").value
    var modelo = document.getElementById("inputModelo").value
    var cidade = document.getElementById("inputCidade").value 
    var estado = document.getElementById("inputEstado").value
    var usuarioId = localStorage.getItem("id");
    if( idVeiculo != null ){
        enviaPUT(idVeiculo, placa, renavam, modelo, cidade, estado, pessoaId, usuarioId)
    }else{
        enviaPOST( placa, renavam, modelo, cidade, estado, pessoaId, usuarioId )
    }
})

function enviaPUT( idVeiculo, placa, renavam, modelo, cidade, estado, pessoaId, usuarioId ){
    var header = {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            placa:placa,
            renavam:renavam,
            modelo:modelo,
            cidade:cidade,
            estado:estado,
            pessoaId:pessoaId,
            usuarioId:usuarioId
        })
    }
    fetch(URL+idVeiculo,header)
    .then(function(response){
        return response.json()
    }).then(function(data){
        window.location.href = "listarVei.html?pessoaId="+pessoaId+"&nomePessoa="+nomePessoa+"&telefonePessoa="+telefonePessoa+"&cidadePessoa="+cidadePessoa+"&estadoPessoa="+estadoPessoa;
    }).catch(function(){
        console.log("Erro ao atualizar veículo");
    })
}

var codigoPessoa = document.getElementById("codigoPessoa")
codigoPessoa.innerText = pessoaId;

function enviaPOST( placa, renavam, modelo, cidade, estado, pessoaId, usuarioId ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            placa:placa,
            renavam:renavam,
            modelo:modelo,
            cidade:cidade,
            estado:estado,
            pessoaId:pessoaId,
            usuarioId:usuarioId
        })
    }
    fetch(URL,header)
    .then(function(response){
        return response.json()
    }).then(function (data) {
        if (data.pessoaId) {
            window.location.href = "listarVei.html?pessoaId="+pessoaId+"&nomePessoa="+nomePessoa+"&telefonePessoa="+telefonePessoa+"&cidadePessoa="+cidadePessoa+"&estadoPessoa="+estadoPessoa;
        } else {
            alert('Ocorreu um erro na inserção do registro!');
        }
    }).catch(function (error) {
        console.log(error);
        alert('Ocorreu um erro na inserção do registro!');
    });
}

const inputEstado = document.getElementById('inputEstado');
const inputCidade = document.getElementById('inputCidade');

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