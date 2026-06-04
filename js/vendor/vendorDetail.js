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
import displayTables from "/js/tableDisplay.js";

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
        const productWindow = await displayVendorProducts(id);
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

    const contactFName = await displayField('First Name','contact-first_name', 'text', 'gs-input');
    const contactLName =  await displayField('Last Name', 'contact-last_name', 'text', 'gs-input');
    const contactPhone =  await displayField('Phone', 'contact-phone', 'text', 'gs-input');
    const contactEmail =  await displayField('Email', 'contact-email', 'text', 'gs-input');
    const contactTitle =  await displayField('Title', 'contact-title', 'text', 'gs-input');
    const contactActive =  await displayField('Active', 'contact-is_active', 'checkbox', 'gs-input');
    const contactLastUpdated =  await displayField('Last Update', 'contact-md', 'date', 'gs-input');
    const contactLine1 = await displayTwoField([contactFName, contactLName]);
    const contactLine2 = await displayThreeFields([contactPhone, contactEmail, contactActive]);
    const contactLine3 = await displayTwoField([contactTitle, contactLastUpdated]);
    let contact;
    const listToSave = [contactFName, contactLName, contactPhone, contactEmail, contactTitle, contactActive];
    if(Array.isArray(vendorContacts) && vendorContacts.length > 0){
        let contactList =[];
        for(const contact of vendorContacts){
            contactList.push({name: contact.first_name + ' ' + contact.last_name, id: contact.id});
        }
        const selectContact = displaySelectInput('Contacts', contactList, 'gs-select', 'contact-select', async (event) => {
                contact = await window.pywebview.api.vendor.get_contact_ById(event.target.value);
                console.log(event.target.options[event.target.selectedIndex].text);
                contactFName.input.value = contact.first_name;
                contactLName.input.value = contact.last_name;
                contactPhone.input.value = contact.phone;
                contactEmail.input.value = contact.email;
                contactTitle.input.value = contact.title;
                contactActive.input.checked = !!contact.is_active;
                contactLastUpdated.input.value = returnDate(contact.modify_date);
        });

        const updateButton = displayButton('Update', ['gs-btn', 'gs-btn--primary'], async() =>{
            listToSave.forEach(field =>{
                const key = field.input.id.replace('contact-','');
                if(key === 'is_active'){
                    contact[key] = field.input.checked ? 1 : 0;
                } else {
                  contact[key] = field.input.value;
                }
            });
            const resultContact = await window.pywebview.api.vendor.update_contact(contact);

            if(resultContact){
                const contactAlert = await displayAlert(resultContact.fullname + " has been updated", 'success', alert.id);
                alert.append(contactAlert);
            }
        });
        dispWin.winBody.append(selectContact);
        dispWin.winBody.append(contactLine1, contactLine2, contactLine3, updateButton);

    } else {

        const addButton = displayButton('Add', ['gs-btn', 'gs-btn--primary'], async() =>{
            const newContact = {};
            listToSave.forEach(field =>{
               const key = field.input.id.replace('contact-','');
               if(key === "is_active"){
                   newContact[key] = field.input.checked ? 1 : 0;
               } else {
                 newContact[key] = field.input.value;
               }
            });
            newContact['vendor_id'] = id;
            const resultContact = await window.pywebview.api.vendor.add_contact(newContact);

            if(resultContact){
                const contactAlert = await displayAlert(resultContact.fullname + " has been added.",'success', alert.id);
                alert.append(contactAlert);
            }
        });
        dispWin.winBody.append(contactLine1, contactLine2, contactLine3, addButton);
    }

    return dispWin;
}

async function displayVendorProducts(id){
    const winDiv = await displayWindow("Products", true);
    const products = await window.pywebview.api.vendor.get_all_products(id);
    const fields = ['item_number','name','description', 'update_date'];
    const tableWin = await displayWindow("Product List", true, false);

    if(Array.isArray(products) && products.length > 0){
        const header = ['Item Number', 'Name', 'Description', 'Last Bill Date', 'Price'];
        const productTable = await displayTables('product-table', header, products, fields);
        tableWin.winBody.append(productTable);
        productTable.addEventListener('rowselect', (e) => {
            displayProductInfo(e.detail);
        });
    }

    const productInfoWin = await displayWindow('Product Details', true, true);
    const displayProductInfo = (product) => {
        console.log("You selected " + product.name);
    };

    winDiv.winBody.append(tableWin, productInfoWin);
    return winDiv;
}