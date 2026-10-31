import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTROL_PANEL_ADMIN_EMAIL,
  isControlPanelAdmin,
  isControlPanelAdminEmail,
} from '../lib/auth/control-panel-access.mjs';

test('grants control panel access only to the active administrator account', () => {
  assert.equal(isControlPanelAdmin({
    email: CONTROL_PANEL_ADMIN_EMAIL,
    role: 'ADMIN',
    status: 'ACTIVE',
  }), true);
  assert.equal(isControlPanelAdmin({
    email: CONTROL_PANEL_ADMIN_EMAIL,
    role: 'ADMIN',
  }), true);
});

test('normalizes the designated administrator email', () => {
  assert.equal(isControlPanelAdminEmail(` ${CONTROL_PANEL_ADMIN_EMAIL.toUpperCase()} `), true);
});

test('does not grant control panel access based on email alone', () => {
  assert.equal(isControlPanelAdmin({
    email: CONTROL_PANEL_ADMIN_EMAIL,
    role: 'CUSTOMER',
    status: 'ACTIVE',
  }), false);
  assert.equal(isControlPanelAdmin({
    email: CONTROL_PANEL_ADMIN_EMAIL,
    role: 'ADMIN',
    status: 'SUSPENDED',
  }), false);
});

test('denies other admins and missing identities', () => {
  assert.equal(isControlPanelAdmin({ email: 'admin@example.test', role: 'ADMIN', status: 'ACTIVE' }), false);
  assert.equal(isControlPanelAdmin(null), false);
  assert.equal(isControlPanelAdminEmail(undefined), false);
});
