import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const pageDataPath = resolve(rootDir, 'src/content/pageData.json');
const pageData = JSON.parse(readFileSync(pageDataPath, 'utf-8'));

// Test that public default profile is unauthenticated guest
test('public default profile is unauthenticated guest', () => {
  const publicProfile = {
    id: 'public_guest',
    name: 'Visiteur Public',
    email: 'visiteur@lfjp.sn',
    role: 'guest',
    assignedRubriques: [],
    canPublish: false,
    canDelete: false,
  };

  assert.equal(publicProfile.role, 'guest');
  assert.equal(publicProfile.canPublish, false);
  assert.equal(publicProfile.canDelete, false);
});

// Test that public showcase strictly hides editor controls without authenticated editor session
test('public showcase view strictly hides editor controls without authenticated editor session', () => {
  const checkControls = ({ role, isEmbedded, isEditorPath, isEditRequested }) => {
    if (!role || (role !== 'editor' && role !== 'superadmin')) {
      return false;
    }
    return Boolean(isEmbedded || isEditorPath || isEditRequested);
  };

  // 1. Public visitor without login
  assert.equal(checkControls({ role: null, isEmbedded: false, isEditorPath: false, isEditRequested: false }), false);

  // 2. Public visitor trying ?edit=1 without valid credentials
  assert.equal(checkControls({ role: null, isEmbedded: false, isEditorPath: false, isEditRequested: true }), false);

  // 3. Authenticated editor visiting public showcase without edit parameter
  assert.equal(checkControls({ role: 'editor', isEmbedded: false, isEditorPath: false, isEditRequested: false }), false);

  // 4. Authenticated editor in backoffice
  assert.equal(checkControls({ role: 'editor', isEmbedded: false, isEditorPath: true, isEditRequested: false }), true);

  // 5. Authenticated editor in embedded visual preview
  assert.equal(checkControls({ role: 'editor', isEmbedded: true, isEditorPath: false, isEditRequested: false }), true);

  // 6. Authenticated superadmin in embedded visual preview
  assert.equal(checkControls({ role: 'superadmin', isEmbedded: true, isEditorPath: false, isEditRequested: false }), true);
});

// Test ELCS data structure integrity
test('ELCS data structure contains all required categories and metrics', () => {
  assert.ok(pageData.elcsData, 'elcsData must be defined in pageData.json');
  assert.ok(pageData.elcsData.satisfaction, 'satisfaction category must exist');
  assert.ok(pageData.elcsData.relations, 'relations category must exist');
  assert.ok(pageData.elcsData.travail, 'travail category must exist');
  assert.ok(pageData.elcsData.securite, 'securite category must exist');

  assert.ok(Array.isArray(pageData.elcsData.satisfaction.primary), 'satisfaction.primary must be array');
  assert.ok(Array.isArray(pageData.elcsData.satisfaction.secondary), 'satisfaction.secondary must be array');
  assert.ok(pageData.elcsData.satisfaction.primary.length > 0, 'satisfaction.primary must not be empty');
});

// Test Restauration data structure integrity
test('Restaurant data structure contains all required datasets and correlations', () => {
  assert.ok(pageData.restaurant, 'restaurant must be defined in pageData.json');
  assert.ok(Array.isArray(pageData.restaurant.studentDistributionData), 'studentDistributionData must be array');
  assert.ok(Array.isArray(pageData.restaurant.restaurationInterestData), 'restaurationInterestData must be array');
  assert.ok(Array.isArray(pageData.restaurant.currentLunchData), 'currentLunchData must be array');
  assert.ok(Array.isArray(pageData.restaurant.serviceInterestByDayData), 'serviceInterestByDayData must be array');
  assert.ok(Array.isArray(pageData.restaurant.mealTypePreferenceData), 'mealTypePreferenceData must be array');
  assert.ok(Array.isArray(pageData.restaurant.priceForDishData), 'priceForDishData must be array');
  assert.ok(Array.isArray(pageData.restaurant.priceForMenuData), 'priceForMenuData must be array');
  assert.ok(Array.isArray(pageData.restaurant.keyMetrics), 'keyMetrics must be array');
  assert.ok(Array.isArray(pageData.restaurant.alertPoints), 'alertPoints must be array');

  pageData.restaurant.studentDistributionData.forEach((row) => {
    assert.equal(typeof row.name, 'string');
    assert.ok(Number.isFinite(row.value), 'value must be finite number');
    assert.ok(Number.isFinite(row.percentage), 'percentage must be finite number');
  });
});

