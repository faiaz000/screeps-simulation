var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Cases for switching states
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }
        //Upgrade the controller
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffafff'}});
            }
        }
        //Get energy from Source
        else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: source => {
                    // Check for hostile creeps or Source Keepers near the source
                    const nearbyHostiles = source.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
                    const nearbySourceKeepers = source.pos.findInRange(FIND_HOSTILE_STRUCTURES, 5, {
                        filter: structure => structure.structureType === STRUCTURE_KEEPER_LAIR
                    });
            
                    return nearbyHostiles.length === 0 && nearbySourceKeepers.length === 0;
                }
            });
            
            if(creep.harvest(source) === ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
            
        }
    }
};

module.exports = roleUpgrader;