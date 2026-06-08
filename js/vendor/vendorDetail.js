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
import displayTextAreaField from "/js/textareaField.js";

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
        const noteWindow = await displayNoteWindow(id);

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
    const contactTableWin = displayWindow('Contacts', true, false);
    const vendorContacts = await window.pywebview.api.vendor.get_all_contacts(id);
    const contactTable = await displayTables(
        'vendor-contacts',
        ['Name', 'Phone', 'Email','Active'],
        vendorContacts,
        ['fullname','phone', 'email', 'is_active'],
        ['fullname','phone', 'email', 'is_active']
        );
    contactTableWin.winBody.append(contactTable);
    const contactDetailWin = displayWindow('Add Contact');

    let contact;

    const contactFName = await displayField('First Name','contact-first_name', 'text', 'gs-input');
    const contactLName =  await displayField('Last Name', 'contact-last_name', 'text', 'gs-input');
    const contactPhone =  await displayField('Phone', 'contact-phone', 'text', 'gs-input');
    const contactEmail =  await displayField('Email', 'contact-email', 'text', 'gs-input');
    const contactTitle =  await displayField('Title', 'contact-title', 'text', 'gs-input');
    const contactActive =  await displayField('Active', 'contact-is_active', 'checkbox', 'gs-input');
    const contactLastUpdated =  await displayField('Last Update', 'contact-modify_date', 'date', 'gs-input');
    const contactLine1 = await displayTwoField([contactFName, contactLName]);
    const contactLine2 = await displayThreeFields([contactPhone, contactEmail, contactActive]);
    const contactLine3 = await displayTwoField([contactTitle, contactLastUpdated]);

    const fieldList = [contactFName, contactLName, contactPhone, contactEmail, contactTitle, contactLastUpdated];
    const contactAddButton = await displayButton('Add',['gs-btn', 'gs-btn--primary'], async() => {
        const newContact = {};
        fieldList.forEach(field => {
           const key = field.input.id.replace('contact-','');
           newContact[key] = field.input.value;
        });
        newContact['vendor_id'] = id;
        const contactResult = await window.pywebview.api.vendor.add_contact(newContact);
        contactTable.addRow(newContact);
    });
    const contactUpdateButton = await displayButton('Update', ['gs-btn', 'gs-btn--primary'], async() => {
        fieldList.forEach(field => {
            const key = field.input.id.replace('contact-', '');
            contact[key] = field.input.value;
        });
        const contactResult = await window.pywebview.api.vendor.update_contact(contact);
        const newData = await window.pywebview.api.vendor.get_all_contacts(id);
        contactTable.refresh(newData);
    });
    const clearContact = () => {
        contact = null;
        fieldList.forEach(field => {
            field.input.value = null;
        });
    }
    const loadContactDetail = (contact, from=null) => {
        fieldList.forEach(field =>{
           const key = field.input.id.replace('contact-','');
           field.input.value = contact[key];
           if(key === 'is_active'){field.input.checked = !!contact[key];}
        });
    }

    contactTable.addEventListener('rowselect', (e) => {
        if(e.detail === null){
            contactDetailWin.removeContent(contactUpdateButton);
            contactDetailWin.addContent(contactAddButton);
            clearContact();
            contactDetailWin.setTitle('Add Contact');
        } else {
            // Ensures contact is removed if already selected.
            clearContact();
            contact = e.detail;
            loadContactDetail(contact);
            if(contactDetailWin.winBody.contains(contactAddButton)){
                contactDetailWin.removeContent(contactAddButton);
                contactDetailWin.addContent(contactUpdateButton);
            }
            contactDetailWin.setTitle(`Update Contact ${contact.fullname}`);
        }
    });

    contactDetailWin.winBody.append(contactLine1, contactLine2, contactLine3, contactAddButton);
    dispWin.winBody.append(contactTableWin, contactDetailWin);
    return dispWin;
}

