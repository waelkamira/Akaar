export const CONTROL_PANEL_ADMIN_EMAIL = 'ramondm4@gmail.com';

export function isControlPanelAdmin(user) {
  return user?.role === 'ADMIN'
    && (user?.status === undefined || user.status === 'ACTIVE')
    && typeof user.email === 'string'
    && user.email.trim().toLowerCase() === CONTROL_PANEL_ADMIN_EMAIL;
}

export function isControlPanelAdminEmail(email) {
  return typeof email === 'string'
    && email.trim().toLowerCase() === CONTROL_PANEL_ADMIN_EMAIL;
}
