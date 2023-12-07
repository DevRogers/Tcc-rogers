const URL_AUTH = "http://localhost:3005/auth/user/"

var botaoCadastrar = document.getElementById("entrarLog")
botaoCadastrar.addEventListener("click",()=>{
    var email = document.getElementById("signin-email").value
    var senha = document.getElementById("signin-password").value

    enviaPOST( email, senha )
})

function enviaPOST( email, password ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email, password
        })
    }
    var status = 0
    fetch(URL_AUTH,header)
    .then(function(response){
        status = response.status
        return response.json()
    }).then( function(data){
        if (status == 422) {
            alert("Não foi possivel efetuar o Login")
        }else if(status == 200 ) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('id', data.id)
            window.location.href = "index.html"
        }
    })
    .catch(function(error){
        console.log(error)
    })
}