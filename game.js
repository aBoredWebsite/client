const choices = Array.from(document.getElementsByClassName('choice-container'))

let questions = null

$.ajax({
  url: 'https://opentdb.com/api.php?amount=10&type=multiple',
  method: 'get'
})
.done(response => {
  // console.log(response)
  questions = response
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
      document.getElementById('question').innerHTML = questions.results[0].question
      document.querySelector(`[value="${i}"]`).innerText = placement[i]
    }
  }
  generateQuestion()

  function finish(){
    
      $("#game").hide()
      $("#scorePage").show()
      // $(`#${e.target.id}`).css({
      //   "background-color" : "red"
      // })
      document.getElementById('scoreQuiz').innerHTML = `${point}/10`
  
    console.log(point)
  }

  choices.forEach(choice => {
    choice.addEventListener('click', e => {
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
})
.fail(err => {
  console.log(err)
})







