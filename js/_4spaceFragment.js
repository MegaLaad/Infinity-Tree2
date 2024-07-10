unlockSF = 0

addLayer("sf", {
    name: "space fragment", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches: ['v'],
    color: "#419292",
    requires: new Decimal(1e275),
    resource: "space fragment", // Name of prestige currency
    baseAmount() { return player.v.points },  // A function to return the current amount of baseResource.
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return unlockSF = 1},

    hotkeys: [
        {key: "s", description: "S: Reset for star fragments", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    update() {
        if (hasUpgrade('v', 31)) {
            unlockSF = 1
        }
    },

    getResetGain() {
        if (player.v.points < 1e275) return new Decimal(0)
        else return new Decimal(1)
    },
    getNextAt() {
        if (player.v.points < 1e275) return 1e275
        else return NaN
    },
    canReset() {
        return getResetGain(this.layer) > 0
    },
    prestigeButtonText() {
        if (getResetGain(this.layer) < 100) return "Reset for +"+format(getResetGain(this.layer))+" space fragments<br><br>"+format(player.v.points)+" / "+format(getNextAt(this.layer))+" velocity"
        else return "Reset for +"+format(getResetGain(this.layer))+" space fragments"
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                ["display-text",
                    function() { return 'You have '+format(player.v.points)+" velocity" }
                ], "blank", 
                "milestones", "blank",
            ]
        },
        "Fragments": {
            content: [
                "main-display",
                ["display-text",
                    function() { return '<b>Fragment Descoveries</b>' }, {"font-size": "32px", "color": "#419292"}
                ], "blank",
                ["display-text",
                    function() { return 'FRAGMENT COMPLETION:<br>1. Keep Velocity and Black Hole Milestones on all resets<br>2. Start with 100 velocity and energy for all row 4 resets<br>3. Electricity cost multiplier is lowered<br>4. Time and Number ^10, and Velocity Upgrade 5 is better.' }
                ], "blank",
                "upgrades",
            ],
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 space fragment",
            effectDescription: "Unlock a new tab, exponential growth without the 1st number upgrade and keep the number limit broken.",
            done() { return player.sf.points.gte(1) }
        },
        1: {
            requirementDescription: "3 space fragment",
            effectDescription: "[PLACEHOLDER]",
            done() { return player.sf.points.gte(3) },
            unlocked() {return hasUpgrade('sf', 53)}
        },
    },

    upgrades: {
        13: {
            fullDisplay() {
                return "<b>Simple Boost</b><br>Infinity boost x10, which is not affected by cap.<br><br>Cost: 1e20 number"
            },
            canAfford() {
                return player.points >= 1e20
            },
            pay() {
                return player.points = player.points.div(1e20)
            },
            unlocked() {return hasMilestone('sf', 0)}
        },
        22: {
            fullDisplay() {
                return "<b>More Infinities</b><br>Infinity gain x1,000,000<br><br>Cost: 100,000 infinity"
            },
            canAfford() {
                return player.i.points >= 1e5
            },
            pay() {
                return player.i.points = player.i.points.sub(1e5)
            },
            unlocked() {return hasUpgrade('sf', 23)}
        },
        23: {
            fullDisplay() {
                return "<b>Small Yet Immediate</b><br>Infinity gain x1,000<br><br>Cost: 1 infinity"
            },
            canAfford() {
                return player.i.points >= 1
            },
            pay() {
                return player.i.points = player.i.points.sub(1)
            },
            unlocked() {return hasUpgrade('sf', 13)}
        },
        24: {
            fullDisplay() {
                return "<b>Early Machines</b><br>Machine gain x7<br><br>Cost: 1.00e20 infinity"
            },
            canAfford() {
                return player.i.points >= 1e20
            },
            pay() {
                return player.i.points = player.i.points.sub(1e20)
            },
            unlocked() {return hasUpgrade('sf', 23)}
        },
        31: {
            fullDisplay() {
                return "<b>Energy Specify</b><br>Make the energy formula better.<br><br>Cost: 1,000,000 energy"
            },
            canAfford() {
                return player.e.points >= 1e6
            },
            pay() {
                return player.e.points = player.e.points.sub(1e6)
            },
            unlocked() {return hasUpgrade('sf', 32)}
        },
        32: {
            fullDisplay() {
                return "<b>Time Warping</b><br>Velocity Milestone 4 is x5e295 better.<br><br>Cost: 3 velocity"
            },
            canAfford() {
                return player.v.points >= 3
            },
            pay() {
                return player.v.points = player.v.points.sub(3)
            },
            unlocked() {return hasUpgrade('sf', 33) && hasUpgrade('sf', 22)}
        },
        33: {
            fullDisplay() {
                return "<b>Starting Resources</b><br>Infinity gain x1e40, Time gain x1,000 and Unlock all Velocity Milestones automatically.<br><br>Cost: 1.00e40 infinity"
            },
            canAfford() {
                return player.i.points >= 1e20
            },
            pay() {
                return player.i.points = player.i.points.sub(1e20)
            },
            unlocked() {return hasUpgrade('sf', 23)}
        },
        34: {
            fullDisplay() {
                return "<b>Speedy Automation</b><br>Unlock auto-velocity, also time gain ^1.2.<br><br>Cost: 100 velocity"
            },
            canAfford() {
                return player.v.points >= 15
            },
            pay() {
                return player.v.points = player.v.points.sub(15)
            },
            unlocked() {return hasUpgrade('sf', 33) && hasUpgrade('sf', 24)}
        },
        35: {
            fullDisplay() {
                return "<b>Dependent Generation</b><br>When online, generate velocity according to last velocity reset gain.<br><br>Cost: 1.00e9 velocity"
            },
            canAfford() {
                return player.v.points >= 1e9
            },
            pay() {
                return player.v.points = player.v.points.sub(1e9)
            },
            unlocked() {return hasUpgrade('sf', 34)}
        },
        42: {
            fullDisplay() {
                return "<b>Advanced Formula</b><br>Unlock Black Hole Milestones automatically, and makes Velocity Buyable 2 better.<br><br>Cost: 2,000,000 velocity"
            },
            canAfford() {
                return player.v.points >= 2e6
            },
            pay() {
                return player.v.points = player.v.points.sub(2e6)
            },
            unlocked() {return hasUpgrade('sf', 43) && hasUpgrade('sf', 32)}
        },
        43: {
            fullDisplay() {
                return "<b>White Holes</b><br>Infinity gain x1e2000, and each Black Hole Challenge gives a ^2 boost to Number gain.<br><br>Cost: 200,000 velocity"
            },
            canAfford() {
                return player.v.points >= 200000
            },
            pay() {
                return player.v.points = player.v.points.sub(200000)
            },
            unlocked() {return hasUpgrade('sf', 33)}
        },
        44: {
            fullDisplay() {
                return "<b>Wormholes Connection</b><br>Increase Energy gain by Black Hole if you have 'Energy Specify'.<br><br>Cost: 180 black hole"
            },
            canAfford() {
                return player.bl.points >= 180
            },
            pay() {
                return player.bl.points = player.bl.points.sub(180)
            },
            unlocked() {return hasUpgrade('sf', 43) && hasUpgrade('sf', 34)}
        },
        53: {
            fullDisplay() {
                return "<b>FRAGMENT COMPLETION</b><br>Unlock more milestones and other things.<br><br>Cost: 1.00e275 velocity"
            },
            canAfford() {
                return player.v.points >= 1e275
            },
            pay() {
                return player.v.points = player.v.points.sub(1e275)
            },
            unlocked() {return hasUpgrade('sf', 33)}
        },
    },
})
