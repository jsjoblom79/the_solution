
window.addEventListener('pywebviewready', () => {
    get_vendors();
});


async function get_vendors() {
    const vendorList = await window.pywebview.api.vendor.get_all_vendors();
    const dataList = document.getElementById('vendors');

    if (vendorList.length == 0){
        opt = document.createElement('option');
        opt.value = "Add Vendors to continue";
        dataList.appendChild(opt);
        return;
    }

    vendorList.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.name;
        dataList.appendChild(option);
    });
}

