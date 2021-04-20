export default function append(options: Record<string, any>) {
  const formData = new FormData();

  for (const key in options) {
    formData.append(key, options[key]);
  }

  return formData;
}
