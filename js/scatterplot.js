class Scatterplot {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 700,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 140},
            tooltipPadding: defaultConfig.tooltipPadding || 15
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.xScale = d3.scaleLinear()
        //vis.xScale = d3.scaleLog()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear() //maybe change to scaleLog later
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)

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
            .attr('x', vis.width + 10)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Mass');

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Radius');

    }

    updateVis() {
        let vis = this

        //vis.colorValue = d => d.pl_rade
        vis.xValue = d => d.pl_rade
        vis.yValue = d => d.pl_bmasse

        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)])
        vis.yScale.domain([0, d3.max(vis.data, vis.yValue)])

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        // this is basically a circle constructor
        vis.circles = vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 4)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))

        vis.xAxisG
            .call(vis.xAxis)
            //.call(g => g.select('.domain').remove())

        vis.yAxisG
            .call(vis.yAxis)
            //.call(g => g.select('.domain').remove)

    }

}