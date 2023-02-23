class Histogram {

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


    }

    updateVis() {
        let vis = this

        vis.renderVis()
    }

    renderVis() {
        let vis = this

      
    
    }


}