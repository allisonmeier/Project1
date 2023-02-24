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
            .text('Radius');

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
                .attr('fill', d3.schemePaired[9])
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