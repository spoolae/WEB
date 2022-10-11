const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener('click' , function(event) {
    modal.classList.add("is-open");
});

close.addEventListener('click' , function(event) {
    modal.classList.remove("is-open");
});

// new WOW().init();

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');


const modalProb = document.querySelector('.modal-prob');
const closeProb = document.querySelector(".close-prob");

function ProbToggleModal() {
    modalProb.classList.toggle("is-open");
}


function LogToggleModal() {
    modalAuth.classList.toggle("is-open");
}

function autorized(){
    console.log('Da');

    function logOut() {
        login = null;
        localStorage.removeItem('gloDelivery');
        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        userName.textContent = login;
        buttonOut.removeEventListener('click', logOut);

        checkAuth();
    }

    userName.textContent = login;

    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';
    buttonOut.addEventListener('click', logOut);
}

function notAutorized(){
    console.log('Net');

    function logIn(event){
        event.preventDefault();
        login = loginInput.value;
        localStorage.setItem('gloDelivery', login);

        if (login) {
            LogToggleModal();
            buttonAuth.removeEventListener('click', LogToggleModal);
            closeAuth.removeEventListener('click', LogToggleModal);
            logInForm.removeEventListener('submit', logIn);
            logInForm.reset();

            checkAuth();
        } 
        else {
            ProbToggleModal();
            closeProb.addEventListener('click', ProbToggleModal);
        }
    }

    buttonAuth.addEventListener('click', LogToggleModal);
    closeAuth.addEventListener('click', LogToggleModal);
    logInForm.addEventListener('submit', logIn);

}

function checkAuth(){
    if (login) {
        autorized();
    } else {
        notAutorized();
    }
}

checkAuth();