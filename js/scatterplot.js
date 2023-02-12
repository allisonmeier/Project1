class Scatterplot {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 700,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 140},
            tooltipPadding: defaultConfig.tooltipPadding || 15
        }
        this.data = _data
        this.initVis()
    }

    initVis() {

    }

    updateVis() {

    }

    renderVis() {
        
    }

}