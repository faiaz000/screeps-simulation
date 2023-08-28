var roleBuilder = {

    run: function(creep) {

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if (creep.memory.working) {
            // get Extensions requiring energy
            const needEnergyExtensions = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_TOWER) {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                    return false; // Exclude other structure types
                }
            });
            //Provide energy to extensions
            if (needEnergyExtensions.length > 0) {
                const targetExtension = needEnergyExtensions[0];
                if (creep.transfer(targetExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                  
                    creep.moveTo(targetExtension, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                //get constrution sites
                const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (site) => {
                        return site.structureType === STRUCTURE_EXTENSION;
                    }
                });
                // Upgrade Controller if no construction sites available
                if (constructionSites.length === 0) {
                    // Extensions are full and no construction sites, upgrade the controller
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                  
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                //Provide energy to build construction sites
                else {
                    const targetConstructionSite = constructionSites[0];
                    if (creep.build(targetConstructionSite) === ERR_NOT_IN_RANGE) {
                   
                        creep.moveTo(targetConstructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        }
        // Collect energy
        else {
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
            if(creep.harvest(source) === ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;
