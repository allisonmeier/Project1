class Barchart {

    //construct!! please!!
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            colorScale: _config.colorScale,
            containerWidth: _config.containerWidth || 260, /* prob adjust this*/
            containerHeight: _config.containerHeight || 300, /* prob adjust this*/
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 40}, /* prob adjust this*/
        }
        this.data = _data;
        this.initVis();

    }

    initVis() {
        let vis = this

        // this defines the INNER chart size - not the outer (that's defined below, in vis.svg)
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        //this is basically a space-saver for where the barchart is going to eventually go
        vis.svg = d3.select(vis.config.parentElement) //('#chart').append('svg')
            .attr('width', vis.config.containerWidth)    
            .attr('height', vis.config.containerHeight)
    
        // the actual chart! this goes inside of vis.svg
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top}`)

        // creating empty axis groups (this is where our axes will go!)
        vis.xAxisGroup = vis.chart.append('g')
            .attr("class", "axis x-axis")
            .attr('transform', `translate(0, ${height})`) //this makes it go at the bottom of the chart
        vis.yAxisGroup = vis.chart.append('g')
            .attr("class", "axis y-axis")

        //give it a title!
        vis.svg.append('text')

        /*const margin = {top: 5, right: 5, bottom: 20, left: 20}
        const width = 500 - margin.left - margin.right
        const height = 140 - margin.top - margin.bottom
        */

        //EXAMPLE OF COLOR/DOMAIN TYPES (from trails thing)
        /*
        vis.colorScale = d3.scaleOrdinal()
        .range(['#d3eecd', '#7bc77e', '#2a8d46']) // light green to dark green
        .domain(['Easy','Intermediate','Difficult']);
        */

        /*
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top}`)*/
        
        //creating the scales for each axis
        vis.xScale = d3.scaleLinear()
            //.domain([0, d3.max(d => d.numPlanets)]) // unsure of this
            .range([0, vis.width])
        vis.yScale = d3.scaleBand()
            //.domain([0, 1, 2 , 3])
            .range([0, vis.height])
            .paddingInner(0.1)

        // creating actual axes (using the scales above)
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(['heading1', 'heading2', 'heading3'])
            .tickSizeOuter(0)
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)

        // add rectangles!
        svg.selectAll('rect')
            .data(data)
            .enter()
        .append('rect')
            .attr("class", "bar")
            .attr("fill", "red")
            .attr("width", d => xScale(d.numPlanets))
            .attr("height", yScale.bandwidth())
            .attr("y", yScale([0,1,2,3]))
            .attr("x", 0)
    }

    updateVis() {
        let vis = this

        // prep da data
        const groupedUpDataMap = d3.rollups(vis.data, v => v.length, d.numStars)
        vis.groupedUpData = Array.from(groupedUpDataMap, ([key, count]) => ({key, count}) )

        // give the data labels!!
        const orderedKeys = ['1', '2', '3', '4', '5']

        // put all da stuff together now
        vis.groupedUpData = vis.groupedUpData.sort( (a,b) => {
            return (orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key))
        })

        // define the functional pieces used above/below
        vis.colorValue = (d => d.key)
        vis.xValue = (d => d.count)
        vis.yValue = (d => d.key)

        // set scale input domains
        vis.xScale.domain(vis.groupedUpData.map(vis.xValue))
        vis.yScale.domain( [0, d3.max(vis.groupedUpData, vis.yValue)] )

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        //adding the rectangles in
        const bars = vis.chart.selectAll('.bar')
            .data(vis.groupedUpData, vis.xValue)
            .join('rect')
                .attr('class', 'bar')
                .attr('x', (d => vis.xScale(vis.xValue(d))))
                .attr('y', (d => vis.yScale(vis.yValue(d))))
                .attr('width', vis.xScale(vis.xValue))
                .attr('height', (d => vis.height - vis.yScale(vis.yValue(d))))
                .attr('fill', (d => vis.colorScale(vis.colorValue(d))))

        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }

    /*Allow a user to understand: 
        *- how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
        *- how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
        *- how many exoplanets orbit stars of different types:
            The star types are: A, F, G, K and M  */

}