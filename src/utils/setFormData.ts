export default function formDataAppend(options: Record<string, any>) {
  return new Promise((resolve) => {
    const formData = new FormData();

    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    resolve(formData);
  });
}
