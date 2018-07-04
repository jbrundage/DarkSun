const mongo = require('mongoose');

const temp = {
    ownedship: {  /* all ships owned by the player */
        owner:    {type: String, required:true},
        shipKind: {type: String, required:true},  /* references the type of ship this is.  This is only the ship core */
        name:     {type: String} /* name of this ship, as decided by the user. If no name is given, a name will be provided by the game. Can be changed any time. */
    },
    shipKind: { /* all types of ships available (only the core) */
        name:        {type: String, require: true, unique: true},
        model:       {type: String, require: true}, /* file path to the 3D model to be displayed */
        texture:     {type: String, require: true}, /* file path to the texture to be applied to to the 3D model */
        weightlimit: {type: Number, require: true, min: 100} /* how much weight this ship can handle, in total. Mostly decided by the part ports */
    },
    portLocation: { /* all locations where other parts can be attached */
        targetType: {type: Number, require: true}, /* 0 for belonging to a ship, 1 for belonging to a part */
        targetId:   {type: String, require: true}, /* what item this port location is for */
        xpos:       {type: Number, require: true}, /* X coordinate, relative to the parent part */
        zpos:       {type: Number, require: true}, /* Z coordinate, relative to the parent part */
        defaultRotation: {type: Number, require: true}, /* Standard rotation for parts attached here */
        isMirrored:      {type: Number, require: true} /* 1 if the attached part will be is rotated 180 degrees by default, or 0 if not */
    },
    ownedPart: { /* all parts owned by the player */
        parentType: {type: Number}, /* 0 if this part is attached to a ship, or 1 for being attached to a part */
        parent:     {type: String}, /* what part or ship this is connected to */
        partKind:   {type: String, required: true}, /* what kind of part this is */
        weight:     {type: Number, required: true, min:100}, /* how much this part weights. This includes components in this part, plus all parts attached
                                                                to this part */
        health:     {type: Number, required: true}, /* how much health this part has, as a whole. When this reaches zero, the part will loose a component at
                                                        random, and the part will gain 25% health. If all components are destroyed, this part will fall apart.
                                                        Any parts attached to this will begin floating freely */
        rotation:   {type: Number, required: true}, /* rotation of this part in relation to the parent part (or ship). Can be set by the user */
        isMirrored: {type: Number, required: true} /* 1 if the attached part is rotated 180 degrees, or 0 if not. Can also be set by the user */
    },
    partKind: { /* all types of parts available */
        name:         {type: String, require: true, unique: true},  
        role:         {type: String, require: true},  /* what purpose this part fulfills */
        model:        {type: String, require: true}, /* file path to the 3D model to be displayed */
        texture:      {type: String, require: true}, /* file path to the texture applied to the 3D model */
        componentMap: {type: String, require: true}, /* file path to the image showing where components can be placed into this part */
        baseweight:   {type: Number, require: true, min: 20}, /* How much this part weighs, before adding any components */
        weightlimit:  {type: Number, require: true, min: 100}, /* how much weight this part can hold on all its ports */
        health:       {type: Number, require: true} /* base health this part has */
    },
    componentLocation: { /* where components can be placed on a given part (relative to the component map image).
            Related only to the part kind. Components must reference this to determine where they can fit */
        targetpart:   {type: String, require: true}, /* reference to what part kind this is for */
        isRequired:   {type: Number, require: true}, /* 1 if this component slot must be filled with something, or 0 if it is optional */
        xpos:         {type: Number, require: true}, /* X coordinate on the map where components can be placed */
        ypos:         {type: Number, require: true}, /* Y coordinate on the map where components can be placed */
        width:        {type: Number, require: true}, /* width of the component space on the map */
        height:       {type: Number, require: true}, /* height of the component space on tha map */
        nextLocation: {type: String}, /* next alternate componentLocation where parts can also fit */
        prevLocation: {type: String}  /* previous alternate componentLocation where parts can also fit. */
    },
    ownedComponent: { /* all components the player owns */
        onPart: {type: String}, /* what part this is attached to, if any */
        componentKind: {type: String, require: true} /* What type of component this is */
    },
    componentKind: { /* all core information about a given component */
        name: {type: String, require: true}, /* name of this component */
        image: {type: String, require: true}, /* file path to the image used to show this component */
        targetPosition: {type: String, require: true} /* Where this part fits onto a part. The target part is listed in the componentLocation */
    },
};
let ret = {}; 
ret.json = {}; 
Object.keys(temp).forEach(function(name,i){ /* create json db schema for client-side use */
    ret.json[name] = {};
    Object.keys(temp[name]).forEach(function(paramName,i2){
        ret.json[name][paramName] = JSON.parse(JSON.stringify(temp[name][paramName]));
        ret.json[name][paramName].type = temp[name][paramName].type === String ? "string" : "";
        ret.json[name][paramName].type = temp[name][paramName].type === Number ? "number" : ret.json[name][paramName].type;
        ret.json[name][paramName].type = temp[name][paramName].type === Date ? "date" : ret.json[name][paramName].type;
    });
});
ret.registeredUserModel = mongo.model('registeredUserModel', new mongo.Schema(temp.registeredUserModel));
ret.ownedship = mongo.model('ownedship', new mongo.Schema(temp.ownedship));
ret.shipkind = mongo.model('shipKind', new mongo.Schema(temp.shipkind));
ret.portLocation = mongo.model('portLocation', new mongo.Schema(temp.portLocation));
ret.ownedPart = mongo.model('ownedPart', new mongo.Schema(temp.ownedPart));
ret.partKind = mongo.model('partKind', new mongo.Schema(temp.partKind));
ret.componentLocation = mongo.model('componentLocation', new mongo.Schema(temp.componentLocation));
ret.ownedComponent = mongo.model('ownedComponent', new mongo.Schema(temp.ownedComponent));
ret.componentKind = mongo.model('componentKind', new mongo.Schema(temp.componentKind));

module.exports = ret;