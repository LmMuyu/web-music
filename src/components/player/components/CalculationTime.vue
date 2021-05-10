<script  lang='tsx'>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    time: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    function CalculationTime(duration: number) {
      const minute = Math.round(duration / 60)
      const second = Math.round(duration % 60)

      return (
        <div class="flex">
          <span>{minute}</span>
          <span>:</span>
          <span>{second}</span>
        </div>
      )
    }

    return () => (
      <>
        {CalculationTime(props.time)}
      </>
    )
  }
})
</script>
<style scoped lang='scss'></style>