<script lang="ts">
    import type { Raga, Taal } from "$lib/types/types"
    export let selectedObject: String
    export let objectObject: Record<string, Raga | Taal>

    function genSelectData(data: Record<string, Raga | Taal>) {
        return Object.keys(data).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    }
</script>

<select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={selectedObject}>
    <option selected disabled>Raga</option>
    {#each genSelectData(objectObject) as raga}
        <option value={raga.value}>{raga.name}</option>
    {/each}
</select>