<script>
    let modalVisible = true
</script>

<div
    class={`fixed top-0 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white sm:w-1/2 lg:w-1/3 h-11/12 overflow-auto [&>p:not(:last-child)]:mb-8 transition-opacity duration-1000 ease-in-out ${
        modalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
>
    <h1 class="text-xl text-center mb-8">🚧 NaadGen v2 🚧</h1>
    <button class="absolute top-4 right-4 text-2xl text-white" on:click={() => modalVisible = false}>❌</button>

    <p>Welcome to NaadGen! This app is a work in progress nearing completion (finally). As a solo developer in my third year, it takes time and effort to realize a polished version.</p>
    <p>I "resume" work on this and other past projects in my limited free time after inevitable hiatuses, most of which is spent refactoring and fixing breaking changes in an endless Sisyphean cycle :)</p>
    <p>The app is functional and ready for use, however some features are still in development and may not work as expected. If you find bugs or have suggestions for improvement, <a href="https://github.com/megz15/swaranjali-web/issues" class="text-blue-600" target="_blank">reach out via a GitHub issue by clicking here.</a></p>
    <p>~ Meghraj</p>
</div>