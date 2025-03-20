<script>
	import '../app.css'
	let { children } = $props()
</script>

<div>
	{@render children()}

    <div class="bg-[#1d2230b9] text-white py-5 text-center">
        Made with 💙 by <a href="https://github.com/megz15/" target="_blank" class="text-yellow-300 font-semibold transition duration-200 hover:text-orange-400">Meghraj Goswami</a>
    </div>
</div>