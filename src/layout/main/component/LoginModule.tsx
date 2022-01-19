import { ElAvatar, ElButton } from "element-plus";

export function AvatarEnter(props: any) {
  return (
    <>
      <router-link class="flex items-center justify-center w-full" to="/login" target="_blank">
        <ElAvatar
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          size={"small"}
        ></ElAvatar>
      </router-link>
    </>
  );
}

export function ButtonEnter() {
  return (
    <>
      <router-link class="flex items-center justify-center w-full" to="/login" target="_blank">
        <ElButton class="flex items-center" type="primary" round>
          登录
        </ElButton>
      </router-link>
    </>
  );
}
