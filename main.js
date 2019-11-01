$(document).ready(()=>{




})


$('#register').on('submit',(e)=>{
  e.preventDefault()
  let name = $('#nameReg').val()
  let email = $(`#emailReg`).val()
  let password = $('#passReg').val()
  registerUser(email,password,name)
})

function registerUser(email,password,name){
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/users/register',
    data : {
      email,password,name
    }
  })
    .done((token)=>{
      localStorage.setItem('token',token) 
    })
    .fail((err)=>{
      let text = ''
      if(err.responseJSON.errArr){
        if(err.responseJSON.errArr.length>1){
          text = err.responseJSON.errArr.join(", ")
        } else {
          err.responseJSON.errArr.forEach(element => {
            text += element
          });
        }
      } else {
        text = err.responseJSON.message
      }
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${text}`,
      })
    })
}

$('#loginStandard').on('submit',(e)=>{
  e.preventDefault()
  let email = $(`#emailLog`).val()
  let password = $('#passLog').val()
  loginUser(email,password)
})

function loginUser(email,password){
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/users/login',
    data : {
      email,password
    }
  })
    .done((token)=>{
      localStorage.setItem('token',token) 
    })
    .fail((err)=>{
      let text = ''
      if(err.responseJSON.errArr){
        if(err.responseJSON.errArr.length>1){
          text = err.responseJSON.errArr.join(", ")
        } else {
          err.responseJSON.errArr.forEach(element => {
            text += element
          });
        }
      } else {
        text = err.responseJSON.message
      }
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${text}`,
      })
    })
}


function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url : 'http://localhost:3000/users/loginOAuth',
    method : 'post',
    data : {
      id_token
    }
  })
    .done((token)=>{
      localStorage.setItem('token',token)
    })
    .fail((err)=>{
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `Something went wrong with our server :(`,
      })
    })
}


function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    localStorage.removeItem('token')
  });
}