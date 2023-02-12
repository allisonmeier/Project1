
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")

let data, barchart, scatterplot
let numStarsFilter = []

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


        let barchart = new Barchart({parentElement: '#barchart'}, data)
        barchart.updateVis()

        let linechart = new Linechart({parentElement: '#linechart'}, data)
        linechart.updateVis()

        })
        
        .catch(error => console.error(error));
