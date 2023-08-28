const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const spawnManager = require('spawnManager');
const roleAttacker = require('role.attacker')
const creepBuilder  = require('creepBuilder');


module.exports.loop = function () {
    
    const roomName = Object.keys(Game.rooms)[0];
    const roomControlLevel = Game.rooms[roomName].controller.level;
    const numberOfCreeps = _.filter( Game.creeps,(creep) => creep.room.name === roomName ).length;
    const harvesterCount = _.filter( Game.creeps, (creep) => creep.memory.role === "harvester").length;
    const upgraderCount = _.filter( Game.creeps, (creep) => creep.memory.role === "upgrader").length;
    const builderCount = _.filter( Game.creeps, (creep) => creep.memory.role === "builder").length;
    const energy = Game.rooms[roomName].energyAvailable;


    const spawn = Game.spawns["Spawn1"]; 
  
    const extensions = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        },
    });
   
    
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        },
    });
    // get extensions that are being build
    const extensionsUnderConstruction = spawn.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (site) => {
            return site.structureType == STRUCTURE_EXTENSION;
        },
    });
    
    // clear memory for dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    const room = Game.rooms[roomName]; // Replace with your actual room name

    let totalEnergy = 0;
  
    // Find all structures in the room
    const structures = room.find(FIND_STRUCTURES);
   
    // get total Energy
    for (const structure of structures) {
        if ( structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN ) 
            totalEnergy += structure.energy;
    }
    
    
    //conitional Tasks for Level 1
    if (roomControlLevel === 1) {
        let spawnQueue = ["harvester", "upgrader"];
        if (numberOfCreeps < 6) {
            
            let creepType = spawnQueue[numberOfCreeps % spawnQueue.length];
            spawn.spawnCreep( [WORK, CARRY, MOVE,MOVE,CARRY], creepType + Game.time, { memory: { role: creepType }, });
        }
    }
    //Tasks to reach Level 2 to 3
    else if (roomControlLevel == 2) {

        let spawnQueue = ["builder", "upgrader", "harvester"];
        let creepType = spawnQueue[numberOfCreeps % spawnQueue.length];

        if (numberOfCreeps < 10) {
            spawnManager.createExtensionsAndSpawn(roomName)

            if(totalEnergy>=300){
                
                spawn.spawnCreep( [WORK, CARRY, MOVE,MOVE], creepType + Game.time, { memory: { role: creepType }});
            }
        }
       
        if(numberOfCreeps<100){
            
            Creep.prototype.createNewSpawn();
        }
        

    }
    if(roomControlLevel==3){
        if(tower.length == 0){
            spawn.room.createConstructionSite(3,27, STRUCTURE_TOWER)
        }
        
    }
    
    //Minimum Creep Limits
    
    if(harvesterCount<3){
            
            if(totalEnergy>=200)
               spawn.spawnCreep( [WORK, CARRY, MOVE], 'harvester' + Game.time, { memory: { role: 'harvester' }});
    }
    if(upgraderCount<3){
            
            if(totalEnergy>=200)
                spawn.spawnCreep( [WORK, CARRY, MOVE], 'upgrader' + Game.time, { memory: { role: 'upgrader' }});
    }
    if(builderCount<3 && roomControlLevel !==1){
            
            if(totalEnergy>=200)
                spawn.spawnCreep( [WORK, CARRY, MOVE], 'builder' + Game.time, { memory: { role: 'builder' }});
    }
    
    // Kill Hostile sources
    if(towers.length>0){
        const towerIds = tower.map(tower => tower.id);
 
        for (const towerId of towerIds) {
            const tower = Game.getObjectById(towerId);
        
            if (tower) {
                const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        }

    }
    
    

    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            "🛠️" + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: "left", opacity: 0.8 }
        );
    }
    // Call creep roles
    for (let name in Game.creeps) {
        
        const creep = Game.creeps[name];

        if (creep.memory.role == "harvester") {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == "builder") {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == "attacker") {
            roleAttacker.run(creep);
        }
    }
};
