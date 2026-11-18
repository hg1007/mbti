<template>
  <div
    :class="[
      'mbti-characters',
      { 'mbti-characters--strip': !type, 'mbti-characters--single': !!type },
    ]"
    :style="rootStyle"
  >
    <div
      v-for="key in visibleTypes"
      :key="key"
      class="mbti-characters__figure"
      :class="[`mbti-characters__figure--${key}`]"
    >
      <!-- ============ DREAMER (INFP) ============ -->
      <svg
        v-if="key === 'dreamer'"
        class="mbti-svg mbti-svg--dreamer"
        viewBox="0 0 160 200"
        :width="size"
        :height="size * 1.25"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Dreamer character"
        role="img"
      >
        <!-- LINEART -->
        <g v-if="activeStyle === 'lineart'">
          <g class="mbti-anim-twinkle">
            <path d="M122 18 L124.5 25 L131 27.5 L124.5 30 L122 37 L119.5 30 L113 27.5 L119.5 25 Z" fill="none" stroke="#7c6cf0" stroke-width="1.5" opacity="0.75" />
            <circle cx="38" cy="22" r="3" fill="none" stroke="#7c6cf0" stroke-width="1.2" opacity="0.55" />
            <circle cx="28" cy="38" r="1.8" fill="none" stroke="#a89cff" stroke-width="1" opacity="0.7" />
          </g>
          <circle cx="112" cy="38" r="5.5" fill="none" stroke="#7c6cf0" stroke-width="1.2" opacity="0.5" />
          <circle cx="102" cy="48" r="3.8" fill="none" stroke="#7c6cf0" stroke-width="1" opacity="0.4" />
          <circle cx="96" cy="55" r="2.4" fill="none" stroke="#7c6cf0" stroke-width="0.8" opacity="0.3" />
          <circle cx="80" cy="62" r="24" fill="none" stroke="#7c6cf0" stroke-width="2" />
          <path d="M58 52 Q68 40 84 44 Q96 46 102 58" fill="none" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <path d="M101 49 Q94 38 80 38 Q64 38 56 52" fill="none" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <path d="M69 62 Q72.5 65.5 76 62" stroke="#7c6cf0" stroke-width="1.6" fill="none" stroke-linecap="round" />
          <path d="M84 62 Q87.5 65.5 91 62" stroke="#7c6cf0" stroke-width="1.6" fill="none" stroke-linecap="round" />
          <circle cx="67" cy="70" r="3.2" fill="none" stroke="#7c6cf0" stroke-width="0.8" opacity="0.4" />
          <circle cx="93" cy="70" r="3.2" fill="none" stroke="#7c6cf0" stroke-width="0.8" opacity="0.4" />
          <path d="M77 74 Q80 77 83 74" stroke="#7c6cf0" stroke-width="1.4" fill="none" stroke-linecap="round" />
          <line x1="80" y1="86" x2="80" y2="92" stroke="#7c6cf0" stroke-width="2" />
          <path d="M50 94 Q50 88 60 88 L100 88 Q110 88 110 94 L114 140 Q114 150 104 150 L56 150 Q46 150 46 140 Z" fill="none" stroke="#7c6cf0" stroke-width="2" stroke-linejoin="round" />
          <path d="M50 100 Q42 110 48 128" fill="none" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <path d="M110 100 Q118 108 120 128" fill="none" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <circle cx="120" cy="128" r="4" fill="none" stroke="#7c6cf0" stroke-width="1.5" />
          <path d="M122 120 L123 124 L127 125 L123 126 L122 130 L121 126 L117 125 L121 124 Z" fill="none" stroke="#7c6cf0" stroke-width="1" opacity="0.85" />
          <line x1="69" y1="150" x2="69" y2="178" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <line x1="91" y1="150" x2="91" y2="178" stroke="#7c6cf0" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="10" ry="4" fill="none" stroke="#7c6cf0" stroke-width="2" />
          <ellipse cx="91" cy="182" rx="10" ry="4" fill="none" stroke="#7c6cf0" stroke-width="2" />
        </g>

        <!-- GEOMETRIC -->
        <g v-else-if="activeStyle === 'geometric'">
          <!-- aura -->
          <circle cx="80" cy="62" r="34" fill="#7c6cf0" opacity="0.15"/>
          <!-- sparkles -->
          <g class="mbti-anim-twinkle">
            <circle cx="118" cy="28" r="3.5" fill="#7c6cf0" opacity="0.5"/>
            <circle cx="36" cy="34" r="2.5" fill="#a89cff" opacity="0.4"/>
          </g>
          <!-- head -->
          <circle cx="80" cy="56" r="22" fill="#ffd9b8"/>
          <!-- hair -->
          <path d="M58 48 Q80 30 102 48" fill="#7c6cf0"/>
          <!-- eyes -->
          <circle cx="72" cy="56" r="2.5" fill="#3a2f4f"/>
          <circle cx="88" cy="56" r="2.5" fill="#3a2f4f"/>
          <!-- mouth -->
          <path d="M74 64 Q80 68 86 64" stroke="#c97a6f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <!-- body -->
          <rect x="66" y="78" width="28" height="44" rx="8" fill="#d8d1ff"/>
          <!-- legs -->
          <rect x="62" y="122" width="12" height="30" rx="6" fill="#5a4fcf"/>
          <rect x="86" y="122" width="12" height="30" rx="6" fill="#5a4fcf"/>
          <!-- shoes -->
          <ellipse cx="68" cy="155" rx="8" ry="4" fill="#5a4fcf"/>
          <ellipse cx="92" cy="155" rx="8" ry="4" fill="#5a4fcf"/>
        </g>

        <!-- BOLD -->
        <g v-else>
          <g class="mbti-anim-twinkle">
            <path d="M122 18 L124.5 25 L131 27.5 L124.5 30 L122 37 L119.5 30 L113 27.5 L119.5 25 Z" fill="#7c6cf0" stroke="#7c6cf0" stroke-width="0.5" opacity="0.85" />
            <circle cx="38" cy="22" r="3.5" fill="#7c6cf0" opacity="0.65" />
            <circle cx="28" cy="38" r="2.2" fill="#a89cff" opacity="0.75" />
          </g>
          <circle cx="112" cy="38" r="5.5" fill="#7c6cf0" opacity="0.5" />
          <circle cx="102" cy="48" r="3.8" fill="#7c6cf0" opacity="0.4" />
          <circle cx="96" cy="55" r="2.4" fill="#7c6cf0" opacity="0.3" />
          <circle cx="80" cy="62" r="26" fill="#7c6cf0" />
          <path d="M56 56 Q64 38 80 36 Q96 38 104 56" fill="none" stroke="#5a4ed4" stroke-width="3" stroke-linecap="round" />
          <path d="M58 52 Q68 40 84 44 Q96 46 102 58" fill="none" stroke="#5a4ed4" stroke-width="2.5" stroke-linecap="round" />
          <path d="M69 62 Q72.5 66 76 62" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <path d="M84 62 Q87.5 66 91 62" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <circle cx="67" cy="70" r="3.5" fill="white" opacity="0.25" />
          <circle cx="93" cy="70" r="3.5" fill="white" opacity="0.25" />
          <path d="M76 74 Q80 78 84 74" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" />
          <line x1="80" y1="88" x2="80" y2="94" stroke="#7c6cf0" stroke-width="3" />
          <path d="M48 96 Q48 88 60 88 L100 88 Q112 88 112 96 L116 142 Q116 152 106 152 L54 152 Q44 152 44 142 Z" fill="#7c6cf0" stroke="#7c6cf0" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M60 100 Q60 96 66 96 L94 96 Q100 96 100 100" fill="none" stroke="#5a4ed4" stroke-width="1.5" opacity="0.5" />
          <path d="M48 102 Q40 112 46 130" fill="none" stroke="#7c6cf0" stroke-width="3" stroke-linecap="round" />
          <path d="M112 102 Q120 110 122 130" fill="none" stroke="#7c6cf0" stroke-width="3" stroke-linecap="round" />
          <circle cx="122" cy="130" r="5" fill="#7c6cf0" />
          <path d="M124 122 L125 126 L129 127 L125 128 L124 132 L123 128 L119 127 L123 126 Z" fill="#7c6cf0" opacity="0.9" />
          <line x1="69" y1="152" x2="69" y2="178" stroke="#7c6cf0" stroke-width="3" stroke-linecap="round" />
          <line x1="91" y1="152" x2="91" y2="178" stroke="#7c6cf0" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="11" ry="5" fill="#7c6cf0" />
          <ellipse cx="91" cy="182" rx="11" ry="5" fill="#7c6cf0" />
        </g>
      </svg>

      <!-- ============ LEADER (ENTJ) ============ -->
      <svg
        v-else-if="key === 'leader'"
        class="mbti-svg mbti-svg--leader"
        viewBox="0 0 160 200"
        :width="size"
        :height="size * 1.25"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Leader character"
        role="img"
      >
        <!-- LINEART -->
        <g v-if="activeStyle === 'lineart'">
          <g class="mbti-anim-sway">
            <path d="M64 28 L70 18 L76 26 L82 14 L88 26 L94 18 L100 28 L98 34 L66 34 Z" fill="none" stroke="#0071e3" stroke-width="1.8" stroke-linejoin="round" opacity="0.85" />
            <circle cx="70" cy="20" r="1.8" fill="#0071e3" opacity="0.6" />
            <circle cx="82" cy="16" r="1.8" fill="#0071e3" opacity="0.6" />
            <circle cx="94" cy="20" r="1.8" fill="#0071e3" opacity="0.6" />
          </g>
          <circle cx="80" cy="62" r="24" fill="none" stroke="#0071e3" stroke-width="2" />
          <path d="M58 56 Q62 42 82 40 Q100 40 102 54" fill="none" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <line x1="68" y1="60" x2="74" y2="60" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <line x1="86" y1="60" x2="92" y2="60" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <path d="M66 54 L76 53" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <path d="M84 53 L94 54" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <path d="M74 73 Q80 78 86 73" stroke="#0071e3" stroke-width="1.6" fill="none" stroke-linecap="round" />
          <line x1="80" y1="86" x2="80" y2="92" stroke="#0071e3" stroke-width="2" />
          <path d="M42 96 Q46 86 62 86 L98 86 Q114 86 118 96 L120 148 Q120 154 112 154 L48 154 Q40 154 40 148 Z" fill="none" stroke="#0071e3" stroke-width="2" stroke-linejoin="round" />
          <path d="M72 86 L80 108 L88 86" fill="none" stroke="#0071e3" stroke-width="1.5" />
          <path d="M78 92 L82 92 L84 108 L80 114 L76 108 Z" fill="none" stroke="#0071e3" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M42 100 Q36 118 40 140" fill="none" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <path d="M118 100 Q124 116 124 138" fill="none" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <circle cx="40" cy="140" r="4" fill="none" stroke="#0071e3" stroke-width="1.5" />
          <circle cx="124" cy="138" r="4" fill="none" stroke="#0071e3" stroke-width="1.5" />
          <line x1="69" y1="154" x2="69" y2="178" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <line x1="91" y1="154" x2="91" y2="178" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="10" ry="4" fill="none" stroke="#0071e3" stroke-width="2" />
          <ellipse cx="91" cy="182" rx="10" ry="4" fill="none" stroke="#0071e3" stroke-width="2" />
        </g>

        <!-- GEOMETRIC -->
        <g v-else-if="activeStyle === 'geometric'">
          <!-- aura -->
          <circle cx="80" cy="62" r="34" fill="#0071e3" opacity="0.12"/>
          <!-- crown -->
          <g class="mbti-anim-sway">
            <path d="M60 28 L66 16 L72 24 L80 10 L88 24 L94 16 L100 28 L98 36 L62 36 Z" fill="#0071e3" opacity="0.7"/>
          </g>
          <!-- head -->
          <circle cx="80" cy="56" r="22" fill="#ffd9b8"/>
          <!-- hair -->
          <path d="M58 50 Q80 38 102 50" fill="#2c2c2e"/>
          <!-- eyes -->
          <rect x="68" y="52" width="6" height="8" rx="2" fill="#2c2c2e"/>
          <rect x="86" y="52" width="6" height="8" rx="2" fill="#2c2c2e"/>
          <!-- mouth -->
          <path d="M72 66 Q80 72 88 66" stroke="#a85a4f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <!-- body -->
          <rect x="64" y="78" width="32" height="46" rx="8" fill="#0071e3"/>
          <!-- tie -->
          <rect x="76" y="78" width="8" height="18" fill="white" opacity="0.5"/>
          <!-- legs -->
          <rect x="60" y="124" width="12" height="30" rx="6" fill="#1d1d1f"/>
          <rect x="88" y="124" width="12" height="30" rx="6" fill="#1d1d1f"/>
          <!-- shoes -->
          <ellipse cx="66" cy="157" rx="8" ry="4" fill="#1d1d1f"/>
          <ellipse cx="94" cy="157" rx="8" ry="4" fill="#1d1d1f"/>
        </g>

        <!-- BOLD -->
        <g v-else>
          <g class="mbti-anim-sway">
            <path d="M64 28 L70 18 L76 26 L82 14 L88 26 L94 18 L100 28 L98 34 L66 34 Z" fill="#0071e3" stroke="#0071e3" stroke-width="1" stroke-linejoin="round" />
            <circle cx="70" cy="20" r="2" fill="white" opacity="0.7" />
            <circle cx="82" cy="16" r="2" fill="white" opacity="0.7" />
            <circle cx="94" cy="20" r="2" fill="white" opacity="0.7" />
          </g>
          <circle cx="80" cy="62" r="26" fill="#0071e3" />
          <path d="M56 56 Q62 40 82 38 Q102 40 104 56" fill="none" stroke="#005bb5" stroke-width="3" stroke-linecap="round" />
          <line x1="67" y1="60" x2="75" y2="60" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          <line x1="85" y1="60" x2="93" y2="60" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          <path d="M65 54 L76 52" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          <path d="M84 52 L95 54" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          <path d="M73 73 Q80 79 87 73" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" />
          <line x1="80" y1="88" x2="80" y2="94" stroke="#0071e3" stroke-width="3" />
          <path d="M40 96 Q44 86 62 86 L98 86 Q116 86 120 96 L122 148 Q122 156 112 156 L48 156 Q38 156 38 148 Z" fill="#0071e3" stroke="#0071e3" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M72 86 L80 110 L88 86" fill="none" stroke="white" stroke-width="2" />
          <path d="M77 92 L83 92 L85 110 L80 116 L75 110 Z" fill="white" opacity="0.8" stroke="white" stroke-width="1" stroke-linejoin="round" />
          <path d="M40 102 Q34 120 38 142" fill="none" stroke="#0071e3" stroke-width="3" stroke-linecap="round" />
          <path d="M120 102 Q126 118 126 140" fill="none" stroke="#0071e3" stroke-width="3" stroke-linecap="round" />
          <circle cx="38" cy="142" r="5" fill="#0071e3" />
          <circle cx="126" cy="140" r="5" fill="#0071e3" />
          <line x1="69" y1="156" x2="69" y2="178" stroke="#0071e3" stroke-width="3" stroke-linecap="round" />
          <line x1="91" y1="156" x2="91" y2="178" stroke="#0071e3" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="11" ry="5" fill="#0071e3" />
          <ellipse cx="91" cy="182" rx="11" ry="5" fill="#0071e3" />
        </g>
      </svg>

      <!-- ============ ANALYST (INTP) ============ -->
      <svg
        v-else-if="key === 'analyst'"
        class="mbti-svg mbti-svg--analyst"
        viewBox="0 0 160 200"
        :width="size"
        :height="size * 1.25"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Analyst character"
        role="img"
      >
        <!-- LINEART -->
        <g v-if="activeStyle === 'lineart'">
          <g class="mbti-anim-float">
            <text x="118" y="36" font-family="-apple-system, 'SF Pro Rounded', system-ui, sans-serif" font-size="28" font-weight="700" fill="none" stroke="#34c759" stroke-width="0.8" opacity="0.8">?</text>
            <circle cx="36" cy="30" r="2.5" fill="none" stroke="#34c759" stroke-width="1" opacity="0.6" />
          </g>
          <circle cx="80" cy="62" r="24" fill="none" stroke="#34c759" stroke-width="2" />
          <path d="M58 56 Q64 40 80 42 Q96 40 102 54" fill="none" stroke="#34c759" stroke-width="2" stroke-linecap="round" />
          <path d="M66 46 Q72 38 78 46" fill="none" stroke="#34c759" stroke-width="1.5" stroke-linecap="round" />
          <path d="M84 46 Q90 38 96 46" fill="none" stroke="#34c759" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="70" cy="62" r="7.5" fill="none" stroke="#34c759" stroke-width="1.8" />
          <circle cx="90" cy="62" r="7.5" fill="none" stroke="#34c759" stroke-width="1.8" />
          <path d="M77.5 62 L82.5 62" stroke="#34c759" stroke-width="1.6" />
          <path d="M62.5 60 L58 58" stroke="#34c759" stroke-width="1.4" stroke-linecap="round" />
          <path d="M97.5 60 L102 58" stroke="#34c759" stroke-width="1.4" stroke-linecap="round" />
          <circle cx="71" cy="61" r="1.8" fill="#34c759" />
          <circle cx="91" cy="61" r="1.8" fill="#34c759" />
          <path d="M76 74 Q80 76 84 74" stroke="#34c759" stroke-width="1.4" fill="none" stroke-linecap="round" />
          <line x1="80" y1="86" x2="80" y2="92" stroke="#34c759" stroke-width="2" />
          <path d="M48 94 Q48 88 60 88 L100 88 Q112 88 112 94 L116 142 Q116 152 106 152 L54 152 Q44 152 44 142 Z" fill="none" stroke="#34c759" stroke-width="2" stroke-linejoin="round" />
          <path d="M60 124 Q60 120 66 120 L94 120 Q100 120 100 124 L100 138 Q100 142 94 142 L66 142 Q60 142 60 138 Z" fill="none" stroke="#34c759" stroke-width="1.2" opacity="0.5" />
          <path d="M48 100 Q38 118 44 138" fill="none" stroke="#34c759" stroke-width="2" stroke-linecap="round" />
          <path d="M112 96 Q128 104 124 128 Q122 140 110 138" fill="none" stroke="#34c759" stroke-width="2" stroke-linecap="round" />
          <circle cx="118" cy="134" r="4" fill="none" stroke="#34c759" stroke-width="1.5" />
          <circle cx="44" cy="138" r="4" fill="none" stroke="#34c759" stroke-width="1.5" />
          <line x1="69" y1="152" x2="69" y2="178" stroke="#34c759" stroke-width="2" stroke-linecap="round" />
          <line x1="91" y1="152" x2="91" y2="178" stroke="#34c759" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="10" ry="4" fill="none" stroke="#34c759" stroke-width="2" />
          <ellipse cx="91" cy="182" rx="10" ry="4" fill="none" stroke="#34c759" stroke-width="2" />
        </g>

        <!-- GEOMETRIC -->
        <g v-else-if="activeStyle === 'geometric'">
          <!-- aura -->
          <circle cx="80" cy="62" r="34" fill="#34c759" opacity="0.12"/>
          <!-- question mark -->
          <g class="mbti-anim-float">
            <text x="118" y="36" font-family="-apple-system, 'SF Pro Rounded', system-ui, sans-serif" font-size="28" font-weight="700" fill="#34c759" opacity="0.6">?</text>
          </g>
          <!-- head -->
          <circle cx="80" cy="56" r="22" fill="#ffd9b8"/>
          <!-- hair -->
          <path d="M58 48 Q80 34 102 48 L100 56 Q80 44 60 56 Z" fill="#5a3a1f"/>
          <!-- glasses -->
          <circle cx="70" cy="56" r="8" fill="none" stroke="#2c2c2e" stroke-width="2"/>
          <circle cx="90" cy="56" r="8" fill="none" stroke="#2c2c2e" stroke-width="2"/>
          <line x1="78" y1="56" x2="82" y2="56" stroke="#2c2c2e" stroke-width="2"/>
          <!-- eyes -->
          <circle cx="70" cy="56" r="2" fill="#2c2c2e"/>
          <circle cx="90" cy="56" r="2" fill="#2c2c2e"/>
          <!-- mouth -->
          <line x1="74" y1="66" x2="86" y2="66" stroke="#8a7a6f" stroke-width="1.8" stroke-linecap="round"/>
          <!-- body -->
          <rect x="64" y="78" width="32" height="46" rx="8" fill="#34c759"/>
          <!-- legs -->
          <rect x="60" y="124" width="12" height="30" rx="6" fill="#4a4a4c"/>
          <rect x="88" y="124" width="12" height="30" rx="6" fill="#4a4a4c"/>
          <!-- shoes -->
          <ellipse cx="66" cy="157" rx="8" ry="4" fill="#4a4a4c"/>
          <ellipse cx="94" cy="157" rx="8" ry="4" fill="#4a4a4c"/>
        </g>

        <!-- BOLD -->
        <g v-else>
          <g class="mbti-anim-float">
            <text x="118" y="36" font-family="-apple-system, 'SF Pro Rounded', system-ui, sans-serif" font-size="28" font-weight="700" fill="#34c759" opacity="0.9">?</text>
            <circle cx="36" cy="30" r="3" fill="#34c759" opacity="0.6" />
          </g>
          <circle cx="80" cy="62" r="26" fill="#34c759" />
          <path d="M56 56 Q64 38 80 40 Q96 38 104 56" fill="none" stroke="#248a3d" stroke-width="3" stroke-linecap="round" />
          <path d="M66 46 Q72 36 78 46" fill="none" stroke="#248a3d" stroke-width="2.5" stroke-linecap="round" />
          <path d="M84 46 Q90 36 96 46" fill="none" stroke="#248a3d" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="70" cy="62" r="8" fill="none" stroke="white" stroke-width="2.5" />
          <circle cx="90" cy="62" r="8" fill="none" stroke="white" stroke-width="2.5" />
          <path d="M78 62 L82 62" stroke="white" stroke-width="2" />
          <path d="M62 60 L57 58" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M98 60 L103 58" stroke="white" stroke-width="2" stroke-linecap="round" />
          <circle cx="71" cy="61" r="2.2" fill="white" />
          <circle cx="91" cy="61" r="2.2" fill="white" />
          <path d="M76 74 Q80 77 84 74" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" />
          <line x1="80" y1="88" x2="80" y2="94" stroke="#34c759" stroke-width="3" />
          <path d="M46 96 Q46 88 60 88 L100 88 Q114 88 114 96 L118 144 Q118 154 108 154 L52 154 Q42 154 42 144 Z" fill="#34c759" stroke="#34c759" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M60 124 Q60 120 66 120 L94 120 Q100 120 100 124 L100 140 Q100 144 94 144 L66 144 Q60 144 60 140 Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.4" />
          <path d="M46 102 Q36 120 42 140" fill="none" stroke="#34c759" stroke-width="3" stroke-linecap="round" />
          <path d="M114 98 Q130 106 126 130 Q124 142 112 140" fill="none" stroke="#34c759" stroke-width="3" stroke-linecap="round" />
          <circle cx="124" cy="136" r="5" fill="#34c759" />
          <circle cx="42" cy="140" r="5" fill="#34c759" />
          <line x1="69" y1="154" x2="69" y2="178" stroke="#34c759" stroke-width="3" stroke-linecap="round" />
          <line x1="91" y1="154" x2="91" y2="178" stroke="#34c759" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="11" ry="5" fill="#34c759" />
          <ellipse cx="91" cy="182" rx="11" ry="5" fill="#34c759" />
        </g>
      </svg>

      <!-- ============ EXPLORER (ESFP) ============ -->
      <svg
        v-else-if="key === 'explorer'"
        class="mbti-svg mbti-svg--explorer"
        viewBox="0 0 160 200"
        :width="size"
        :height="size * 1.25"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Explorer character"
        role="img"
      >
        <!-- LINEART -->
        <g v-if="activeStyle === 'lineart'">
          <g class="mbti-anim-sway">
            <path d="M20 80 L30 80" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
            <path d="M16 92 L28 92" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round" opacity="0.45" />
            <path d="M22 104 L30 104" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round" opacity="0.5" />
          </g>
          <g class="mbti-anim-twinkle">
            <path d="M128 28 L130 34 L136 36 L130 38 L128 44 L126 38 L120 36 L126 34 Z" fill="none" stroke="#ff9500" stroke-width="1.5" opacity="0.8" />
          </g>
          <circle cx="82" cy="62" r="24" fill="none" stroke="#ff9500" stroke-width="2" />
          <path d="M60 54 Q68 38 88 40 Q106 42 108 56" fill="none" stroke="#ff9500" stroke-width="2" stroke-linecap="round" />
          <path d="M62 50 Q70 40 82 44" fill="none" stroke="#ff9500" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="73" cy="62" r="2.6" fill="#ff9500" />
          <circle cx="91" cy="62" r="2.6" fill="#ff9500" />
          <circle cx="74" cy="61" r="0.9" fill="var(--canvas, white)" />
          <circle cx="92" cy="61" r="0.9" fill="var(--canvas, white)" />
          <path d="M72 72 Q82 82 92 72" stroke="#ff9500" stroke-width="1.8" fill="none" stroke-linecap="round" />
          <circle cx="66" cy="70" r="3" fill="none" stroke="#ff9500" stroke-width="0.8" opacity="0.4" />
          <circle cx="98" cy="70" r="3" fill="none" stroke="#ff9500" stroke-width="0.8" opacity="0.4" />
          <line x1="82" y1="86" x2="82" y2="92" stroke="#ff9500" stroke-width="2" />
          <path d="M52 94 Q52 88 62 88 L102 88 Q112 88 112 94 L116 142 Q116 152 106 152 L58 152 Q48 152 48 142 Z" fill="none" stroke="#ff9500" stroke-width="2" stroke-linejoin="round" />
          <path d="M74 110 L82 96 L90 110 Z" fill="none" stroke="#ff9500" stroke-width="1.2" opacity="0.6" />
          <path d="M52 98 Q38 90 38 96" fill="none" stroke="#ff9500" stroke-width="2" stroke-linecap="round" />
          <path d="M112 98 Q126 88 132 88" fill="none" stroke="#ff9500" stroke-width="2" stroke-linecap="round" />
          <circle cx="38" cy="96" r="4" fill="none" stroke="#ff9500" stroke-width="1.5" />
          <circle cx="132" cy="88" r="4" fill="none" stroke="#ff9500" stroke-width="1.5" />
          <line x1="69" y1="152" x2="62" y2="178" stroke="#ff9500" stroke-width="2" stroke-linecap="round" />
          <line x1="95" y1="152" x2="102" y2="178" stroke="#ff9500" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="60" cy="182" rx="10" ry="4" fill="none" stroke="#ff9500" stroke-width="2" />
          <ellipse cx="102" cy="182" rx="10" ry="4" fill="none" stroke="#ff9500" stroke-width="2" />
        </g>

        <!-- GEOMETRIC -->
        <g v-else-if="activeStyle === 'geometric'">
          <!-- aura -->
          <circle cx="82" cy="62" r="34" fill="#ff9500" opacity="0.12"/>
          <!-- sparkle -->
          <g class="mbti-anim-twinkle">
            <path d="M128 28 L130 34 L136 36 L130 38 L128 44 L126 38 L120 36 L126 34 Z" fill="#ff9500" opacity="0.5"/>
          </g>
          <!-- head -->
          <circle cx="82" cy="56" r="22" fill="#ffd9b8"/>
          <!-- hair -->
          <path d="M60 50 Q68 34 88 38 Q106 40 104 52" fill="#d85a00"/>
          <path d="M62 48 Q70 38 82 42" fill="#d85a00" opacity="0.8"/>
          <!-- eyes -->
          <rect x="70" y="52" width="6" height="8" rx="2" fill="#2c2c2e"/>
          <rect x="86" y="52" width="6" height="8" rx="2" fill="#2c2c2e"/>
          <!-- mouth -->
          <path d="M72 66 Q82 74 92 66" stroke="#a85a4f" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <!-- body -->
          <rect x="68" y="78" width="28" height="44" rx="8" fill="#ff9500"/>
          <!-- triangle detail -->
          <path d="M76 90 L82 80 L88 90 Z" fill="white" opacity="0.5"/>
          <!-- legs -->
          <rect x="64" y="122" width="12" height="30" rx="6" fill="#3a3a3c"/>
          <rect x="88" y="122" width="12" height="30" rx="6" fill="#3a3a3c"/>
          <!-- shoes -->
          <ellipse cx="70" cy="155" rx="8" ry="4" fill="#3a3a3c"/>
          <ellipse cx="94" cy="155" rx="8" ry="4" fill="#3a3a3c"/>
        </g>

        <!-- BOLD -->
        <g v-else>
          <g class="mbti-anim-sway">
            <path d="M20 80 L30 80" stroke="#ff9500" stroke-width="3" stroke-linecap="round" opacity="0.7" />
            <path d="M16 92 L28 92" stroke="#ff9500" stroke-width="3" stroke-linecap="round" opacity="0.55" />
            <path d="M22 104 L30 104" stroke="#ff9500" stroke-width="3" stroke-linecap="round" opacity="0.6" />
          </g>
          <g class="mbti-anim-twinkle">
            <path d="M128 28 L130 34 L136 36 L130 38 L128 44 L126 38 L120 36 L126 34 Z" fill="#ff9500" stroke="#ff9500" stroke-width="0.5" opacity="0.85" />
          </g>
          <circle cx="82" cy="62" r="26" fill="#ff9500" />
          <path d="M58 54 Q68 36 88 38 Q108 40 110 56" fill="none" stroke="#cc7700" stroke-width="3" stroke-linecap="round" />
          <path d="M60 50 Q70 38 84 42" fill="none" stroke="#cc7700" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="73" cy="62" r="3.5" fill="white" />
          <circle cx="91" cy="62" r="3.5" fill="white" />
          <circle cx="74.5" cy="61" r="1.2" fill="#ff9500" />
          <circle cx="92.5" cy="61" r="1.2" fill="#ff9500" />
          <path d="M72 73 Q82 84 92 73" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <circle cx="66" cy="70" r="3.5" fill="white" opacity="0.25" />
          <circle cx="98" cy="70" r="3.5" fill="white" opacity="0.25" />
          <line x1="82" y1="88" x2="82" y2="94" stroke="#ff9500" stroke-width="3" />
          <path d="M50 96 Q50 88 62 88 L102 88 Q114 88 114 96 L118 144 Q118 154 108 154 L56 154 Q46 154 46 144 Z" fill="#ff9500" stroke="#ff9500" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M74 112 L82 98 L90 112 Z" fill="none" stroke="white" stroke-width="1.8" opacity="0.6" />
          <path d="M50 100 Q36 92 36 98" fill="none" stroke="#ff9500" stroke-width="3" stroke-linecap="round" />
          <path d="M114 100 Q128 88 134 88" fill="none" stroke="#ff9500" stroke-width="3" stroke-linecap="round" />
          <circle cx="36" cy="98" r="5" fill="#ff9500" />
          <circle cx="134" cy="88" r="5" fill="#ff9500" />
          <line x1="69" y1="154" x2="60" y2="178" stroke="#ff9500" stroke-width="3" stroke-linecap="round" />
          <line x1="95" y1="154" x2="104" y2="178" stroke="#ff9500" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="58" cy="182" rx="11" ry="5" fill="#ff9500" />
          <ellipse cx="104" cy="182" rx="11" ry="5" fill="#ff9500" />
        </g>
      </svg>

      <!-- ============ CONNECTOR (ENFJ) ============ -->
      <svg
        v-else-if="key === 'connector'"
        class="mbti-svg mbti-svg--connector"
        viewBox="0 0 160 200"
        :width="size"
        :height="size * 1.25"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Connector character"
        role="img"
      >
        <!-- LINEART -->
        <g v-if="activeStyle === 'lineart'">
          <g class="mbti-anim-float">
            <path d="M24 44 Q24 38 30 38 Q36 38 36 44 Q36 50 30 56 Q24 50 24 44 Z" fill="none" stroke="#ff375f" stroke-width="1.2" opacity="0.6" />
            <path d="M124 28 Q124 22 130 22 Q136 22 136 28 Q136 34 130 40 Q124 34 124 28 Z" fill="none" stroke="#ff375f" stroke-width="1.2" opacity="0.75" />
            <path d="M132 56 Q132 52 136 52 Q140 52 140 56 Q140 60 136 64 Q132 60 132 56 Z" fill="none" stroke="#ff375f" stroke-width="1" opacity="0.5" />
          </g>
          <circle cx="80" cy="62" r="24" fill="none" stroke="#ff375f" stroke-width="2" />
          <path d="M58 56 Q64 42 82 42 Q98 42 102 54" fill="none" stroke="#ff375f" stroke-width="2" stroke-linecap="round" />
          <path d="M56 56 Q52 72 56 92" fill="none" stroke="#ff375f" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
          <path d="M104 56 Q108 72 104 92" fill="none" stroke="#ff375f" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
          <path d="M68 62 Q71.5 59 75 62" stroke="#ff375f" stroke-width="1.8" fill="none" stroke-linecap="round" />
          <path d="M85 62 Q88.5 59 92 62" stroke="#ff375f" stroke-width="1.8" fill="none" stroke-linecap="round" />
          <circle cx="66" cy="70" r="3.4" fill="none" stroke="#ff375f" stroke-width="0.8" opacity="0.5" />
          <circle cx="94" cy="70" r="3.4" fill="none" stroke="#ff375f" stroke-width="0.8" opacity="0.5" />
          <path d="M72 73 Q80 80 88 73" stroke="#ff375f" stroke-width="1.8" fill="none" stroke-linecap="round" />
          <line x1="80" y1="86" x2="80" y2="92" stroke="#ff375f" stroke-width="2" />
          <path d="M50 94 Q50 88 60 88 L100 88 Q110 88 110 94 L114 142 Q114 152 104 152 L56 152 Q46 152 46 142 Z" fill="none" stroke="#ff375f" stroke-width="2" stroke-linejoin="round" />
          <line x1="78" y1="88" x2="78" y2="152" stroke="#ff375f" stroke-width="1.2" opacity="0.5" />
          <line x1="82" y1="88" x2="82" y2="152" stroke="#ff375f" stroke-width="1.2" opacity="0.5" />
          <path d="M50 98 Q32 104 22 100" fill="none" stroke="#ff375f" stroke-width="2" stroke-linecap="round" />
          <path d="M110 98 Q128 104 138 100" fill="none" stroke="#ff375f" stroke-width="2" stroke-linecap="round" />
          <circle cx="22" cy="100" r="4" fill="none" stroke="#ff375f" stroke-width="1.5" />
          <circle cx="138" cy="100" r="4" fill="none" stroke="#ff375f" stroke-width="1.5" />
          <line x1="69" y1="152" x2="69" y2="178" stroke="#ff375f" stroke-width="2" stroke-linecap="round" />
          <line x1="91" y1="152" x2="91" y2="178" stroke="#ff375f" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="10" ry="4" fill="none" stroke="#ff375f" stroke-width="2" />
          <ellipse cx="91" cy="182" rx="10" ry="4" fill="none" stroke="#ff375f" stroke-width="2" />
        </g>

        <!-- GEOMETRIC -->
        <g v-else-if="activeStyle === 'geometric'">
          <!-- aura -->
          <circle cx="80" cy="62" r="34" fill="#ff375f" opacity="0.12"/>
          <!-- hearts -->
          <g class="mbti-anim-float">
            <path d="M24 44 Q24 38 30 38 Q36 38 36 44 Q36 50 30 56 Q24 50 24 44 Z" fill="#ff375f" opacity="0.4"/>
            <path d="M124 28 Q124 22 130 22 Q136 22 136 28 Q136 34 130 40 Q124 34 124 28 Z" fill="#ff375f" opacity="0.35"/>
          </g>
          <!-- head -->
          <circle cx="80" cy="56" r="22" fill="#ffd9b8"/>
          <!-- hair -->
          <path d="M58 50 Q64 36 82 38 Q100 36 102 50" fill="#8a3a4f"/>
          <!-- hair sides -->
          <path d="M56 50 Q54 64 58 82" fill="#8a3a4f" opacity="0.7"/>
          <path d="M104 50 Q106 64 102 82" fill="#8a3a4f" opacity="0.7"/>
          <!-- eyes -->
          <path d="M68 54 Q72 50 76 54" stroke="#2c2c2e" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M84 54 Q88 50 92 54" stroke="#2c2c2e" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- mouth -->
          <path d="M72 66 Q80 72 88 66" stroke="#a85a4f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <!-- body -->
          <rect x="64" y="78" width="32" height="46" rx="8" fill="#ff375f"/>
          <!-- legs -->
          <rect x="60" y="124" width="12" height="30" rx="6" fill="#3a3a3c"/>
          <rect x="88" y="124" width="12" height="30" rx="6" fill="#3a3a3c"/>
          <!-- shoes -->
          <ellipse cx="66" cy="157" rx="8" ry="4" fill="#3a3a3c"/>
          <ellipse cx="94" cy="157" rx="8" ry="4" fill="#3a3a3c"/>
        </g>

        <!-- BOLD -->
        <g v-else>
          <g class="mbti-anim-float">
            <path d="M24 44 Q24 38 30 38 Q36 38 36 44 Q36 50 30 56 Q24 50 24 44 Z" fill="#ff375f" opacity="0.7" />
            <path d="M124 28 Q124 22 130 22 Q136 22 136 28 Q136 34 130 40 Q124 34 124 28 Z" fill="#ff375f" opacity="0.8" />
            <path d="M132 56 Q132 52 136 52 Q140 52 140 56 Q140 60 136 64 Q132 60 132 56 Z" fill="#ff375f" opacity="0.55" />
          </g>
          <circle cx="80" cy="62" r="26" fill="#ff375f" />
          <path d="M56 56 Q64 40 82 40 Q100 40 104 56" fill="none" stroke="#d42a4c" stroke-width="3" stroke-linecap="round" />
          <path d="M54 56 Q50 72 54 94" fill="none" stroke="#d42a4c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M106 56 Q110 72 106 94" fill="none" stroke="#d42a4c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M68 62 Q71.5 58 75 62" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <path d="M85 62 Q88.5 58 92 62" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <circle cx="66" cy="70" r="3.5" fill="white" opacity="0.25" />
          <circle cx="94" cy="70" r="3.5" fill="white" opacity="0.25" />
          <path d="M72 73 Q80 81 88 73" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <line x1="80" y1="88" x2="80" y2="94" stroke="#ff375f" stroke-width="3" />
          <path d="M48 96 Q48 88 60 88 L100 88 Q112 88 112 96 L116 144 Q116 154 106 154 L54 154 Q44 154 44 144 Z" fill="#ff375f" stroke="#ff375f" stroke-width="2.5" stroke-linejoin="round" />
          <line x1="78" y1="88" x2="78" y2="154" stroke="white" stroke-width="1.5" opacity="0.35" />
          <line x1="82" y1="88" x2="82" y2="154" stroke="white" stroke-width="1.5" opacity="0.35" />
          <path d="M48 100 Q30 106 20 102" fill="none" stroke="#ff375f" stroke-width="3" stroke-linecap="round" />
          <path d="M112 100 Q130 106 140 102" fill="none" stroke="#ff375f" stroke-width="3" stroke-linecap="round" />
          <circle cx="20" cy="102" r="5" fill="#ff375f" />
          <circle cx="140" cy="102" r="5" fill="#ff375f" />
          <line x1="69" y1="154" x2="69" y2="178" stroke="#ff375f" stroke-width="3" stroke-linecap="round" />
          <line x1="91" y1="154" x2="91" y2="178" stroke="#ff375f" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="69" cy="182" rx="11" ry="5" fill="#ff375f" />
          <ellipse cx="91" cy="182" rx="11" ry="5" fill="#ff375f" />
        </g>
      </svg>

      <span v-if="showLabels" class="mbti-characters__label">
        {{ labels[key] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type MbtiCharacterType =
  | 'dreamer'
  | 'leader'
  | 'analyst'
  | 'explorer'
  | 'connector'

export type MbtiCharStyle = 'geometric' | 'lineart' | 'bold'

export interface MbtiCharactersProps {
  type?: MbtiCharacterType
  size?: number
  showLabels?: boolean
  charStyle?: MbtiCharStyle
}

const props = withDefaults(defineProps<MbtiCharactersProps>(), {
  size: 140,
  showLabels: true,
  charStyle: undefined,
})

const ALL_TYPES: readonly MbtiCharacterType[] = [
  'dreamer',
  'leader',
  'analyst',
  'explorer',
  'connector',
] as const

const labels: Record<MbtiCharacterType, string> = {
  dreamer: 'The Dreamer',
  leader: 'The Leader',
  analyst: 'The Analyst',
  explorer: 'The Explorer',
  connector: 'The Connector',
}

const visibleTypes = computed<MbtiCharacterType[]>(() =>
  props.type ? [props.type] : [...ALL_TYPES],
)

const activeStyle = computed<MbtiCharStyle>(() => {
  if (props.charStyle) return props.charStyle
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('mbti-char-style')
    if (stored === 'geometric' || stored === 'lineart' || stored === 'bold') {
      return stored
    }
  }
  return 'lineart'
})

const rootStyle = computed(() => ({
  '--mbti-char-size': `${props.size}px`,
}))
</script>

<style scoped>
.mbti-characters {
  --mbti-char-size: 140px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
    'SF Pro Text', system-ui, sans-serif;
}

.mbti-characters--strip {
  gap: 18px;
  flex-wrap: wrap;
  padding: 8px 4px 4px;
}

.mbti-characters--single {
  display: inline-flex;
}

.mbti-characters__figure {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  will-change: transform;
}

.mbti-characters__label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--ink-subtle, #6e6e73);
  text-align: center;
}

