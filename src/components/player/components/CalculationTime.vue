<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    time: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    function countTime(time: number) {
      const minute = Math.round(time >= 60 ? time / 60 : 0);
      const second = Math.round(time >= 60 ? time % 60 : time);
      const remainder = String(second).padStart(2, "0");

      return { minute, remainder };
    }

    function CalculationTime(duration: number) {
      const { minute, remainder } = countTime(duration);

      return (
        <div class="flex">
          <span>{minute}</span>
          <span>:</span>
          <span>{remainder}</span>
        </div>
      );
    }

    return () => <>{CalculationTime(props.time)}</>;
  },
});
</script>
<style scoped lang="scss"></style>
