"use strict";

export default function displayButton(name, classArray, event){

    const button = document.createElement('button');
    button.textContent = name;
    button.addEventListener('click', event);

    if(Array.isArray(classArray)){
        for(const item of classArray){
            button.classList.add(item);
        }
    } else {
        button.classList.add(classArray);
    }
    //button.classList.add('gs-info');

    return button;
}