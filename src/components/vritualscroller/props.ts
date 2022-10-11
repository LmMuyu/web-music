import type { DefineComponent, ExtractPropTypes, PropType } from "vue";

export const vritualProps = {
  field: {
    type: String,
    required: true,
  },
  weapperHeight: {
    type: Number,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  itemSize: {
    type: Number,
    required: true,
  },
  twoDimension: {
    type: Boolean,
    default: false,
  },
  colDimension: {
    type: Number,
    default: 1,
  },
  comp: {
    type: Object as PropType<DefineComponent<any>>,
    required: true,
  },
};

export type VritualProps = ExtractPropTypes<typeof vritualProps>;
