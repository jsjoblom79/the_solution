"use strict";

export default function displayAlert(message, type, parentElement){
    const div = document.createElement('div');
    div.classList.add('gs-alert')
    const span = document.createElement('span');
    span.classList.add('gs-alert__label');
    const button = document.createElement('button');

    switch(type){
        case "success":
            div.classList.add('gs-alert--success');
            span.textContent = "Success ";
            break;
        case "error":
            div.classList.add('gs-alert--danger');
            span.textContent = "Error ";
            break;
        case "warning":
            div.classList.add('gs-alert--warning');
            span.textContent = "Warning ";
            break;
        case "info":
            div.classList.add('gs-alert--info');
            span.textContent = "Info ";
            break;
    }

    button.classList.add('gs-btn', 'gs-btn--sm')
    button.textContent = "close";
    button.addEventListener('click', () => {
        document.getElementById(parentElement).innerHTML = ``;
    });

    div.append(span, message, button);
    return div;
}