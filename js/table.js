class Table {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 700,
            containerHeight: defaultConfig.containerHeight || 600,
            margin: defaultConfig.margin || {top: 5, right: 20, bottom: 20, left: 20},
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this
    
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right 
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom 

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`) 


        vis.table = document.querySelector('table')
        
        let tableData = Object.keys(vis.data[0])

        // generating the table body
        for (let element of vis.data) {
            let row = vis.table.insertRow()
            for (let key in element) {
                let cell = row.insertCell()
                let text = document.createTextNode(element[key])
                cell.appendChild(text)
            }
        }

        // and now the header
        vis.thead = vis.table.createTHead()  
        let row = vis.thead.insertRow()
        for (let key of tableData) {
            let th = document.createElement('th')
            let text = document.createTextNode(key)
            th.appendChild(text)
            row.appendChild(th)
        }
    
    }



    updateVis() {
        let vis = this
        vis.renderVis()
    }


    renderVis() {
        let vis = this
    }

}

// https://www.valentinog.com/blog/html-table/#:~:text=function%20generateTableHead(table%2C%20data),)%3B%20let%20text%20%3D%20document.
