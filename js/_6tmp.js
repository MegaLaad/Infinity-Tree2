addLayer("wip", {
    name: "wip", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "WIP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#bf8f8f",
    branches: [],
    requires: new Decimal(10),
    resource: "wip", // Name of prestige currency
    baseResource: "wip",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return null },  // A function to return the current amount of baseResource.
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        return null
    },
    getNextAt() {
        return null
    },
    canReset() {
        return null
    },
    prestigeButtonText() {
        return null
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
	},
 
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                "milestones"
            ]
        },
    },
})