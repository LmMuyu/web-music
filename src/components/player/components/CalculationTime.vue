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
      const minute = Math.floor(time >= 60 ? time / 60 : 0);
      const second = Math.floor(time >= 60 ? time % 60 : time);

      const DateList = [minute, second].map(String).map((time) => time.padStart(2, "0"));

      return DateList;
    }

    function CalculationTime(duration: number) {
      const [minute, second] = countTime(duration);

      return (
        <div class="flex">
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
<style scoped lang="scss">
</style>
