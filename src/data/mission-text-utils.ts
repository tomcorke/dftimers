const replacements = {
  '{nh}': '**any Normal / Hard operation**',
  '{zd}': '**any Zero Dam Normal / Eternal Night operation**',
  '{space}': '**any Space City Normal / Hard operation**',
  '{br}': '**any Brakkesh Normal/Hard Operation**',
  '{ln}': '**Layali Grove Normal operation**',
  '{space or brakkesh}': '**any Space City / Brakkesh Normal / Hard operations**',
  '{special}':
    'special class enemies (Shieldbearer, Sniper, Rocketeer, Machine Gunner, Flamethrower, or Boss Guard)',
  '{ahsarah special}':
    'Ahsarah special class enemies (Shieldbearer, Sniper, Rocketeer, Machine Gunner, Flamethrower, Boss Guard)',
  '{haavk special}':
    'Haavk special class enemies (Shieldbearer, Sniper, Machine Gunner, or Flamethrower)',
  '{green}': '<span class="quality-indicator green"></span>',
  '{blue}': '<span class="quality-indicator blue"></span>',
  '{purple}': '<span class="quality-indicator purple"></span>',
  '{gold}': '<span class="quality-indicator gold"></span>',
  '{red}': '<span class="quality-indicator red"></span>',
  '{common}': '<span class="quality-indicator green"></span>',
  '{rare}': '<span class="quality-indicator blue"></span>',
  '{epic}': '<span class="quality-indicator purple"></span>',
  '{legendary}': '<span class="quality-indicator gold"></span>',
  '{exotic}': '<span class="quality-indicator red"></span>',
  '{purchase}': '(purchase from the T&E Lab Supply Station)',
  '{goto}': 'go to the specified location',
  '{flagship}': 'Flagship Task (including Operation Iron Dome, Operation Wall Breaker, Operation Nightingale, Operation Ascended, Operation Blazefall, Operation Asylum, Operation Broken Wings, Operation Floodline, Operation Ravenhunter, Operation Starslayer)',
};

export const missionDescriptionReplacements = (raw: string) => {
  const replaced = Object.entries(replacements)
    .reduce((acc, [from, to]) => {
      let newAcc = acc;
      while (newAcc.includes(from)) {
        newAcc = newAcc.replace(from, to);
      }
      return newAcc;
    }, raw);

  const unhandledPattern = /\{[^}]+\}/g;
  if (unhandledPattern.test(replaced)) {
    throw Error(`Unhandled pattern in mission description: ${replaced}`);
  }
  return replaced;
};
