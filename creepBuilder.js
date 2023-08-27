Creep.prototype.createNewSpawn = function () {
    
    let totalEnergy = 0;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    const structures = room.find(FIND_STRUCTURES);
    
    let creepParts;
    
    const extensions =  Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        },
    });
    
    // get current Creeps available
    const numberOfCreeps = _.filter( Game.creeps, (creep) => creep.room.name === roomName).length;
    const spawnQueue = ["builder","upgrader","attacker", "harvester"];
    const creepType = spawnQueue[numberOfCreeps % spawnQueue.length];
     
    console.log("current CreepType", numberOfCreeps,creepType)
    // get total energy along with structures
    for (const structure of structures) {
         
        if ( structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN ) 
            totalEnergy += structure.energy;
        
    }
    // Build Creeps based on extensions and total energy
    if (extensions.length >= 1 && totalEnergy >= 350) {
        creepParts = creepType === "attacker" ? [ATTACK, ATTACK,ATTACK, MOVE, MOVE] : [WORK, MOVE, CARRY, WORK, MOVE];
    } else if (extensions.length >= 2 && totalEnergy >= 400) {
        creepParts = creepType === "attacker" ? [ATTACK, ATTACK,ATTACK,MOVE, MOVE, MOVE] : [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length >= 3 && totalEnergy >= 450) {
        creepParts = creepType === "attacker" ? [ATTACK,RANGED_ATTACK, MOVE, MOVE,MOVE,MOVE] : [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length >= 4 && totalEnergy >= 500) {
        creepParts = creepType === "attacker" ? [ATTACK,RANGED_ATTACK, MOVE, MOVE,MOVE,ATTACK] : [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length >= 5 && totalEnergy >= 550) {
        creepParts = creepType === "attacker" ? [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE,MOVE] : [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    if (creepParts) 
        Game.spawns["Spawn1"].spawnCreep(creepParts, creepType + Game.time, { memory: { role: creepType } });  
    
}