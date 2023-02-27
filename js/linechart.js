class Linechart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 700,
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
            //.nice()

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(10)
            .tickFormat(d3.format('d'))
        
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(10)

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
            .text('Year');

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Discoveries')

        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', 100)
            .attr('y', 330)
            .attr('dy', '.71em')
            .text('Exoplanet Discovieries per Year') 

    }

    updateVis() {
        let vis = this

        let countedDataMap = d3.rollups(vis.data, v => v.length, d => d.disc_year)
        
        vis.countedDataArray = Array
            .from(countedDataMap, ([year, numOccurences]) => ({year, numOccurences}))
            .sort((a,b) => {
                return a.year - b.year;
            })

        vis.xValue = d => d.year //d.disc_year, year
        vis.yValue = d => d.numOccurences // num discoveries

        vis.xScale.domain(d3.extent(vis.countedDataArray, vis.xValue))
        vis.yScale.domain(d3.extent(vis.countedDataArray, vis.yValue))
        
        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)))

        vis.renderVis()

    }

    renderVis() {
        let vis = this 

        vis.chart
            .append("path")
            .data([vis.countedDataArray])
            .attr("class", "chart-line")
            .attr("d", vis.line)

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }


}