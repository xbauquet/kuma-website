<template>
  <div class="waves waves--type-2" ref="wavesCenterOut">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      height="420"
      width="1372"
    >
      <mask id="a" fill="#fff">
        <path d="m.37.162h619.646v42.204h-619.646z" fill="#fff" fill-rule="evenodd"/>
      </mask>
      <mask id="b" fill="#fff">
        <path d="m0 .603h623.44v182.352h-623.44z" fill="#fff" fill-rule="evenodd"/>
      </mask>
      <g fill="none" fill-rule="evenodd" stroke-width="2">
        <g class="wave-group wave-group--1">
          <path d="m1436.831 624.19c0-482.92-597.632-97.16-597.632-622.692" stroke="#b64188"/>
          <path d="m1400.491 623.3c0-455.72-568.86-104.175-568.86-621.931" stroke="#a23987"/>
          <path d="m1364.152 622.41c0-428.516-540.092-111.188-540.092-621.168" stroke="#8e3086"/>
          <path d="m1327.812 621.522c0-401.32-511.328-118.204-511.328-620.412" stroke="#7a2885"/>
          <path d="m1291.472 620.63c0-374.115-482.56-125.22-482.56-619.647" stroke="#662084"/>
        </g>
        <g class="wave-group wave-group--2">
          <path d="m1176.179 624.19c0-412.16-389.02-91.924-389.02-622.692" stroke="#9f5c9c"/>
          <path d="m1138.948 623.3c0-402.651-359.36-88.467-359.36-621.931" stroke="#8452a1"/>
          <path d="m1101.72 622.41c0-393.14-329.704-85.012-329.704-621.168" stroke="#6948a7"/>
          <path d="m1064.49 621.522c0-383.628-300.044-81.556-300.044-620.412" stroke="#4f3eac"/>
          <path d="m1027.259 620.63c0-374.115-270.384-78.1-270.384-619.647" stroke="#3434b2"/>
        </g>
        <g class="wave-group wave-group--3">
          <path d="m-62.798 625.002c0-496.516 614.956-94.02 614.956-623.44" stroke="#953984"/>
          <path d="m-25.802 624.03c0-469.317 585.532-109.88 585.532-622.597" stroke="#9a4289"/>
          <path d="m11.19 623.059c0-442.116 556.108-125.748 556.108-621.752" stroke="#9f4b8d"/>
          <path d="m48.183 622.088c0-414.92 526.692-141.608 526.692-620.912" stroke="#a45492"/>
          <path d="m85.179 621.117c0-387.72 497.264-157.476 497.264-620.072" stroke="#a95d97"/>
        </g>
        <g class="wave-group wave-group--4">
          <path d="m196.347 624.635c0-420.264 419.864-93.652 419.864-623.076" stroke="#662084"/>
          <path d="m233.714 624.717c0-410.008 389.176-91.168 389.176-623.284" stroke="#84297b"/>
          <path d="m271.081 624.797c0-399.752 358.492-88.68 358.492-623.492" stroke="#a23273"/>
          <path d="m308.444 624.879c0-389.5 327.812-86.196 327.812-623.704" stroke="#c03b6a"/>
          <path d="m345.812 624.96c0-379.247 297.124-83.711 297.124-623.915" stroke="#de4461"/>
        </g>
        <g class="wave-group wave-group--5">
          <path d="m900.404 624.19c0-339.704-164.396-91.924-164.396-622.692" stroke="#9a3a85"/>
          <path d="m864.062 623.3c0-348.307-133.848-88.467-133.848-621.931" stroke="#a33d86"/>
          <path d="m827.722 622.41c0-356.912-103.3-85.012-103.3-621.168" stroke="#ad4087"/>
          <path d="m791.382 621.522c0-365.516-72.748-81.556-72.748-620.412" stroke="#b64288"/>
          <path d="m.37.162c374.116 0 78.1 42.204 619.648 42.204" mask="url(#a)" stroke="#c04589" transform="matrix(0 -1 -1 0 755.204 621.001)"/>
        </g>
        <g class="wave-group wave-group--6">
          <path d="m0 182.955c335.402 0 94.02-182.352 623.44-182.352" mask="url(#b)" stroke="#662084" transform="matrix(0 -1 -1 0 666.204 625.001)"/>
          <path d="m520.308 625.002c0-344.008 151.084-91.452 151.084-623.572" stroke="#702684"/>
          <path d="m557.366 625.002c0-352.608 119.82-88.888 119.82-623.696" stroke="#7b2b84"/>
          <path d="m594.425 625.002c0-361.212 88.556-86.32 88.556-623.828" stroke="#853184"/>
          <path d="m631.484 625.002c0-369.816 57.288-83.752 57.288-623.956" stroke="#903684"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import animejs from "animejs"
import { inView } from "../../util"

export default {
  data() {
    return {
      hasAnimated: false
    }
  },
  methods: {
    animate() {
      // settings
      const container = this.$refs.wavesCenterOut
      const rightGroup = '.wave-group--1 path, .wave-group--2 path, .wave-group--5 path'
      const leftGroup = '.wave-group--3 path, .wave-group--4 path, .wave-group--6 path'
      const delayAmt = 100
      const strokeOffset = [animejs.setDashoffset, 0]
      const targetWidth = 820
      
      const tl = animejs.timeline({
        easing: 'cubicBezier(.66,.3,0,.94)',
        duration: 800,
        direction: 'normal'
      })
      
      // only run this function at certain widths...
      if (window.innerWidth >= targetWidth) {

        // and only run if the element is in view, and hasn't already animated
        if ( inView(container) && !this.hasAnimated ) {
          this.hasAnimated = true

          // right line group
          tl
            .add({
              targets: container,
              opacity: 1
            })
            .add({
              targets: rightGroup,
              strokeDashoffset: strokeOffset,
              delay: (el, i) => i * delayAmt
            }, '-=800')
            .add({
              targets: leftGroup,
              strokeDashoffset: strokeOffset,
              delay: (el, i) => i * delayAmt
            }, '-=1200')
        }
      }
    }
  },
  mounted() {
    // TODO debounce this
    window.addEventListener('scroll', this.animate)
    this.animate()
  },
  destroyed() {
    window.removeEventListener('scroll', this.animate)
  }
}
</script>

<style lang="scss" scoped>
.waves--type-2 {
  opacity: 0;
}
</style>