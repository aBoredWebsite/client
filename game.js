const choices = Array.from(document.getElementsByClassName('choice-container'))

let questions = null

$.ajax({
  url: 'http://localhost:3000/quiz',
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
    let random = Math.floor(Math.random() * 3)+1
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
    console.log('done')
  }

  choices.forEach(choice => {
    choice.addEventListener('click', e => {
      if(questionNumber <= 1 ){
        finish()
      } else if (e.target.id == correctIndex){
        point++
        questionNumber--
        questions.results.shift()
        generateQuestion()
        console.log('correct')
      } else {
        questionNumber--
        questions.results.shift()
        generateQuestion()
        console.log('wrong')
      }
    })
  })
})
.fail(err => {
  console.log(err)
})







