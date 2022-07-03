import { ElNotification } from "element-plus";

type NottificationType = "success" | "warning" | "info" | "error";

export default function openNotification(
  content: string,
  title?: string,
  type: NottificationType = "info"
) {
  return ElNotification.success({
    type,
    message: content,
    showClose: false,
    ...(title ? { title } : {}),
  });
}
