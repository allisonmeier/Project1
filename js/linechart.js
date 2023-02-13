class Linechart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 600,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 40},
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.xScale = d3.scaleTime()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .nice()

        vis.xAxis = d3.axisBottom()
            .ticks(10) //may need to change if this doesnt look good
        
        vis.yAxis = d3.axisLeft()
            .ticks(5) //this also may need changed

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)
            
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`)

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')        

    }

    updateVis() {
        let vis = this

        let countedDataMap = d3.rollups(vis.data, v => v.length, d => d.disc_year)
        vis.countedData = Array.from(countedDataMap, ([thing, numOfThing]) => ({thing, numOfThing}))

        let orderedYears = []
        orderedYears.push(data.forEach(d => d.disc_year)) 
        // is this working...?
        // fyi: orderedYears should be an array

        vis.countedData = vis.countedData.sort((a,b) => {
            return orderedYears.indexOf(a.thing) - orderedYears.indexOf(b.thing)
        })

        vis.xValue = d => d.thing //d.disc_year, year
        vis.yValue = d => d.numOfThing // num discoveries

        //vis.area - this fills in the bottom and looks cute 

        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)))
        
        vis.xScale.domain(d3.extent(vis.data, vis.xValue))
        vis.yScale.domain(d3.extent(vis.data, vis.yValue))
        
        vis.renderVis()

        /**Enable the user to see exoplanet discoveries over time (by year). 
            They should be able to identify the trends in the discoveries. 
            A line chart is a good choice for this.*/

    }

    renderVis() {
        let vis = this 

        vis.chart
            .append("path")
            .data([vis.data])
            .attr("class", "chart-area")
            .attr("d", vis.area);

        // Add line path
        vis.chart
            .append("path")
            .data([vis.data])
            .attr("class", "chart-line")
            .attr("d", vis.line);

        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);


    }


}