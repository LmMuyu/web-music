import { ElMessage } from "element-plus";

interface OPTION {
  Inob: string;
  type?: string;
  message?: string;
}

interface INSPECTION {
  readonly message: (message: string) => void;
  readonly jiancha: () => Record<string, Function>;
}

enum WRITE {
  ACC = "acc",
  PASS = "pass",
}

class Inspection implements INSPECTION {
  messageInfoList = ["请输入11位手机号", "请输入正确手机号"];

  message(message: string) {
    ElMessage.error({
      type: "error",
      message,
    });

    return false;
  }

  jiancha() {
    const that = this;
    return {
      len(optons: OPTION) {
        const { Inob, message = "请输入正确手机号" } = optons;
        if (Inob.length !== 11) {
          return that.message(message);
        }

        return true;
      },

      write(optons: OPTION) {
        const { Inob, message = "请输入正确手机号", type = "acc" } = optons;

        if (type === WRITE.ACC) {
          const res = /^(0\d{2,3}-)?1[0-9]\d{9}$/.test(Inob);

          if (!res) {
            return that.message(message);
          }

          return true;
        } else {
        }
      },
    };
  }

  whileInspection(options: OPTION) {
    const examination = this.jiancha();

    let index = 0;
    for (const key in examination) {
      if (index > this.messageInfoList.length - 1) break;
      const method = examination[key];

      const mess = this.messageInfoList[index];
      mess && options.message && (options.message = mess);
      const res = method(options);

      if (!res) {
        return;
      }

      index += 1;
    }

    return true;
  }
}

export default Inspection;
