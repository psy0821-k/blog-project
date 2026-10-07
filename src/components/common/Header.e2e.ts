import { expect, test } from '@playwright/test'

test.describe('Header', () => {
  test('데스크톱 화면에서는 전역 내비게이션이 보이고 모바일 메뉴 버튼은 숨겨진다', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 })
    await page.goto('/')

    const nav = page.locator('header nav')

    await expect(nav.getByRole('link', { name: '프로젝트', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '실험실', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '개발로그', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '소개', exact: true })).toBeVisible()
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

    const nav = page.locator('header nav')
    await expect(nav).toBeInViewport()
    await expect(nav.getByRole('link', { name: '소개', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '프로젝트', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '실험실', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '개발로그', exact: true })).toBeVisible()

    await nav.getByRole('button', { name: '메뉴 닫기' }).click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    // 닫힌 메뉴는 화면 밖(translate-x-full)으로 이동한다
    await expect(nav).not.toBeInViewport()
  })

  test('오프캔버스 메뉴의 링크를 클릭하면 해당 페이지로 이동한다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    await page.getByRole('button', { name: '메뉴 열기' }).click()
    await page.locator('header nav').getByRole('link', { name: '프로젝트', exact: true }).click()

    await expect(page).toHaveURL('/projects')
  })

  test('메뉴가 열린 상태에서 화면을 데스크톱 크기로 키우면 오프캔버스 메뉴가 자동으로 닫힌다', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: '메뉴 열기' })
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await page.setViewportSize({ width: 1024, height: 800 })

    // 데스크톱에서는 메뉴 버튼이 숨겨지므로 숨김 요소까지 포함해 상태를 확인한다
    await expect(
      page.getByRole('button', { name: '메뉴 열기', includeHidden: true }),
    ).toHaveAttribute('aria-expanded', 'false')
  })
})
