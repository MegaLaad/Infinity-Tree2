addLayer("si", {
    name: "simulation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        layer: new Decimal(0),
        eternity: new Decimal(0),
    }},
    color: "#F8E165",
    nodeStyle() {return {
        "background": (player.si.unlocked)?"radial-gradient(#F8E165, #8800)":"#bf8f8f" ,
    }},
    branches: [['n', 2]],
    requires: new Decimal(2),
    resource: "simulation", // Name of prestige currency
    baseResource: "universe",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.u.points.add(player.u.buyableSpent) },  // A function to return the current amount of baseResource.
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        return Decimal.pow(10, player.u.points.add(player.u.buyableSpent))
    },
    getNextAt() {
        return NaN
    },
    canReset() {
        return player.u.points.add(player.u.buyableSpent).gte(2)
    },
    prestigeButtonText() {
        return "Build "+format(getResetGain(this.layer))+" simulations based off your universe."
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
	},

    update() {
        if (hasMilestone('si', 0)) {
            layerGain = Decimal.pow(10, Decimal.pow(2, Decimal.log10(player.si.points.add(10)))).div(20)
            player.si.layer = player.si.layer.add(layerGain)
        }  
    },
 
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                ["display-text",
                    function() { return 'You have '+format(player.u.points.add(player.u.buyableSpent))+" total universe" }
                ],
                ["display-text",
                    function() { return "(You need at least 2 total universe for the prestige button to work)" }, {"color": "#F8E165"}
                ], "blank",
                "milestones", "blank"
            ]
        },
        "Eternity": {
            content: [
                "main-display",
                ["display-text",
                    function() { 
                        number = new Decimal(10).tetrate(player.si.layer)
                        return 'You have '+format(number)+" simulated number, with "+format(player.si.eternity)+" eternity<br><br>Gain 1 eternity at F1.79e308 simulated number" 
                    }, {'color': '#F8E165', 'font-size': '18px'}
                ],
                ["display-text",
                    function() { return "Current Layer: "+format(player.si.layer)+" ("+format(Decimal.pow(10, Decimal.pow(2, Decimal.log10(player.si.points.add(10)))).div(20))+" layers/tick)" },
                ], "blank",
            ],
            unlocked() {return hasMilestone('si', 0)}
        },
    },

    milestones: {
        0: {
            requirementDescription: "200 simulations",
            effectDescription: "Unlock a new tab.",
            done() { return player.si.points.gte(200) },
        },
    },

    hotkeys: [
        {key: "i", description: "I: Reset for simulation", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})