"use strict";

export default function displayAppTitleBar(title, subtitle){
    const div = document.createElement('div');
    const titleSpan = document.createElement('span');
    const subtitleSpan = document.createElement('span');

    div.classList.add('gs-titlebar');
    titleSpan.textContent = title;
    subtitleSpan.classList.add('gs-titlebar__system');
    subtitleSpan.textContent = subtitle;

    div.append(titleSpan, subtitleSpan);

    return div;s
}