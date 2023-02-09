
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")

let data, barchart, scatterplot
let numStarsFilter = []

d3.csv('data/exoplanets.csv')
    .then(_data => {
        data = _data
        //changing strings to numbers; non-numbers commented out
        data.forEach(d => {
            //d.planetName = +d.pl_name;
            //d.hostName = +d.hostname;
            //d.systemName = +d.sys_name;
            d.numStars = +d.sy_snum; //num stars in system?
            d.numPlanets = +d.sy_pnum; //num planets in system?
            //d.discoveryMethod = +d.discoverymethod;
            d.discoveryYear = +d.disc_year;
            d.orbitalPeriod = +d.pl_orbper;
            d.orbitalAxis = +d.pl_orbsmax;
            d.planetRadius = +d.pl_rade;
            d.planetMass = +d.pl_bmasse;
            d.eccentricity = +d.pl_orbeccen;
            //d.spectralType = +d.st_spectype;
            d.stellarRadius = +d.st_rad;
            d.stellarMass = +d.st_mass;
            d.distance = +d.sy_dist;
            //d.discoveryFacility = +d.disc_facility;
        })
           
            barchart = new Barchart({parentElement: '#barchart' }, _data)
        })
        .catch(error => console.error(error));
