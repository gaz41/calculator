// Event listeners for buttons
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const percentageButton = document.querySelector("[data-percentage]");
const negateButton = document.querySelector("[data-negate]");
const errorMsg = document.getElementById("error-message");
const copyright = document.getElementById("copy");

const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]",
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]",
);

let currentOperand = "0"; // Holds the current input
let previousOperand = ""; // Holds the previous input
let operation = undefined; // Holds the selected operation
let isError = false; // Tracks if an error has occurred

// Function to clear all operands and operation
function clearCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
  isError = false;
  errorMsg.innerHTML = ""; // Clear any error messages
}

// Function to delete the last digit of the current operand
function deleteLastDigit() {
  currentOperand =
    currentOperand.length === 1 // Check if the currentOperand has only one digit
      ? "0" // If true, reset to "0"
      : currentOperand.slice(0, -1); // Otherwise, remove the last digit
}

// Function to append a number to the current operand
function appendNumber(number) {
  if (isError) {
    clearCalculator(); // Clear the calculator if there was an error
  }
  if (number === "." && currentOperand.includes(".")) return; // Prevent multiple decimals

  // Update the current operand based on its current value
  currentOperand =
    currentOperand === "0" // If current operand is "0"
      ? number.toString() // Replace it with the new number
      : currentOperand + number.toString(); // Otherwise, append the new number
}

// Function to choose an operation and prepare for the next input
function chooseOperation(op) {
  if (currentOperand === "") return; // Prevent operation if no current operand
  if (previousOperand !== "") {
    compute(); // Compute if there's a previous operand
  }
  operation = op; // Set the operation
  previousOperand = currentOperand; // Store current operand as previous
  currentOperand = ""; // Reset current operand for new input
}

// Function to compute the result based on the selected operation
function compute() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return; // Exit if either operand is invalid

  let result; // Variable to store the result of the operation

  switch (operation) {
    case "+":
      result = prev + current; // Addition
      break;
    case "−":
      result = prev - current; // Subtraction
      break;
    case "×":
      result = prev * current; // Multiplication
      break;
    case "÷":
      if (current === 0) {
        isError = true; // Set error state for division by zero
        displayError("Cannot divide by zero"); // Display error message
        return; // Exit the function
      } else {
        result = prev / current; // Division
      }
      break;
    default:
      return; // Exit if no valid operation is specified
  }

  // Format the result to a maximum of 10 decimal places and remove trailing zeros
  currentOperand = result.toFixed(10).replace(/\.?0+$/, ""); // Format result
  operation = undefined; // Reset the operation for the next calculation
  previousOperand = ""; // Clear the previous operand for the next input
}

// Display error message
function displayError(message) {
  currentOperand = "∞"; // Display infinity for division by zero
  operation = undefined; // Reset operation
  previousOperand = ""; // Clear previous operand
  errorMsg.innerText = message; // Display error message
}

// Function to calculate percentage for current operand
function calculatePercentage() {
  // Check if there is a current operand to work with
  if (currentOperand) {
    // Parse previous and current operands as floating-point numbers
    let prev = parseFloat(previousOperand);
    let curr = parseFloat(currentOperand);

    // Validate that both operands are numbers
    if (isNaN(prev) || isNaN(curr)) return; // Exit if validation fails

    let currPercent = prev * (curr / 100); // Calculate the percentage of the previous operand
    let currPercent2 = curr / 100; // Calculate the percentage of the current operand

    switch (operation) {
      case "+":
      case "−":
        currentOperand = currPercent.toString(); // Update current operand for addition/subtraction
        break;
      case "×":
      case "÷":
        currentOperand = currPercent2.toString(); // Update current operand for multiplication/division
        break;
      default:
        currentOperand = currPercent2.toString(); // Default case if no valid operation is found
    }
  }
}

// Function to negate the current operand
function negateCurrentOperand() {
  // Check if the current operand is not "0" and not an empty string
  if (currentOperand !== "0" && currentOperand !== "") {
    // Negate the value by multiplying by -1 and convert it back to a string
    currentOperand = (parseFloat(currentOperand) * -1).toString();
  }
}

// Function to format the number for display
function getDisplayNumber(number) {
  if (number === "∞") return number; // Handle infinity
  if (number.startsWith(".")) return "0" + number; // Prepend '0' to numbers starting with '.'
  const stringNumber = number.toString(); // Convert the number to a string for processing
  const [integerPart, decimalPart] = stringNumber.split("."); // Split the string into integer and decimal parts
  // Format the integer part with locale-specific comma placement
  const integerDisplay = isNaN(parseFloat(integerPart))
    ? "" // If the integer part is not a number, return an empty string
    : parseFloat(integerPart).toLocaleString("en", {
        maximumFractionDigits: 0, // No decimal places for the integer part
      });
  // Return the formatted number, including the decimal part if it exists
  return decimalPart ? `${integerDisplay}.${decimalPart}` : integerDisplay; // Format display
}

// Function to update the display with current and previous operands
function updateDisplay() {
  const calculationString = `${getDisplayNumber(previousOperand)} ${operation}`; // Prepare calculation string
  currentOperandTextElement.innerText = getDisplayNumber(currentOperand); // Update current operand display
  previousOperandTextElement.innerText = operation ? calculationString : ""; // Update previous operand display
}

// Event listener for number buttons
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentOperand === "0" && button.innerText !== ".") {
      currentOperand = button.innerText; // Start new number
    } else {
      appendNumber(button.innerText); // Append number
    }
    updateDisplay(); // Update display
  });
});

// Event listeners for operation buttons
operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentOperand !== "") {
      chooseOperation(button.innerText); // Choose operation
      updateDisplay(); // Update display
    } else {
      operation = button.innerText; // Set operation if no current operand
    }
  });
});

// Event listener for equals button
equalsButton.addEventListener("click", () => {
  if (currentOperand !== "") {
    compute(); // Compute result
    updateDisplay(); // Update display
    previousOperand = currentOperand; // Store result as previous operand
    currentOperand = ""; // Reset current operand
  }
});

// Event listener for all clear button
allClearButton.addEventListener("click", () => {
  clearCalculator(); // Clear calculator
  updateDisplay(); // Update display
});

// Event listener for delete button
deleteButton.addEventListener("click", () => {
  deleteLastDigit(); // Delete last digit
  updateDisplay(); // Update display
});

// Event listener for percentage button
percentageButton.addEventListener("click", () => {
  calculatePercentage(); // Calculate percentage
  updateDisplay(); // Update display
});

// Event listener for negate button
negateButton.addEventListener("click", () => {
  if (currentOperand !== "") {
    negateCurrentOperand(); // Negate current operand
    updateDisplay(); // Update display
  }
});

// Initialize display to show '0' on load
updateDisplay();

// Dynamically generate copyright information
copyright.innerHTML =
  "Copyright &copy; " +
  new Date().getFullYear() +
  ` <a href="https://www.gaz41.com">gaz41.com</a>. <span class="copy2">All Rights Reserved</span>`;
