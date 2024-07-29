addLayer("de", {
    name: "deterioration", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
    }},
    color: "#8A877E",
    nodeStyle() {return {
        "background": (player.de.unlocked || player.si.eternity.gte(1000) && player.dm.points.add(player.dm.buyableSpent).gte(1.5e6))?"radial-gradient(#8A877E, #8800)":"#bf8f8f" ,
    }},
    branches: ['d', 'u'],
    requires: new Decimal(10),
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 5, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    tooltipLocked() {return "Reach 1,500,000 total dark matter to unlock (You have "+format(player.dm.points.add(player.dm.buyableSpent))+" total dark matter"},
    tooltip() {return "Deterioration"},

    doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
	},

    update() {
        if (player.dm.points.add(player.dm.buyableSpent).gte(1.5e6)) player.de.unlocked = true
    },

    tabFormat: [
        ["display-text",
            function() { return '<b>Deterioration</b>' }, {"font-size": "32px", "color": "#8A877E"}
        ], "blank",
        "milestones"
    ],

    milestones: {
        0: {
            requirementDescription: "1,500,000 total dark matter",
            effectDescription: "Anions star fragment nerf is much worse.",
            done() { return player.dm.points.add(player.dm.buyableSpent).gte(1.5e6) },
        },
    },
})