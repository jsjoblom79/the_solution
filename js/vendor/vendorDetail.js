let vendorId;
let vendor;
let contacts;

window.addEventListener('pywebviewready', () => {
    const urlParams = new URLSearchParams(window.location.search);

    vendorId = urlParams.get('id');
    displayVendor(vendorId);
    displayContacts(vendorId);
    getComments();

});

async function displayVendor(vendor_id) {
    const appVersion = await window.pywebview.api.config.getVersion();

    vendor = await window.pywebview.api.vendor.get_vendor(vendorId);

    if (vendor != null){
        // vendorName.textContent = vendor.name;
        document.getElementById('appVer').innerHTML = `${appVersion}`;
        document.getElementById('vendor-footer').innerHTML = `${vendor.name}`;
        document.getElementById('vendorname').value = vendor.name;
        document.getElementById('vendor-address1').value = vendor.address1;
        document.getElementById('vendor-address2').value = vendor.address2;
        document.getElementById('vendor-city').value = vendor.city;
        document.getElementById('vendor-state').value = vendor.state;
        document.getElementById('vendor-zip').value = vendor.zip;
        document.getElementById('vendor-country').value = vendor.country;
        document.getElementById('vendor-website').value = vendor.website;
        document.getElementById('create-date').value = vendor.create_date;
        document.getElementById('modify-date').value = vendor.modify_date;
    }


}

async function displayContacts(vendorId) {
    contacts = await window.pywebview.api.vendor.get_all_contacts(vendorId);
    const vendorContacts = document.getElementById('vendor-contacts');
    vendorContacts.innerHTML = "";

    if (contacts.length === 0){
        const p = document.createElement('p');
        p.textContent = "No Contacts Added";
        vendorContacts.appendChild(p);
    } else {
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = `${contact.first_name} ${contact.last_name}`;
            li.onclick = getContact(`${contact.first_name} ${contact.last_name}`, vendorId);
            li.classList.add('gs-sidebar__link')
            li.addEventListener('click', () => {
                const links = document.querySelectorAll('.gs-sidebar__link');
                links.forEach(l => l.classList.remove('gs-sidebar__link--active'));
                li.classList.toggle('gs-sidebar__link--active');
                getContact(`${contact.first_name} ${contact.last_name}`, vendorId);
            });
            vendorContacts.appendChild(li);
        });

    }
    displayNoteContacts();
}


async function getContact(name, vendor_id) {
    const contact = await window.pywebview.api.vendor.get_contact(name, vendor_id);
    displayContact(contact);
}

function displayContact(contact) {
    const fname = document.getElementById('contact-fname');
    const lname = document.getElementById('contact-lname');
    const phone = document.getElementById('contact-phone')
    const email = document.getElementById('contact-email');
    const title = document.getElementById('contact-title');
    const is_active = document.getElementById('contact-active');

    is_active.checked = !!contact.is_active;

    fname.value = contact.first_name;
    lname.value = contact.last_name;
    phone.value = contact.phone;
    email.value = contact.email;
    title.value = contact.title;
    document.getElementById('contact-cd').value = contact.create_date;
    document.getElementById('contact-md').value = contact.modify_date;
}

async function addContact() {
        const fname = document.getElementById('contact-fname');
        const lname = document.getElementById('contact-lname');
        const phone = document.getElementById('contact-phone')
        const email = document.getElementById('contact-email');
        const title = document.getElementById('contact-title');
        const is_active = document.getElementById('contact-active');
        if (is_active.checked){
            is_active.value = 1;
        } else {
            is_active.value = 0;
        }
    const newContact = {
        first_name: fname.value,
        last_name: lname.value,
        phone: phone.value,
        email: email.value,
        title: title.value,
        is_active: is_active.value,
        vendor_id: vendorId
    };

    results = await pywebview.api.vendor.add_contact(newContact);

    if(results != null){
        alert("Contact saved.");
        clearContact();
    }
}

function clearContact() {
    document.getElementById('contact-fname').value = '';
    document.getElementById('contact-lname').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-title').value = '';
    document.getElementById('contact-active').checked = false;
    document.getElementById('contact-cd').value = '';
    document.getElementById('contact-md').value = '';
}

// Notes Section
async function displayNoteContacts(){
    const contactSelect = document.getElementById('selected-contact');
    if (contactSelect){
        const option = document.createElement('option');
        option.value = '-1';

        const hasContacts = Array.isArray(contacts) && contacts.length > 0;

        option.textContent = hasContacts ? "Select a contact" : "Add contacts to continue";
        contactSelect.appendChild(option);
    }

    contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.id;
        option.textContent = `${contact.first_name} ${contact.last_name}`;
        contactSelect.appendChild(option);
    });
}

async function addNote(){
    const note = document.getElementById('vendor-comment');
    if (note.value != null){
        newComment = {
            contact_id: document.getElementById('selected-contact').value,
            vendor_id: vendorId,
            comment: note.value
        }
        result = await window.pywebview.api.vendor.add_comment(newComment);
        if (result) {
            note.value = '';
            document.getElementById('selected-contact').value = '-1';
            getComments()
        }
    }
}

async function getComments(){
    const table_row = document.getElementById('comment-body');
    table_row.innerHTML  = ``;
    const comments = await window.pywebview.api.vendor.get_vendor_comments(vendorId);
    const hasComments = Array.isArray(comments) && comments.length > 0;

    if(hasComments){
        comments.forEach(comment => {
            const tr = document.createElement('tr');
        tr.innerHTML = `<td>${formatStringDatetime(comment.create_date)}</td><td>${comment.comment}</td>`;
        table_row.appendChild(tr);
        });


    }
}

function formatStringDatetime(unformatted) {
    const date = new Date(unformatted.replace(" ", "T"));
    const formatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    return formatter.format(date);
}

// Product information

async function displayProducts(vendorId){
    const products = await window.pywebview.api.vendor.get_all_products(vendorId);
    const product_table = document.getElementById('product-table-body');
    const hasProducts = Array.isArray(products) && products.length > 0;

    if (hasProducts){
        product_table.innerHTML = ``;
        products.forEach(product => {
           const tr = document.createElement('tr');
           tr.innerHTML = `
                    <td>${product.item_number}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${product.updated_date}</td>
                    `;
        });
        product_table.appendChild(tr);
    }
}

async function addProduct() {
    newProduct = {
        item_number: document.getElementById('product-item-number').value,
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        model: document.getElementById('product-model').value,
        serial: document.getElementById('product-serial').value,
        service_level: document.getElementById('product-service-level').value,
        is_used: document.getElementById('product-isUsed').value,
        vendor_id: vendorId
    }
    result = window.pywebview.api.vendor.add_product(newProduct);

    if (result){
        const message = document.getElementById('product-message');
        const div = document.createElement('div');
        div.classList.add('gs-alert','gs-alert--success');
        div.innerHTML = `<span class="gs-alert__lable">Success</span> ${newProduct.name} has been created.`;
        message.appendChild(div);
        clearProductForm();
    }
}

function clearProductForm() {
    document.getElementById('product-item-number').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-model').value = '';
    document.getElementById('product-serial').value = '';
    document.getElementById('product-service-level').value = '';
    document.getElementById('product-isUsed').value = '';
}