"use strict";

export default async function displayTextAreaField(name, rows, id, initialValue = null){
    const div = document.createElement('div');
    div.classList.add(
        'gs-field'
    );

    const label = document.createElement('label');
    label.for = id;
    label.textContent = name;

    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.rows = rows;
    textarea.classList.add('gs-input');
    if (initialValue !== null){
        textarea.value = initialValue;
    }

    div.append(label, textarea);
    div.input = textarea;
    return div;
}