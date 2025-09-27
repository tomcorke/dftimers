import { computedMission, createMissions, Mission } from './missions';

// Main mission chain
// add a dummy root mission to anchor phase 1 side-missions
const rootMission = new Mission('Root - Entrance', [], { type: 'dummy' });

// Phase 1
const [, phase1FirstMission, phase1LastMission] = createMissions(
  'main',
  'Phase 1 - Main Objective: Warm-Up',
  'Reach for the Sky',
  'Basic Work',
  'Fighting Spirit',
  'Stealth Outlook',
  'Flame of Legacy',
  'Ignite the Flame',
  'Into the Flames',
);

phase1FirstMission.follows(rootMission);
phase1LastMission.setStars(10);

const [, phase1_1_start, phase1_1_end] = createMissions(
  'side',
  'Phase 1 - Supply Deployment Operation',
  'Deep Customization - 1',
  'Deep Customization - 2',
  'Deep Customization - 3',
  'Deep Customization - 4',
  'Deep Customization - 5',
);
phase1_1_start.follows(rootMission);
phase1_1_end.setStars(3);

// Side missions from reference image: 'Reconnaissance and Supply Lines'
const [, phase1_recon, phase1_recon_end] = createMissions(
  'side',
  'Phase 1 - Reconnaissance and Supply Lines',
  'Clever Tactics',
  'Change of Position',
  'Pick the Fruit',
  'Medical Aid',
  'Tourist: Masquerade Ball',
);
phase1_recon.follows(rootMission);
phase1_recon_end.setStars(3);

// Side missions from reference image: 'Escapist\'s Trick: Basic'
const [, phase1_escapist, phase1_escapist_end] = createMissions(
  'side',
  'Phase 1 - Escapist\'s Trick: Basic',
  'Strategic Advance - 1',
  'Strategic Advance - 2',
  'Strategic Advance - 3',
  'Strategic Advance - 4',
  'Strategic Advance - 5',
);
phase1_escapist.follows(rootMission);
phase1_escapist_end.setStars(2);

// Side missions from reference image: "Logistics Support"
const [, phase1_logistics, phase1_logistics_end] = createMissions(
  'side',
  'Phase 1 - Logistics Support',
  'Strong Assurance: Attachment',
  'Strong Assurance: Protection',
  'Strong Assurance: Medical',
  'Strong Assurance: Firepower',
  'Strong Assurance: Bedrock',
);
phase1_logistics.follows(rootMission);
phase1_logistics_end.setStars(2);

const phase2StartGate = computedMission(
  'Phase 2 Start Gate',
  [phase1LastMission, phase1_1_end, phase1_recon_end, phase1_escapist_end, phase1_logistics_end],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0), 0) >= self.stars,
).setStars(16);
phase2StartGate.follows(phase1LastMission);

// -----------------------
// Phase 2
// -----------------------
// Main mission chain for Phase 2 (follows Phase 1 final mission)
const [, phase2FirstMission, phase2LastMission] = createMissions(
  'main',
  'Phase 2 - Main Objective: Lifting the Veil',
  'Approaching Storm',
  'Armed Escort',
  'Bone-Deep Scars',
  'Skyfall Aegis',
  'Clearance Operation: Reverse Engineering',
  'Clearance Operation - 3',
  'Clearance Operation - 2',
  'Clearance Operation - 1',
);
phase2LastMission.setStars(10);
phase2FirstMission.follows(phase2StartGate);

// Side mission: Turmoil in Ahsarah
const [, phase2_turmoil, phase2_turmoil_last] = createMissions(
  'side',
  'Phase 2 - Turmoil in Ahsarah',
  'Deterrence Directive',
  'Eastward Diversion',
  'Evaporation Order',
  'Twin Fall',
  'Tourist of Ahsarah',
);
phase2_turmoil_last.setStars(5);
phase2_turmoil.follows(phase2StartGate);

