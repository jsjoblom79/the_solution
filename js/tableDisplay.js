"use strict";

export default async function displayTables(tableId, headerArray, dataArray, filterTableResultsArray){
    const table = document.createElement('table');
    table.id=tableId;
    table.classList.add('gs-table');
    const thead = document.createElement('thead');
    const first_tr = document.createElement('tr');
    for(const item of headerArray){
        const th = document.createElement('th');
        th.textContent = item;
        first_tr.append(th);
    }
    thead.append(first_tr);
    const tbody = document.createElement('tbody');
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
                tr.addEventListener('click', ()=>{
                    console.log('row selected');
                    tr.classList.toggle('selected-row');
                });
            }
        }

        tbody.append(tr);
    }

    table.append(thead, tbody);
    table.selectedRow = tbody.selectedRow;
    return table;
}