import BlogIntroSection from '@/components/pages/mainPage/BlogIntroSection'
import HeroSection from '@/components/pages/mainPage/HeroSection'
import MenuIntroSection from '@/components/pages/mainPage/MenuIntroSection'

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">박성윤 개발 블로그</h1>
      <HeroSection />
      <BlogIntroSection />
      <MenuIntroSection />
    </main>
  )
}
