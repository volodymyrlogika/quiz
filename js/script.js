let question_field = document.querySelector('.question')
let answer_buttons = document.querySelectorAll('.answer')
let start_btn = document.querySelector('.start-btn')

let start_page =  document.querySelector('.start-page')
let main_page =  document.querySelector('.main-page')
let result_field = document.querySelector('.result')

let signs = ['+', '-', '*', '/']
let isCookies = false
let max_points

let cookies = document.cookie.split(';')

for (let i=0; i<cookies.length; i+=1){
    let name_value= cookies[i].split('=')
    if (name_value[0].includes('max-points')){
        isCookies = true
        max_points = name_value[1]
        result_field.innerHTML = `Ваш попередній результат: ${max_points}`   
    }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) { // Цикл повторюється до тих пір, поки залишаються елементи для перемішування
    randomIndex = Math.floor(Math.random() * currentIndex); // Вибираємо елемент, що залишився.
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [    // Міняємо місцями з поточним елементом.
      array[randomIndex], array[currentIndex]];
  }
  return array; // Повертаємо перемішаний масив
}

function randint(min, max){
    return Math.round(Math.random() * (max-min) + min)
}

function getRandomSign(){
    let i = randint(0,3)
    return signs[i]
}

async function getQuestions (){
    let response = await fetch("questions.json")
    let questions = await response.json()
    return questions
}

let questions_list = []

getQuestions ().then(function (questions) {
    questions_list = questions
    console.log(questions_list)
})


let quiz_time = 5
let points = 0
let total_question_count = 0

function displayResult(){
    start_page.style.display = 'flex'
    main_page.style.display = 'none'
    let accuracy = Math.round(points * 100 / total_question_count)
    result_field.innerHTML = `Ви дали ${points} правильних відровідей з ${total_question_count}.
    Точність: ${accuracy}%`   
    if (max_points && +max_points<points){
        document.cookie = `max-points=${points};max-age=${60*60*24*30}`
    }
    
        
}

start_btn.addEventListener("click", function(){
    start_page.style.display = 'none'
    main_page.style.display = 'flex'
    current_question = question_list[randint(0, questions_list.length-1)]
    current_question.display()
    setTimeout(displayResult, quiz_time * 1000)
})

for (let i = 0; i< answer_buttons.length; i+=1){
    answer_buttons[i].addEventListener("click", function(){
        total_question_count+=1
        if (answer_buttons[i].innerHTML == current_question.correct){
            points += 1
            console.log(points)
            answer_buttons[i].style.background =  'rgb(82, 255, 19)'
            anime({
                targets: answer_buttons[i],
                background:  '#ffd749',
                delay: 100,
                duration: 500,
                easing: 'linear',
            }).finished.then(function(){
                current_question = new Question()
                 current_question.display()
            })
        } else{
            answer_buttons[i].style.background =  'rgb(250, 0, 0)'
            anime({
                targets: answer_buttons[i],
                background:  '#ffd749',
                delay: 100,
                duration: 500,
                easing: 'linear',
            }).finished.then(function(){
                current_question = new Question()
                 current_question.display()
            })
        }
      
    })
}