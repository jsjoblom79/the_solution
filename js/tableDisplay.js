"use strict";

export default async function displayTables(tableId, headerArray, dataArray, filterTableResultsArray){
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


    const createRow = (data) => {
        const tr = document.createElement('tr');

        for(const [key, value] of Object.entries(data)){
            if(filterTableResultsArray.includes(key)){
                const td = document.createElement('td');
                if(key.toLowerCase().includes('date')){
                    console.log(typeof value);
                    if(value !== 'None') {
                        const [year, month, day] = value.substring(0, 10).split('-');
                        td.textContent = `${month}/${day}/${year}`;
                    }
                } else {
                    td.textContent = value;
                }

                tr.append(td);

            }
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