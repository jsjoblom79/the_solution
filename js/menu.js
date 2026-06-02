"use strict";

export default async function displayMainMenu() {
    const nav = document.createElement('nav');
    nav.classList.add('gs-mb-2');
    // nav.innerHTML = ``;

    const ul = document.createElement('ul');
    ul.classList.add('gs-menubar', 'gs-mb-2');
    ul.id = 'gs-main-menubar';

    const menuItems = await window.pywebview.api.config.getUrls();
    if (menuItems.length > 0){
       for(const item of menuItems){
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.classList.add('gs-menubar__trigger');
            button.textContent = item.name;
            button.addEventListener('click', () => goToUrl(item.url));
            li.appendChild(button);
            ul.appendChild(li);
       }
       const ulli = document.createElement('li');
       const exitBtn = document.createElement('button');
       exitBtn.classList.add('gs-menubar__trigger', 'gs-btn--danger');
       exitBtn.textContent = "EXIT";
       exitBtn.addEventListener('click', async() => await window.pywebview.api.close_app());
       ulli.appendChild(exitBtn);
       ul.appendChild(ulli);
       nav.appendChild(ul);
    }
    return nav;
}

window.goToUrl = function(url){
    location.assign(url);
}

