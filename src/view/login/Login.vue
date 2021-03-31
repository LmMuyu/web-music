<script lang="tsx">
import { defineAsyncComponent, ref, unref } from "vue";
import {
  getQrKey,
  getQrCreate,
  checkStatus,
} from "../../api/login/qrCodeLogin";
import "./scss/index.scss";
import { STATUS } from "./enum";
import { ElButton } from "element-plus";
import { MouseDwon, MouseMove, MouseOut } from "./api/mouse";
const Expired = defineAsyncComponent(() => import("./components/Expired.vue"));

export default {
  setup() {
    const qrBase64 = ref("");
    const qrexpired = ref(false);

    function QrCreate(key: string) {
      getQrCreate({
        url: "/login/qr/create",
        params: {
          qrimg: "base64",
          key,
        },
      }).then(({ data: { data: qrimg } }) => {
        qrBase64.value = qrimg.qrimg;

        // checkLoginStatus(key);
      });
    }

    async function checkLoginStatus(key: string) {
      let times;

      times = setInterval(async () => {
        const checkRes = await checkStatus({
          url: "/login/qr/check",
          params: { key },
        });

        const {
          data: { code },
        } = checkRes;

        console.log(checkRes);

        loginReslutDealWith(code);
      }, 5000);
    }

    function loginReslutDealWith(code: number) {
      switch (code) {
        case STATUS.EXPIRED:
          qrexpired.value = true;
          break;
        case STATUS.WAIT:
          break;
        case STATUS.TODECONFIRMED:
          break;
        case STATUS.RESLUT:
          break;
        default:
          return;
      }
    }

    getQrKey({
      url: "/login/qr/key",
    }).then(({ data }) => {
      const unikey = data.data.unikey;

      QrCreate(unikey);
    });

    return () => (
      <>
        <div
          class="bg-white flex flex-col absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 rounded-2xl shadow"
          style="width:530px;height:372px;"
        >
          <article
            onMousedown={MouseDwon}
            onMousemove={MouseMove}
            onMouseout={MouseOut}
            class="h-full w-full"
          >
            <header class="bg-gray-900 py-3 flex" style="height:12.499%">
              <div style="width:50%" class="flex items-center">
                <p class="transform translate-x-2 text-white font-bold text-lg">
                  登录
                </p>
              </div>
              <div style="width:50%" class="icon flex items-center justify-end">
                <i class="iconfont icondel transform -translate-x-2"></i>
              </div>
            </header>
            <article class="flex justify-center items-center h-3/4">
              <div class="px-4">
                <img
                  src="https://s2.music.126.net/style/web2/img/qr_guide.png?0ddbd359a12507dd562b38c0ebef72fc"
                  width="140"
                  height="140"
                />
              </div>
              <div class="w-52 flex flex-col" style="height:245.55px">
                <p class="text-center  text-2xl ">扫码登录</p>
                <div class="w-52 h-52 relative">
                  <img src={unref(qrBase64)} class="h-full w-full" />
                  <Expired qrexpired={qrexpired.value} />
                </div>
              </div>
            </article>
            <footer
              style="height:12.499%"
              class="flex items-center justify-center"
            >
              <ElButton round>选择其它方式登录</ElButton>
            </footer>
          </article>
        </div>
      </>
    );
  },
};
</script>
