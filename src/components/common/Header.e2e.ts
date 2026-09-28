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
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    const nav = page.locator('#mobile-nav')
    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '프로젝트 이동하기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '실험실 이동하기' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '개발로그 이동하기' })).toBeVisible()

    await nav.getByRole('button').click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeHidden()
  })

  test('오프캔버스 메뉴의 링크를 클릭하면 해당 페이지로 이동한다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    await page.getByRole('button', { name: '메뉴 열기' }).click()
    await page.locator('#mobile-nav').getByRole('link', { name: '프로젝트 이동하기' }).click()

    await expect(page).toHaveURL('/projects')
  })

  test('메뉴가 열린 상태에서 화면을 데스크톱 크기로 키우면 오프캔버스 메뉴가 자동으로 닫힌다', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    await page.getByRole('button', { name: '메뉴 열기' }).click()

    const nav = page.locator('#mobile-nav')
    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeVisible()

    await page.setViewportSize({ width: 1024, height: 800 })

    await expect(nav.getByRole('link', { name: '홈 이동하기' })).toBeHidden()
  })
})
