import * as myFunctions from './functions.mjs';

myFunctions.linksPreventDefault();

const form = document.querySelector("form[name='form']");
const passwordToggleButton = document.querySelector("button[name='f-toggle-password']");
const passwordElement = document.getElementById('password');
const TINElement = document.getElementById('tax-number');
const formRequiredElements = document.querySelectorAll('[data-required]');

const inputMessageClass = 'f-item__error-message';
const inputMessageClassActive = `${inputMessageClass}_active`;
const inputClass = 'f-item__input';
const inputClassError = `${inputClass}_error`;
const inputClassValid = `${inputClass}_valid`;

const errorMessages = {
  emptyFirstName: 'Введите имя',
  emptyLastName: 'Введите фамилию',
  emptyEmail: 'Введите email',
  emptyPassword: 'Введите пароль',
  emptyTIN: 'Введите ИНН',
  wrongEmail: 'Неверный email',
  wrongPassword: 'Слишком короткий пароль',
  wrongTIN: 'Неверный ИНН',
  correctTIN: 'Ваша компания уже зарегистрирована, пожалуйста обратитесь к менеджеру вашего аккаунта или <a href="#">напишите нам</a> (Верный ИНН)'
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

TINElement.addEventListener('keydown', function (e) {
  if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 ||
    (e.keyCode == 65 && e.ctrlKey === true) ||
    (e.keyCode >= 35 && e.keyCode <= 39)) {
    return;
  } else {
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
});

passwordToggleButton.addEventListener('click', (e) => {
  let buttonClass = e.target.classList[0],
    buttonClassActive = `${buttonClass}_active`;

  passwordElement.getAttribute('type') == 'password' ? (
    passwordElement.setAttribute('type', 'text'),
    passwordToggleButton.classList.add(buttonClassActive)
  ) : (
    passwordElement.setAttribute('type', 'password'),
    passwordToggleButton.classList.remove(buttonClassActive)
  );
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  formRequiredElements.forEach(e => {
    let currentElement = e,
      currentElementSiblings = getSiblings(e);

    if (!currentElement.value) {
      setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'empty');
    } else {
      switch (currentElement.id) {
        case 'first-name':
        case 'last-name':
          setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid);
          break;
        case 'email':
          if (validateEmail(currentElement.value)) {
            setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid);
          } else {
            setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'wrong');
          }
          break;
        case 'tax-number':
          if (checkInn(currentElement.value)) {
            setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid, 'correct');
          } else {
            setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'wrong');
          }
          break;
        case 'password':
          if (currentElement.value.length < 5) {
            setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'wrong');
          } else {
            setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid);
          }
          break;
      }
    }
  })

  if (!document.querySelectorAll('[data-required].f-item__input_error').length) {
    const data = new FormData(form);
    let dataArray = [];
    for (const [name, value] of data) {
      dataArray.push([name, value])
    }
    alert(dataArray);
  }
})

function getChildren(n, skipMe) {
  var r = [];
  for (; n; n = n.nextSibling)
    if (n.nodeType == 1 && n != skipMe)
      r.push(n);
  return r;
};

function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

function setErrorMessage(curElLabel, curEl, errorType) {
  if (curElLabel.classList.contains(inputMessageClassActive) &&
    curEl.classList.contains(inputClassValid) && !errorType) {
    curElLabel.classList.remove(inputMessageClassActive);
    curElLabel.textContent = '';
    return;
  }
  if (curElLabel.classList.contains(inputMessageClass) && errorType == 'empty') {
    curElLabel.classList.add(inputMessageClassActive);
    switch (curEl.id) {
      case "first-name":
        curElLabel.textContent = errorMessages.emptyFirstName;
        break;
      case "last-name":
        curElLabel.textContent = errorMessages.emptyLastName;
        break;
      case "email":
        curElLabel.textContent = errorMessages.emptyEmail;
        break;
      case "password":
        curElLabel.textContent = errorMessages.emptyPassword;
        break;
      case "tax-number":
        curElLabel.textContent = errorMessages.emptyTIN;
        break;
    }
    return;
  }
  if (curElLabel.classList.contains(inputMessageClass) && errorType == 'wrong') {
    curElLabel.classList.add(inputMessageClassActive);
    switch (curEl.id) {
      case "email":
        curElLabel.textContent = errorMessages.wrongEmail;
        break;
      case "password":
        curElLabel.textContent = errorMessages.wrongPassword;
        break;
      case "tax-number":
        curElLabel.textContent = errorMessages.wrongTIN;
        break;
    }
    return;
  }
  if (curElLabel.classList.contains(inputMessageClass) && errorType == 'correct') {
    curElLabel.classList.add(inputMessageClassActive);
    switch (curEl.id) {
      case "tax-number":
        curElLabel.innerHTML = errorMessages.correctTIN;
        break;
    }
    return;
  }
}

function setValidationClasses(curEl, curElSibl, msgRemove, msgAdd, errorType = '') {
  if (curEl.classList.contains(msgRemove)) curEl.classList.remove(msgRemove);
  if (!curEl.classList.contains(msgAdd)) curEl.classList.add(msgAdd);

  curElSibl.forEach(e => {
    setErrorMessage(e, curEl, errorType);
  })
}

function checkInn(value) {
  if (typeof value !== 'string' ||
    (value.length !== 10 && value.length !== 12) ||
    value.split('').some((symbol) => isNaN(Number(symbol)))
  ) return false;

  if (value.length === 10) {
    return Number(value[9]) === (value.split('').slice(0, -1)
      .reduce(
        (summ, symbol, index) => [2, 4, 10, 3, 5, 9, 4, 6, 8][index] * Number(symbol) + summ,
        0) %
      11) % 10;

  } else if (value.length === 12) {
    let checkSumOne = (value.split('').slice(0, -2)
      .reduce(
        (summ, symbol, index) => [7, 2, 4, 10, 3, 5, 9, 4, 6, 8][index] * Number(symbol) + summ,
        0) %
      11) % 10;

    let checkSumTwo = (value.split('').slice(0, -1)
      .reduce(
        (summ, symbol, index) => [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8][index] * Number(symbol) + summ,
        0) %
      11) % 10;

    return (checkSumOne === Number(value[10]) && checkSumTwo === Number(value[11]));
  }
}