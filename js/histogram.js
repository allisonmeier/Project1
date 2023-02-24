class Histogram {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            containerWidth: defaultConfig.containerWidth || 700,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 140},
            selectedData: defaultConfig.selectedData, //format as (d => d.whatever) 
            xAxisFormat: defaultConfig.xAxisFormat || '',
            yAxisFormat: defaultConfig.yAxisFormat || '',
            xLabel: defaultConfig.xLabel || 'needs a label',
            yLabel: defaultConfig.yLabel || 'needs a label',
            title: defaultConfig.title || 'needs a title',
            tooltipPadding: defaultConfig.tooltipPadding || 15,
            numBins: defaultConfig.numBins || 10,
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right 
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom 

        // overall svg
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight + 100)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`) 

        // x axis
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.data, vis.config.selectedData)])
            .range([0, vis.width])

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d => d + vis.config.xAxisFormat) 

        vis.xAxisG = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`) 
            .call(vis.xAxis)

        // histogram preppin
        vis.histogram = d3.histogram()
            .value(vis.config.selectedData) 
            .domain(vis.xScale.domain())
            .thresholds(vis.xScale.ticks(vis.config.numBins))

        // define bins
        vis.bins = vis.histogram(vis.data)

        // y axis
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, d3.max(vis.bins, d => d.length) + 100])

        vis.yAxis = d3.axisLeft(vis.yScale)

        vis.yAxisG = vis.svg.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis)

        // titles :)
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height + 20)
            .attr('x', vis.width/2)
            .attr('dy', '.71em')
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

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        vis.svg.selectAll('rect')
            .data(vis.bins)
            .join('rect')
                .attr('x', 1)
                .attr('transform', d => `translate(${vis.xScale(d.x0)} , ${vis.yScale(d.length)})`)
                .attr("width", d => vis.xScale(d.x1) - vis.xScale(d.x0))
                .attr("height", d => vis.height - vis.yScale(d.length))
                .attr('fill', d3.schemePaired[9])
            .on('mouseover', (event, d) => {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    
                    .html(`
                        <div class="tooltip-title">More Info:</div>
                        <ul>
                        <li>Actual number: ${d.length} ${vis.config.yLabel}</li>
                        <li>Category: ${d.x0}-${d.x1} ${vis.config.xAxisFormat}</li>
                        </ul>
                    `)
                })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none')
            })
        
    

    }


}