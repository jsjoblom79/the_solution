
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
        let section = document.getElementById("applications");
        names.forEach(item => {
            display_system(section, item.name, item.url);
        });
    } catch (error) {
        console.error("Failed to fetch system names.", error);
    }

}

// Display the different Systems
function display_system(section, name, url) {
    let span = document.createElement('span');
    let a  = document.createElement('a');
    a.textContent = name;
    a.href = url;
    // a.addEventListener('click', function(){
    //     window.pywebview.api.navigate_to(url);
    // });
    span.appendChild(a);
    section.appendChild(span);
}