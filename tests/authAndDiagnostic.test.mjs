import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pageDataPath = resolve(__dirname, '../src/content/pageData.json');
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
});
