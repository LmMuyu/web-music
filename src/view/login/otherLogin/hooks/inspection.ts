import { ElMessage } from "element-plus";

interface INSPECTION {
  readonly message: (message: string) => void;
  readonly jiancha: () => Record<string, Function>;
}

enum WRITE {
  ACC = "acc",
  PASS = "pass",
}

class Inspection implements INSPECTION {
  text: string = "";
  constructor(text: string) {
    this.text = text.trim();
  }

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
      len(Inob: string, messgae: string) {
        if (Inob.length !== 11) {
          return that.message(messgae);
        }

        return true;
      },

      write(Inob: string, type: string = "acc", messgae: string) {
        if (type === WRITE.ACC) {
          const res = /^1[23456789]\d{9}$/.test(Inob);

          if (!res) {
            return that.message(messgae);
          }

          return true;
        } else {
        }
      },
    };
  }

  whileInspection() {}
}

export default Inspection;
