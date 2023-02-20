
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")
let data

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


        let starBarchart = new Barchart(
            {parentElement: '#starBarchart',
            selectedData: d => d.sy_snum,
            colorScale: d3.schemePaired,
            xAxisFormat: ' Star(s)',
            xLabel: 'Stars in System',
            yLabel: 'Exoplanets',
            title: 'Exoplanets vs. Stars in System',
        }, data)
        starBarchart.updateVis()

        let planetBarchart = new Barchart(
            {parentElement: '#planetBarchart',
            selectedData: d => d.sy_pnum,
            colorScale: d3.schemePaired,
            xAxisFormat: ' Planet(s)',
            xLabel: 'Planets in System',
            yLabel: 'Exoplanets',
            title: 'Exoplanets vs. Total Planets in System',
        }, data)
        planetBarchart.updateVis()

        let starTypeBarchart = new Barchart(
            {parentElement: '#starTypeBarchart',
            selectedData: d => d.st_spectype.charAt(0),
            colorScale: d3.schemePaired,
            xLabel: 'Star Type',
            yLabel: 'Exoplanets',
            title: 'Orbiting Exoplanets vs. Star Type',
        }, data)
        starTypeBarchart.updateVis()


        /*let linechart = new Linechart({parentElement: '#linechart'}, data)
        linechart.updateVis()*/


        let scatterplot = new Scatterplot({parentElement: '#scatterplot'}, data)
        scatterplot.updateVis()

        })
        
        .catch(error => console.error(error));


// Some general functions below here 

function inHabitableZone(starDistance, starType) {
    /*
    The habitable zone depends on both the distance between the star and the planet, and the type of star. 
        It begins and ends according to the list below (in astronomical units)
            A - inner =  8.5 AU, outer = 12.5 AU
            F - inner = 1.5 AU, outer = 2.2 AU
            G - inner = 0.95 AU, outer = 1.4 AU
            K - inner = 0.38 AU, outer = 0.56 AU
            M - inner = 0.08 AU, outer = 0.12 AU
    */
   
    if (((starType == 'A') && (starDistance > 8.5) && (starDistance < 12.5))
        || ((starType == 'F') && (starDistance > 1.5) && (starDistance < 2.2))
        || ((starType == 'G') && (starDistance > 0.95) && (starDistance < 1.4))
        || ((starType == 'K') && (starDistance > 0.38) && (starDistance < 0.56))
        || ((starType == 'M') && (starDistance > 0.08) && (starDistance < 0.12))) {
            return true
        } else {
            return false
        }
}

function planetType() {

    
}
