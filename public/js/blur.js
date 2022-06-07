const triggerElements = {
    "[object HTMLButtonElement]": {},
    "[object HTMLInputElement]": {
        type: "submit"
    }
}

document.addEventListener('click', (e) => {
    if(Object.keys(triggerElements).includes(document.activeElement.toString()) && 
        Object.keys(triggerElements[document.activeElement.toString()]).every((value) => document.activeElement[value] == triggerElements[document.activeElement.toString()][value])
    ) document.activeElement.blur()
})