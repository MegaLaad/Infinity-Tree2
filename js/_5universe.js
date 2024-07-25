addLayer("u", {
    name: "universe", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        buyableSpent: new Decimal(0),
    }},
    color: "#534FE7",
    nodeStyle() {return {
        "background": "radial-gradient(#0000FF, #A020F0)",
    }},
    branches: ['sf', 's', 'd', 'g'],
    requires: new Decimal(1e26),
    resource: "universe", // Name of prestige currency
    baseResource: "space",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.s.points },  // A function to return the current amount of baseResource.
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription() { 
        return "with "+format(player.u.points.add(player.u.buyableSpent))+" universes total."
    },
    getResetGain() {
        gain = Decimal.floor(Decimal.ln(Decimal.log10(player.s.points.add(10)).add(26)).div(Decimal.ln(26))).sub(player.u.points).sub(player.u.buyableSpent)
        if (!isNaN(gain) && gain.gte(1)) return gain
        else return decimalZero
    },
    getNextAt() {
        nextAt = Decimal.pow(10, Decimal.pow(26, getResetGain(this.layer).add(1).add(player.u.points).add(player.u.buyableSpent)))
        return nextAt
    },
    canReset() {
        return getResetGain(this.layer).gte(1)
    },
    prestigeButtonText() {
        if (!getResetGain(this.layer).gte(100)) return "Reset for +"+format(getResetGain(this.layer))+" universe<br><br>"+format(player.s.points)+" / "+format(getNextAt(this.layer))+" space"
        else return "Reset for +"+format(getResetGain(this.layer))+" universe"
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
 
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                ["display-text",
                    function() { return 'You have '+format(player.s.points)+" space" }
                ], "blank",
                "milestones", "blank"
            ]
        },
        "Exploration": {
            content: [
                "main-display",
                ["display-text",
                    function() { return '<b>Alternative Universes</b>' }, {"font-size": "32px", "color": "#534FE7"}
                ], "blank",
                "buyables", "blank",
                "upgrades",
            ]
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 velocity",
            effectDescription: "Get all velocity milestones and keep them on reset, and unlock auto-velocity early.",
            done() { return player.v.points.gte(1) },
            unlocked() {return player.u.unlocked}
        },
        1: {
            requirementDescription: "1 black hole",
            effectDescription: "Get all black hole milestones and keep them on reset, and unlock auto-velocity early.",
            done() { return player.bl.points.gte(1) },
            unlocked() {return player.u.unlocked}
        },
        2: {
            requirementDescription: "1 star fragment",
            effectDescription: "Get all star fragment milestones, make all non-missing upgrades affordable and keep them on reset.",
            done() { return player.sf.points.gte(1) },
            unlocked() {return player.u.unlocked}
        },
        3: {
            requirementDescription: "1 electron",
            effectDescription: "Get all generators milestones and keep them on reset.",
            done() { return player.g.electron.gte(1) },
            unlocked() {return player.u.unlocked}
        },
        4: {
            requirementDescription: "1 space",
            effectDescription: "Get all space milestones and keep them on reset, and space boost is 100x better",
            done() { return player.sf.points.gte(1) },
            unlocked() {return player.u.unlocked}
        },
        5: {
            requirementDescription: "1e100 relativity gain",
            effectDescription: "Gain 100% of relativity every second.",
            done() { return player.d.relativityGain.gte(1e100) },
            unlocked() {return player.u.unlocked}
        },
    },

    buyables: {
        showRespec: true,
        respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
            player.u.points = player.u.points.add(player.u.buyableSpent)
            player.u.buyableSpent = new Decimal(0)
            setBuyableAmount(this.layer, 11, new Decimal(0))
            setBuyableAmount(this.layer, 12, new Decimal(0))
            setBuyableAmount(this.layer, 13, new Decimal(0))
            setBuyableAmount(this.layer, 21, new Decimal(0))
            setBuyableAmount(this.layer, 22, new Decimal(0))
        },
        respecMessage: "Are you sure you want to respec?",
        11: {
            cost(x) { return decimalOne },
            title: "The Reality",
            display() { return "<b>[NUMBER BOOSTER]</b><br><br>Multiply gain and exponent exponential gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id).pow(1.5)))+", and exponent double exponential gain by "+format(Decimal.pow(2, getBuyableAmount(this.layer, this.id)))+".<br><br>Cost: "+format(player.u.points)+" / "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" universe<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.u.points.gte(this.cost()) },
            buy() {
                player.u.points = player.u.points.sub(1)
                player.u.buyableSpent = player.u.buyableSpent.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {"background": function() { return "radial-gradient(#4BDC13, #534FE7)"}},
        },
        12: {
            cost(x) { return decimalOne },
            title: "Distant Universe",
            display() { return "<b>[INFINITY BOOSTER]</b><br><br>Multiply gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id).times(2).pow(3)))+", exponent gain by "+format(Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)))+", and exponent time gain by "+format(Decimal.pow(2, getBuyableAmount(this.layer, this.id)))+".<br><br>Cost: "+format(player.u.points)+" / "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" universe<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.u.points.gte(this.cost()) },
            buy() {
                player.u.points = player.u.points.sub(1)
                player.u.buyableSpent = player.u.buyableSpent.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {"background": function() { return "radial-gradient(#FF00FF, #534FE7)"}},
        },
        13: {
            cost(x) { return decimalOne },
            title: "Mutation Universe",
            display() { return "<b>[VELOCITY BOOSTER]</b><br><br>Multiply gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id).times(2).pow(3)))+", exponent gain by "+format(Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)))+", and exponent double exponential gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id)))+".<br><br>Cost: "+format(player.u.points)+" / "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" universe<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.u.points.gte(this.cost()) },
            buy() {
                player.u.points = player.u.points.sub(1)
                player.u.buyableSpent = player.u.buyableSpent.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade('u', 11)},
            style: {"background": function() { return "radial-gradient(#BBBB00, #534FE7)"}},
        },
        21: {
            cost(x) { return decimalOne },
            title: "Mutation Universe",
            display() { return "<b>[STAR FRAGMENT BOOSTER]</b><br><br>Multiply gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id).times(2).pow(3)))+", exponent gain by "+format(Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)))+".<br><br>Cost: "+format(player.u.points)+" / "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" universe<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.u.points.gte(this.cost()) },
            buy() {
                player.u.points = player.u.points.sub(1)
                player.u.buyableSpent = player.u.buyableSpent.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade('u', 12)},
            style: {"background": function() { return "radial-gradient(#419292, #534FE7)"}},
        },
        22: {
            cost(x) { return decimalOne },
            title: "Production Universe",
            display() { return "<b>[GENERATOR BOOSTER]</b><br><br>Multiply gain by "+format(Decimal.pow(10, getBuyableAmount(this.layer, this.id).times(2).pow(3)))+", exponent gain by "+format(Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)))+".<br><br>Cost: "+format(player.u.points)+" / "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" universe<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.u.points.gte(this.cost()) },
            buy() {
                player.u.points = player.u.points.sub(1)
                player.u.buyableSpent = player.u.buyableSpent.add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade('u', 13)},
            style: {"background": function() { return "radial-gradient(#DD3652, #534FE7)"}},
        },
    },

    upgrades: {
        11: {
            fullDisplay() {
                return "Unlock Mutation Universe.<br><br>Cost: 1.00e25 velocity"
            },
            canAfford() {
                return player.v.points.gte(new Decimal("e25"))
            },
            pay() {
                return player.v.points = player.v.points.div(new Decimal("e25"))
            },
        },
        12: {
            fullDisplay() {
                return "Unlock Fragmentation Universe.<br><br>Cost: 100 star fragment"
            },
            canAfford() {
                return player.sf.points.gte(new Decimal("100"))
            },
            pay() {
                return player.sf.points = player.sf.points.div(new Decimal("100"))
            },
        },
        13: {
            fullDisplay() {
                return "Unlock Production Universe.<br><br>Cost: 1e10 generators"
            },
            canAfford() {
                return player.g.points.gte(new Decimal("1e10"))
            },
            pay() {
                return player.g.points = player.g.points.div(new Decimal("1e10"))
            },
        },
    },

    hotkeys: [
        {key: "u", description: "U: Reset for universe", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})