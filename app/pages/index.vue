<script setup lang="ts">
const { t } = useLocale()
useReveal()
</script>

<template>
  <div>
    <AppNav />
    <HeroSection />
    <ChapterDivider num="01" :title="t.chapters[0]" />
    <AboutSection />
    <ChapterDivider num="02" :title="t.chapters[1]" />
    <ProjectsSection />
    <ChapterDivider num="03" :title="t.chapters[2]" />
    <SkillsSection />
    <ChapterDivider num="04" :title="t.chapters[3]" />
    <BlogSection />
    <ChapterDivider num="05" :title="t.chapters[4]" />
    <ContactSection />
    <AppFooter />
  </div>
</template>
