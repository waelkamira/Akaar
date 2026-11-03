export const CONTROL_PANEL_PERMISSION_CATALOG = [
  {
    name: 'control_panel.users.manage',
    label: 'إدارة المستخدمين',
    description: 'إنشاء الحسابات وتعديل أدوارها وحالتها.',
  },
  {
    name: 'control_panel.roles.manage',
    label: 'إدارة الأدوار والصلاحيات',
    description: 'إنشاء الأدوار وربط الصلاحيات وتعيين الأدوار.',
  },
  {
    name: 'control_panel.catalog.manage',
    label: 'إدارة الكتالوج',
    description: 'إدارة المنتجات والأسعار والصور.',
  },
  {
    name: 'control_panel.shipping.manage',
    label: 'إدارة الشحن',
    description: 'إدارة شركات الشحن والخدمات ومناطق الأسعار.',
  },
  {
    name: 'control_panel.stores.manage',
    label: 'إدارة المتاجر والبائعين',
    description: 'مراجعة المتاجر وبيانات البائعين.',
  },
  {
    name: 'control_panel.finance.manage',
    label: 'إدارة المدفوعات',
    description: 'إدارة سجلات الدفع والتحصيل.',
  },
  {
    name: 'control_panel.messages.manage',
    label: 'إدارة الرسائل',
    description: 'الوصول إلى رسائل المنصة وإدارتها.',
  },
  {
    name: 'control_panel.marketing.manage',
    label: 'إدارة التسويق',
    description: 'إدارة مشتركي النشرة البريدية.',
  },
  {
    name: 'control_panel.content.manage',
    label: 'إدارة المحتوى',
    description: 'إدارة صفحات الموقع ومحتواها.',
  },
];

export const CONTROL_PANEL_PERMISSION_NAMES = CONTROL_PANEL_PERMISSION_CATALOG.map(({ name }) => name);
export const BUILT_IN_PLATFORM_ROLE_NAMES = ['ADMIN', 'SELLER', 'CUSTOMER', 'GUEST'];
const controlPanelEntryPaths = [
  ['control_panel.users.manage', '/admin/control-panel'],
  ['control_panel.roles.manage', '/admin/control-panel/roles'],
  ['control_panel.catalog.manage', '/admin/control-panel/products'],
  ['control_panel.shipping.manage', '/admin/control-panel/shipping'],
  ['control_panel.stores.manage', '/admin/control-panel/stores'],
  ['control_panel.finance.manage', '/admin/control-panel/payments'],
  ['control_panel.messages.manage', '/admin/control-panel/messages'],
  ['control_panel.marketing.manage', '/admin/control-panel/subscribers'],
  ['control_panel.content.manage', '/admin/control-panel/site-pages'],
];

const permissionNames = new Set(CONTROL_PANEL_PERMISSION_NAMES);
const builtInRoleNames = new Set(BUILT_IN_PLATFORM_ROLE_NAMES);

export function isControlPanelPermissionName(value) {
  return typeof value === 'string' && permissionNames.has(value);
}

export function hasControlPanelPermission(grantedPermissions, requiredPermission) {
  if (!Array.isArray(grantedPermissions)) return false;
  const granted = new Set(grantedPermissions.filter(isControlPanelPermissionName));
  if (requiredPermission) return granted.has(requiredPermission);
  return granted.size > 0;
}

export function getControlPanelEntryPath(grantedPermissions) {
  if (!Array.isArray(grantedPermissions)) return null;
  const granted = new Set(grantedPermissions.filter(isControlPanelPermissionName));
  return controlPanelEntryPaths.find(([permission]) => granted.has(permission))?.[1] ?? null;
}

export function isBuiltInPlatformRoleName(value) {
  return typeof value === 'string' && builtInRoleNames.has(value);
}
