class Barchart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale, // https://github.com/d3/d3-scale-chromatic#schemeAccent 
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
        }
        this.data = _data
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right 
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom 
    
        vis.colorScale = d3.scaleOrdinal(vis.config.colorScale)

        vis.xScale = d3.scaleBand()
            .range([vis.width - 100, 0])
            .padding(0.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d => d + vis.config.xAxisFormat) 
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(10)

        //size of the overall svg 
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight + 100)

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`) 

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`) 
            .call(vis.xAxis)

        if (vis.config.parentElement == '#discoveryBarchart') {
            vis.xAxisG = vis.chart.append('g')
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', 'rotate(-65)')
        }
        
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
            //.attr('transform', 'rotate(-90)')
    
        vis.svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', 100)
            .attr('y', 330)
            .attr('dy', '.71em')
            .text(vis.config.title) 

    }

    updateVis() {
        let vis = this
        let orderedThings, countedDataMap

        if (vis.config.parentElement == '#starBarchart') {
            orderedThings = [4,3,2,1]
        } else if (vis.config.parentElement == '#planetBarchart') {
            orderedThings = [8,7,6,5,4,3,2,1]
        } else if (vis.config.parentElement == '#starTypeBarchart') {
            orderedThings = ['Unknown', 'Other', 'M', 'K', 'G', 'F', 'A']
        } else if (vis.config.parentElement == '#habitableZoneBarchart') {
            orderedThings = ['Uninhabitable', 'Inhabitable']
        } else {
            orderedThings = ['test1', 'test2', 'test3', 'test4', 'test5', '']
        }

        if (vis.config.parentElement == '#starTypeBarchart') {
            vis.data.forEach(d => {
                if (d.st_spectype.charAt(0)!='A' && d.st_spectype.charAt(0)!='F' 
                    && d.st_spectype.charAt(0)!='G' && d.st_spectype.charAt(0)!='K' 
                    && d.st_spectype.charAt(0)!='M' && d.st_spectype.charAt(0)!='') {
                    d.type = 'Other'
                } else if (d.st_spectype.charAt(0) == '' ) {
                    d.type = 'Unknown'
                } else {
                    d.type = d.st_spectype.charAt(0)
                }
            })
            countedDataMap = d3.rollups(vis.data, v => v.length, d => d.type)
        } else if (vis.config.parentElement == '#habitableZoneBarchart') {
            let habitableData = vis.data.filter(d => (d.st_spectype.charAt(0)=='A' || d.st_spectype.charAt(0)=='F' 
                    || d.st_spectype.charAt(0)=='G' || d.st_spectype.charAt(0)=='K' || d.st_spectype.charAt(0)=='M') 
                    && d.pl_orbsmax!='')

            habitableData.forEach(d => {
                if (((d.st_spectype.charAt(0) == 'A') && (d.pl_orbsmax > 8.5) && (d.pl_orbsmax < 12.5))
                || ((d.st_spectype.charAt(0) == 'F') && (d.pl_orbsmax > 1.5) && (d.pl_orbsmax < 2.2))
                || ((d.st_spectype.charAt(0) == 'G') && (d.pl_orbsmax > 0.95) && (d.pl_orbsmax < 1.4))
                || ((d.st_spectype.charAt(0) == 'K') && (d.pl_orbsmax > 0.38) && (d.pl_orbsmax < 0.56))
                || ((d.st_spectype.charAt(0) == 'M') && (d.pl_orbsmax > 0.08) && (d.pl_orbsmax < 0.12))) {
                    d.isInhabitable = 'Inhabitable'
                } else {
                    d.isInhabitable = 'Uninhabitable'
                }
            })
            countedDataMap = d3.rollups(habitableData, v => v.length, d => d.isInhabitable)
        } else {
            countedDataMap = d3.rollups(vis.data, v => v.length, vis.config.selectedData)
        }
        
        vis.countedData = Array
            .from(countedDataMap, ([thing, numOfThing]) => ({thing, numOfThing}))
            .sort((a,b) => {
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

        vis.bars = vis.chart.selectAll('.bar')
            .data(vis.countedData, vis.xValue)
            .join('rect')
                .attr('class', 'bar')
                .attr('x', d => vis.xScale(vis.xValue(d)))
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .attr('y', d => vis.yScale(vis.yValue(d)))
                .attr('fill', d => vis.colorScale(vis.colorValue(d)))
              .on('mouseover', (event, d) => {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
                        <div class="tooltip-title">More Info:</div>
                        <ul>
                        <li>Actual number: ${d.numOfThing} ${vis.config.yLabel}</li>
                        <li>Category: ${d.thing + vis.config.xAxisFormat}</li>
                        </ul>
                    `)
                })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none')
            })
            .on('click', function(event, d) {
                const isActive = dataFilter.includes(d.key)
                if (isActive) {
                    dataFilter = dataFilter.filter(f => f !== d.key); // Remove filter
                } else {
                    dataFilter.push(d.key) // Append filter
                }
                filterData(d.thing) // Call global function to update other charts
                d3.select(this).classed('active', !isActive); // Add class to style active filters with CSS
              })



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