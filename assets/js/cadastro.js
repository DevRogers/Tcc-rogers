const URL_AUTH = "http://localhost:3005/auth/register/"

var botaoCadastrar = document.getElementById("botaoCadastrar")
botaoCadastrar.addEventListener("click",()=>{
    var name = document.getElementById("campoNome").value
    var email = document.getElementById("signin-email").value
    var senha = document.getElementById("signin-password").value
    var confirmarSenha = document.getElementById("confirm-password").value

    enviaPOST( name, email, senha, confirmarSenha )
})

function enviaPOST( name, email, password, confirmPassword ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name, email, password, confirmPassword
        })
    }
    fetch(URL_AUTH,header)
    .then(function(response){
        if (!response.ok && response.status === 422) {
            alert("Cadastro Inválido")
            return response.json();            
        }else if(response.ok && response.status == 201 ) {
            window.location.href = "login.html"
        }
    }).then(function(data){
//erro
    }).catch(function(error){
        console.log(error)
    })
}