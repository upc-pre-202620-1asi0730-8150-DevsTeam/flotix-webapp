<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  kind: { type: String, required: true, validator: (value) => ['terms', 'privacy'].includes(value) }
})
const emit = defineEmits(['update:modelValue'])
const { t, tm, rt } = useI18n()
const sections = computed(() => tm(`auth.legal.${props.kind}.sections`))

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="legal-modal" role="presentation" @click.self="close" @keydown.esc="close">
    <section class="legal-sheet" role="dialog" aria-modal="true" :aria-labelledby="`legal-${kind}-title`" tabindex="-1">
      <header class="legal-header">
        <div>
          <h2 :id="`legal-${kind}-title`">{{ t(`auth.legal.${kind}.title`) }}</h2>
          <p>{{ t(`auth.legal.${kind}.lede`) }}</p>
        </div>
        <button class="legal-icon-button" type="button" :aria-label="t('auth.legal.close')" @click="close"><i class="pi pi-times" aria-hidden="true" /></button>
      </header>
      <div class="legal-sections">
        <section v-for="section in sections" :key="section.title">
          <h3>{{ rt(section.title) }}</h3>
          <p>{{ rt(section.body) }}</p>
        </section>
      </div>
      <footer class="legal-footer">
        <button type="button" @click="close">{{ t('auth.legal.close') }}</button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.legal-modal { position: fixed; z-index: 1100; inset: 0; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(11,27,43,.62); }
.legal-sheet { display: flex; width: min(100%, 44rem); max-height: min(84vh, 52rem); flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; color: #0f172a; box-shadow: 0 18px 60px rgba(11,27,43,.25); }
.legal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.25rem; padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid #e2e8f0; }
.legal-header h2 { margin: 0; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.65rem; line-height: 1.15; }
.legal-header p { margin: .5rem 0 0; color: #64748b; font-size: .95rem; }
.legal-icon-button { display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; border: 0; border-radius: 6px; background: transparent; color: #64748b; cursor: pointer; }
.legal-icon-button:hover { background: #f1f5f9; color: #0f172a; }
.legal-sections { overflow-y: auto; padding: .25rem 1.5rem 1rem; }
.legal-sections h3 { margin: 1rem 0 .35rem; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.1rem; font-weight: 600; }
.legal-sections p { margin: 0; color: #475569; font-size: .925rem; line-height: 1.6; }
.legal-footer { display: flex; justify-content: flex-end; padding: .85rem 1.5rem; border-top: 1px solid #e2e8f0; }
.legal-footer button { min-height: 2.5rem; padding: .5rem 1rem; border: 0; border-radius: 6px; background: #0879e8; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
.legal-footer button:hover { background: #0662bd; }
@media (max-width: 560px) {
  .legal-modal { align-items: flex-end; padding: 0; }
  .legal-sheet { width: 100%; max-height: 90vh; border-radius: 14px 14px 0 0; }
  .legal-header { padding: 1.25rem 1.1rem .9rem; }
  .legal-sections { padding: .2rem 1.1rem 1rem; }
  .legal-footer { padding: .75rem 1.1rem calc(.75rem + env(safe-area-inset-bottom, 0px)); }
}
</style>
