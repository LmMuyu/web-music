class Observer {
  private watch: Record<string, any> = {};

  has(key: string) {
    return !!this.watch.hasOwnProperty(key) ? true : false;
  }

  on(key: string, value: any) {
    this.has(key) ? this.watch[key].push(value) : (this.watch[key] = [value]);
  }

  off(key: string, value?: any) {
    if (!this.has(key)) throw new Error(`未找到对应:${key}`);

    const watchKey = this.watch[key];

    if (!value) {
      for (let i = 0; i < watchKey.length; i++) {
        let timer = watchKey[i];
        clearTimeout(timer);
        timer = null;
      }

      watchKey.length = 0;
      delete this.watch[key];
    } else {
      for (let i = 0; i < watchKey.length; i++) {
        let timer = watchKey[i];

        if (timer === value) {
          clearTimeout(timer);
          timer = null;

          watchKey.splice(i, 0);
        } else {
          continue;
        }
      }
    }
  }

  remove(key: string, value: any) {
    if (!this.has(key)) throw new Error(`未找到对应:${key}`);
    const watchKey = this.watch[key] as [];

    if (!value) {
      const valueIndex = watchKey.findIndex((item) => item === value);

      if (!valueIndex) {
        watchKey.splice(valueIndex, 1);
      } else {
        throw new Error("未找到对应:value");
      }
    } else {
      watchKey.length = 0;
    }

    if (watchKey.length === 0) {
      delete this.watch[key];
    }
  }
}

export default new Observer();
