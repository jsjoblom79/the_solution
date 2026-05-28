window.addEventListener('pywebviewready', () => {

});

async function addVendor() {
    const vendorName = document.getElementById('vendor-name');
    const vendorAdd1 = document.getElementById('vendor-address1');
    const vendorAdd2 = document.getElementById('vendor-address2');
    const vendorCity = document.getElementById('vendor-city');
    const vendorState = document.getElementById('vendor-state');
    const vendorZip = document.getElementById('vendor-zip');
    const vendorCountry = document.getElementById('vendor-country');
    const vendorWebsite = document.getElementById('vendor-website');


    let newVendor = {
        name: vendorName.value,
        address1: vendorAdd1.value,
        address2: vendorAdd2.value,
        city: vendorCity.value,
        state: vendorState.value,
        zip: vendorZip.value,
        country: vendorCountry.value,
        website: vendorWebsite.value
    }

    vendorReturned = await window.pywebview.api.vendor.add_vendor(newVendor);

    if (vendorReturned != null){
        alert("Vendor Successfully Added.");
        clearVendorValues();
    }
}

function clearVendorValues(){
    document.getElementById('vendor-name').value = null;
}