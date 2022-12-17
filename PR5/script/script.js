const btnOpenModal = document.querySelector("#btnOpenModal");
const modalBlock = document.querySelector("#modalBlock");
const closeModal = document.querySelector("#closeModal");
const questionTitle = document.querySelector("#question");
const formAnswers = document.querySelector("#formAnswers");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const sendButton = document.querySelector("#send");
let questionData;

const getData = () => {
  setTimeout(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyD1loTPvTVq8sYV9w_0JVYhFYP0bbLe0O0",
      authDomain: "burgerseit.firebaseapp.com",
      databaseURL: "https://burgerseit-default-rtdb.firebaseio.com",
      projectId: "burgerseit",
      storageBucket: "burgerseit.appspot.com",
      messagingSenderId: "835509823965",
      appId: "1:835509823965:web:b86b3dfcab9c86008eee34",
      measurementId: "G-X7KW5NNQX6",
    };

    firebase.initializeApp(firebaseConfig);
    firebase
      .database()
      .ref()
      .child("questions")
      .once("value")
      .then((snap) => {
        questionData = snap.val();
        formAnswers.textContent = "";
        playTest();
      });
  }, 1000);
};

function renderQuestions(id) {
  switch (id) {
    case 0:
      prevButton.classList.add("d-none");
      questionTitle.textContent = questionData[id].question;
      renderAnswers(id);
      break;

    case questionData.length:
      questionTitle.textContent = "";
      formAnswers.innerHTML = `
      <div class = "form-group">
        <label for="numberPhone">Enter your number</label>
        <input type="phone" class="form-control" id="numberPhone">
      </div>
      `;
      nextButton.classList.add("d-none");
      prevButton.classList.add("d-none");
      sendButton.classList.add("d-block");
      break;

    case questionData.length + 1:
      sendButton.classList.remove("d-block");
      prevButton.classList.add("d-none");
      formAnswers.textContent = "Спасибо за ваши ответы";
      setTimeout(() => {
        modalBlock.classList.remove("d-block");
        formAnswers.innerHTML = "";
      }, 2000);
      break;

    default:
      prevButton.classList.remove("d-none");
      nextButton.classList.remove("d-none");
      sendButton.classList.add("d-none");
      questionTitle.textContent = questionData[id].question;
      renderAnswers(id);
      break;
  }
}

function renderAnswers(id) {
  questionData[id].answers.forEach((answer) => {
    const question = `
                <div class="answers-item d-flex justify-content-center">
                    <input type="${questionData[id].type}" id="${answer.title}" name="answer" class="d-none" value = "${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                    </label>
                </div>  
            `;
    formAnswers.insertAdjacentHTML("beforeend", question);
  });
}

function checkAnswers(questionId, obj) {
  const inputs = [...formAnswers.elements].filter(
    (input) => input.checked || input.id === "numberPhone"
  );
  console.log(inputs);
  inputs.forEach((input, index) => {
    if (questionId >= 0 && questionId < questionData.length) {
      obj[`${index}_${questionData[questionId].question}`] = input.value;
    }
    if (questionId === questionData.length) {
      obj["Номер телефона"] = input.value;
    }
  });
}
function playTest() {
  let questionId = 0;
  const resultObj = {};
  prevButton.classList.remove("d-none");
  nextButton.classList.remove("d-none");
  sendButton.classList.add("d-none");
  prevButton.addEventListener("click", () => {
    questionId--;
    formAnswers.innerHTML = "";
    formAnswers.textContent = "";
    renderQuestions(questionId);
  });
  nextButton.addEventListener("click", () => {
    checkAnswers(questionId, resultObj);
    questionId++;
    formAnswers.innerHTML = "";
    renderQuestions(questionId);
  });
  sendButton.addEventListener("click", () => {
    checkAnswers(questionId, resultObj);
    questionId++;
    renderQuestions(questionId);
    firebase.database().ref().child("contacts").push(resultObj);
  });
  renderQuestions(questionId);
}

btnOpenModal.addEventListener("click", () => {
  modalBlock.classList.add("d-block");
  getData();
});

closeModal.addEventListener("click", () => {
  modalBlock.classList.remove("d-block");
  formAnswers.innerHTML = "";
});