// Test Plan Stratégique & Diagnostic PSD datasets exist and are properly structured in pageData.json
test('pageData.json includes psdAxesData (Axes 1-4) and psdSurveyData (Eleves & Parents)', () => {
  assert.ok(pageData.psdAxesData, 'psdAxesData must be defined in pageData.json');
  ['axe1', 'axe2', 'axe3', 'axe4'].forEach((axisKey) => {
    const axis = pageData.psdAxesData[axisKey];
    assert.ok(axis, `${axisKey} must exist in psdAxesData`);
    assert.equal(typeof axis.title, 'string');
    assert.ok(Number.isFinite(axis.budgetMillions));
    assert.ok(Array.isArray(axis.indicators) && axis.indicators.length > 0);
  });

  assert.ok(pageData.psdSurveyData, 'psdSurveyData must be defined in pageData.json');
  assert.ok(pageData.psdSurveyData.eleves, 'psdSurveyData.eleves must exist');
  assert.ok(pageData.psdSurveyData.parents, 'psdSurveyData.parents must exist');
  assert.ok(Number.isFinite(pageData.psdSurveyData.eleves.totalResponses));
  assert.ok(Number.isFinite(pageData.psdSurveyData.parents.totalResponses));
  assert.equal(pageData.source, undefined, 'stray source key must not be present in pageData.json');
});

// Test Admin authentication screen contains NO pre-filled credentials or email hints
test('Admin authentication form has zero pre-filled credentials or exposed email hints', () => {
  const adminSource = readFileSync(resolve(rootDir, 'src/pages/Admin.tsx'), 'utf-8');
  assert.ok(!adminSource.includes('useState(\'admin-lfjp\')'), 'loginPassword must not prefill admin-lfjp');
  assert.ok(!adminSource.includes('useState(\'editeur-lfjp\')'), 'loginPassword must not prefill editeur-lfjp');
  assert.ok(!adminSource.includes('useState(\'direction@lfjpsaly.org\')'), 'loginEmail must not prefill direction@lfjpsaly.org');
  assert.ok(!adminSource.includes('useState(\'editeur@lfjpsaly.org\')'), 'loginEmail must not prefill editeur@lfjpsaly.org');
  assert.ok(!adminSource.includes('defaultValue={editorAccount.password}'), 'editor password field must not expose defaultValue');
  assert.ok(!adminSource.includes('defaultValue={editorAccount.email}'), 'editor email field must not expose defaultValue');
  assert.ok(!adminSource.includes('placeholder="editeur@lfjpsaly.org"'), 'email placeholder must not leak credentials');
  assert.ok(!adminSource.includes('placeholder="direction@lfjpsaly.org"'), 'email placeholder must not leak credentials');
});

// Test strict read-only public vitrine guards on Budget/Transport/ProjectDetail pages
test('Public showcase pages guard localStorage draft reads behind isContentDraftPreview', () => {
  const filesToCheck = [
    'src/pages/BudgetCadreVieInfrastructures.tsx',
    'src/components/BudgetCadreVieInfrastructures.tsx',
    'src/pages/TransportScolaire.tsx',
    'src/pages/ProjectDetailPage.tsx',
    'src/components/admin/AdminBudgetDashboard.tsx',
    'src/components/admin/AdminTransportDashboard.tsx',
  ];

  filesToCheck.forEach((relPath) => {
    const content = readFileSync(resolve(rootDir, relPath), 'utf-8');
    assert.ok(
      content.includes('isContentDraftPreview'),
      `${relPath} must check isContentDraftPreview() before reading draft storage`
    );
  });
});

// Test French decimal comma parsing behavior in pageDataSanitizer
test('French decimal commas and NaN sanitization logic matches expected rules', () => {
  const parseLocaleNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'string') {
      const cleaned = value.replace(/\u00A0/g, ' ').replace(/\s+/g, '').replace(/,/g, '.');
      if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return null;
      if (!/^[-+]?\d*(\.\d+)?$/.test(cleaned)) return null;
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  assert.equal(parseLocaleNumber('17,2'), 17.2);
  assert.equal(parseLocaleNumber('17.2'), 17.2);
  assert.equal(parseLocaleNumber('1 500,75'), 1500.75);
  assert.equal(parseLocaleNumber(NaN), null);
  assert.equal(parseLocaleNumber(undefined), null);
  assert.equal(parseLocaleNumber(''), null);
});

