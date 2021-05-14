import { ref } from "@vue/reactivity";

import type { MatchItem } from "../type";

export const musicItemList = ref<Map<number, MatchItem>>(new Map());

export const currTop = ref(0);
