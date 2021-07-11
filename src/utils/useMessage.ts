import { ElMessage } from "element-plus";

export type TYPE = "error" | "info" | "success" | "warning";

export const showMessage = (type: TYPE, message: string) => {
  ElMessage({
    type,
    message,
  });
};
