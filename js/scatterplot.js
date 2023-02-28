class Scatterplot {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 600,
            containerHeight: defaultConfig.containerHeight || 400,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 140},
            tooltipPadding: defaultConfig.tooltipPadding || 15
        }
        this.data = _data.filter(d => d.pl_bmasse != 0 && d.pl_rade != 0)
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.data.forEach(d => {d.source = 'notOurSystem'})

        vis.data.push(
                {pl_name: 'Mercury', pl_bmasse: 0.055, pl_rade: 0.38, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Venus', pl_bmasse: 0.8, pl_rade: 0.95, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Earth', pl_bmasse: 1, pl_rade: 1, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Mars', pl_bmasse: 0.107, pl_rade: 0.53, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Jupiter', pl_bmasse: 317.8, pl_rade: 11.2, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Saturn', pl_bmasse: 95, pl_rade: 9.13, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Uranus', pl_bmasse: 14.5, pl_rade: 4, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Neptune', pl_bmasse: 17.1, pl_rade: 3.9, source: 'ourSystem', sys_name: 'Home'},
                {pl_name: 'Pluto', pl_bmasse: 0.0022, pl_rade: 0.187, source: 'ourSystem', sys_name: 'Home'},
                )
                
        vis.data.forEach(d => {
            if (d.pl_bmasse < 0.00001) {
                d.type = 'Asteroidan'
            } else if (d.pl_bmasse >= 0.00001 && d.pl_bmasse < 0.1) {
                d.type = 'Mercurian'
            } else if (d.pl_bmasse >= 0.01 && d.pl_bmasse < 0.5) {
                d.type = 'Subterran'
            } else if (d.pl_bmasse >= 0.05 && d.pl_bmasse < 2) {
                d.type = 'Terran'
            } else if (d.pl_bmasse >= 2 && d.pl_bmasse < 10) {
                d.type = 'Superterran'
            } else if (d.pl_bmasse >= 10 && d.pl_bmasse < 50) {
                d.type = 'Neptunian'
            } else if (d.pl_bmasse >= 50 && d.pl_bmasse < 5000) {
                d.type = 'Jovian'
            }
        })



        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.xScale = d3.scaleLog()
            .range([0, vis.width])

        vis.yScale = d3.scaleLog()
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
            .text('Radius')

        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', 100)
            .attr('y', 330)
            .attr('dy', '.71em')
            .text('Exoplanet Mass vs. Radius') 

        vis.zoom = d3.zoom()
            .on('zoom', (event) => {
                vis.chart.attr("transform", event.transform)
                vis.chart.selectAll('circle')
                    .transition()
                    .duration(750)
                    .attr('r', (10 / event.transform.k))
            })
            .scaleExtent([1, 1000])
    }

    updateVis() {
        let vis = this

        vis.colorValue = d => d.source
        vis.xValue = d => d.pl_rade
        vis.yValue = d => d.pl_bmasse

        vis.xScale.domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)])
        vis.yScale.domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)])

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        vis.circles = vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 4)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('fill', d => vis.config.colorScale(vis.colorValue(d)))
                .attr('opacity', '0.5')
            .on('mouseover', (event, d) => {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    
                    .html(`
                        <div class="tooltip-title">${d.pl_name}</div>
                        <div><i>${d.sys_name} System</i></div>
                        <ul>
                        <li>${d.pl_rade} Earth-radii</li>
                        <li>${d.pl_bmasse} Earth-masses</li>
                        <li>${d.type} Planet Type</li>
                        </ul>
                    `)
                })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none')
            })

        vis.xAxisG
            .call(vis.xAxis)

        vis.yAxisG
            .call(vis.yAxis)

        vis.svg
            .call(vis.zoom)

    }

}