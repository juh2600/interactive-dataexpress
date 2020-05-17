let form = [
    {id: "username", error: true},
    {id: "email", error: true},
    {id: "dob", error: true},
    {id: "securityAnswer1", error: true},
    {id: "securityAnswer2", error: true},
    {id: "securityAnswer3", error: true}
]

const typeOfForm = document.getElementById("dataForm").dataset.method;


const init = () => {
    addPasswordsToForm();
    setEventListeners();
}

const addPasswordsToForm = () => {
    if(typeOfForm == "create") {
        form.push({id: "password", error: true});
        form.push({id: "confirmPassword", error: true});
    }
    else {
        form.push({id: "newPassword", error: true});
        form.push({id: "oldPassword", error: true});
    }
}



const submitForm = () => {
    console.log("Submit form");
    return !(hasError());
 }

const hasError = () => {
    let errorTotal = 0;
    for(let i = 0; i < form.length; i++) {
        if(form[i].error){
            errorTotal++;
            setRed(document.getElementById(form[i].id));
        }
    }
    if(errorTotal > 0) {
        document.getElementById("headErrMsg").style.visibility = "visible";
        return true;
    }
    return false;
}




const setRed = target => {
    document.getElementById(target.id).classList.add("red");
    document.getElementById(target.id).classList.remove("green");
    changeError(target.id, true);
    showErrorText(target);
}

const setGreen = target => {
    document.getElementById(target.id).classList.remove("red");
    document.getElementById(target.id).classList.add("green");
    changeError(target.id, false);
    hideErrorText(target);
}

const changeError = (id, value) => {
    for(let i = 0; i < form.length; i++) {
        if(form[i].id == id) {
            form[i].error = value;
        }
    }
}

const showErrorText = target => {
    target.parentNode.lastElementChild.style.visibility = "visible";
}

const hideErrorText = target => {
    target.parentNode.lastElementChild.style.visibility = "hidden";
}



const inputHandler = evt => {
    switch(evt.target.id) {
        case "username":
            validateLength(evt.target, 3, 32);
            break;
        case "email":
            validateEmail(evt.target);
            break;
        case "dob":
            validateDate(evt.target);
            break;
        case "password":
            validatePasswordConfirmation();
        case "newPassword":
            validatePassword(evt.target);
            break;
        case "confirmPassword":
            validatePasswordConfirmation();
            break;
        case "oldPassword":
            validateOldPassword(evt.target);
            break;
    }
    
}

const validateLength = (target, lowerBound, upperBound=512) => {
    let input = document.getElementById(target.id).value.length;
    if(input <= upperBound && input >= lowerBound) {
        setGreen(target);
    }
    else {
        setRed(target);
    }
}

const validateDate = target => {
    let input = document.getElementById(target.id).value;
    let inputDate = Date.parse(input);
    let ageLimit = new Date();
    ageLimit.setFullYear(ageLimit.getFullYear()-13);
    console.log(ageLimit);
    if(inputDate < ageLimit) {
        setGreen(target);
    }
    else{
        setRed(target);
    }
}

const validateEmail = target => {
    let input = document.getElementById(target.id).value;
    let regex = /.+@.{2,}\..{2,}/;
    if(regex.test(input)) {
        setGreen(target);
    }
    else{
        setRed(target);
    }
}

const validatePassword = target => {
    let input = document.getElementById(target.id).value;
    let regexArr = [/.{8}/,/[A-Z]/, /[a-z]/, /[0-9]/];
    for(let i = 0; i < regexArr.length; i++) {
        if(!regexArr[i].test(input)) {
            setRed(target);
            return;
        }
    }
    setGreen(target);
}

const validatePasswordConfirmation = () => {
    target = document.getElementById("confirmPassword");
    let input = document.getElementById(target.id).value;
    if(input == document.getElementById("password").value) {
        setGreen(target);
    }
    else {
        setRed(target);
    }
}

const validateOldPassword = target => {
    let input = document.getElementById(target.id).value;
}


const setEventListeners = () => {
    let inputs = document.getElementsByTagName("input");
    for(let i = 0; i < inputs.length-1; i++) {
        inputs[i].addEventListener("input", inputHandler);
    }

}


init();