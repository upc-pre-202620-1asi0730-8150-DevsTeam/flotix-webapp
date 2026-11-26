<script setup>
import { useI18n } from 'vue-i18n'
import { toggleLocale } from '@/internationalization/i18n.js'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import brandLockup from '@/assets/brand/auth-brand-lockup.png'
import brandMark from '@/assets/brand/auth-brand-mark.png'
import fleetHero from '@/assets/brand/auth-fleet-hero.jpg'

defineProps({ activeTab: { type: String, required: true } })
const { t, tm, locale } = useI18n()
</script>

<template>
  <div class="auth-shell">
    <aside class="brand-panel" :style="{ '--auth-hero-image': `url(${fleetHero})` }">
      <img class="brand-lockup" :src="brandLockup" alt="Flotix" />
      <div class="brand-copy">
        <span class="brand-kicker">{{ t('auth.kicker') }}</span>
        <h1>{{ t('auth.brandTitle') }}</h1>
        <p class="brand-subtitle">{{ t('auth.brandSub') }}</p>
        <ul class="brand-features">
          <li v-for="(feature, index) in tm('auth.features')" :key="feature">
            <span class="feature-chip"><AppIcon :name="['truck', 'fuel', 'wrench', 'pin'][index]" :size="16" /></span>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
      <div class="brand-footer">
        <div class="brand-stats">
          <div><b>120+</b><span>{{ tm('auth.stats')[0] }}</span></div>
          <div><b>18</b><span>{{ tm('auth.stats')[1] }}</span></div>
          <div><b>99.4%</b><span>{{ tm('auth.stats')[2] }}</span></div>
        </div>
        <p class="brand-copyright">© 2026 Flotix, UPC Developers Team</p>
      </div>
    </aside>

    <main class="auth-formside">
      <div class="auth-wrap">
        <header class="auth-top">
          <div class="mobile-brand"><img :src="brandMark" alt="" /><span>FLOTIX</span></div>
          <div class="language-toggle" role="group" aria-label="Language">
            <button type="button" :aria-pressed="locale === 'en'" @click="locale !== 'en' && toggleLocale()">EN</button>
            <button type="button" :aria-pressed="locale === 'es'" @click="locale !== 'es' && toggleLocale()">ES</button>
          </div>
        </header>

        <nav class="auth-tabs" role="tablist" :aria-label="t('auth.tabsLabel')">
          <RouterLink to="/login" role="tab" :aria-selected="activeTab === 'login'">{{ t('auth.login.tab') }}</RouterLink>
          <RouterLink to="/register" role="tab" :aria-selected="activeTab === 'register'">{{ t('auth.register.tab') }}</RouterLink>
        </nav>
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-shell {
  --auth-navy: #0b1b2b;
  --auth-primary: #0879e8;
  --auth-primary-hover: #0662bd;
  --auth-amber: #f2a93d;
  --auth-bg: #f8fafc;
  --auth-panel: #fff;
  --auth-ink: #0f172a;
  --auth-muted: #64748b;
  --auth-line: #e2e8f0;
  --auth-line-strong: #cbd5e1;
  --auth-danger-bg: #fde4e1;
  --auth-danger: #a52a1c;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  color: var(--auth-ink);
  background: var(--auth-bg);
  font-family: var(--flotix-font-body, 'Barlow', system-ui, sans-serif);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.brand-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem 3rem;
  color: #f2f6fb;
  background-image: linear-gradient(100deg, rgba(11,27,43,.97) 0%, rgba(11,27,43,.92) 35%, rgba(11,27,43,.72) 70%, rgba(11,27,43,.55) 100%), linear-gradient(0deg, rgba(11,27,43,1) 0%, rgba(11,27,43,.1) 30%, rgba(11,27,43,0) 50%), var(--auth-hero-image);
  background-size: cover;
  background-position: center 38%;
}
.brand-lockup { width: 12rem; height: auto; object-fit: contain; object-position: left center; }
.brand-copy { position: relative; z-index: 1; }
.brand-kicker { display: block; margin-bottom: .75rem; color: var(--auth-amber); font-size: .8rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.brand-panel h1 { max-width: 14ch; margin: 0; color: #fff; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: clamp(2.2rem, 3.6vw, 3.3rem); font-weight: 700; letter-spacing: -.01em; line-height: 1.05; }
.brand-subtitle { max-width: 40ch; margin: 1rem 0 0; color: #a9bacd; font-size: 1.05rem; }
.brand-features { display: grid; gap: .7rem; margin: 1.75rem 0 0; padding: 0; list-style: none; }
.brand-features li { display: flex; align-items: center; gap: .75rem; color: rgba(255,255,255,.88); font-size: .95rem; font-weight: 500; }
.feature-chip { display: grid; width: 1.9rem; height: 1.9rem; flex: 0 0 auto; place-items: center; border: 1px solid rgba(255,255,255,.14); border-radius: 6px; background: rgba(255,255,255,.1); }
.brand-footer { position: relative; z-index: 1; }
.brand-stats { display: flex; gap: 2rem; }
.brand-stats > div { flex: 1; min-width: 0; padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.14); }
.brand-stats b { display: block; color: var(--auth-amber); font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.4rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.brand-stats span { color: #a9bacd; font-size: .85rem; }
.brand-copyright { margin: 1.5rem 0 0; color: rgba(255,255,255,.4); font-size: .75rem; }
.auth-formside { display: flex; min-width: 0; flex-direction: column; justify-content: center; padding: 2rem 1.5rem; background: var(--auth-bg); }
.auth-wrap { width: 100%; max-width: 25rem; margin: 0 auto; }
.auth-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.25rem; }
.mobile-brand { display: none; align-items: center; gap: .5rem; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-weight: 700; letter-spacing: .04em; }
.mobile-brand img { width: auto; height: 1.7rem; }
.language-toggle { display: inline-flex; margin-left: auto; padding: 2px; border: 1px solid var(--auth-line-strong); border-radius: 999px; }
.language-toggle button { min-height: 24px; padding: .2rem .55rem; border: 0; border-radius: 999px; background: none; color: var(--auth-ink); font: inherit; font-size: .7rem; font-weight: 700; cursor: pointer; }
.language-toggle button[aria-pressed="true"] { background: #0a2a49; color: #fff; }
.auth-tabs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; margin-bottom: 1.5rem; padding: 3px; border: 1px solid var(--auth-line); border-radius: 10px; background: #fff; }
.auth-tabs a { display: flex; min-height: 40px; align-items: center; justify-content: center; padding: .55rem .25rem; border-radius: 6px; color: var(--auth-muted); font-size: .875rem; font-weight: 600; text-decoration: none; transition: background-color .15s ease, color .15s ease; }
.auth-tabs a:hover { color: var(--auth-ink); }
.auth-tabs a[aria-selected="true"] { background: #eef6ff; color: var(--auth-primary); }
:deep(button:focus-visible), :deep(a:focus-visible), :deep(input:focus-visible), :deep(summary:focus-visible) { outline: 2px solid var(--auth-amber); outline-offset: 2px; }
@media (prefers-color-scheme: dark) {
  .auth-shell {
    --auth-bg: #0b1b2b; --auth-panel: #10263c; --auth-ink: #f2f6fb; --auth-muted: #a9bacd;
    --auth-line: #1d3550; --auth-line-strong: #2c4766; --auth-primary-tint: #12304d;
    --auth-danger-bg: #3a1a18; --auth-danger: #ffb4aa;
  }
  .language-toggle button[aria-pressed="true"] { background: #0a2a49; }
  .auth-tabs { background: var(--auth-panel); border-color: var(--auth-line); }
  .auth-tabs a[aria-selected="true"] { background: var(--auth-primary-tint); color: #8ec5fd; }
}
@media (max-width: 900px) {
  .auth-shell { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
  .auth-formside { min-height: 100vh; justify-content: flex-start; padding: 1.25rem 1.25rem 2rem; }
  .auth-top { margin-bottom: 1.75rem; }
  .mobile-brand { display: flex; }
}
@media (prefers-reduced-motion: reduce) { .auth-shell * { transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
