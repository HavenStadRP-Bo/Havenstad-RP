// utils/permissions.js
export const modRoles = [
  "1406025210527879238", // Beheer
  "1406942631522734231", // Manager
  "1406942944627265536", // Superizer
  "1406943073694515280", // SR.Mod
  "1406943251826606234", // MOD
];

export function hasModPermission(member) {
  return member.roles.cache.some(role => modRoles.includes(role.id));
}
