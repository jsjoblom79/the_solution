
window.addEventListener('pywebviewready', () => {
    get_vendors();
    update_display();
});


async function get_vendors() {
    const vendorList = await window.pywebview.api.vendor.get_all_vendors();
    const selectVendors = document.getElementById('vendorList');

    if (vendorList.length == 0){
        const opt = document.createElement('option');
        opt.textContent = "Add Vendors to continue";
        opt.value = -1;
        selectVendors.appendChild(opt);
        return;
    } else {
        let selectOption = document.createElement('option');
        selectOption.value = '-1';
        selectOption.textContent = 'Select a Vendor';
        selectVendors.appendChild(selectOption);
    }

    vendorList.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id;
        option.textContent = vendor.name;
        selectVendors.appendChild(option);
    });

    const vendorListSelect = document.getElementById('vendorList');
    vendorListSelect.addEventListener('change', (event) => {
        console.log(`NewValue Selected `, event.target.value);
        const vendorSearch = document.getElementById('vendor-search');
        vendorSearch.innerHTML = "";
        const searchLink = document.createElement('a');
        searchLink.href = `/html/vendor/detail.html?id=${event.target.value}`;
        searchLink.textContent = "Search";
        searchLink.classList.add('link-btn');
        vendorSearch.appendChild(searchLink);
    });
}

function update_display(){

    const vendorAdd = document.getElementById('vendor-add');
    const vendorSelect = document.getElementById('vendorList');
    vendorAdd.innerHTML = "";


    const addLink = document.createElement('a');
    addLink.href= '/html/vendor/add.html';
    addLink.textContent= "Add Vendor";
    addLink.classList.add('link-btn');
    vendorAdd.appendChild(addLink);


}



