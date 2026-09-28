import { expect, test } from '@playwright/test'

test.describe('Header', () => {
  test('데스크톱 화면에서는 전역 내비게이션이 보이고 모바일 메뉴 버튼은 숨겨진다', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 })
    await page.goto('/')

    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Lab' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'DevLog' })).toBeVisible()
    await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeHidden()
  })

  test('모바일 화면에서 메뉴 버튼을 누르면 오프캔버스 메뉴가 열리고 닫기 버튼으로 닫힌다', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: '메뉴 열기' })
    await expect(menuButton).toBeVisible()

    await menuButton.click()

    const nav = page.locator('#mobile-nav')
    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '프로젝트 이동하기' })).toBeVisible()

    await nav.getByRole('button').click()
    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeHidden()
  })
})
