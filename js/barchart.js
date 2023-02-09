class Barchart {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            colorScale: _config.colorScale,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 600,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 40},
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        //size of the chart itself (container minus margins)
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.colorScale = d3.scaleOrdinal()
            .range(['#f1b5cd', '#dc6996', '#a0496b'])
            .domain(['One Star', 'Two Stars', 'Three Stars'])

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickPadding(10)
            //.tickFormat(d => d + ' km');
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickPadding(10);

        //size of the svg in use
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
        
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height - 15)
            .attr('x', vis.width - 100)
            .attr('dy', '.71em')
            //.style('text-anchor', 'end')
            .text('Stars in System');
    
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 6)
            .attr('dy', '.71em')
            .text('Exoplanets');
    
        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', vis.width/2)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Exoplanets per Stars in System');

        //fix these 
        /*
        vis.colorValue = d => d.numStars 
        vis.xValue = d => d.numStars
        vis.yValue = d => d.something*/

    }

    updateVis() {}

    renderVis() {}

    /*Allow a user to understand: 
        *- how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
        *- how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
        *- how many exoplanets orbit stars of different types:
            The star types are: A, F, G, K and M  */

}