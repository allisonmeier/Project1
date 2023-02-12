class Barchart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 600,
            containerHeight: defaultConfig.containerHeight || 600,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 40},
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        //size of the chart itself (container minus margins)
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right 
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom 
    
        //parametrize?
        vis.colorScale = d3.scaleOrdinal()
            .range(['#f1b5cd', '#dc6996', '#a0496b', 'blue'])
            .domain(['One Star', 'Two Stars', 'Three Stars', 'Unknown'])

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(vis.colorScale.domain) //tried something different, test if it works
            //.tickFormat(d => d + ' km') 
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)

        //size of the overall svg 
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

        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height - 15)
            .attr('x', vis.width - 100)
            .attr('dy', '.71em')
            //.style('text-anchor', 'end')
            .text('Stars in System') 
    
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 6)
            .attr('dy', '.71em')
            .text('Exoplanets') 
    
        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', vis.width/2)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Exoplanets per Stars in System') 

    }

    updateVis() {
        let vis = this

        let countedDataMap = d3.rollups(vis.data, v => v.length, d => d.sy_snum)
        vis.countedData = Array.from(countedDataMap, ([thing, numOfThing]) => ({thing, numOfThing}))

        let orderedThings = ['0', '1', '2', '3', '4', '5', '']

        vis.countedData = vis.countedData.sort((a,b) => {
            return orderedThings.indexOf(a.thing) - orderedThings.indexOf(b.thing)
        })

        vis.colorValue = d => d.thing
        vis.xValue = d => d.thing
        vis.yValue = d => d.numOfThing

        vis.xScale.domain(vis.countedData.map(vis.xValue))
        vis.yScale.domain([0, d3.max(vis.countedData, vis.yValue)])

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        let bars = vis.chart.selectAll('.bar')
            .data(vis.countedData, vis.xValue)
            .join('rect')
                .attr('class', 'bar')
                .attr('x', d => vis.xScale(vis.xValue(d)))
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .attr('y', d => vis.yScale(vis.yValue(d)))
                .attr('fill', 'blue')

        vis.xAxisG.call(vis.xAxis)
        vis.yAxisG.call(vis.yAxis)

    }

    /*Allow a user to understand: 
        *- how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
        *- how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
        *- how many exoplanets orbit stars of different types:
            The star types are: A, F, G, K and M  */

}