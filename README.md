# DarkSun #

This is a top-down shooter where you salvage parts from the enemy ships you destroy. Instead of gaining fully working powerup weapons, you have to salvage components from multiple enemy ships until you have a working part to apply to your own ship. You can then upgrade those parts as you acquire more components for that particular part.

Dark Sun is in many ways similar to action RPGs such as Diablo 2 or Path of Exile. Each part you utilize will have a large range of stats affecting its performance; it's like building a whole ship out of characters. Each part of your ship will fulfill a certain role of your ship; be it raw armor, power generators, shield projectors, offensive weapons, even storage and material production units.

Note: This project used to be called Garbage Invaders (see my previous Git repository), but Dark Sun sounds like a better name

## Ship Layout ##
The layout of your ship might, at first, look similar to ships from Battleships Forever (it's a good game, you should check it out). But there is nothing requiring your ship to be symmetrical. The size of your ship will be determined by how you wish to play; you may choose to command a large battleship with powerful guns that can take a beating without slowing down. Or, you may decide to fly a small, fast ship that is difficult for enemies to hit.

To make combat in this game more interesting, there will be multiple ways to attack targets - and multiple ways to avoid being destroyed. The player will deal with a wide range of alien species, each using a different means to win in combat.

* Optical stealth (hides your ship by way of projecting images behind you, towards the target). Light beacon 'bombs' can be used to illuminate targets in stealth.
* Kinetic impact weapons - Fires straight-shot rounds at very high speeds to punch through targets. Shots can either be small at a rapid fire rate, or large at a slower fire rate. Ships using kinetic weapons usually suffer from recoil; if a ship is too light, it may be thrown way off course, including tilting its fire angle. Firing systems can either be chemical (like a cannon) or magnetic (aka railgun). The best defense against these weapons is heavy-metal armor, or shields. A singularity projector may also absorb the impact without damage, if it is in the right place.
* Plasma weapons - Fires super-hot rounds that can burn holes through targets. Requires a lot of energy to fire, but still effective. Heavy-metal armor and shields are effective at absorbing damage from this.
* Explosive warheads - Common missile / cannon rounds, explodes on impact. Can be fired at high speeds like a cannon (either chemically or via railgun) or launched like a rocket.
* Acidic warheads - Burns targets with acid, slowly eating away armor and parts. Acid explosions generally spray acids in an area; this can pose a hazard to your own ship.
* EMP warhead - On impact with its target, will release a powerful electric pulse, shorting out any electronics. To those not prepared for this, can disable the entire ship. Generally disables a single part. Heavy-metal armor is immune to this (since it has no electronics).
* Anti-shield warheads - When used on shields, sends a feedback loop into the shield projectors, disabling them. Ineffective on anything else. Shields can be upgraded with repair modules to regenerate projectors, or bypass the feedback loop by turning off and back on.
* Lasers - Shoots light at enemy targets, burning them. Light travels instantly from source to target, but can be easily deflected with shields, and usually requires a lot of power.
* Cyber crack warhead - When used on electronic-based parts, will hack into their systems and attempt to take over the part. When successful, this virus will continue trying to take over other connected parts. If the victim isn't prepared for this, will take over the entire ship, turning it to work for you instead of your enemies. Ship parts can be equipped with cyber security measures to prevent such attacks.

## Other Parts ##

Player ships will have a lot of parts that can be added to them. Each part will have a specific role on the ship, and will come in all shapes and sizes. Not all part types will be available starting out (for example, shields); early ones may cost a lot to construct, power and maintain. The more parts a player's ship has, the heavier it'll be, needing more thruster power, or just move slower. Here are some ideas for ship parts:

* Core: All ships have a core, where everything connects to. This basically houses the pilot. If this part is destroyed, the remainder of the ship will become inactive (making for easy parts to grab).
* Engine: Produces power for the ship. The fuel source for this can vary, from gasoline engines to fusion reactors and beyond. Ships will try to save power whenever it can, since fuel can sometimes be hard to come by. Each part will consume a variable amount of power, based on what it is doing.
* Capacitors: Batteries used to manage power fluxuations. Some engines take time to 'rev up' to handle power output of certain parts. These batteries will cover the power shortage until the engines can catch up. When batteries drain of power, they too will request power until they have filled up. All batteries require some power flow for themselves to maintain their power levels.
* Armor: Heavy metal armor will be a good defensive choice for any ship, large or small. However, they are rather heavy, and can weigh down a ship if the player isn't careful.
* Shield projectors: Generates a bubble-type shield to block any incoming fire. Shields can only handle so much abuse before they go down; many shield types will be able to regenerate in short time. Placement of shields will be important, as they may not always cover the entire ship.
* Part protectors: (We may opt to leave this out, based on effects of gameplay) Generates a defensive shield on a single (other) part. Protectors can be defeated by continuous fire, and can only protect parts for so long before they have to turn off to reset.
* Thruster: Basic device to shift your ship around. Ships can be loaded with many thrusters to aid in movement.
* Chemical cannons: Covers all weapons using chemical explosives to launch their weapon payloads.
* Rail cannons: Covers all weapons using magnetic rails to launch their payloads.
* Missile launchers: Covers all weapons that aren't fired from a cannon, such as rockets, missiles, even bombs
* Counter-measure missiles: Fires smaller-sized missiles that are used to intercept incoming fire. Larger, slower-moving weapons are easier to hit and destroy than fast-moving or small ones. Will usually not be used against rapid-fire weapons (like machine-gun fire).
* Storage units: Stores all the items your ship is currently carrying but not using. Storage capacity can be increased by adding more units, but this can slow down your ship fairly easily. Cannot hold gasses or fluids.
* Fluid storage: Stores any gasses or fluids your ship may be carrying. However, can only hold 1 type per unit.
* Ammo assemblers: Turns scrap metal and other materials into usable ammo. Ammo types produced by this can range between metal spheres to sophisticated smart missiles, depending on how capable the assembler is.
* Scrap makers: Turns unwanted or broken parts into scrap metal and other materials, for use in building other things with it. These require power to run, and can be turned off during combat.
* Component makers: Turns scrap and other materials into part components or whole parts. Components that the player wishes to build must be broken down by this to determine how it works. It may take several tries to properly scan and produce the part the player wishes to build.
