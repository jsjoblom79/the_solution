"use strict";

import displayButton from "/js/button.js";
import displayField from "/js/inputField.js";
import displaySelectInput from "/js/selectInput.js";
import displayWindow from "/js/displayWindow.js";
import displayTwoField from "/js/displayTwoField.js";
import displayThreeFields from "/js/displayThreeFields.js";
import displayAlert from "/js/alertMessage.js";
import displayMainMenu from "/js/menu.js";
import displayFooter from "/js/displayFooter.js";
import displayAppTitleBar from "/js/appTitleBar.js";

let mainContent = document.getElementById('main-content');


window.addEventListener('pywebviewready', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    mainContent.append(
        displayAppTitleBar(
            'JMS Systems',
            'Copyright (c) 2026 JMS'
        ),
        await displayMainMenu(),
        await displayVendor(vendorId),
        await displayFooter('Vendor', 'System')
    )
});

async function displayVendor(id){
    const div = document.createElement('div');
    const vendor = await window.pywebview.api.vendor.get_vendor(id);
    if(vendor){
        const vendorWindow = await displayVendorWindow(vendor);
        const contactWindow = displayWindow("Contacts", true);
        const productWindow = displayWindow("Products", true);
        const invoiceWindow = displayWindow("Invoices", true);
        const noteWindow = displayWindow("Notes", true);

        div.append(vendorWindow, contactWindow, productWindow, invoiceWindow, noteWindow);
    }
    return div;
}

async function displayVendorWindow(vendor){
    console.log(vendor.create_date);
    const dispWin = displayWindow(vendor.name + " Company Information", false);
    const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input',vendor.name);
    const add1Field = await displayField('Add 1', 'vendor-add1', 'text', 'gs-input',vendor.address1);
    const add2Field = await displayField('Add 2', 'vendor-add2', 'text', 'gs-input',vendor.address2);
    const cityField = await displayField('City', 'vendor-city', 'text', 'gs-input',vendor.city);
    const stateField = await displayField('State', 'vendor-state', 'text', 'gs-input', vendor.state);
    const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input', vendor.zip);
    const countryField = await displayField('Country', 'vendor-country', 'text', 'gs-input',vendor.country);
    const websiteField = await displayField('Website', 'vendor-website', 'text', 'gs-input',vendor.website);
        const cdField = await displayField('Created','vendor-cd','date','gs-input',returnDate(vendor.create_date));
    const udField = await displayField('Last Updated', 'vendor-ud', 'date', 'gs-input', returnDate(vendor.modify_date));
    const updateButton = displayButton('Update',['gs-btn','gs-btn--primary'], async() => {
        const result = await window.pywebview.api.vendor.update_vendor(vendor);
        if(result){
            displayAlert('Vendor updated','success','alert-message');
        }

    });


    const line2 = await displayTwoField([add1Field, add2Field]);
    const line3 = await displayThreeFields([cityField, stateField, zipField]);
    const line4 = await displayTwoField([countryField, websiteField]);
    const line5 = await displayThreeFields([updateButton, cdField, udField])
    dispWin.winBody.append(nameField, line2, line3, line4, line5);
    return dispWin;
}

function returnDate(dateString){
    return dateString.substring(0,10);
}