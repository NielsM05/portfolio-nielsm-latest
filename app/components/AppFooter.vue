<template>
  <footer>
    <span>NIELS MAES — CYBERSECURITY SPECIALIST</span>
    <span>© {{ new Date().getFullYear() }} — BRUGGE, BELGIË</span>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--border);
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--border);
}
</style>
