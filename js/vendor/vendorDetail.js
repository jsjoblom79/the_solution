"use strict";

import displayButton from "/js/button.js";
import displayField from "/js/inputField.js";
import displayWindow from "/js/displayWindow.js";
import displayTwoField from "/js/displayTwoField.js";
import displayThreeFields from "/js/displayThreeFields.js";
import displayAlert from "/js/alertMessage.js";
import displayMainMenu from "/js/menu.js";
import displayFooter from "/js/displayFooter.js";
import displayAppTitleBar from "/js/appTitleBar.js";
import displaySelectInput from "/js/selectInput.js";

let mainContent = document.getElementById('main-content');
let alert = document.createElement('div');
alert.id = 'alert-message';
window.addEventListener('pywebviewready', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    mainContent.append(
        displayAppTitleBar(
            'JMS Systems',
            'Copyright (c) 2026 JMS'
        ),
        await displayMainMenu(),
        alert,
        await displayVendor(vendorId),
        await displayFooter('Vendor', 'System')
    )
});

async function displayVendor(id){
    const div = document.createElement('div');
    const vendor = await window.pywebview.api.vendor.get_vendor(id);
    if(vendor){
        const vendorWindow =  await displayVendorWindow(vendor);
        const contactWindow = await displayVendorContacts(id);
        const productWindow = displayWindow("Products", true);
        const invoiceWindow = displayWindow("Invoices", true);
        const noteWindow = displayWindow("Notes", true);

        div.append(vendorWindow, contactWindow, productWindow, invoiceWindow, noteWindow);
    }
    return div;
}

async function displayVendorWindow(vendor){
    console.log(vendor.create_date);
    const dispWin = displayWindow(vendor.name + " Company Information", true);
    const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input',vendor.name);
    const add1Field = await displayField('Add 1', 'vendor-address1', 'text', 'gs-input',vendor.address1);
    const add2Field = await displayField('Add 2', 'vendor-address2', 'text', 'gs-input',vendor.address2);
    const cityField = await displayField('City', 'vendor-city', 'text', 'gs-input',vendor.city);
    const stateField = await displayField('State', 'vendor-state', 'text', 'gs-input', vendor.state);
    const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input', vendor.zip);
    const countryField = await displayField('Country', 'vendor-country', 'text', 'gs-input',vendor.country);
    const websiteField = await displayField('Website', 'vendor-website', 'text', 'gs-input',vendor.website);
    const cdField = await displayField('Created','vendor-cd','date','gs-input',returnDate(vendor.create_date));
    const udField = await displayField('Last Updated', 'vendor-ud', 'date', 'gs-input', returnDate(vendor.modify_date));
    const updateButton = displayButton('Update',['gs-btn','gs-btn--primary'], async() => {

        const fieldsToSave = [nameField, add1Field, add2Field, cityField, stateField, zipField, countryField, websiteField]
        fieldsToSave.forEach(field =>{
            const key = field.input.id.replace('vendor-', '');
            vendor[key] = field.input.value;
        });

        vendor.create_date = new Date(vendor.create_date).toISOString();
        const result = await window.pywebview.api.vendor.update_vendor(vendor);
        console.log(result);
        if(result){
            const message = await displayAlert('Vendor updated ','success', alert.id);
            alert.append(message);
            udField.input.value = returnDate(result.modify_date);
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

async function displayVendorContacts(id){
    const dispWin = displayWindow("Contacts", true);
    const vendorContacts = await window.pywebview.api.vendor.get_all_contacts(id);
    const contactDiv = document.createElement('div');

    const contactFName = await displayField('First Name','contact-first-name', 'text', 'gs-input');
    const contactLName =  await displayField('Last Name', 'contact-last-name', 'text', 'gs-input');
    const contactPhone =  await displayField('Phone', 'contact-phone', 'text', 'gs-input');
    const contactEmail =  await displayField('Email', 'contact-email', 'text', 'gs-input');
    const contactTitle =  await displayField('Title', 'contact-title', 'text', 'gs-input');
    const contactActive =  await displayField('Active', 'contact-active', 'checkbox', 'gs-input');
    const contactLastUpdated =  await displayField('Last Update', 'contact-md', 'date', 'gs-input');
    let contact;
    if(Array.isArray(vendorContacts)){
        let contactList =[];
        for(const contact of vendorContacts){
            contactList.push({name: contact.first_name + ' ' + contact.last_name, id: contact.id});
            console.log(contact);
        }
        const selectContact = displaySelectInput('Contacts', contactList, 'gs-select', 'contact-select', async () => {
                contact = await window.pywebview.api.vendor.get_contact();
                contactFName.input.value = contact.first_name;
                contactLName.input.value = contact.last_name;
                contactPhone.input.value = contact.phone;
                contactEmail.input.value = contact.email;
                contactTitle.input.value = contact.title;
                contactActive.input.value = contact.active === 1 & true;
                contactLastUpdated.input.value = returnDate(contact.modify_date);
        });

        dispWin.winBody.append(selectContact);
        dispWin.winBody.append(contactFName, contactLName, contactTitle, contactPhone, contactEmail, contactActive, contactLastUpdated);
    } else {

    }

    return dispWin;
}