
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")

let data;
let barchart;
let numStarsFilter = [];

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
        })

        let colorScale = d3.scaleOrdinal()
            .range(['#d3eecd', '#7bc77e', '#2a8d46', 'black', 'black']) // light green to dark green
            .domain(['1','2','3', '4', '5'])

        barchart = new Barchart({parentElement: '#barchart', colorScale: colorScale}, data)
        barchart.updateVis()

    .catch(error => {console.error("Error loading data", error)})


// FUNCTION: Drawing bar chart showing # exoplanets from systems w 1 star, 2 stars, 3 stars, etc

const exoplanetCSVLines = 5244

function filterData() {
    if (numStarsFilter.length == 0) {
      barchart.data = data;
    } else {
      barchart.data = data.filter(d => numStarsFilter.includes(d.numStars))
    }
    barchart.updateVis();
  }



/*
Allow a user to understand: 
    *- how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
    *- how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
    *- how many exoplanets orbit stars of different types:
        The star types are: A, F, G, K and M 
*/