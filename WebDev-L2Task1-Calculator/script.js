const historyEl = document.getElementById('history');
const currentEl = document.getElementById('current');

let firstOperand = null;
let operator = null;
let secondOperand = '';
let overwrite = false;

function updateDisplay() {
  currentEl.textContent = secondOperand === '' ? (firstOperand !== null ? firstOperand : '0') : secondOperand;
  historyEl.textContent = operator ? `${firstOperand} ${operator}` : '';
}

function inputDigit(digit) {
  if (overwrite) {
    secondOperand = digit;
    overwrite = false;
  } else {
    if (secondOperand === '0') secondOperand = digit;
    else secondOperand += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (overwrite) { secondOperand = '0.'; overwrite = false; updateDisplay(); return; }
  if (secondOperand === '') { secondOperand = '0.'; }
  else if (!secondOperand.includes('.')) { secondOperand += '.'; }
  updateDisplay();
}

function clearAll() {
  firstOperand = null;
  operator = null;
  secondOperand = '';
  overwrite = false;
  currentEl.classList.remove('error');
  updateDisplay();
}

function backspace() {
  if (overwrite) return;
  secondOperand = secondOperand.slice(0, -1);
  updateDisplay();
}

function toggleZero() {
  const val = parseFloat(secondOperand);
  if (!isNaN(val)) {
    secondOperand = String(-val);
    updateDisplay();
  }
}

function percent() {
  if (secondOperand === '') return;
  secondOperand = String(parseFloat(secondOperand) / 100);
  updateDisplay();
}

function compute(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) return null; // division by zero
      return a / b;
    default: return b;
  }
}

function setOperator(nextOperator) {
  const inputValue = parseFloat(secondOperand);

  if (operator && secondOperand !== '') {
    const result = compute(firstOperand, operator, inputValue);
    if (result === null) {
      showError();
      return;
    }
    firstOperand = roundResult(result);
  } else if (secondOperand !== '') {
    firstOperand = inputValue;
  } else if (firstOperand === null) {
    firstOperand = 0;
  }

  operator = nextOperator;
  secondOperand = '';
  overwrite = false;
  updateDisplay();
}

function roundResult(num) {
  return Math.round((num + Number.EPSILON) * 1e10) / 1e10;
}

function showError() {
  currentEl.textContent = 'Cannot divide by 0';
  currentEl.classList.add('error');
  firstOperand = null;
  operator = null;
  secondOperand = '';
  overwrite = true;
}

function equals() {
  if (operator === null || secondOperand === '') return;
  const inputValue = parseFloat(secondOperand);
  const result = compute(firstOperand, operator, inputValue);
  if (result === null) {
    showError();
    return;
  }
  firstOperand = roundResult(result);
  operator = null;
  secondOperand = '';
  overwrite = true;
  currentEl.textContent = firstOperand;
  historyEl.textContent = '';
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    currentEl.classList.remove('error');

    if (action === 'number') inputDigit(value);
    else if (action === 'decimal') inputDecimal();
    else if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'percent') percent();
    else if (action === 'operator') setOperator(value);
    else if (action === 'equals') equals();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('−');
  else if (e.key === '*') setOperator('×');
  else if (e.key === '/') { e.preventDefault(); setOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') equals();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});

updateDisplay();
