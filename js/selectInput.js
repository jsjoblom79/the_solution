"use strict";

export default function displaySelectInput(name, options, classList, id, event = null){
    const div = document.createElement('div');
    div.classList.add('gs-field');

    const select = document.createElement('select');
    select.classList.add(classList);
    select.id = id;

    //verify options are arrays
    const selOption = {textContent: 'Select an option to continue', value:'-1'};
    if(Array.isArray(options)){
        const firstOpt = document.createElement('option');
        firstOpt.textContent = selOption.textContent;
        firstOpt.value = selOption.value;
        select.append(firstOpt);

        for(const option of options){
            const opt = document.createElement('option');
            opt.textContent = option.name;
            opt.value = option.id;
            select.append(opt);
        }
    } else {
        const noOption = document.createElement('option');
        noOption.textContent = 'Add an option to continue';
        noOption.value = '-1';
        select.append(noOption);
    }
    if(event){
       select.addEventListener('change', event);
    }

    div.append(select);
    div.select = select;
    return div;
}