// Side mission: Profiling Ahsarah
const [, phase2_profiling, phase2_profiling_last] = createMissions(
  'side',
  'Phase 2 - Profiling Ahsarah',
  'Ahsarah Guard Profile - 1',
  'Ahsarah Guard Profile - 2',
  'Ahsarah Guard Profile - 3',
  'Ahsarah Guard Profile - 4',
  'Swift Moment',
);
phase2_profiling.follows(phase2StartGate);
phase2_profiling_last.setStars(4);

// Side mission: Edge and Steel
const [, phase2_edge, phase2_edge_last] = createMissions(
  'side',
  'Phase 2 - Edge and Steel',
  'Search and Eliminate - 1',
  'Search and Eliminate - 2',
  'Search and Eliminate - 3',
  'Search and Eliminate - 4',
  'Search and Eliminate - 5',
);
phase2_edge.follows(phase2StartGate);
phase2_edge_last.setStars(3);

// Side mission: Protection and Construction
const [, phase2_protection, phase2_protection_last] = createMissions(
  'side',
  'Phase 2 - Protection and Construction',
  'Control and Secure - 1',
  'Control and Secure - 2',
  'Control and Secure - 3',
  'Control and Secure - 4',
  'Control and Secure - 5',
);
phase2_protection.follows(phase2StartGate);
phase2_protection_last.setStars(3);

// Additional Phase 2 spare side stories from attachments
const [phase2_encyclopedic_missions, phase2_encyclopedic, phase2_encyclopedic_last] = createMissions(
  'side',
  'Phase 2 - Encyclopedic Insight: Basic Collection',
  'Broad Knowledge - 1',
  'Broad Knowledge - 2',
  'Broad Knowledge - 3',
  'Broad Knowledge - 4',
  'Broad Knowledge - 5',
);
phase2_encyclopedic.follows(phase2StartGate);
phase2_encyclopedic_missions.forEach(m => m.setLocked(true));
phase2_encyclopedic_last.setStars(3);

const [phase2_deepenemy_missions, phase2_deepenemy, phase2_deepenemy_last] = createMissions(
  'side',
  'Phase 2 - Deep Into Enemy Lines',
  'Chaos',
  'Vehicles Lost',
  'Lose-Lose Situation',
  'Losing Two Birds to One Stone',
  'No Regrets',
);
phase2_deepenemy.follows(phase2StartGate);
phase2_deepenemy_missions.forEach(m => m.setLocked(true));
phase2_deepenemy_last.setStars(2);

const phase3StartGate = computedMission(
  'Phase 3 Start Gate',
  [phase2LastMission, phase2_turmoil_last, phase2_profiling_last, phase2_edge_last, phase2_protection_last, phase2_encyclopedic_last, phase2_deepenemy_last],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0), 0) >= self.stars,
).setStars(22);
phase3StartGate.follows(phase2LastMission);

// -----------------------
// Phase 3
// -----------------------
// Main mission chain for Phase 3 (first mission follows Phase 2 final mission)
// Title: Main Objective: Secrets of the Invitation Letter
const [, phase3FirstMission, phase3LastMission] = createMissions(
  'main',
  'Phase 3 - Main Objective: Secrets of the Invitation Letter',
  'An Eye for an Eye',
  'Unknown - 2',
  'Unknown - 3',
  'Unknown - 4',
  'Unknown - 5',
  'Unknown - 6',
  'Unknown - 7',
  'Unknown - 8',
);
phase3FirstMission.follows(phase3StartGate);
phase3LastMission.setStars(10);

// Side mission: Combat Specialist: Golden Gunner (Season 3-1)
const [, phase3_gunner, phase3_gunner_last] = createMissions(
  'side',
  'Phase 3 - Combat Specialist: Golden Gunner',
  'Golden Gunner - 1',
  'Golden Gunner - 2',
  'Golden Gunner - 3',
  'Golden Gunner - 4',
  'Golden Gunner - 5',
  'Golden Gunner - 6',
  'Golden Gunner - 7',
);
phase3_gunner.follows(phase3StartGate);
phase3_gunner_last.setStars(5);

// Side mission: Combat Specialist: Sniper Elite (Season 3-2)
const [, phase3_sniper, phase3_sniper_last] = createMissions(
  'side',
  'Phase 3 - Combat Specialist: Sniper Elite',
  'Sniper Elite - 1',
  'Sniper Elite - 2',
  'Sniper Elite - 3',
  'Sniper Elite - 4',
  'Sniper Elite - 5',
);
phase3_sniper.follows(phase3StartGate);
phase3_sniper_last.setStars(5);

