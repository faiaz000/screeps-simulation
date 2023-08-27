module.exports = {

    run: function (creep) {

        const creepCarry = creep.carry.energy;
        const creepCarryCapacity = creep.carryCapacity

        // Cases for switching states
        if(creep.memory.working && creepCarry === 0){
            creep.memory.working = false;
        }
        else if(!creep.memory.working && creepCarry === creepCarryCapacity){
            creep.memory.working = true;
        }

        // Run the creep
        if(creep.memory.working) {
            
            //Find closest spawn and transfer energy
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
        else {
            
            // Get energy from source 
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: source => {
                    // Check if there are any hostile creeps or Source Keepers near the source
                    const nearbyHostiles = source.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
                    const nearbySourceKeepers = source.pos.findInRange(FIND_HOSTILE_STRUCTURES, 5, {
                        filter: structure => structure.structureType === STRUCTURE_KEEPER_LAIR
                    });
            
                    return nearbyHostiles.length === 0 && nearbySourceKeepers.length === 0;
                }
            });

            if(creep.harvest(source) === ERR_NOT_IN_RANGE)
                creep.moveTo(source);
            
        }
    }
}
