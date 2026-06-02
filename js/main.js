import displayMainMenu from "/js/menu.js";
import displayAppTitleBar from "/js/appTitleBar.js";
import displayFooter from "/js/displayFooter.js";
import displayWindow from "/js/displayWindow.js";


let mainContent = document.getElementById('main-content');
let footerContent = document.getElementById('footer');
// Add the main event to look for the pywebview.
window.addEventListener('pywebviewready', async () =>{
    const mainMenu = await displayMainMenu();

    mainContent.append(
        await displayAppTitleBar('JMS Systems', 'copyright (c) 2026 jms'),
        mainMenu

    );
    displayBodyContent();
    mainContent.append(await displayFooter("Main",'System'));
});

function displayBodyContent() {
    const vendorWindow = displayWindow('Vendor Dashboard',true);
    mainContent.append(vendorWindow);
}