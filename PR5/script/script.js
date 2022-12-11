const openModalButton = document.querySelector('#btnOpenModal');
const modal = document.querySelector('#modalBlock');
const closeModal = document.querySelector('#closeModal');
const questionTitle = document.querySelector('#question');
const formAnswers = document.querySelector('#formAnswers');
const nextButton = document.querySelector('#next');
const prevButton = document.querySelector('#prev');
const sendButton = document.querySelector('#send');

let questions = [];
let page = 0;
let finalAnswers = [];
let numberQuestion = null;

closeModal.addEventListener('click', onCloseModalClick);
openModalButton.addEventListener('click', onOpenModalBtnClick);
nextButton.addEventListener('click', onNextBtnClick);
prevButton.addEventListener('click', onPrevBtnClick);
sendButton.addEventListener('click', onSendBtnClick);

async function getQuestions(url) {
  const resolve = await fetch(url);
  const data = await resolve.json();
  return data;
}

getQuestions('./questions.json')
  .then(data => {
    questions = data.questions;
  })
  .catch(error => {
    console.log(error);
  });

function onOpenModalBtnClick() {
  modal.classList.add('d-block');
  playTest();
}

function onCloseModalClick() {
  modal.classList.remove('d-block');
}

function playTest() {
  formAnswers.innerHTML = '';
  sendButton.classList.add('d-none');

  if (page === 0) {
    prevButton.classList.add('d-none');
  }
  if (page > 0) {
    prevButton.classList.remove('d-none');
  }
  if (page === questions.length) {
    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');
    sendButton.classList.remove('d-none');
    formAnswers.innerHTML = `


       <div class="form-group">
       <label for="numberPhone">Введіть свій номер телефону</label>
       <input type="tel" name="phone" required pattern="^\+\d{2}\(\d{3}\)\s\d{3}[-]\d{2}[-]\d{2}$">
       </div>



      `;
     questionTitle.textContent = '';
     page = 0;
    return;
  }
  if (page < questions.length) {
    nextButton.classList.remove('d-none');
  }

  const renderAnswers = (answersArr, type) => {
    answersArr.forEach(answer => {
      const answerItem = document.createElement('div');
      answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

      answerItem.innerHTML = `
      <input type="${type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}" />
         <label for="${answer.title}" class="d-flex flex-column justify-content-between">
             <img class="answerImg" src="${answer.url}" alt="burger" />
             <span>${answer.title}</span>
         </label>
      `;

      formAnswers.appendChild(answerItem);
    });
  };

  const renderQuestions = index => {
    numberQuestion = index;
    questionTitle.textContent = `${questions[index].question}`;

    renderAnswers(questions[index].answers, questions[index].type);
  };

  renderQuestions(page);
}

function checkAnswer() {
  const obj = {};

  const inputs = [...formAnswers.elements].filter(
    element => element.checked || element.id === 'numberPhone'
  );
  inputs.forEach((input, index) => {
    if (input.id === 'numberPhone') {
      obj['Номер телефону'] = input.value;
    } else {
      obj[`${index}_${questions[numberQuestion].question}`] = input.value;
    }
  });
  finalAnswers.push(obj);
}

function onNextBtnClick() {
  checkAnswer();
  page += 1;
  playTest();
}

function onPrevBtnClick() {
  page -= 1;
  playTest();
}

function onSendBtnClick() {
  checkAnswer();
  formAnswers.textContent = 'Дякую за пройдений тест';
  sendButton.classList.add('d-none');
  setTimeout(() => {
    modal.classList.remove('d-block');
  }, 2000);

  console.log(finalAnswers);
  finalAnswers = [];
}

var inputsTel = document.querySelectorAll('input[type="tel"]');

Inputmask({
  "mask": "+38(999) 999-99-99",
  showMaskOnHover: false
}).mask(inputsTel);

