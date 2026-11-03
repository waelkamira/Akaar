import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BUILT_IN_PLATFORM_ROLE_NAMES,
  CONTROL_PANEL_PERMISSION_NAMES,
  getControlPanelEntryPath,
  hasControlPanelPermission,
  isBuiltInPlatformRoleName,
  isControlPanelPermissionName,
} from '../lib/auth/control-panel-permissions.mjs';
import {
  parseControlPanelRoleName,
  parseControlPanelRolePermissions,
} from '../lib/admin/control-panel-role-validation.mjs';

test('permission checks accept only catalogued permissions', () => {
  assert.equal(hasControlPanelPermission(['control_panel.catalog.manage'], 'control_panel.catalog.manage'), true);
  assert.equal(hasControlPanelPermission(['control_panel.unknown'], 'control_panel.unknown'), false);
  assert.equal(hasControlPanelPermission([], undefined), false);
  assert.equal(isControlPanelPermissionName(CONTROL_PANEL_PERMISSION_NAMES[0]), true);
  assert.equal(getControlPanelEntryPath(['control_panel.finance.manage']), '/admin/control-panel/payments');
  assert.equal(getControlPanelEntryPath(['control_panel.shipping.manage']), '/admin/control-panel/shipping');
  assert.equal(getControlPanelEntryPath(['control_panel.unknown']), null);
});

test('platform role names cannot be reused for custom roles', () => {
  assert.deepEqual(BUILT_IN_PLATFORM_ROLE_NAMES, ['ADMIN', 'SELLER', 'CUSTOMER', 'GUEST']);
  assert.equal(isBuiltInPlatformRoleName('ADMIN'), true);
  assert.equal(parseControlPanelRoleName('catalog_manager'), 'CATALOG_MANAGER');
  assert.equal(parseControlPanelRoleName('admin'), null);
  assert.equal(parseControlPanelRoleName('role with spaces'), null);
});

test('role permission input accepts a unique list from the catalog only', () => {
  assert.deepEqual(parseControlPanelRolePermissions([
    'control_panel.catalog.manage',
    'control_panel.catalog.manage',
  ]), ['control_panel.catalog.manage']);
  assert.equal(parseControlPanelRolePermissions(['control_panel.unknown']), null);
  assert.equal(parseControlPanelRolePermissions('control_panel.catalog.manage'), null);
});
