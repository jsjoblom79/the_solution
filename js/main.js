
// Add the main event to look for the pywebview.
window.addEventListener('pywebviewready', () =>{
    getSystemNames();
    getAppVersion();
});

// Gets the application version
async function getAppVersion() {
    try {
        const ver = await window.pywebview.api.config.getVersion();
        const spanVer = document.getElementById("appVer");
        spanVer.textContent = ver;
    } catch (error) {
        console.error("Failed to get version information.");
    }
}

// This function will display a list of system names.
async function getSystemNames() {
    try {
        const names = await window.pywebview.api.config.getUrls();
        let section = document.getElementById("gs-menubar-dropdown");
        names.forEach(item => {
            display_system(section, item.name, item.url);
        });
        const exitBtn = document.createElement('li');
        exitBtn.innerHTML = `<button class="gs-btn gs-btn--danger" onclick="window.pywebview.api.close_app()">Exit</button>`;
        section.appendChild(exitBtn);
    } catch (error) {
        console.error("Failed to fetch system names.", error);
    }

}

// Display the different Systems
function display_system(section, name, url) {
    let li = document.createElement('li');
    li.innerHTML = `<button class="gs-menubar__trigger" onclick="goToUrl('${url}')">${name}</button>`;
    // let a  = document.createElement('a');
    // a.textContent = name;
    // a.href = url;
    // li.classList.add(['gs-btn','gs-menubar__item']);
    // li.appendChild(a);
    // section.appendChild(li);
    section.appendChild(li);
}

function goToUrl(url){
    location.assign(url);
}