export async function handler(event: { name?: string }) {
  const name = event.name?.trim() || "there";
  return `hello ${name}`;
}
