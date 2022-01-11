<template>
  <div class="flex flex-wrap">
    <filterBtnItem
      v-for="(tag, index) in beforeCatlist"
      :tag="tag.name"
      :key="index"
    ></filterBtnItem>
  </div>
  <div class="flex flex-wrap items-center">
    <ElTag
      class="m-2"
      v-for="selectTag in slectAllSection"
      :key="selectTag.id"
      closable
      @close="removeSelectTag(selectTag.id)"
      >{{ selectTag.name }}
    </ElTag>
    <ElButton type="danger" size="small" v-if="ifSelectList" @click="closeAll">清空</ElButton>
  </div>
  <transition name="fade" mode="out-in">
    <div v-if="showAllBtnItem">
      <el-container v-for="(efories, index) in categories" :key="index">
        <el-aside width="100px" class="flex justify-center items-center">{{ efories }}</el-aside>
        <el-main>
          <div class="flex flex-wrap">
            <filterBtnItem
              v-for="(tag, index) in playlistTags(index)"
              :is-in-all-main="true"
              :key="index"
              :tag="tag.name"
              :default-active="tag.defaultactive ?? false"
            >
            </filterBtnItem>
          </div>
        </el-main>
      </el-container>
    </div>
  </transition>
</template>
<script setup lang="tsx">
import { ref, unref, defineComponent, Ref, computed } from "vue";

import { getPlaylistCatlist, highqualityTags } from "../../../api/explore";
import { useRefNegate } from "../../../utils/useRefNegate";

import { ElCheckTag, ElAside, ElContainer, ElMain, ElTag, ElButton } from "element-plus";

const ctxEmit = defineEmits(["withTagData"]);

let tagId = 0;
const catlist = [];
const categories = ref([]);
const beforeCatlist = ref([]);
const showAllBtnItem = ref(false);
const activeBtnRefList: Ref<boolean>[] = [];
const slectAllSection = ref([]);
const recordSelectClick = ref(false);

getPlaylistCatlist().then((catvalue) => {
  categories.value = Object.values(catvalue.data.categories);
  catlist.push(...catvalue.data.sub);
});

highqualityTags().then((highquality) => {
  beforeCatlist.value.push({ name: "全部" }, ...highquality.data.tags.slice(0, 15), {
    name: "· · ·",
  });
});

const filterBtnItem = defineComponent({
  props: {
    defaultActive: Boolean,
    tag: String,
    isInAllMain: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const initRef = () => (props.tag === "全部" ? true : false || props.defaultActive);
    const { countRef: selectBtnValue } = useRefNegate(initRef());
    activeBtnRefList.push(selectBtnValue);

    if (selectBtnValue.value) {
      ctxEmit("withTagData", props.tag);
    }

    function addSlectAllSection(tag: string, btnref: Ref<boolean>) {
      const [first, last] = retListFirstLast();
      const isin = slectAllSection.value.some((taginfo) => taginfo.name === tag);

      if (tag !== "" && tag !== first.name && tag !== last.name && !isin) {
        slectAllSection.value.push({ id: ++tagId, name: tag, btnref });
      }
    }

    function activeBtn() {
      ctxEmit("withTagData", props.tag);

      if (props.tag === beforeCatlist.value[beforeCatlist.value.length - 1].name) {
        showAllBtnItem.value = !showAllBtnItem.value;
        const len = activeBtnRefList.length;
        activeBtnRefList.splice(17, len);
      }

      exclusive(activeBtnRefList, props.isInAllMain);
      addSlectAllSection(props.tag, selectBtnValue);
      recordSelectClick.value = props.isInAllMain;
      selectBtnValue.value = true;
    }

    return () => (
      <>
        <ElCheckTag
          style="margin: 0.5rem !important;"
          onChange={activeBtn}
          checked={unref(selectBtnValue)}
        >
          {props.tag}
        </ElCheckTag>
      </>
    );
  },
});

function exclusive(reflist: Ref<boolean>[], isInAllMain: boolean) {
  if (!(recordSelectClick.value && isInAllMain)) {
    reflist.forEach((btnref) => (btnref.value = false));
  }
}

function playlistTags(index: number) {
  const tags = slectAllSection.value.map((value) => value.name);

  return catlist.filter((cat) => {
    if (tags.indexOf(cat.name) > -1) {
      cat.defaultactive = true;
    }

    return cat.category === index;
  });
}

function removeSelectTag(tagId: number) {
  const index = slectAllSection.value.findIndex((tag) => tag.id === tagId);
  slectAllSection.value[index].btnref = false;
  slectAllSection.value.splice(index, 1);
}

function closeAll() {
  slectAllSection.value = [];
  exclusive(activeBtnRefList, false);
}

function retListFirstLast() {
  const first = beforeCatlist.value[0];
  const last = beforeCatlist.value[beforeCatlist.value.length - 1];
  return [first, last];
}

const ifSelectList = computed(() => {
  return unref(slectAllSection).length > 0;
});
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