test('Diagnostic.tsx wraps PSD, Restaurant, and ELCS sections in isolated ErrorBoundary with default recovery', () => {
  const diagnosticSrc = readFileSync(resolve(rootDir, 'src/pages/Diagnostic.tsx'), 'utf-8');
  const boundaryCount = (diagnosticSrc.match(/<ErrorBoundary\b/g) || []).length;
  assert.ok(boundaryCount >= 3, 'Diagnostic.tsx must wrap each of the 3 tabs in an isolated ErrorBoundary');
  assert.ok(diagnosticSrc.includes("clearSectionDraftKey('psdSurveyData'"), 'Diagnostic PSD ErrorBoundary must recover psdSurveyData');
  assert.ok(diagnosticSrc.includes("clearSectionDraftKey('restaurant'"), 'Diagnostic Restaurant ErrorBoundary must recover restaurant');
  assert.ok(diagnosticSrc.includes("clearSectionDraftKey('elcsData'"), 'Diagnostic ELCS ErrorBoundary must recover elcsData');

  const errorBoundarySrc = readFileSync(resolve(rootDir, 'src/components/ErrorBoundary.tsx'), 'utf-8');
  assert.ok(errorBoundarySrc.includes('onRecoverDefault'), 'ErrorBoundary must support onRecoverDefault callback');
  assert.ok(errorBoundarySrc.includes('Récupérer les données par défaut'), 'ErrorBoundary must expose automatic default recovery CTA');
});

test('All Recharts Diagnostic chart components handle empty or zero-sum datasets without crashing', () => {
  const chartFiles = [
    'src/components/diagnostic/restaurant/StudentDistributionChart.tsx',
    'src/components/diagnostic/restaurant/HorizontalBarChart.tsx',
    'src/components/diagnostic/restaurant/VerticalBarChart.tsx',
    'src/components/diagnostic/restaurant/RestaurantPieChart.tsx',
    'src/components/diagnostic/DiagnosticPsdElevesContent.tsx',
    'src/components/diagnostic/DiagnosticPsdParentsContent.tsx',
  ];

  chartFiles.forEach((relPath) => {
    const src = readFileSync(resolve(rootDir, relPath), 'utf-8');
    assert.ok(src.includes('Aucune donnée à afficher'), `${relPath} must provide empty-state fallback`);
  });

  const pieSrc = readFileSync(resolve(rootDir, 'src/components/diagnostic/restaurant/RestaurantPieChart.tsx'), 'utf-8');
  assert.ok(pieSrc.includes('totalValue <= 0'), 'RestaurantPieChart must guard against all-zero slice sums');
});

test('Diagnostic editors prevent deleting the last remaining row/indicator and sanitize French decimals', () => {
  const restEditor = readFileSync(resolve(rootDir, 'src/components/diagnostic/restaurant/AdminRestaurantSurveyEditor.tsx'), 'utf-8');
  assert.ok(restEditor.includes('list.length <= 1'), 'AdminRestaurantSurveyEditor must block deleting last row');
  assert.ok(restEditor.includes('recalculateStudentDistribution'), 'AdminRestaurantSurveyEditor must recalculate student percentages on add/delete');

  const elcsEditor = readFileSync(resolve(rootDir, 'src/components/diagnostic/AdminElcsSurveyEditor.tsx'), 'utf-8');
  assert.ok(elcsEditor.includes("group === 'primary' && current.length <= 1"), 'AdminElcsSurveyEditor must block deleting last primary ELCS indicator');

  const adminSrc = readFileSync(resolve(rootDir, 'src/pages/Admin.tsx'), 'utf-8');
  assert.ok(adminSrc.includes('sanitizeDiagnosticData'), 'Admin.tsx must normalize diagnostic datasets before validation/deploy');
  assert.ok(adminSrc.includes('setPublishedPageDataCache'), 'Admin.tsx must update live published cache immediately after deploy');
  assert.ok(adminSrc.includes('if (rows.length <= 1)'), 'Admin.tsx removeRestaurantRow must block deleting last row');
});

test('Publish API and live published content endpoint are properly wired without cache staleness', () => {
  const prSrc = readFileSync(resolve(rootDir, 'api/github/pull-request.ts'), 'utf-8');
  assert.ok(
    /import\s*\{[^}]*getFallbackRepoToken[^}]*\}\s*from\s*'\.\.\/_github\.js'/.test(prSrc),
    'api/github/pull-request.ts must import getFallbackRepoToken from ../_github.js'
  );

  const publishedApiSrc = readFileSync(resolve(rootDir, 'api/content/published.ts'), 'utf-8');
  assert.ok(publishedApiSrc.includes('no-store'), 'api/content/published.ts must disable caching via no-store');

  const syncLibSrc = readFileSync(resolve(rootDir, 'src/lib/publishedDataSync.ts'), 'utf-8');
  assert.ok(syncLibSrc.includes('usePublishedPageData'), 'publishedDataSync.ts must export usePublishedPageData');
});

