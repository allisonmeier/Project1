class Linechart {

    constructor(defaultConfig, _data) {
        this.config = {
            parentElement: defaultConfig.parentElement,
            colorScale: defaultConfig.colorScale,
            containerWidth: defaultConfig.containerWidth || 600,
            containerHeight: defaultConfig.containerHeight || 300,
            margin: defaultConfig.margin || {top: 5, right: 5, bottom: 20, left: 40},
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