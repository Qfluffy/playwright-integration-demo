import { test, expect, BrowserContext, Page } from '@playwright/test';

// =====================================================
// ข้อ 2: DRIVER สำหรับเปิดหน้า card.html
// ทำหน้าที่ตั้งค่า Cookie (Authentication State)
// แล้วสั่ง Navigate ไปที่หน้า card.html
// =====================================================
async function driverOpenCard(context: BrowserContext): Promise<Page> {
  // Inject Cookie เพื่อให้จำลองสถานะ Login เรียบร้อย
  await context.addCookies([
    {
      name: 'Anantaya Aunjai',
      value: '6804101396',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  // เปิดไปยัง URL card.html
  await page.goto('https://www.saucedemo.com/card.html');
  return page;
}

test('Integration Test: Driver call card.html and verify Student Name in Stub', async ({ browser }) => {
  const context = await browser.newContext();

  try {
    // -------------------------------------------------
    // 1. เรียกใช้ Driver เพื่อเปิดหน้า card.html
    // -------------------------------------------------
    const page = await driverOpenCard(context);

    // -------------------------------------------------
    // ข้อ 1: สร้าง STUB สำหรับ card.html
    // แทนที่ DOM ของหน้าด้วย HTML ปลอมที่มีชื่อ-นามสกุลของคุณ
    // -------------------------------------------------
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Card Stub Page</title>
        </head>
        <body>
          <h1>Card Inventory Stub</h1>
          <div class="user-profile" data-test="student-name">
            Anantaya Aunjai
          </div>
        </body>
      </html>
    `);

    // -------------------------------------------------
    // ข้อ 1 (ต่อ): เขียนการทดสอบ (Assert)
    // ตรวจสอบว่ามีชื่อ-นามสกุลปรากฏในหน้าเว็บหรือไม่
    // -------------------------------------------------
    const nameLocator = page.locator('[data-test="student-name"]');
    
    // ตรวจสอบว่า element มองเห็นได้
    await expect(nameLocator).toBeVisible();

    // ตรวจสอบว่ามีชื่อและนามสกุลของคุณตรงตามที่กำหนด
    await expect(nameLocator).toContainText('Anantaya Aunjai');

  } finally {
    await context.close();
  }
});

