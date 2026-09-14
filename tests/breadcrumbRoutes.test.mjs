import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const routesPath = resolve(__dirname, '../src/data/breadcrumbRoutes.json');
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'));

const expectedRoutes = {
  '/vision-missions-valeurs': { parent: '/' },
  '/diagnostic': { parent: '/' },
  '/plan-strategique': { parent: '/' },
  '/plan-maintenance-strategique': { parent: '/plan-strategique' },
  '/curriculum-soft-skills': { parent: '/plan-strategique' },
  '/curriculum-numerique-spiralaire': { parent: '/plan-strategique' },
  '/parcours-avenir': { parent: '/plan-strategique' },
  '/section-internationale-bfi': { parent: '/plan-strategique' },
  '/pc-par-lyceen': { parent: '/plan-strategique' },
  '/plan-strategique/reussite-citoyenne': { parent: '/plan-strategique' },
  '/education-financiere-vie-autonome': { parent: '/plan-strategique' },
  '/mecenat-numerique': { parent: '/plan-strategique' },
  '/construction-cantine': { parent: '/plan-strategique' },
  '/protocole-phare': { parent: '/plan-strategique' },
  '/mediation-entre-pairs': { parent: '/plan-strategique' },
  '/politique-e3d': { parent: '/plan-strategique' },
  '/elcs-analyse-complete': { parent: '/diagnostic' }
};

test('all breadcrumb routes served by App.tsx are defined', () => {
  for (const [path, { parent }] of Object.entries(expectedRoutes)) {
    assert.ok(routes[path], `La route "${path}" doit être définie dans le fil d'Ariane.`);
    if (parent) {
      assert.strictEqual(
        routes[path].parent,
        parent,
        `La route "${path}" doit avoir pour parent "${parent}".`
      );
    }
    assert.equal(typeof routes[path].name, 'string', `La route "${path}" doit avoir un nom.`);
  }
});

test('les routes racines sont présentes', () => {
  assert.ok(routes['/'], 'La route racine "/" doit être définie.');
  assert.ok(routes['/plan-strategique'], 'La page plan stratégique doit être définie.');
  assert.ok(routes['/diagnostic'], 'La page diagnostic doit être définie.');
});

test('les routes peuvent chaîner plusieurs parents jusqu\'à la racine', () => {
  const targetPath = '/curriculum-soft-skills';
  let currentPath = targetPath;
  const visited = new Set([currentPath]);
  let reachedRoot = false;

  while (true) {
    const route = routes[currentPath];
    assert.ok(route, `La route "${currentPath}" doit être définie.`);

    const parent = route.parent;
    if (!parent) break;

    if (parent === '/') {
      reachedRoot = true;
      assert.ok(routes[parent], 'La route racine "/" doit être définie.');
      break;
    }

    assert.ok(
      !visited.has(parent),
      `La hiérarchie des routes ne doit pas contenir de cycle (boucle détectée à "${parent}").`
    );

    visited.add(parent);
    currentPath = parent;
  }

  assert.ok(
    reachedRoot,
    `La route "${targetPath}" doit pouvoir remonter jusqu'à la racine "/" en suivant ses parents.`
  );
});
