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

const vendorBody = document.getElementById('main-content');
const alert = document.createElement('div');
alert.id = 'alert-message';

let vendorList;
let vendorWindow;
window.addEventListener('pywebviewready', async () => {
    const mainWindow = document.getElementById('main-content');
    vendorWindow = await displayVendorList();
    vendorBody.append(
        displayAppTitleBar("JMS Systems", "Copyright (c) 2026 JMS"),
        await displayMainMenu(),
        alert,
        vendorWindow,
        await displayAddVendor(),
        await displayFooter('Vendors','System'));
});

async function displayVendorList() {

    vendorList = await window.pywebview.api.vendor.get_all_vendors();

    const vendorSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');
    const searchBtn = displayButton('Select','gs-btn', () => goToUrl(`/html/vendor/detail.html?id=${vendorSelect.select.value}`));

    const vendorWindow = displayWindow('select vendor');
    vendorWindow.winBody.append(vendorSelect, searchBtn);

    vendorWindow.refresh = async () => {
        vendorList = await window.pywebview.api.vendor.get_all_vendors();
        const newSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');
        vendorSelect.replaceWith(newSelect.select.parentElement ?? newSelect);
    }
    return vendorWindow;
}

async function displayAddVendor(){
    const addWindow = await displayWindow('Add Vendor', true);
    const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input');
    const add1Field = await displayField('Add 1', 'vendor-add1', 'text', 'gs-input');
    const add2Field = await displayField('Add 2', 'vendor-add2', 'text', 'gs-input');
    const cityField = await displayField('city', 'vendor-city', 'text', 'gs-input');
    const stateField = await displayField('state', 'vendor-state', 'text', 'gs-input');
    const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input');
    const countryField = await displayField('country', 'vendor-country', 'text', 'gs-input');
    const websiteField = await displayField('website', 'vendor-website', 'text', 'gs-input');

    const line2 = await displayTwoField([add1Field, add2Field]);
    const line3 = await displayThreeFields([cityField, stateField, zipField]);
    const line4 = await displayTwoField([countryField, websiteField]);
    const line5 = displayButton('Add', ['gs-btn','gs-btn--primary'], () => {
        if(addVendor(nameField.input.value, add1Field.input.value, add2Field.input.value,
            cityField.input.value, stateField.input.value, zipField.input.value, countryField.input.value,
            websiteField.input.value))
        {
            nameField.input.value = '';
            add1Field.input.value = '';
            add2Field.input.value = '';
            cityField.input.value = '';
            stateField.input.value = '';
            zipField.input.value = '';
            countryField.input.value = '';
            websiteField.input.value = '';
        }

    });
    addWindow.winBody.append(nameField, line2, line3, line4, line5);
    return addWindow;
}

async function addVendor(name, add1, add2, city, state, zip, country, website){
    const newVendor = {
        name: name,
        address1: add1,
        address2: add2,
        city: city,
        state: state,
        zip: zip,
        country: country,
        website: website
    }

    const vendorReturned = await window.pywebview.api.vendor.add_vendor(newVendor);

    if(vendorReturned){
        const alert = document.getElementById('alert-message');
        const message = displayAlert("Vendor Successfully Added. ", "success", alert.id);
        alert.append(message);

        await vendorWindow.refresh();
        return true;
    }
}