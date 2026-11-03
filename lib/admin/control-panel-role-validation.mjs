import {
  isBuiltInPlatformRoleName,
  isControlPanelPermissionName,
} from '../auth/control-panel-permissions.mjs';

export function parseControlPanelRoleName(value) {
  if (typeof value !== 'string') return null;
  const name = value.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9_]{2,49}$/.test(name) || isBuiltInPlatformRoleName(name)) return null;
  return name;
}

export function parseControlPanelRolePermissions(value) {
  if (!Array.isArray(value) || value.length > 50) return null;
  if (value.some((name) => !isControlPanelPermissionName(name))) return null;
  return [...new Set(value)];
}
