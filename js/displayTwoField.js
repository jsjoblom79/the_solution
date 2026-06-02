"use strict";

export default function displayTwoField(fields){
    if(Array.isArray(fields)){
        const div = document.createElement('div');
        div.classList.add('gs-fields-2');

        for(const field of fields){
            div.append(field);
        }
        return div;
    }
}

