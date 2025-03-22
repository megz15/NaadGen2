<script>
	import '../app.css'
	let { children } = $props()
</script>

<div class="">
    <svg class="wave1" viewBox="0 0 1440 250" xmlns="http://www.w3.org/2000/svg">
        <path class="fill-none stroke-[#535bf2] stroke-[18px] max-md:stroke-[30px]" stroke-dasharray="1650" stroke-dashoffset="1650" d="M0,160L21.8,160C43.6,160,87,160,131,181.3C174.5,203,218,245,262,234.7C305.5,224,349,160,393,133.3C436.4,107,480,117,524,106.7C567.3,96,611,64,655,80C698.2,96,742,160,785,176C829.1,192,873,160,916,138.7C960,117,1004,107,1047,112C1090.9,117,1135,139,1178,170.7C1221.8,203,1265,245,1309,234.7C1352.7,224,1396,160,1418,128L1440,96L1440">
            <animate attributeName="stroke-dashoffset" from="1650" to="0" dur="2.5s" fill="freeze" keySplines=".42,0,.58,1" calcMode="spline" keyTimes="0; 1"></animate>
        </path>
    </svg>

	{@render children()}

    <div class="bg-[#1d2230b9] text-white py-5 text-center flex flex-col justify-center items-center gap-2">
        <div>
            Made with 💙 by <nobr><a href="https://www.instagram.com/megh.sarod/" target="_blank" class="hover:text-blue-900 active:text-blue-900 font-semibold hover:bg-blue-100 active:bg-blue-100 py-0.5 px-2 rounded text-yellow-900 bg-yellow-100 transition duration-200">Meghraj Goswami</a></nobr>
        </div><div>
            Download <a id="dailyRagaPromo" href="https://play.google.com/store/apps/details?id=megh.dailyraga" target="_blank" class="text-lg hover:text-yellow-900 active:text-yellow-900 font-semibold hover:bg-yellow-100 active:bg-yellow-100 py-0.5 px-2 rounded text-blue-900 bg-blue-100 transition duration-200">DailyRaga</a> from the <nobr><a href="https://play.google.com/store/apps/developer?id=Meghraj+Goswami" target="_blank" class="text-lg hover:text-yellow-900 active:text-yellow-900 font-semibold hover:bg-yellow-100 active:bg-yellow-100 py-0.5 px-2 rounded text-blue-900 bg-blue-100 transition duration-200">Play Store!</a></nobr>
        </div>
    </div>
</div>