module.exports = {
    createExtensionsAndSpawn: function(roomName) {
        const room = Game.rooms[roomName];
        const extensions = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
        });
        const extensionsUnderConstruction = room.find(FIND_CONSTRUCTION_SITES, {
              filter: (site) => site.structureType == STRUCTURE_EXTENSION
        });
        
        if (extensions.length === 0 && extensionsUnderConstruction.length < 5) {
            console.log("Creating extensions...");
            // Create construction sites for extensions
            const spawnPos = Game.spawns["Spawn1"].pos;
            const positions = [
                [2, 0], [-2, 0], [4, 0], [-4, 0], [6, 0]
            ];
            
            for (const position of positions) {
                const x = spawnPos.x + position[0];
                const y = spawnPos.y + position[1];
                room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
            }
            
            // Change roles of existing creeps
            for (const name in Game.creeps) {
                const creep = Game.creeps[name];
                creep.memory.role = "builder";
            }
            
            // Spawn a new builder creep
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "builder" + Game.time, {
                memory: { role: "builder" }
            });
        }
    }
};
