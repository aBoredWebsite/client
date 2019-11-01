$(document).ready(function(){

  if (localStorage.getItem('token')){
    homePage() // isinya game dan cards
  } else {
    loginPage() // isinya login & register
  }

  // getBoredCard()
  // getJokeCard()
  // getQuoteCard()

});


function loginPage(){
  $('#logout').hide()
  $('#login').show()
  $('#reg').hide()
  $('#game').hide()
  $('#home').hide()
  $('#game-joke').hide()
}

function homePage(){
  // getBoredCard()
  // getJokeCard()
  // getQuoteCard()
  // $('#game-joke').show()
  // $('#game').show()
  $('#reg').hide()
  $('#logout').show()
  $('#login').hide()
  $('#home').show()
}



$('#registerForm').on('submit',(e)=>{
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
      console.log('--------------------->>>>>>>');
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
      homePage()
    })
    .fail((err)=>{

      console.log('login===-=-=-=-=-=');
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
      homePage()
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
  $("#reg").show()
  $("#login").hide()
  // $('#randomQuestion').empty()
});

$("#loginButton").click(function(){
  $("#logout").show()
});

$("#logout").click(function(){
  // $("#logout").show()
  localStorage.removeItem('token')
  loginPage()
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
  <div class='mx-auto d-flex flex-column align-items-center justify-content-center' style="height: 300px; width: 60%;">
                        <h4 style="color: white; text-align: center;margin-bottom: 3rem;font-size: 1.5rem; font-style:italic">  Maybe you can : </h4>
                        <h2 style="color: white; text-align: center;margin-bottom: 1rem;font-size: 3rem;">"${activity}"</h2>
                        <h4 style="color: white; text-align: center;font-size: 1rem; font-style:italic">  participant : ${participant}</h4>
                        <h4 style="color: white; text-align: center;font-size: 1rem; font-style:italic">  type : ${type}</h4>
                        <h4 style="color: white; text-align: center;font-size: 1rem; font-style:italic">  price : ${newPrice}</h4>
                        <br>
                        <a id = getMoreBored href="#" class="btn btn-outline-light" style="padding: 0.375rem 2.75rem; margin:10px;border-radius: 2.25rem;font-size: 1.3rem;line-height: 2.5;width: 300px;">Get another activity</a>
                        
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
                        <h4 id ="question" style="color:rgb(43, 43, 43); text-align: center;font-size: 3rem; margin: 50px;">${setup}</h4>
                        <center><button type="button" class="btn btn-primary btn-sm" id="reveal">Punchline!</button></center>
                        <center><h4 id="punchline" style="display:none; color:"yellow">"${punchline}"</h4></center>
                        </br>
                        <center><h4 id="getMoreJoke" class="card-link" style="cursor:pointer; color :rgb(17, 85, 102)">want to hear more joke?</h4></center>
                        <h4 id="punchline" style="display:none; color:rgb(55, 134, 148)">${punchline}</h4>
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
  <div class='mx-auto d-flex flex-column align-items-center justify-content-center' style="height: 300px; width: 60%;">
          <h2 style="color: white; text-align: center;margin-bottom: 3rem;font-size: 3rem;">${body}</h2>
          <h4 style="color: white; text-align: center;margin-bottom: 3rem;font-size: 1.5rem; font-style:italic"> - ${author} - </h4>
          <a id = getMoreQuote href="#" class="btn btn-outline-light" style="padding: 0.375rem 2.75rem; margin:10px;border-radius: 2.25rem;font-size: 1.3rem;line-height: 2.5;width: 300px;">More Quotes</a>
          
  </div>
  `)
  $('#getMoreQuote').click(()=>{
    getQuoteCard()
  })
}

