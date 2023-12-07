

const URL_USER = "https://localhost:3004/auth/user/"
var idUsuario = localStorage.getItem("id")
lerParametros();
function lerParametros(){
    var name = localStorage.getItem("nome")
    var email = localStorage.getItem("email")

        document.getElementById("inputName").value = name
    
        document.getElementById("email").value = email
}

var botaoAdicionar = document.getElementById("botaoAdicionar");
botaoAdicionar.addEventListener("click", function(){
    var name = document.getElementById("inputName").value;
    var email = document.getElementById("email").value;
    var token = localStorage.getItem("token");  // Obtém o token armazenado localmente

    enviaPUT(idUsuario, name, email, token);
});

function enviaPUT(idUsuario, name, email, token){
    var header = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": token  // Adiciona o token ao cabeçalho
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    };
    fetch(URL_USER + idUsuario, header)
    .then(function(response){
        return response.json();
    }).then(function(data){
        window.location.href = 'index.html';
    }).catch(function(){
        alert("Erro");
    });
}
