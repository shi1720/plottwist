import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
const storageKey = 'plottwist.session.v1.pilot';
test('home exposes three episodes, responsive layout, and accessible controls', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Who are you/ }),
  ).toBeVisible();
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
      page.getByRole('button', { name: 'Next question' }),
    ).toBeDisabled();
    for (let i = 0; i < 12; i++) {
      await expect(
        page.getByText(`Question ${i + 1} of 12`, {
          exact: true,
        }),
      ).toBeVisible();
      await page
        .getByRole('radio')
        .nth(i % 4)
        .check();
      await page
        .getByRole('button', {
          name: i === 11 ? 'See my character' : 'Next question',
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
    await expect(
      page.getByText('Question 12 of 12', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Previous', exact: true }).click();
    await expect(
      page.getByText('Question 11 of 12', { exact: true }),
    ).toBeVisible();
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
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.reload();
  await expect(
    page.getByText('Question 3 of 12', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await page.getByRole('radio').nth(3).check();
  await page.getByRole('button', { name: 'Next question' }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
});
test('clear-data in another tab resets an open quiz without resurrecting answers', async ({
  page,
  context,
}) => {
  await page.goto('/play?pack=pilot');
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Next question' }).click();
  const other = await context.newPage();
  await other.goto('/about');
  await other.getByRole('button', { name: 'Clear my saved episodes' }).click();
  await expect(
    page.getByText('Question 1 of 12', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Next question' }),
  ).toBeDisabled();
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
  await expect(
    page.getByText('Question 1 of 12', { exact: true }),
  ).toBeVisible();
  await page.goto('/result?r=v1.pilot.NaN_1_1_1');
  await expect(
    page.getByRole('heading', { name: 'This result link is not valid.' }),
  ).toBeVisible();
  await page.goto('/play?pack=missing');
  await expect(
    page.getByRole('heading', { name: 'This quiz could not be found.' }),
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
  await page.getByRole('button', { name: 'Download card' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('plottwist-the-group-chat-parent.png');
  const bytes = await readFile((await file.path())!);
  expect(Array.from(bytes.subarray(0, 8))).toEqual([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  const header = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  expect(header.getUint32(16)).toBe(1080);
  expect(header.getUint32(20)).toBe(1350);
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
  await expect(page.getByRole('status')).toContainText(
    'new characters selected',
  );
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

test('result, cast, chemistry, and privacy meet automated accessibility checks', async ({
  page,
}) => {
  for (const path of [
    '/result?r=v1.pilot.5_-3_1_-5',
    '/cast',
    '/chemistry?a=0110&b=1001',
    '/about',
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
    page.getByRole('heading', { name: 'Page not found.' }),
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
  await page.getByRole('button', { name: 'Next question' }).click();
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
    await page.getByRole('button', { name: 'Next question' }).click();
  }
  await expect(page.locator('.progress-label')).toContainText(
    'With other people',
  );
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
      .getByRole('link', { name: 'Characters', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Characters', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Search characters' })
    .fill('biscuit');
  await expect(page.locator('.cast-card')).toHaveCount(1);
  await expect(page.locator('.cast-card')).toContainText('The Cozy Enigma');
});

test('copied links never inherit saved answers, including a coarse-token collision', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/play?pack=pilot');
  for (let i = 0; i < 12; i++) {
    await page.getByRole('radio').first().check();
    await page
      .getByRole('button', {
        name: i === 11 ? 'See my character' : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(page.locator('.answer-receipts')).toHaveCount(1);
  expect(new URL(page.url()).hash).toMatch(/^#local=/);
  await page
    .getByRole('button', { name: 'Copy result link', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText('Result link copied');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(copied).hash).toBe('');
  // Both the all-first-choice fixture and one changed first answer yield this
  // coarse token; the unit regression proves that collision independently.
  expect(new URL(copied).searchParams.get('r')).toBe('v1.pilot.-5_-3_3_5');
  await page.goto(copied);
  await expect(page.locator('.result-poster h2')).toBeVisible();
  await expect(page.locator('.answer-receipts')).toHaveCount(0);
  await expect(page.locator('.choice-callback')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Play this episode', exact: true }),
  ).toBeVisible();
});

test('clearing saved data also removes receipts from an already open result', async ({
  page,
  context,
}) => {
  await page.goto('/play?pack=pilot');
  for (let i = 0; i < 12; i++) {
    await page.getByRole('radio').first().check();
    await page
      .getByRole('button', {
        name: i === 11 ? 'See my character' : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(page.locator('.answer-receipts')).toHaveCount(1);
  const localContext = await page.evaluate(() =>
    JSON.parse(
      sessionStorage.getItem('plottwist.result-context.v1.pilot') ?? '{}',
    ),
  );
  expect(Object.keys(localContext).sort()).toEqual([
    'nonce',
    'revision',
    'token',
  ]);
  expect(localContext.revision).toMatch(/^[a-f0-9-]{36}$/);
  const other = await context.newPage();
  await other.goto('/about');
  await other.getByRole('button', { name: 'Clear my saved episodes' }).click();
  await expect(other.getByRole('status')).toContainText(
    'All saved episodes have been cleared',
  );
  await expect(page.locator('.answer-receipts')).toHaveCount(0);
  await expect(page.locator('.choice-callback')).toHaveCount(0);
  await other.close();
});

test('a revised answer in another tab cannot replace receipts on an older local result', async ({
  page,
  context,
}) => {
  await page.goto('/play?pack=pilot');
  for (let i = 0; i < 12; i++) {
    await page.getByRole('radio').first().check();
    await page
      .getByRole('button', {
        name: i === 11 ? 'See my character' : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(page.locator('.answer-receipts')).toHaveCount(1);
  const other = await context.newPage();
  await other.goto('/play?pack=pilot');
  // Change a real answer through the quiz. The resulting public token collides.
  for (let i = 0; i < 11; i++)
    await other.getByRole('button', { name: 'Previous', exact: true }).click();
  await other.getByRole('radio').nth(1).check();
  await expect(page.locator('.answer-receipts')).toHaveCount(0);
  await expect(page.locator('.choice-callback')).toHaveCount(0);
  await expect(page.locator('.result-intro')).toContainText('Shared result');
  await other.close();
});