.mbti-svg {
  display: block;
  overflow: visible;
}

/* Dark mode: brighten SVG character colors */
[data-theme="framer"] .mbti-svg {
  filter: brightness(1.25) saturate(1.1);
}

/* ---------- Animations ---------- */

@keyframes mbti-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes mbti-sway {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

@keyframes mbti-twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.86); }
}

@keyframes mbti-bob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(1deg); }
}

.mbti-anim-float {
  animation: mbti-float 3.4s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.mbti-anim-sway {
  animation: mbti-sway 4s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.mbti-anim-twinkle {
  animation: mbti-twinkle 2.6s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.mbti-svg--dreamer {
  animation: mbti-bob 5s ease-in-out infinite;
  transform-origin: center bottom;
}

.mbti-svg--leader {
  animation: mbti-bob 6s ease-in-out infinite 0.4s;
  transform-origin: center bottom;
}

.mbti-svg--analyst {
  animation: mbti-bob 5.5s ease-in-out infinite 0.8s;
  transform-origin: center bottom;
}

.mbti-svg--explorer {
  animation: mbti-bob 4.2s ease-in-out infinite 0.2s;
  transform-origin: center bottom;
}

.mbti-svg--connector {
  animation: mbti-bob 5.2s ease-in-out infinite 0.6s;
  transform-origin: center bottom;
}

@media (prefers-reduced-motion: reduce) {
  .mbti-anim-float,
  .mbti-anim-sway,
  .mbti-anim-twinkle,
  .mbti-svg--dreamer,
  .mbti-svg--leader,
  .mbti-svg--analyst,
  .mbti-svg--explorer,
  .mbti-svg--connector {
    animation: none;
  }
}
</style>
