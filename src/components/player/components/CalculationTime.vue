<script lang="tsx">
import { defineComponent } from "vue";
import filterDate from "../../../utils/filterDate";

export default defineComponent({
  props: {
    time: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    function CalculationTime(duration: number) {
      const [minute, second] = filterDate(duration).split(":");

      return (
        <div class="flex px-4">
          <span class="p-1 text-sm">{minute}</span>
          <span class="p-1">:</span>
          <span class="p-1 text-sm">{second}</span>
        </div>
      );
    }

    return () => <>{CalculationTime(props.time)}</>;
  },
});
</script>
<style scoped lang="scss"></style>
