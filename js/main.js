import displayTitleAndMenu from "/js/TitlebarAndMenu.js";

window.addEventListener('pywebviewready', async () =>{
    const main = await displayTitleAndMenu();
    document.body.prepend(main);
    main.mainMenu.addEventListener('itemselect', (e) => {
        navigate(e.detail.location);
    });
});

async function navigate(location){
    console.log("you want to go here.   " + location);
}

