$.ajax({
  url: 'http://localhost:3000/apis/trivia',
  method: 'get'
})
.done(response => {
  let questions = response  
  let questionNumber = questions.results.length
  let point = 0
  let correctIndex = null

  function generateQuestion(){
    let placement = ['', '', '', '']
    let random = Math.floor(Math.random() * 4)
    placement[random] = questions.results[0].correct_answer
    correctIndex = random
    for(let i=0 ; i<placement.length ; i++){
      if(placement[i] == ''){
        placement[i] = questions.results[0].incorrect_answers[0]
        questions.results[0].incorrect_answers.shift()
      }
    }
    for(let i=0 ; i<placement.length ; i++){
      // document.getElementById('question').innerHTML = questions.results[0].question
      // document.querySelector(`[value="${i}"]`).innerText = placement[i]
      $("#question").html(questions.results[0].question)
      $(`#choice${i}`).text(placement[i])
    }
  }
  generateQuestion()

  function finish(){
    
      $("#game").hide()
      $("#scorePage").show()
      $('#scoreQuiz').html(`${point}/10`) 
      // document.getElementById('scoreQuiz').innerHTML = `${point}/10`
    Swal.fire(
      'Good job!',
      'You have finish this quiz!',
      'success'
    )
    $('#game').hide()
  }

  let choices = $(".choice-container")
    choices.on('click', e => {
      // $(`#${e.target.id}`).css({
      //   "background-color" : "black"
      // })
      
      if(questionNumber <= 1 && e.target.id == correctIndex){
        point++
        $(`#${e.target.id}`).animate({backgroundColor: "rgb(135, 241, 86)"})
        $(`#${e.target.id}`).animate({backgroundColor: "white"})
        setTimeout(function(){
          finish()
        },700)
      } else if (questionNumber <= 1 && e.target.id !== correctIndex) {
        $(`#${e.target.id}`).animate({backgroundColor: "#FF0000"})
        $(`#${e.target.id}`).animate({backgroundColor: "white"})
        setTimeout(function(){
          finish()
        },700)
        
      }else if (e.target.id == correctIndex){
        point++
        questionNumber--
        questions.results.shift()
        // generateQuestion()
        setTimeout(function(){
          generateQuestion()
        },700)
        $(`#${e.target.id}`).animate({backgroundColor: "rgb(135, 241, 86)"})
        $(`#${e.target.id}`).animate({backgroundColor: "white"})
        
        console.log('correct')
      } else {
        questionNumber--
        questions.results.shift()
        console.log('wrong')
        
        $(`#${e.target.id}`).animate({backgroundColor: "#FF0000"})
        $(`#${e.target.id}`).animate({backgroundColor: "white"})
        setTimeout(function(){
          generateQuestion()
        },700)
      }
      // $(`#${e.target.id}`).css({
        //   "background-color" : "black"
        // })
      })
 
})
.fail(err => {
  console.log(err)
})







