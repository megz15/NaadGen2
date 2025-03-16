<script>
    export let text = ""
    export let textCol = "black"
    export let bgCol = "yellow-400"
    export let textSize = "sm"
</script>

<button class="text-{textCol} bg-{bgCol} font-medium rounded-lg text-{textSize} px-5 py-2.5 me-2 mb-5">
    {text}
</button>