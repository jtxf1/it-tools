<script setup lang="ts">
import { useTheme } from './c-modal.theme'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{ open?: boolean, centered?: boolean, overlay?: boolean }>(), {
  open: false,
  centered: true,
  overlay: true,
})

const emit = defineEmits(['update:open'])

const isOpen = useVModel(props, 'open', emit, { passive: true })

const { centered, overlay } = toRefs(props)

function close() {
  isOpen.value = false
}

function open() {
  isOpen.value = true
}

function toggle() {
  isOpen.value = !isOpen.value
}

defineExpose({
  close,
  open,
  toggle,
  isOpen,
})

const theme = useTheme()
const modal = ref()

onClickOutside(modal, () => {
  if (isOpen.value) {
    close()
  }
})
</script>

<template>
  <transition>
    <div v-if="isOpen" fixed left-0 top-0 z-10 h-full w-full flex justify-center px-2 :class="{ 'items-center': centered, 'c-modal--overlay': overlay, 'c-modal--overlay-transparent': !overlay }">
      <div ref="modal" :class="{ 'c-modal--container': overlay, 'c-modal--overlay-transparent': !overlay }" v-bind="$attrs" max-w-xl w-full flex-grow rounded-md pa-24px>
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.c-modal--overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
.c-modal--overlay-transparent {
  background-color: transparent;
}

.c-modal--container {
  background-color: v-bind('theme.background');
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
