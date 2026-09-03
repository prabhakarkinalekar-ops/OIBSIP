const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const equalsButton = document.getElementById("equals");


let currentValue = "";
let previousValue = "";
let selectedOperator = null;
let shouldResetDisplay = false;


// ===============================
// Number Buttons
// ===============================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (shouldResetDisplay) {
            currentValue = "";
            previousValue = "";
            selectedOperator = null;
            previousDisplay.textContent = "";
            shouldResetDisplay = false;
        }

        // Prevent multiple decimal points
        if (number === "." && currentValue.includes(".")) {
            return;
        }

        // Prevent unnecessary leading zero
        if (currentValue === "0" && number !== ".") {
            currentValue = "";
        }

        currentValue += number;

        updateDisplay();
    });

});


// ===============================
// Operator Buttons
// ===============================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator = button.dataset.operator;

        if (currentValue === "" && previousValue === "") {
            return;
        }

        // Operator chaining
        if (selectedOperator !== null && currentValue !== "") {
            calculate();
        }

        if (currentValue !== "") {
            previousValue = currentValue;
            currentValue = "";
        }

        selectedOperator = operator;

        previousDisplay.textContent =
            previousValue + " " + selectedOperator;
    });

});


// ===============================
// Equals Button
// ===============================

equalsButton.addEventListener("click", () => {

    if (
        previousValue === "" ||
        currentValue === "" ||
        selectedOperator === null
    ) {
        return;
    }

    // Save the complete expression BEFORE calculation
    const firstNumber = previousValue;
    const secondNumber = currentValue;
    const operator = selectedOperator;

    calculate();

    // Show the completed calculation
    previousDisplay.textContent =
        firstNumber + " " + operator + " " + secondNumber + " =";

    selectedOperator = null;
    shouldResetDisplay = true;
});


// ===============================
// Calculation Logic
// ===============================

function calculate() {

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (selectedOperator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            // Division by zero protection
            if (secondNumber === 0) {

                currentDisplay.textContent = "Error";
                previousDisplay.textContent =
                    "Cannot divide by zero";

                currentValue = "";
                previousValue = "";
                selectedOperator = null;
                shouldResetDisplay = true;

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Remove unnecessary decimal zeros
    result = Number(result.toFixed(10));

    currentValue = result.toString();
    previousValue = "";

    currentDisplay.textContent = currentValue;
}


// ===============================
// Clear Button
// ===============================

clearButton.addEventListener("click", () => {

    currentValue = "";
    previousValue = "";
    selectedOperator = null;
    shouldResetDisplay = false;

    currentDisplay.textContent = "0";
    previousDisplay.textContent = "";
});


// ===============================
// Backspace Button
// ===============================

backspaceButton.addEventListener("click", () => {

    if (shouldResetDisplay) {
        currentValue = "";
        previousDisplay.textContent = "";
        shouldResetDisplay = false;
    }

    currentValue = currentValue.slice(0, -1);

    if (currentValue === "") {
        currentDisplay.textContent = "0";
    } else {
        updateDisplay();
    }
});


// ===============================
// Update Display
// ===============================

function updateDisplay() {

    currentDisplay.textContent =
        currentValue || "0";

    if (previousValue && selectedOperator) {

        previousDisplay.textContent =
            previousValue + " " + selectedOperator;
    }
}