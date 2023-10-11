const inputSlider = document.querySelector("[pass-lengthSlider]");
const displayLength = document.querySelector("[pass-length]");
const displayPassword = document.querySelector("[pass-display]");
const copyBtn = document.querySelector("[pass-copy]");
const copyMsg = document.querySelector("[pass-copyMsg]");
const uppercaseCheck = document.querySelector("#uprCase");
const lowercaseCheck = document.querySelector("#lwrCase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[pass-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


let password = "";
let passwordLength = 10;  //intial length
let checkCount = 0;
const symbols = "`!@#$%^&*()_+-=[]\;',./{}|:<>?";
// strength color to grey 
setIndicator("#ccc");


handleSlider();


// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    displayLength.innerText = passwordLength;

    // for setting the backgroundColor of slider 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

// to extact the value of slider after sliding 
inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


// to get number of check box ticked
function handleCheckBoxChanges(){
    checkCount=0;

    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    })

    // handling edge case 
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

// to find how many checkbox is checked
allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change' , handleCheckBoxChanges);    //make sure to pass the function without parenthesis
})




// returns a random character 
function getRandomValue(min , max)
{
    return Math.floor(Math.random() * (max  - min)) + min;
}


function generateRandomNumber() {
    return getRandomValue(0,10);   
}

function generateUprCase()
{
    return String.fromCharCode(getRandomValue(65 , 91));   //65 -> A , 90 -> Z
}

function generateLwrCase()
{
    return String.fromCharCode(getRandomValue(97 , 123));   //97 -> a , 123 -> z
}

function generateSymbols(){
    const randomNum = getRandomValue(0 , symbols.length);
    return symbols.charAt(randomNum);
}



// set strength of password 
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}


// calculate the strength of password 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6) 
        {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}




// for copy to clipboard
async function copyPassword(){
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerText = "Copied";
    }
    catch(error)
    {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    // for automatically hide the copied text  after sometime 
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}


// copy password, if generated 
copyBtn.addEventListener('click' , () =>{
    if(displayPassword.value)
    copyPassword();
});


// Shuffle the array randomly - Fisher Yates Method
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // j -> finding a random index 
        const j = Math.floor(Math.random() * (i + 1));
        // swaping the value at index i and j  
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    // storing the password after shuffling 
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// now generate the password 
generateBtn.addEventListener('click', () =>{
    // none of the checkbox is checked 
    if(checkCount == 0)
    return;

    // handling edge case 
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove prev password 
    password = "";

    // creating a array of function for including those function whose value is checked in checkbox    
    let funcArray = [];

    if(uppercaseCheck.checked){
        funcArray.push(generateUprCase);     //make sure to pass the function without parenthesis
    }

    if(lowercaseCheck.checked){
        funcArray.push(generateLwrCase);
    }

    if(numberCheck.checked){
        funcArray.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArray.push(generateSymbols);
    }

    //compulsory addition 
    for(let i=0; i<funcArray.length; i++){
        password += funcArray[i]();
    }

    // remaining addition 
    for(let i=0; i<passwordLength- funcArray.length; i++)
    {
        let randomIndex = getRandomValue(0 , funcArray.length);
        password += funcArray[randomIndex]();
    }


    // now shuffling the password to rearrange
    password = shufflePassword(Array.from(password));

    // password is ready now show it to UI 
    displayPassword.value = password;


    // and calculate the password strength 
    calcStrength();
})




