"use strict";

export default function displayWindow(title, hasDropDown=true, isCollapsed=true){
    //Creates a div window
    const divWin = document.createElement('div');
    divWin.classList.add('gs-window', 'gs-mb-1');
    //const titleId =
    divWin.id = title.replaceAll(' ','-').replaceAll(/[^\w\s-]/g,'');
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
        ctrlBtn.textContent = isCollapsed ? '▲' : '▽';
        ctrlBtn.setAttribute('aria-label', isCollapsed ? 'Expand' : 'Collapse');
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
    winBody.classList.add('gs-window__body');
    if(isCollapsed){
        winBody.classList.add('gs-window__body--collapsed');
    }

    // Put it all together
    titlebar.append(spanTitle);
    divWin.append(titlebar, winBody)
    divWin.winBody = winBody;

    divWin.setTitle = (title) => { spanTitle.textContent = title; };
    divWin.addContent = (...elements) => { winBody.append(...elements); };
    divWin.removeContent = (element) => { winBody.removeChild(element); };
    divWin.clearContent = () => { winBody.replaceChildren(); };

    return divWin;
}