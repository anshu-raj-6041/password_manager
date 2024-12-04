const inputSlider = document.querySelector("[data_lengthSlider]");
const lengthDisplay = document.querySelector("[data_lengthNumber]");
const passwordDisplay = document.querySelector("[data_passwordDisplay]");
const copyBtn = document.querySelector("[data_copy]");
const copyMsg = document.querySelector("[data_copyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data_indicator]");
const generateBtn = document.querySelector(".generate_button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '@#$%^&*(){}?>|\~<';

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set circle color to grey
setIndicator("#ccc")

// set password length (Ui ko update krna)
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 15px 1px $(color)`;
    // shadow


}

function getRndInteger(min, max) {
    // 0 -- (max-min)
    // + min kyki min -- max
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    // charAt => us index pe kon sa symbol hai
    return symbols.charAt(randNum);

}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0")
    }
    else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && (passwordLength >= 6)
    ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

// wait tb hi kaam krta hai jb async operation
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";

    }
    // jb error ata hai
    catch (e) {
        copyMsg.innerText = "Failed";


    }
    // to make copy wla span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        // random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i and j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// checkbox pe eventListener
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// slider ke upr eventListener
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    // to show change in UI
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

// generate password pe eventListener
generateBtn.addEventListener('click', () => {
    // none of the checkbox is checked
    if (checkCount == 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    // remove old password
    password = "";

    // lets put the stuff mentioned by checkbox
    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition (1 condition dalna hi hai)
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < (passwordLength - funcArr.length); i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();

    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // to show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

});