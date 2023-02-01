
// loading data from exoplanets.csv (main data file with "" instead of "BLANK")

//pl_name,hostname,sys_name,sy_snum,sy_pnum,discoverymethod,

//disc_year,pl_orbsmax,pl_rade,pl_bmasse,pl_orbeccen,st_spectype,

//st_rad,st_mass,sy_dist,disc_facility


d3.csv('data/exoplanets.csv')
    .then(data => {
        //changing strings to numbers; non-numbers commented out
        data.forEach(d => {
            //d.planetName = +d.pl_name;
            //d.hostName = +d.hostname;
            //d.systemName = +d.sys_name;
            d.numStars = +d.sy_snum;
            d.numPlanets = +d.sy_pnum;
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
        });
        
    })
    .catch(error => {
        console.error("Error loading data");
    });