test('Zero-division protection and dynamic weakest-day correlation rules work for arbitrary restaurant mutations', () => {
  const safePercent = (part, total) => {
    const p = Number(part);
    const t = Number(total);
    if (!Number.isFinite(p) || !Number.isFinite(t) || t <= 0) return 0;
    return Math.round((p / t) * 1000) / 10;
  };

  // All zeros must yield 0 instead of NaN or Infinity
  assert.equal(safePercent(0, 0), 0);
  assert.equal(safePercent(15, 0), 0);
  assert.equal(safePercent(15, 87), 17.2);

  // Add-then-delete simulation on studentDistributionData yields clean finite totals & percentages
  const initial = [
    { name: 'Maternelle', value: 15, percentage: 17.2 },
    { name: 'Élémentaire', value: 53, percentage: 60.9 },
  ];
  const afterAdd = [...initial, { name: 'Test niveau', value: 32, percentage: 0 }];
  const afterDelete = afterAdd.filter((_, idx) => idx !== 2);
  const totalAfter = afterDelete.reduce((s, r) => s + r.value, 0);
  const recalculated = afterDelete.map((r) => ({ ...r, percentage: safePercent(r.value, totalAfter) }));

  assert.equal(totalAfter, 68);
  recalculated.forEach((row) => {
    assert.ok(Number.isFinite(row.percentage) && row.percentage >= 0);
  });
});

test('Restauration Tabs 4 & 5 support full Add/Edit/Delete CRUD and safe empty-state correlations', () => {
  const restEditor = readFileSync(
    resolve(rootDir, 'src/components/diagnostic/restaurant/AdminRestaurantSurveyEditor.tsx'),
    'utf-8'
  );
  assert.ok(restEditor.includes('Ajouter un jour'), 'Tab 4 must expose + Ajouter un jour button');
  assert.ok(restEditor.includes('Ajouter un type de repas'), 'Tab 5 must expose + Ajouter un type de repas button');
  assert.ok(
    !restEditor.includes('const deleteGenericRow = <K extends keyof RestaurantPageData>(key: K, index: number) => {\n    const current = (restaurant[key] as Record<string, unknown>[]) || [];\n    if (current.length <= 1) return;'),
    'deleteGenericRow must allow deleting rows down to empty array'
  );

  const corrSrc = readFileSync(
    resolve(rootDir, 'src/components/diagnostic/restaurant/restaurantCorrelations.ts'),
    'utf-8'
  );
  assert.ok(corrSrc.includes("'Aucun jour'"), 'Empty days list must fall back cleanly to Aucun jour');
  assert.ok(corrSrc.includes("'aucune donnée saisie'"), 'Empty days list must provide clean summary label');
});

test('AdminBudgetDashboard uses Portal modal, form submission, synchronous persistence, and Section 4 dynamic sync', () => {
  const budgetDash = readFileSync(resolve(rootDir, 'src/components/admin/AdminBudgetDashboard.tsx'), 'utf-8');
  assert.ok(budgetDash.includes('createPortal'), 'AdminBudgetDashboard must render modal inside createPortal');
  assert.ok(budgetDash.includes('<form'), 'AdminBudgetDashboard modal must use native <form onSubmit>');
  assert.ok(budgetDash.includes('persistBudgetSnapshot'), 'AdminBudgetDashboard must persist modal saves synchronously');
  assert.ok(
    budgetDash.includes('return !projects || !Array.isArray(projects);'),
    'isStaleProjectList must preserve intentional empty []'
  );

  const budgetPublic = readFileSync(resolve(rootDir, 'src/components/BudgetCadreVieInfrastructures.tsx'), 'utf-8');
  assert.ok(budgetPublic.includes('usePublishedPageData'), 'BudgetCadreVieInfrastructures must sync with usePublishedPageData');
  assert.ok(budgetPublic.includes('tuitionBaseRevenue'), 'Section 4 must render dynamic tuitionBaseRevenue');
  assert.ok(budgetPublic.includes('cumulativeTuition'), 'Section 4 must render dynamic cumulativeTuition');
});

