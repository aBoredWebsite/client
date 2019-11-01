$(document).ready(function(){
  $("#button").click(function(){
      $("#home").animate({
          height: 'toggle',
      });
      $("#question1").show()
  });
});

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

function generateQuestion(){
  $.ajax({
      method: 'GET',
      url: `https://official-joke-api.appspot.com/random_joke`
  })
  .done((data) => {
    
      let question = data.setup
      let punchline = data.punchline
      let html = ''
      html += ` <h2 style="color: #464646; text-align: center;font-size: 2.5rem;margin-left: 80px;margin-right: 80px;;">${question}</h2>
                      <br>
              <h4 id= "punchline" style="color: #464646; text-align: center;font-size: 2.5rem;margin-left: 80px;margin-right: 80px;font-weight: 200;font-size: 2rem; font-style: italic;display:none;">${punchline}</h4>
            
              `
      $('#randomQuestion').prepend(html)
  })
  .fail((err)=>{
      console.log(err)
  })
}



  let counter = 0
$("#answer").click(function(){
    $("#punchline").show()
    $("#answer").hide()
    $("#more").show()
    // let counter = $("#true").text()
    // console.log(counter)
    counter++
    $("#score").empty()
    // $("#true").text(counter)
    $("#score").append(`
        <p>${counter}</p>
    `)

});

$("#more").click(function(){
    generateQuestion()
    $("#answer").show()
    $("#more").hide()
    $('#randomQuestion').empty()
});

$("#registerPage").click(function(){
  $("#register").show()
  $("#login").hide()
  $('#randomQuestion').empty()
});

$("#loginButton").click(function(){
  $("#logout").show()
  $("#game").show()
  $("#login").hide()
});