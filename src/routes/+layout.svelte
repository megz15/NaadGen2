<script>
	import '../app.css'
	let { children } = $props()
</script>

<div>
	{@render children()}

    <div class="bg-[#1d2230b9] text-white py-5 text-center flex flex-col justify-center items-center gap-2">
        <div>
            Made with 💙 by <nobr><a href="https://github.com/megz15/" target="_blank" class="hover:text-blue-900 active:text-blue-900 font-semibold hover:bg-blue-100 active:bg-blue-100 py-0.5 px-2 rounded text-yellow-900 bg-yellow-100 transition duration-200">Meghraj Goswami</a></nobr>
        </div><div>
            Download <a id="dailyRagaPromo" href="https://play.google.com/store/apps/details?id=megh.dailyraga" target="_blank" class="text-lg hover:text-yellow-900 active:text-yellow-900 font-semibold hover:bg-yellow-100 active:bg-yellow-100 py-0.5 px-2 rounded text-blue-900 bg-blue-100 transition duration-200">DailyRaga</a> from the <a href="https://play.google.com/store/apps/developer?id=Meghraj+Goswami" target="_blank" class="text-lg hover:text-yellow-900 active:text-yellow-900 font-semibold hover:bg-yellow-100 active:bg-yellow-100 py-0.5 px-2 rounded text-blue-900 bg-blue-100 transition duration-200">Play Store!</a>
        </div>
    </div>
</div>