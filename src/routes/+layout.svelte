<script>
	import '../app.css'
	let { children } = $props()
</script>

<div>
	{@render children()}

    <div class="bg-[#1d2230b9] text-white py-5 text-center">
        Made with 💙 by <a href="https://github.com/megz15/" target="_blank" class="hover:text-blue-900 font-semibold hover:bg-blue-100 py-0.5 px-2 rounded text-yellow-900 bg-yellow-100 transition duration-200">Meghraj Goswami</a>
    </div>
</div>