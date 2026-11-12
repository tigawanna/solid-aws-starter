/** Same directory, `-thumbnail` inserted before the extension. */
export function thumbnailKey(key: string): string {
  const slash = key.lastIndexOf("/");
  const dir = slash === -1 ? "" : key.slice(0, slash + 1);
  const file = slash === -1 ? key : key.slice(slash + 1);
  const dot = file.lastIndexOf(".");
  if (dot <= 0) return `${dir}${file}-thumbnail`;
  return `${dir}${file.slice(0, dot)}-thumbnail${file.slice(dot)}`;
}

export function isThumbnailKey(key: string): boolean {
  const file = key.slice(key.lastIndexOf("/") + 1);
  const dot = file.lastIndexOf(".");
  const stem = dot <= 0 ? file : file.slice(0, dot);
  return stem.endsWith("-thumbnail");
}
