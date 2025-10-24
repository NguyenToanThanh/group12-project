export default function RoleGate({ allowed, userRole, children, fallback }) {
  if (!userRole) return fallback || null;
  if (allowed.includes(userRole)) return children;
  return fallback || null;
}
