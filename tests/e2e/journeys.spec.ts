import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const storageKey = 'plottwist.session.v1.pilot';
test('home exposes three episodes, responsive layout, and accessible controls', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Your life/ })).toBeVisible();
  await expect(page.locator('.episode-card')).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
for (const pack of ['pilot', 'office', 'friends'])
  test(`${pack}: complete, explain, revise, and share`, async ({ page }) => {
    await page.goto(`/play?pack=${pack}`);
    await expect(
      page.getByRole('button', { name: 'Next scene' }),
    ).toBeDisabled();
    for (let i = 0; i < 12; i++) {
      await expect(
        page.getByText(`SCENE ${String(i + 1).padStart(2, '0')}`, {
          exact: true,
        }),
      ).toBeVisible();
      await page
        .getByRole('radio')
        .nth(i % 4)
        .check();
      await page
        .getByRole('button', {
          name: i === 11 ? 'Reveal my character' : 'Next scene',
        })
        .click();
    }
    await expect(page).toHaveURL(/\/result\?r=v1\./);
    await expect(page.locator('.result-poster h2')).toBeVisible();
    await expect(page.locator('.trait-card')).toHaveCount(4);
    await page.getByText('Show my 12 choices', { exact: false }).click();
    await expect(page.locator('.answer-receipts li')).toHaveCount(12);
    const url = page.url();
    await page.getByRole('link', { name: 'Revisit my answers' }).click();
    await expect(page.getByText('SCENE 12', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Previous', exact: true }).click();
    await expect(page.getByText('SCENE 11', { exact: true })).toBeVisible();
    await page.goto(url);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test('resume survives reload and revising a previous answer preserves future answers', async ({
  page,
}) => {
  await page.goto('/play?pack=pilot');
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Next scene' }).click();
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: 'Next scene' }).click();
  await page.reload();
  await expect(page.getByText('SCENE 03', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await page.getByRole('radio').nth(3).check();
  await page.getByRole('button', { name: 'Next scene' }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
});
test('clear-data in another tab resets an open quiz without resurrecting answers', async ({
  page,
  context,
}) => {
  await page.goto('/play?pack=pilot');
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Next scene' }).click();
  const other = await context.newPage();
  await other.goto('/about');
  await other.getByRole('button', { name: 'Clear my saved episodes' }).click();
  await expect(page.getByText('SCENE 01', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next scene' })).toBeDisabled();
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key) || '{"answers":[]}').answers
            .length,
        storageKey,
      ),
    )
    .toBe(0);
  await other.close();
});
test('corrupt storage and malformed URLs fail gracefully', async ({ page }) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, '{"version":1,"answers":[null]}'),
    storageKey,
  );
  await page.goto('/play?pack=pilot');
  await expect(page.getByText('SCENE 01', { exact: true })).toBeVisible();
  await page.goto('/result?r=v1.pilot.NaN_1_1_1');
  await expect(
    page.getByRole('heading', { name: 'This result wandered off.' }),
  ).toBeVisible();
  await page.goto('/play?pack=missing');
  await expect(
    page.getByRole('heading', { name: 'That plot went missing.' }),
  ).toBeVisible();
});
test('shared result works without local data and downloads a real PNG', async ({
  page,
}) => {
  await page.goto('/result?r=v1.pilot.5_-3_1_-5');
  await expect(
    page.getByRole('heading', { name: 'The Group Chat Parent', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.answer-receipts')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save card' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('plottwist-the-group-chat-parent.png');
  await expect(page.getByRole('status')).toContainText('downloaded');
});
test('cast search, character detail, chemistry selection and randomizer work', async ({
  page,
}) => {
  await page.goto('/cast');
  await expect(page.locator('.cast-card')).toHaveCount(16);
  await page
    .getByRole('textbox', { name: 'Search characters' })
    .fill('spreadsheet');
  await expect(page.locator('.cast-card')).toHaveCount(1);
  await page.locator('.cast-card').click();
  await expect(
    page.getByRole('heading', { name: 'The Spreadsheet Sage', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Find their co-star' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Character one' }),
  ).toContainText('The Spreadsheet Sage');
  await page.getByRole('combobox', { name: 'Character two' }).click();
  await page
    .getByRole('option', { name: 'The Lovable Menace', exact: true })
    .click();
  await expect(page.locator('.chemistry-verdict h2')).toContainText(
    'opposites',
  );
  await page.getByRole('button', { name: 'Surprise me' }).click();
  await expect(page.getByRole('status')).toContainText('new double act');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test('quiz supports keyboard selection and accessible scene controls', async ({
  page,
}) => {
  await page.goto('/play?pack=pilot');
  const radio = page.getByRole('radio').first();
  await radio.focus();
  await page.keyboard.press('Space');
  await expect(radio).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test('result, cast, and chemistry meet automated accessibility checks', async ({
  page,
}) => {
  for (const path of [
    '/result?r=v1.pilot.5_-3_1_-5',
    '/cast',
    '/chemistry?a=0110&b=1001',
  ]) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const report = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      report.violations,
      `${path}: ${JSON.stringify(report.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});
test('unknown characters and missing pages return intentional error screens', async ({
  page,
}) => {
  const character = await page.goto('/cast/9999');
  expect(character?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'This wasn’t in the script.' }),
  ).toBeVisible();
  const missing = await page.goto('/missing-episode');
  expect(missing?.status()).toBe(404);
});
test('playing sends no answer payload to the scoring API', async ({ page }) => {
  const calls: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') calls.push(r.url());
  });
  await page.goto('/play?pack=pilot');
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Next scene' }).click();
  expect(calls).toEqual([]);
});

test('all sixteen cast portraits load and character fiction follows the selected identity', async ({
  page,
}) => {
  await page.goto('/cast');
  const portraits = page.locator('.cast-card img.character-art');
  await expect(portraits).toHaveCount(16);
  const sources = new Set<string>();
  for (const portrait of await portraits.all()) {
    await portrait.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        portrait.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    sources.add((await portrait.getAttribute('src'))!);
  }
  expect(sources.size).toBe(16);
  await page.goto('/cast/0101');
  await expect(page.locator('.character-cold-open')).toContainText(
    'who invented the fork',
  );
  await expect(page.locator('.result-poster img')).toHaveAttribute(
    'src',
    '/characters/0101.webp',
  );
});

test('answer reactions and three-act progression follow actual selections', async ({
  page,
}) => {
  await page.goto('/play?pack=pilot');
  await page.getByRole('radio').first().check();
  await expect(page.locator('.director-reaction')).toContainText(
    'notification takes a personal day',
  );
  await page.getByRole('radio').nth(1).check();
  await expect(page.locator('.director-reaction')).toContainText(
    'exclusive comedy tour',
  );
  for (let i = 0; i < 4; i++) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: 'Next scene' }).click();
  }
  await expect(page.locator('.scene-heading .eyebrow')).toContainText('ACT 2');
});

test('shared results offer play rather than claiming saved answers, with navigation available', async ({
  page,
}) => {
  await page.goto('/result?r=v1.pilot.5_-3_1_-5');
  await expect(
    page.getByRole('link', { name: 'Play this episode', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Revisit my answers', exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'The cast', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'The cast', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Search characters' })
    .fill('biscuit');
  await expect(page.locator('.cast-card')).toHaveCount(1);
  await expect(page.locator('.cast-card')).toContainText('The Cozy Enigma');
});