// Side mission: Bat Specialist: Sector Hunter (Season 3-3)
const [, phase3_sector, phase3_sector_last] = createMissions(
  'side',
  'Phase 3 - Bat Specialist: Sector Hunter',
  'Sector Hunter: Dam',
  'Sector Hunter: Grove',
  'Sector Hunter: New Tower of Babel',
  'Sector Hunter: Central District',
  'Eternal Heart: Return',
);
phase3_sector.follows(phase3StartGate);
phase3_sector_last.setStars(4);

// Side mission: Ability Expert: Patrol the World (Season 3-4)
const [, phase3_grandtour, phase3_grandtour_last] = createMissions(
  'side',
  'Phase 3 - Ability Expert: Patrol the World',
  'Grand Tour: Dam',
  'Grand Tour: Grove',
  'Grand Tour: Space City',
  'Grand Tour: Brakkesh',
  'Ultimate Standard: Return',
);
phase3_grandtour.follows(phase3StartGate);
phase3_grandtour_last.setStars(4);

// add

// Additional Phase 3 spare side stories from attachments
const [phase3_escapist_missions, phase3_escapist_spare, phase3_escapist_last] = createMissions(
  'side',
  'Phase 3 - Escapist\'s Trick: Jack of All Trades',
  'Escapist\'s Trick: Out of Pocket',
  'Escapist\'s Arts: Slip Through the Cracks',
  'Escapist\'s Trick: Baton Pass',
  'Escapist\'s Trick: Big Score',
  'Escapist\'s Trick: Supreme Solo',
);
phase3_escapist_spare.follows(phase3StartGate);
phase3_escapist_missions.forEach(m => m.setLocked(true));
phase3_escapist_last.setStars(3);

const [phase3_encyclopedic_missions, phase3_encyclopedic_cont, phase3_encyclopedic_last] = createMissions(
  'side',
  'Phase 3 - Encyclopedic Insight: Broad Knowledge (cont.)',
  'Broad Knowledge - 6',
  'Broad Knowledge - 7',
  'Broad Knowledge - 8',
  'Broad Knowledge - 9',
  'Broad Knowledge - 10',
);
phase3_encyclopedic_cont.follows(phase3StartGate);
phase3_encyclopedic_missions.forEach(m => m.setLocked(true));
phase3_encyclopedic_last.setStars(3);

const [phase3_collector_missions, phase3_collector, phase3_collector_last] = createMissions(
  'side',
  'Phase 3 - Path to the Great Collector',
  'Shadow of Stealth',
  'Personal Belongings',
  'Box Affection',
  'Boundless Link',
  'Code of Thieves',
);
phase3_collector.follows(phase3StartGate);
phase3_collector_missions.forEach(m => m.setLocked(true));
phase3_collector_last.setStars(3);

const phase4StartGate = computedMission(
  'Phase 4 Start Gate',
  [phase3LastMission, phase3_gunner_last, phase3_sniper_last, phase3_sector_last, phase3_grandtour_last, phase3_escapist_last, phase3_encyclopedic_last, phase3_collector_last],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0), 0) >= self.stars,
).setStars(24);
phase4StartGate.follows(phase3LastMission);

// Phase 4
// Final phase main missions (placeholders)
// Title: Final Phase: Silent Scream
const [, phase4FirstMission, phase4LastMission] = createMissions(
  'main',
  'Phase 4 - Final Phase: Silent Scream',
  'Silent Scream - 1',
  'Silent Scream - 2',
  'Silent Scream - 3',
  'Silent Scream - 4',
  'Silent Scream - 5',
  'Silent Scream - 6',
  'Silent Scream - 7',
  'Silent Scream - 8',
);
phase4FirstMission.follows(phase4StartGate);

export const ROOT_MISSION = rootMission;
export const FINAL_MISSION = phase4LastMission;

export const MISSION_DISPLAY_OFFSETS: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];
