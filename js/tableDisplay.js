"use strict";

import displayField from "/js/inputField.js";

export default async function displayTables(tableId, headerArray, dataArray, filterTableResultsArray=[], displayOrderArray=[]){
    const tableDiv = document.createElement('div');
    const table = document.createElement('table');
    table.id=tableId;
    table.classList.add('gs-table');
    const thead = document.createElement('thead');
    thead.style.position = 'sticky';
    thead.style.background = '#050e05';
    const first_tr = document.createElement('tr');
    for(const item of headerArray){
        const th = document.createElement('th');
        th.textContent = item;
        th.style.position = 'sticky';
        th.style.top = '0';
        th.style.zIndex = '2';
        th.style.background = '#050e05';

        first_tr.append(th);
    }
    thead.append(first_tr);
    const tbody = document.createElement('tbody');

    const getRows = () => {
        Array.from(tbody.rows).forEach(row => row.classList.remove('selected-row'));
    };


    // Determine the ordered list of keys to render.
    // If displayOrderArray is provided, use it as the canonical order (filtered
    // to only keys that also appear in filterTableResultsArray when that list is
    // non-empty). Otherwise fall back to filterTableResultsArray order, then
    // finally natural object-key order.
    const resolveKeyOrder = (data) => {
        const filter = filterTableResultsArray.length ? filterTableResultsArray : null;
        if (displayOrderArray.length) {
            return displayOrderArray.filter(k => (!filter || filter.includes(k)) && Object.prototype.hasOwnProperty.call(data, k));
        }
        return filter ? filter.filter(k => Object.prototype.hasOwnProperty.call(data, k)) : Object.keys(data);
    };

    const createRow = (data) => {
        const tr = document.createElement('tr');

        for (const key of resolveKeyOrder(data)) {
            const td = document.createElement('td');
            td.textContent = data[key];
            if(key.includes('date') && data[key] != null){
                const [year, month, day] = data[key].substring(0, 10).split('-');
                td.textContent = `${month}/${day}/${year}`;//data[key].substring(0, 10);
            }
            console.log(typeof data[key]);
            if(typeof data[key] === 'boolean'){
                if(data[key]){ td.textContent = 'X';} else { td.textContent = '';}
            }
            tr.append(td);
        }
        tr.addEventListener('click', ()=>{
            if(tr.classList.contains('selected-row')){
                tr.classList.remove('selected-row');
                tableDiv.selectedRow = null;
                tableDiv.dispatchEvent(new CustomEvent('rowselect', { detail: null }));
            } else {
                getRows();
                tr.classList.add('selected-row');
                tableDiv.selectedRow = data;
                tableDiv.dispatchEvent(new CustomEvent('rowselect', { detail: data }));
            }
        });
        return tr;
    }
    tbody.append(...dataArray.map(createRow));
    tableDiv.style.maxHeight = "300px";
    tableDiv.style.overflowY = 'auto';
    table.selectedRow = null;
    table.append(thead, tbody);
    tableDiv.append(table);

    tableDiv.addRow = (data) => {tbody.append(createRow(data)); };
    tableDiv.refresh = (newDataArray) => {
        tbody.replaceChildren(...newDataArray.map(createRow));
        tableDiv.selectedRow = null;
    };

    return tableDiv;
}