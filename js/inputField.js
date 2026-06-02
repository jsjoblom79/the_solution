"use strict";

export default async function displayField(name, id, type, classList, initialValue=''){
    const div = document.createElement('div');
    div.classList.add('gs-field');

    const label = document.createElement('label');
    label.for = id;
    label.textContent = name;

    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.classList.add(classList);
    input.value = initialValue;
    div.appendChild(label);
    div.appendChild(input);

    div.input = input;
    return div;
}