
/*

TO-DO

- make each row of data into an array of info
- figure out how to give it headers for columns
- figure out how to make it update in response to other selections


*/


//------------------MAKING FUNCTIONS------------------


// generate table head (the space allotted for the headers)
function generateTableHead(table, tableData) {
    let thead = table.createTHead()  
    let row = thead.insertRow()
    for (let key of tableData) {
        let th = document.createElement('th')
        let text = document.createTextNode(key)
        th.appendChild(text)
        row.appendChild(th)
    }
}

// generate the rest of the table
function generateTableBody(table, tableData) {
    for (let element of tableData) {
        let row = table.insertRow()
        for (key in element) {
            let cell = row.insertCell()
            let text = document.createTextNode(element[key])
            cell.appendChild(text)
        }
    }
}

//------------------USING FUNCTIONS------------------

let rawData = [
    { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
    { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
    { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
    { name: "Monte Amiata", height: 1738, place: "Siena" }
]

let table = document.querySelector('table')
let tableData = Object.keys(rawData[0])


generateTableBody(table, rawData)
generateTableHead(table, tableData)
    
    
    
/*
class Table {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 300,
            containerHeight: defaultConfig.containerHeight || 900,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 5},
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this
    
    }



    updateVis() {
        let vis = this

        vis.renderVis()
    }


    renderVis() {
        let vis = this

    }

*/

// https://www.valentinog.com/blog/html-table/#:~:text=function%20generateTableHead(table%2C%20data),)%3B%20let%20text%20%3D%20document.
