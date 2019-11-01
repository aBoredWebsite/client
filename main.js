$(document).ready(function(){
  $("#button").click(function(){
      $("#home").animate({
          height: 'toggle',
      });
      $("#question1").show()
  });

  getBoredCard()
  getJokeCard()
  getQuoteCard()

});

$('#register').on('submit',(e)=>{
  console.log('test')
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
      console.log('ers')
      localStorage.setItem('token',token) 
    })
    .fail((err)=>{
      console.log(err)
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
      url: `https://localhost:3000/apis/joke`
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
      $('#home').hide()
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
});
      $("#more").click(function(){
          generateQuestion()
          $("#answer").show()
          $("#more").hide()
          $('#randomQuestion').empty()
      });


function getBoredCard(){
  console.log('masuks');
  $('#bored').empty()
  $.ajax({
    method : 'get',
    url : 'http://localhost:3000/apis/bored'
  })
    .done((data)=>{
      console.log(data);
      setBoredCard(data.activity,data.participants,data.price,data.type)
    })
    .fail((err)=>{
      console.log(err);
    })
}


function setBoredCard(activity,participant,price,type){
  let newPrice = price*10
  $('#bored').append(`
  <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${activity}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Type: ${type}</h6>
        <p class="card-text">Participants: ${participant}</p>
        <p class="card-text">Price: ${newPrice}</p>
        <a id="getMoreBored" class="card-link" style="cursor: pointer">Get another activity</a>
      </div>
    </div>
  `)
  $('#getMoreBored').click(()=>{
    getBoredCard()
  })
  
}

function getJokeCard(){
  $('#joke').empty()
  $.ajax({
    method : 'get',
    url : 'http://localhost:3000/apis/joke'
  })
    .done((data)=>{
      console.log(data);
      setJokeCard(data.setup,data.punchline)
    })
    .fail((err)=>{
      console.log(err);
    })
}


function setJokeCard(setup,punchline){
  $('#joke').append(`
  <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${setup}</h5>
        <button type="button" class="btn btn-primary btn-sm" id="reveal">Punchline!</button>
        <h6 id="punchline" style="display:none">${punchline}</h6>
        </br>
        <a id="getMoreJoke" class="card-link" style="cursor:pointer">want to hear more joke?</a>
      </div>
    </div>
  `)
  $('#reveal').click(()=>{
    $('#punchline').show()
    $('#reveal').hide()
  })
  $('#getMoreJoke').click(()=>{
    getJokeCard()
  })
}

function getQuoteCard(){
  $('#quote').empty()
  $.ajax({
    method : 'get',
    url : 'http://localhost:3000/apis/quote'
  })
    .done((data)=>{
      let detail = data.quotes[0] 
      console.log();
      setQuoteCard(detail.author,detail.body)
    })
    .fail((err)=>{
      console.log(err);
    })
}


function setQuoteCard(author,body){
  $('#quote').append(`
  <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${body}</h5>
        <p class="card-text">- ${author}</p>
        <a id="getMoreQuote" class="card-link" style="cursor:pointer">get more quote</a>
      </div>
    </div>
  `)
  $('#getMoreQuote').click(()=>{
    getQuoteCard()
  })
}
