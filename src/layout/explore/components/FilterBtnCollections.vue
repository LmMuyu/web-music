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
      :key="selectTag.tagId"
      closable
      @close="removeSelectTag(selectTag.tagId)"
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
            >
            </filterBtnItem>
          </div>
        </el-main>
      </el-container>
    </div>
  </transition>
</template>
<script setup lang="tsx">
import { ref, defineEmits, unref, defineComponent, Ref, computed } from "vue";

import { getPlaylistCatlist } from "../../../api/explore";

import { ElCheckTag, ElAside, ElContainer, ElMain, ElTag, ElButton } from "element-plus";
import { useRefNegate } from "../../../utils/useRefNegate";

const ctxEmit = defineEmits(["btnWithActive"]);

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
  beforeCatlist.value.push({ name: "全部" }, ...catlist.slice(0, 15), { name: "· · ·" });
});

const filterBtnItem = defineComponent({
  props: {
    tag: String,
    isInAllMain: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { countRef: selectBtnValue } = useRefNegate(props.tag === "全部" ? true : false);
    activeBtnRefList.push(selectBtnValue);

    function addSlectAllSection(tag: string) {
      const [first, last] = retListFirstLast();
      if (tag !== "" && tag !== first.name && tag !== last.name) {
        slectAllSection.value.push({ id: ++tagId, name: tag });
      }
    }

    function enterTriggerRef() {
      const tags = slectAllSection.value.map((value) => value.name);
      
      
    }

    function activeBtn() {
      if (props.tag === beforeCatlist.value[beforeCatlist.value.length - 1].name) {
        showAllBtnItem.value = !showAllBtnItem.value;
        const len = activeBtnRefList.length;
        activeBtnRefList.splice(17, len);
      }

      exclusive(activeBtnRefList, props.isInAllMain);
      addSlectAllSection(props.tag);
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
  return catlist.filter((cat) => cat.category === index);
}

function removeSelectTag(tagId: number) {
  slectAllSection.value.splice(
    slectAllSection.value.findIndex((tag) => tag.tagId === tagId),
    1
  );
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
