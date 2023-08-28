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
    
    const numberOfCreeps = _.filter( Game.creeps, (creep) => creep.room.name === roomName).length;
   
    const spawnQueue = ["builder","upgrader","harvester"];
    const creepType = spawnQueue[numberOfCreeps % spawnQueue.length];
     
     console.log("current CreepType", numberOfCreeps,creepType)
    
     for (const structure of structures) {
         
        if ( structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN ) 
            totalEnergy += structure.energy;
        
    }
   
    if(!extensions && totalEnergy >= 300)
        creepParts = [WORK,CARRY.CARRY,MOVE,MOVE]
   
    if (extensions.length == 1 && totalEnergy >= 350) {
        creepParts =  [WORK, MOVE, CARRY, WORK, MOVE];
    } else if (extensions.length == 2 && totalEnergy >= 400) {
        creepParts =  [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length == 3 && totalEnergy >= 450) {
        creepParts =  [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length == 4 && totalEnergy >= 500) {
        creepParts =   [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    } else if (extensions.length == 5 && totalEnergy >= 550) {
        console.log("helloPart")
        creepParts =  [WORK, WORK, WORK, CARRY,CARRY, CARRY, MOVE, MOVE];
    }

    if (creepParts) {
        Game.spawns["Spawn1"].spawnCreep(
            creepParts,
            creepType + Game.time,
            { memory: { role: creepType } }
        );
    }
    
}