async function displayVendorProducts(id){
    const winDiv = await displayWindow("Products", true);
    const products = await window.pywebview.api.vendor.get_all_products(id);
    const fields = ['item_number','name','description', 'update_date'];
    const tableWin = await displayWindow("Product List", true, false);
    let product = null;

    const header = ['Item Number', 'Name', 'Description', 'Last Bill Date'];

    const productTable = await displayTables('product-table', header, products, fields);

    //Body is only created if there are products
    if(Array.isArray(products) && products.length > 0){

        tableWin.winBody.append(productTable);
        // This is the update button only
        const updateButton = displayButton('Update', ['gs-btn','gs-btn--primary'], async() => {
            updFields.forEach(field => {
               const key = field.input.id.replace('product-','');
               product[key] = field.input.value;
            });
            const newProduct = await window.pywebview.api.vendor.update_product(product);
            updateProductInfo(newProduct);
        });


    }
    // Create all the fields
    const productItemNumber = await displayField('Item Number', 'product-item_number','text','gs-input');
    const productName = await displayField('Name', 'product-name', 'text', 'gs-input');
    const productDescription = await displayField('Description','product-description', 'text', 'gs-input');
    const productModel = await displayField('Model', 'product-model', 'text', 'gs-input');
    const productSerial = await displayField('Serial', 'product-serial', 'text', 'gs-input');
    const productServiceLevel = await displayField('Service Level', 'product-service_level', 'text', 'gs-input');
    const productUpdateDate = await displayField('Update Date', 'product-update_date',  'date', 'gs-input');
    const productIsUsed = await displayField('IN USE', 'product-is_used', 'checkbox', 'gs-input');
    const productPrice = await displayField('Price', 'product-price', 'text', 'gs-input');
    // Create the rows
    const rowOneFields = displayTwoField([productName, productItemNumber]);
    const rowTwoFields = displayTwoField([productDescription, productPrice]);
    const rowThreeFields = displayThreeFields([productModel, productSerial, productServiceLevel]);
    const rowFourFields = displayTwoField([productUpdateDate, productIsUsed]);


    const updFields = [productItemNumber, productName, productDescription, productModel, productSerial, productServiceLevel, productUpdateDate, productIsUsed];
    const updateProductInfo = async(product) => {
        updFields.forEach(field => {
            const key = field.input.id.replace('product-', '');
            if(key.includes('date')){
                const fieldValue = product?.[key] ?? ''
                field.input.value = fieldValue ? returnDate(product[key]) : '';
            } else {
                field.input.value = product?.[key] ?? '';

                if(key === 'is_used'){
                    field.input.checked = product[key] === 1;
                }
            }
        });
        const prodPrice = await window.pywebview.api.vendor.get_product_price(product.id);
        if(prodPrice){
          productPrice.input.value = `$ ${prodPrice.price}`;
        }

    };

    const getNewProduct = () => {
        let newProduct = {};
        updFields.forEach(field => {
            const key = field.input.id.replace('product-', '');
            newProduct[key] = field.input.value;
            if(key === 'is_used'){
                console.log('is_used.');
                newProduct[key] = field.input.checked ? 1 : 0;
            }

        });
        newProduct['id'] = product.id;
        newProduct['vendor_id'] = id;
        return newProduct;
    };

    const getNewPrice = (product_id) => {
        return {
            product_id: product_id.id,
            price: productPrice.input.value.replace("$ ", ''),
            is_active: 1
        };
    }

    const clearProduct = () => {
        updFields.forEach(field => {
            field.input.value = null;
        });
        productPrice.input.value = null;
    }


    const productAddWin = await displayWindow('Add Product', true, true);

    const productAddButton = displayButton('Add', ['gs-btn', 'gs-btn--primary'], async() => {
        const newProduct = await window.pywebview.api.vendor.add_product(getNewProduct());
        const newPrice = getNewPrice(newProduct);
        console.log(newPrice);
        const addedPrice = await window.pywebview.api.vendor.add_product_price(newPrice);
        productTable.addRow(newProduct);
    });

    const productUpdateButton = displayButton('Update', ['gs-btn', 'gs-btn--primary'], async() => {
        const newProduct = await window.pywebview.api.vendor.update_product(getNewProduct());
        const newDataArray = await window.pywebview.api.vendor.get_all_products(id);
        const newPrice = getNewPrice(newProduct);
        const addedPrice = await window.pywebview.api.vendor.add_product_price(newPrice);
        productTable.refresh(newDataArray);
    });

    productAddWin.winBody.append(rowOneFields, rowTwoFields, rowThreeFields, rowFourFields, productAddButton);

    productTable.addEventListener('rowselect', (e) => {
        if( e.detail === null){
            console.log('')
            productAddWin.removeContent(productUpdateButton);
            productAddWin.addContent(productAddButton);
            clearProduct();
            productAddWin.setTitle("add Product");
        } else {
            clearProduct();
            product = e.detail;
            updateProductInfo(product);
            if(productAddWin.winBody.contains(productAddButton)){
                productAddWin.removeContent(productAddButton);
                productAddWin.addContent(productUpdateButton);
            }
            productAddWin.setTitle("update Product");
        }
    });

    winDiv.winBody.append(tableWin, productAddWin);
    return winDiv;
}

async function displayNoteWindow(id) {
    const noteWin = await displayWindow('Vendor Comments', true, true);
    const noteTableWin = await displayWindow('Previous Notes', true, false);
    const addNoteWin = await displayWindow('Add Notes', true, true);
    const notes = await window.pywebview.api.vendor.get_vendor_comments(id);
    const header = ['Date', 'Comment'];
    const displayAndOrder = ['create_date', 'comment'];
    const tableComments = await displayTables('vendor-comments',header, notes, displayAndOrder, displayAndOrder);

    const addNoteField = await displayTextAreaField('Comment', 3, 'vendor-note');
    const addNoteButton = await displayButton('Add', ['gs-btn', 'gs-btn--primary'],async() => {
        const comment = {
            vendor_id: id,
            comment: addNoteField.input.value
        }
        const result = await window.pywebview.api.vendor.add_comment(comment);
        if (result.id !== null){
            addNoteField.input.value = null;
            const newNotes = await window.pywebview.api.vendor.get_vendor_comments(id);
            tableComments.refresh(newNotes);
        }
    });
    addNoteWin.winBody.append(addNoteField, addNoteButton);
    noteTableWin.winBody.append(tableComments);
    noteWin.winBody.append(noteTableWin, addNoteWin);

    return noteWin;
}