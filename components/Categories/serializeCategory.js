export function serializeCategory(category) {
  const { id, name, enName, path, description } = category;
  return JSON.stringify({ id, name, enName, path, description });
}
