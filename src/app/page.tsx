import BlogIntroSection from '@/components/pages/mainPage/BlogIntroSection'
import HeroSection from '@/components/pages/mainPage/HeroSection'
import MenuIntroSection from '@/components/pages/mainPage/MenuIntroSection'
import ProjectIntroSection from '@/components/pages/mainPage/ProjectIntroSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BlogIntroSection />
      <MenuIntroSection />
      <ProjectIntroSection />
    </main>
  )
}
