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

    for(const data of dataArray){
        const tr = document.createElement('tr');

        for(const [key, value] of Object.entries(data)){
            if(filterTableResultsArray.includes(key)){
                const td = document.createElement('td');
                if(key.toLowerCase().includes('date')){
                    td.textContent = value.substring(0, 10);
                }
                td.textContent = value;
                tr.append(td);

            }
        }
        tr.addEventListener('click', ()=>{
            getRows();
            tr.classList.add('selected-row');
            tableDiv.selectedRow = data;
            tableDiv.dispatchEvent(new CustomEvent('rowselect', { detail: data }));
        });
        tbody.append(tr);
    }

    tableDiv.style.maxHeight = "300px";
    tableDiv.style.overflowY = 'auto';
    table.selectedRow = null;
    table.append(thead, tbody);
    tableDiv.append(table);
    return tableDiv;
}