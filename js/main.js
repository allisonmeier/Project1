
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")
let data
let infoTable, starBarchart, planetBarchart, starTypeBarchart, discoveryBarchart, 
    habitableZoneBarchart, distanceHistogram, linechart, scatterplot
let dataFilter = []

d3.csv('../data/exoplanets.csv')
    .then(_data => {
        data = _data
        //changing strings to numbers; non-numbers commented at bottom
        data.forEach(d => {
            d.sy_snum = +d.sy_snum, //num stars in system
            d.sy_pnum = +d.sy_pnum, //num planets in system
            d.disc_year = +d.disc_year, //discovery year
            d.pl_orbper = +d.pl_orbper, //orbital period
            d.pl_orbsmax = +d.pl_orbsmax, //orbital axis max
            d.pl_rade = +d.pl_rade, //planet radius
            d.pl_bmasse = +d.pl_bmasse, //planet mass
            d.pl_orbeccen = +d.pl_orbeccen, //planet orbit eccentricity
            d.st_rad = +d.st_rad, //stellar radius
            d.st_mass = +d.st_mass, //stellar mass
            d.sy_dist = +d.sy_dist //distance
            //d.pl_name - planet name
            //d.hostname - host name
            //d.sys_name - system name
            //d.discoveryMethod - discovery method
            //d.st_spectype - spectral type
            //d.disc_facility - discovery facility
        })
           
        d3.select("#selected-dropdown")
        d3.select()

        infoTable = new Table(
            {parentElement: '#infoTable',
        }, data)
        infoTable.updateVis()

        starBarchart = new Barchart(
            {parentElement: '#starBarchart',
            selectedData: d => d.sy_snum,
            colorScale: d3.schemePaired,
            xAxisFormat: ' Star(s)',
            xLabel: 'Stars in System',
            yLabel: 'Exoplanets',
            title: 'Exoplanets vs. Stars in System',
        }, data)
        starBarchart.updateVis()

        planetBarchart = new Barchart(
            {parentElement: '#planetBarchart',
            selectedData: d => d.sy_pnum,
            colorScale: d3.schemePaired,
            xAxisFormat: ' Planet(s)',
            xLabel: 'Planets in System',
            yLabel: 'Exoplanets',
            title: 'Exoplanets vs. Total Planets in System',
        }, data)
        planetBarchart.updateVis()

        starTypeBarchart = new Barchart(
            {parentElement: '#starTypeBarchart',
            selectedData: d => d.st_spectype,
            colorScale: d3.schemePaired,
            xLabel: 'Star Type',
            yLabel: 'Exoplanets',
            title: 'Orbiting Exoplanets vs. Star Type',
        }, data)
        starTypeBarchart.updateVis()

        discoveryBarchart = new Barchart(
            {parentElement: '#discoveryBarchart',
            selectedData: d => d.discoverymethod,
            colorScale: d3.schemePaired,
            xLabel: 'Discovery Method',
            yLabel: 'Exoplanets',
            title: 'Exoplanets by Discovery Method',
            //margin: {top: 5, right: 5, bottom: 100, left: 140},
        }, data)
        discoveryBarchart.updateVis()

        // https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
        habitableZoneBarchart = new Barchart(
            {parentElement: '#habitableZoneBarchart',
            selectedData: d => d.sy_dist,
            colorScale: d3.schemePaired,
            xAxisFormat: '',
            xLabel: ' ',
            yLabel: 'Exoplanets',
            title: 'Habitable vs. Inhabitable Planets',
        }, data)
        habitableZoneBarchart.updateVis()


        //https://d3-graph-gallery.com/graph/histogram_basic.html
        distanceHistogram = new Histogram(
            {parentElement: '#distanceHistogram',
            selectedData: d => d.sy_dist,
            xLabel: 'Distance',
            xAxisFormat: ' AU',
            yLabel: 'Exoplanets',
            title: 'Exoplanets vs. Distance to Us',
            numBins: 10,
        }, data)
        distanceHistogram.updateVis()

        linechart = new Linechart(
            {parentElement: '#linechart'}, 
            data)
        linechart.updateVis()
        
        scatterplot = new Scatterplot(
            {parentElement: '#scatterplot',
            colorScale: d3.scaleOrdinal().range([d3.schemePaired[9], d3.schemePaired[4]])
        }, data)
        scatterplot.updateVis()

        })
        
        .catch(error => console.error(error));

// FUNCTION(S) --------------------------------

function filterData(key) {
    if (dataFilter.length == 0) {
        data = data;
    } else {
        data = data.filter(d => dataFilter.includes(key)) // d.key
        //scatterplot.data = data.filter(d => difficultyFilter.includes(d.difficulty));
    }
    infoTable.updateVis() 
    starBarchart.updateVis()  
    planetBarchart.updateVis()  
    starTypeBarchart.updateVis()  
    discoveryBarchart.updateVis() 
    habitableZoneBarchart.updateVis()  
    distanceHistogram.updateVis()  
    linechart.updateVis()  
    scatterplot.updateVis() 

    console.log('did it')
    console.log(data)
    }