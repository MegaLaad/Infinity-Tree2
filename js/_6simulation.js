addLayer("si", {
    name: "simulation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        layer: new Decimal(0),
        layerGain: new Decimal(0),
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
        if (layers[resettingLayer].row >= 5) player.si.layer = new Decimal(0);
	},

    update() {
        if (hasMilestone('si', 0)) {
            player.si.layerGain = Decimal.pow(10, Decimal.pow(2, Decimal.log10(player.si.points.add(10)))).div(20)
            if (hasUpgrade('si', 11)) player.si.layerGain = player.si.layerGain.times(Decimal.log2(player.si.layer.add(2)))

            player.si.layer = player.si.layer.add(player.si.layerGain)
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
                "milestones"
            ]
        },
        "Eternity": {
            content: [
                "main-display",
                ["display-text",
                    function() { 
                        number = new Decimal(10).tetrate(player.si.layer)
                        return 'You have '+format(number)+" simulated number, with "+format(player.si.eternity)+" eternity" 
                    }, {'color': '#F8E165', 'font-size': '18px'}
                ],
                ["display-text",
                    function() { return "Current Layer: "+format(player.si.layer)+" ("+format(player.si.layerGain)+" layers/tick)" },
                ], "blank",
                "upgrades"
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
        1: {
            requirementDescription: "300 simulations",
            effectDescription: "Universe formula is better.",
            done() { return player.si.points.gte(300) },
        },
        2: {
            requirementDescription: "400 simulations",
            effectDescription: "Keep Generator Upgrades, Dilation Milestones and Upgrades, and Universe Upgrades on reset.",
            done() { return player.si.points.gte(400) },
        },
        3: {
            requirementDescription: "5,000 simulations",
            effectDescription: "Unlock auto-dilation, and dilation doesn't reset anything.",
            done() { return player.si.points.gte(5000) },
        },
        4: {
            requirementDescription: "20,000 simulations",
            effectDescription: "Unlock auto-universe.",
            done() { return player.si.points.gte(20000) },
        },
    },

    upgrades: {
        11: {
            fullDisplay() {
                return "<b>Simulated Automation</b><br>Simulated number gain boost itself.<br><br>Cost: F1,000,000 simulated number"
            },
            canAfford() {
                return player.si.layer.gte(new Decimal("1e6"))
            },
            pay() {
                return player.si.layer = player.si.layer.div(new Decimal("1e6"))
            },
            unlocked() {return hasMilestone('si', 0)}
        },
        12: {
            fullDisplay() {
                return "<b>Simulated Minimum</b><br>Black Hole is always higher than 1,000.<br><br>Cost: F400,000,000 simulated number"
            },
            canAfford() {
                return player.si.layer.gte(new Decimal("4e8"))
            },
            pay() {
                return player.si.layer = player.si.layer.div(new Decimal("4e8"))
            },
            unlocked() {return hasMilestone('si', 0)}
        },
        13: {
            fullDisplay() {
                return "<b>Simulated Realities</b><br>Universe gain is boosted by simulated number if you have simulation milestone 2.<br><br>Cost: F5.00e9 simulated number"
            },
            canAfford() {
                return player.si.layer.gte(new Decimal("5e9"))
            },
            pay() {
                return player.si.layer = player.si.layer.div(new Decimal("5e9"))
            },
            unlocked() {return hasMilestone('si', 0)}
        },
        14: {
            fullDisplay() {
                return "<b>Simulated Dilation</b><br>You gain relativity without dilation, and all dilation upgrades apply without dilating.<br><br>Cost: F1.00e13 simulated number"
            },
            canAfford() {
                return player.si.layer.gte(new Decimal("1e13"))
            },
            pay() {
                return player.si.layer = player.si.layer.div(new Decimal("1e13"))
            },
            unlocked() {return hasMilestone('si', 0)}
        },
        21: {
            fullDisplay() {
                return "<b>Simulated Travel</b><br>You gain 2 free level on all universe buyables. (Manually respec them after buying this)<br><br>Cost: F3.00e19 simulated number"
            },
            canAfford() {
                return player.si.layer.gte(new Decimal("3e19"))
            },
            pay() {
                return player.si.layer = player.si.layer.div(new Decimal("3e19"))
            },
            unlocked() {return hasMilestone('si', 0)}
        },
    },

    hotkeys: [
        {key: "i", description: "I: Reset for simulation", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})