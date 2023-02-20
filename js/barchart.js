class Barchart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 700,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 140},
            selectedData: defaultConfig.selectedData, //format as (d => d.whatever) or it won't work
            xAxisFormat: defaultConfig.xAxisFormat || '',
            yAxisFormat: defaultConfig.yAxisFormat || '',
            xLabel: defaultConfig.xLabel || 'needs a label',
            yLabel: defaultConfig.yLabel || 'needs a label',
            title: defaultConfig.title || 'needs a title',
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        //size of the chart itself (container minus margins)
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right 
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom 
    
        vis.colorScale = d3.scaleOrdinal(vis.config.colorScale)
            //.range(['#f1b5cd', '#dc6996', '#a0496b', 'blue', 'red', 'green'])
            //.domain(['1', '2', '3', '4', ''])

        vis.xScale = d3.scaleBand()
            .range([vis.width - 100, 0])
            .padding(0.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
            //.ticks(['1 Star', '2 Stars', '3 Stars', '4 Stars', 'Unknown']) 
            .tickFormat(d => d + vis.config.xAxisFormat) 
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(10)
            //.tickFormat(d => d + ' exoplanets') 

        //size of the overall svg 
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight + 100)

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`) 

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`) 
        
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height + 20)
            .attr('x', vis.width/2 - 100)
            .attr('dy', '.71em')
            //.style('text-anchor', 'end')
            .text(vis.config.xLabel) 
    
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 6)
            .attr('dy', '.71em')
            .text(vis.config.yLabel) 
    
        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', 100)
            .attr('y', 330)
            .attr('dy', '.71em')
            .text(vis.config.title) 

    }

    updateVis() {
        let vis = this
        let orderedThings

        if (vis.config.parentElement == '#starBarchart') {
          orderedThings = ['1', '2', '3', '4', '']
        } else if (vis.config.parentElement == '#planetBarchart') {
          orderedThings = ['1', '2', '3', '4', '5', '6', '7', '8']
        } else if (vis.config.parentElement == '#starTypeBarchart') {
          orderedThings = ['A', 'F', 'G', 'K', 'M', '']
        }

        let countedDataMap = d3.rollups(vis.data, v => v.length, vis.config.selectedData)
        vis.countedData = Array.from(countedDataMap, ([thing, numOfThing]) => ({thing, numOfThing}))
        //worth looking at

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

        const bars = vis.chart.selectAll('.bar')
            .data(vis.countedData, vis.xValue)
            .join('rect')
                .attr('class', 'bar')
                .attr('x', d => vis.xScale(vis.xValue(d)))
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .attr('y', d => vis.yScale(vis.yValue(d)))
                .attr('fill', d => vis.colorScale(vis.colorValue(d)))

        vis.xAxisG.call(vis.xAxis)
        vis.yAxisG.call(vis.yAxis)

    }

    /*
    Allow a user to understand: 
    how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
    how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
    how many exoplanets orbit stars of different types: The star types are: A, F, G, K and M 
        Include a link which opens a new tab, leading the user to information about star types
    how many exoplanets were discovered by different methods
        Include a link that explains the different exoplanet discovery methods 
    how many exoplanets are within a habitable zone vs outside the habitable zone.   
        The habitable zone depends on both the distance between the star and the planet, and the type of star. 
        The habitable zone begins and ends according to the list below (in astronomical units)
            A - inner =  8.5 AU, outer = 12.5 AU
            F - inner = 1.5 AU, outer = 2.2 AU
            G - inner = 0.95 AU, outer = 1.4 AU
            K - inner = 0.38 AU, outer = 0.56 AU
            M - inner = 0.08 AU, outer = 0.12 AU
    Bar charts are a good choice for this.  You may use other approaches- see note below.

    */

}