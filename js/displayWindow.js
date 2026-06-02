"use strict";

export default function displayWindow(title, hasDropDown=false){
    //Creates a div window
    const divWin = document.createElement('div');
    divWin.classList.add('gs-window', 'gs-mb-1');
    divWin.id = title.replace(' ', '-') + "-id";
    //Creates the title bar
    const titlebar = document.createElement('div');
    titlebar.classList.add('gs-window__titlebar');

    //title bar title
    const spanTitle = document.createElement('span');
    spanTitle.textContent = title;

    //Create the dropdown functionality if required.
    if(hasDropDown){
        const divWinCtrls = document.createElement('div');
        const ctrlBtn = document.createElement('button');
        ctrlBtn.classList.add('gs-window__btn', 'gs-window__btn--collapse');
        ctrlBtn.ariaLabel = 'Collapse';
        ctrlBtn.addEventListener('click', () =>{
            const b = document.querySelector('#' + divWin.id +' .gs-window__body');
            const collapsed = b.classList.toggle('gs-window__body--collapsed');
            ctrlBtn.textContent = collapsed ? '▲' : '▽';
            ctrlBtn.setAttribute('aria-label', collapsed ? 'Expand' : 'Collapse');
        });
        ctrlBtn.textContent = '▲';
        divWinCtrls.append(ctrlBtn);
        titlebar.append(divWinCtrls);
    }

    //Create the Body of the window.
    const winBody = document.createElement('div');
    if(hasDropDown){
        winBody.classList.add('gs-window__body','gs-window__body--collapsed');
    }
    winBody.classList.add('gs-window__body');


    // Put it all together
    titlebar.append(spanTitle);
    divWin.append(titlebar, winBody)
    divWin.winBody = winBody;

    return divWin;
}