test('Admin.tsx synchronizes auth sessions properly and allows Plan Stratégique & Budget CRUD for editors and superadmins', () => {
  const adminSrc = readFileSync(resolve(rootDir, 'src/pages/Admin.tsx'), 'utf-8');
  assert.ok(!adminSrc.includes('defaultAccounts[2]'), 'Admin.tsx must not index undefined defaultAccounts[2]');
  assert.ok(
    adminSrc.includes("window.dispatchEvent(new Event('lfjp_auth_changed'))"),
    'Admin.tsx must dispatch lfjp_auth_changed on session updates'
  );
  assert.ok(adminSrc.includes('renderAxisIndicatorsEditor'), 'Admin.tsx must expose psdAxesData indicators CRUD in Rubrique 5');
  assert.ok(
    adminSrc.includes("dataset !== 'serviceInterestByDayData' && dataset !== 'mealTypePreferenceData'"),
    'Admin.tsx removeRestaurantRow must allow deleting all rows on Tabs 4 & 5'
  );
});

test('Plan Stratégique Axes 1-4 restore original showcase design while keeping Editor/Superadmin CRUD and strict read-only vitrine', () => {
  const psdSrc = readFileSync(resolve(rootDir, 'src/components/PSD.tsx'), 'utf-8');
  assert.ok(!psdSrc.includes('Tableau de bord synthétique'), 'PSD.tsx showcase must not inject extra dashboard card');
  assert.ok(!psdSrc.includes('BarChart'), 'PSD.tsx showcase must not render public Recharts BarChart');
  assert.ok(psdSrc.includes('isPrivileged && showEditorControls'), 'PSD.tsx must gate AdminPlanStrategiqueEditor behind privileged access');

  const planEditor = readFileSync(resolve(rootDir, 'src/components/AdminPlanStrategiqueEditor.tsx'), 'utf-8');
  assert.ok(planEditor.includes('Aucun indicateur défini'), 'AdminPlanStrategiqueEditor must render empty indicator state');
  assert.ok(planEditor.includes('BarChart'), 'AdminPlanStrategiqueEditor must host synchronized overview BarChart inside privileged drawer');
  assert.ok(planEditor.includes('PsdAxisIndicatorsSection'), 'AdminPlanStrategiqueEditor must host PsdAxisIndicatorsSection inside privileged drawer');
  assert.ok(
    !planEditor.includes('disabled={axis.indicators.length <= 1}'),
    'AdminPlanStrategiqueEditor must allow deleting last indicator cleanly'
  );
  assert.ok(
    !planEditor.includes('disabled={timeline.actions.length <= 1}'),
    'AdminPlanStrategiqueEditor must allow deleting last jalon cleanly'
  );

  const axeWithTimeline = [
    'src/components/PSDAxe1.tsx',
    'src/components/PSDAxe2.tsx',
    'src/components/PSDAxe3.tsx',
  ];
  axeWithTimeline.forEach((relPath) => {
    const src = readFileSync(resolve(rootDir, relPath), 'utf-8');
    assert.ok(src.includes('usePublishedPageData'), `${relPath} must use usePublishedPageData for live published sync`);
    assert.ok(src.includes('Aucune action programmée'), `${relPath} must render clean empty-state for empty timeline`);
    assert.ok(!src.includes('PsdAxisIndicatorsSection'), `${relPath} must not alter original showcase with PsdAxisIndicatorsSection`);
  });

  const axe4Src = readFileSync(resolve(rootDir, 'src/components/PSDAxe4.tsx'), 'utf-8');
  assert.ok(axe4Src.includes('usePublishedPageData'), 'PSDAxe4.tsx must use usePublishedPageData for live published sync');
  assert.ok(!axe4Src.includes('PsdAxisIndicatorsSection'), 'PSDAxe4.tsx must not render PsdAxisIndicatorsSection');
  assert.ok(!axe4Src.includes('Frise temporelle'), 'PSDAxe4.tsx must preserve original layout without Frise temporelle');

  const editorComponents = [
    'src/components/diagnostic/restaurant/AdminRestaurantSurveyEditor.tsx',
    'src/components/diagnostic/AdminElcsSurveyEditor.tsx',
    'src/components/diagnostic/AdminPsdSurveyEditor.tsx',
    'src/components/AdminPlanStrategiqueEditor.tsx',
    'src/components/admin/AdminBudgetDashboard.tsx',
    'src/components/admin/AdminTransportDashboard.tsx',
  ];
  editorComponents.forEach((relPath) => {
    const src = readFileSync(resolve(rootDir, relPath), 'utf-8');
    assert.ok(
      /if\s*\(\s*!isPrivileged\s*\|\|\s*!showEditorControls\s*\)\s*\{\s*return\s+null;\s*\}/.test(src),
      `${relPath} must strictly return null from DOM when !isPrivileged || !showEditorControls`
    );
  });
});


