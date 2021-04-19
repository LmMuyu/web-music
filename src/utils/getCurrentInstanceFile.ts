interface InstanceObject {
  type: {
    __file: string;
  };
}

export default function (instance: InstanceObject | null): Promise<string> {
  return new Promise((resolve, rejects) => {
    if (!instance) return rejects("");

    const fileNmae = instance.type.__file.match(/([\w\d]+)\.vue$/)?.[1];

    if (fileNmae) {
      resolve(fileNmae);
    } else {
      rejects("为获取当前文件路径" + ":" + fileNmae);
    }
  });
}
