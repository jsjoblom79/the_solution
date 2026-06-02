"use strict";

export default async function displayFooter(leftInfo, rightInfo){
    const footer = document.createElement('footer');
    const leftSpan = document.createElement('span');
    const appSpan = document.createElement('span');
    const rightSpan = document.createElement('span');

    footer.classList.add('gs-statusbar');
    leftSpan.classList.add('gs-statusbar__segment');
    appSpan.classList.add('gs-statusbar__segment');
    rightSpan.classList.add('gs-statusbar__segment');
    const version = await window.pywebview.api.config.getVersion();
    leftSpan.textContent = leftInfo;
    appSpan.textContent = version;
    rightSpan.textContent = rightInfo;

    footer.append(leftSpan, appSpan, rightSpan);
    return footer;
}