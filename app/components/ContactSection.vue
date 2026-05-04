<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: '',
})

function handleSubmit() {
  // Form submission logic here
  console.log('Form submitted:', form)
}
</script>

<template>
  <section id="contact">
    <div class="contact-big reveal">
      Klaar om<br>samen te <em>werken?</em>
    </div>

    <div class="contact-split">
      <div class="contact-info reveal">
        <p>
          Of je nu een pentest nodig hebt, advies zoekt over je security-architectuur,
          of gewoon een vraag hebt — ik reageer binnen 24 uur.
        </p>
        <p>Gebaseerd in Brugge, beschikbaar remote en on-site.</p>
        <a href="mailto:niels@example.com" class="contact-mail">niels@example.com</a>
      </div>

      <div class="reveal">
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <label for="contact-name">Naam</label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              placeholder="Jouw naam"
            />
          </div>
          <div class="form-row">
            <label for="contact-email">Email</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              placeholder="jouw@email.com"
            />
          </div>
          <div class="form-row">
            <label for="contact-message">Bericht</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              placeholder="Vertel me hoe ik kan helpen..."
            />
          </div>
          <button type="submit" class="form-btn">Verstuur bericht →</button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
#contact {
  padding: 8rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-big {
  font-family: var(--display);
  font-size: clamp(3rem, 7vw, 7rem);
  color: var(--white);
  font-weight: 900;
  line-height: 0.9;
  margin-bottom: 4rem;
}

.contact-big em {
  color: var(--accent);
  font-style: italic;
}

.contact-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
}

.contact-info p {
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.contact-mail {
  font-family: var(--display);
  font-size: 1.4rem;
  color: var(--white);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 0.3rem;
  transition: color 0.2s;
}

.contact-mail:hover {
  color: var(--accent);
}

.form-row {
  margin-bottom: 1px;
}

.form-row label {
  display: block;
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.form-row input,
.form-row textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  outline: none;
  font-family: var(--body);
  font-size: 0.9rem;
  color: var(--white);
  padding: 1rem 1.2rem;
  resize: none;
  transition: border-color 0.2s;
  margin-bottom: 1rem;
}

.form-row input:focus,
.form-row textarea:focus {
  border-color: var(--accent);
}

.form-row textarea {
  min-height: 120px;
}

.form-btn {
  width: 100%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--white);
  padding: 1.2rem;
  transition: opacity 0.2s;
}

.form-btn:hover {
  opacity: 0.85;
}
</style>
