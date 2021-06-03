import { Ref } from "@vue/reactivity";

export type allType<T> = Ref<T> | Array<T> | T;
