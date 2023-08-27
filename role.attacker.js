var roleAttacker = {
    run: function(creep) {
        // Attack behavior
        if (creep.hits === 0) {
            creep.memory.attacking = false;
            creep.say('🔄 Healing');
        }
        if (!creep.memory.attacking && creep.hits === creep.hitsMax) {
            creep.memory.attacking = true;
            creep.say('⚡ Attacking');
        }

        if (creep.memory.attacking) {
            // Find and attack the nearest hostile creep or structure
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                console.log("targetPos", target.pos.x)
                if (creep.getActiveBodyparts(ATTACK) > 0) {
                    // Creep has ATTACK body part
                    if (creep.pos.isNearTo(target)) {
                        creep.attack(target);
                    } else {
                        
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                } else if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    // Creep has RANGED_ATTACK body part
                    if (creep.pos.inRangeTo(target, 3)) {
                        creep.rangedAttack(target);
                    } else {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                }
            }
        } else {
            // Move to a room position to respawn if needed // reSpawn Logic to be written
            creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

module.exports = roleAttacker;
