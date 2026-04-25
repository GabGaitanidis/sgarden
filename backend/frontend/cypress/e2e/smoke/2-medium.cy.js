// =============================================================================
//  M9 – M17  |  MEDIUM missions (100 – 200 pts)
// =============================================================================

// ---------------------------------------------------------------------------
// M9: Sales Records CRUD (150 pts)
// ---------------------------------------------------------------------------
describe('M9: Sales Records CRUD (150 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('sidebar-sales-data-link navigates to sales-data-page', () => {
    cy.get('[data-testid="sidebar-sales-data-link"]').click();
    cy.get('[data-testid="sales-data-page"]').should('be.visible');
  });

  it('sales-data-add-button is present on sales-data-page', () => {
    cy.get('[data-testid="sidebar-sales-data-link"]').click();
    cy.get('[data-testid="sales-data-add-button"]').should('exist');
  });

  it('clicking sales-data-add-button reveals form with all required fields', () => {
    cy.get('[data-testid="sidebar-sales-data-link"]').click();
    cy.get('[data-testid="sales-data-add-button"]').click();
    cy.get('[data-testid="sales-data-form"]').should('be.visible');
    cy.get('[data-testid="sales-data-field-category"]').should('exist');
    cy.get('[data-testid="sales-data-field-month"]').should('exist');
    cy.get('[data-testid="sales-data-field-year"]').should('exist');
    cy.get('[data-testid="sales-data-field-value"]').should('exist');
    cy.get('[data-testid="sales-data-field-unit"]').should('exist');
    cy.get('[data-testid="sales-data-field-notes"]').should('exist');
  });

  it('sales-data-form-submit and sales-data-form-cancel exist in form', () => {
    cy.get('[data-testid="sidebar-sales-data-link"]').click();
    cy.get('[data-testid="sales-data-add-button"]').click();
    cy.get('[data-testid="sales-data-form-submit"]').should('exist');
    cy.get('[data-testid="sales-data-form-cancel"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M10: Threshold Alerts System (150 pts)
// ---------------------------------------------------------------------------
describe('M10: Threshold Alerts System (150 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('sidebar-alerts-link shows alerts-page with alerts-empty state', () => {
    cy.get('[data-testid="sidebar-alerts-link"]').click();
    cy.get('[data-testid="alerts-page"]').should('be.visible');
    // Either alerts-empty (no rules yet) or alerts-table must exist
    cy.get('[data-testid="alerts-empty"], [data-testid="alerts-table"]').should('exist');
  });

  it('alerts-add-button reveals form with metric, operator and threshold fields', () => {
    cy.get('[data-testid="sidebar-alerts-link"]').click();
    cy.get('[data-testid="alerts-add-button"]').click();
    cy.get('[data-testid="alerts-form"]').should('be.visible');
    cy.get('[data-testid="alerts-field-metric"]').should('exist');
    cy.get('[data-testid="alerts-field-operator"]').should('exist');
    cy.get('[data-testid="alerts-field-threshold"]').should('exist');
  });

  it('alerts-form-submit and alerts-form-cancel exist in form', () => {
    cy.get('[data-testid="sidebar-alerts-link"]').click();
    cy.get('[data-testid="alerts-add-button"]').click();
    cy.get('[data-testid="alerts-form-submit"]').should('exist');
    cy.get('[data-testid="alerts-form-cancel"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M11: In-App Notes & Annotations (120 pts)
// ---------------------------------------------------------------------------
describe('M11: In-App Notes & Annotations (120 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard1');
  });

  it('notes-toggle-button exists on /dashboard1', () => {
    cy.get('[data-testid="notes-toggle-button"]').should('exist');
  });

  it('clicking notes-toggle-button shows notes-panel', () => {
    cy.get('[data-testid="notes-toggle-button"]').click();
    cy.get('[data-testid="notes-panel"]').should('be.visible');
  });

  it('notes-add-input and notes-add-submit exist inside notes-panel', () => {
    cy.get('[data-testid="notes-toggle-button"]').click();
    cy.get('[data-testid="notes-panel"]').within(() => {
      cy.get('[data-testid="notes-add-input"]').should('exist');
      cy.get('[data-testid="notes-add-submit"]').should('exist');
    });
  });
});

// ---------------------------------------------------------------------------
// M12: Data Comparison Mode (150 pts)
// ---------------------------------------------------------------------------
describe('M12: Data Comparison Mode (150 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard1');
  });

  it('compare-toggle exists on /dashboard1', () => {
    cy.get('[data-testid="compare-toggle"]').should('exist');
  });

  it('clicking compare-toggle shows both comparison panels', () => {
    cy.get('[data-testid="compare-toggle"]').click();
    cy.get('[data-testid="compare-panel-left"]').should('be.visible');
    cy.get('[data-testid="compare-panel-right"]').should('be.visible');
  });

  it('compare-close button exists after activating comparison mode', () => {
    cy.get('[data-testid="compare-toggle"]').click();
    cy.get('[data-testid="compare-close"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M13: Multi-Language Support / i18n (120 pts)
// ---------------------------------------------------------------------------
describe('M13: Multi-Language Support / i18n (120 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('language-switcher exists in the header', () => {
    cy.get('[data-testid="language-switcher"]').should('exist');
  });

  it('clicking language-switcher shows EN and EL options', () => {
    cy.get('[data-testid="language-switcher"]').click();
    cy.get('[data-testid="language-option-en"]').should('be.visible');
    cy.get('[data-testid="language-option-el"]').should('be.visible');
  });

  it('language-active shows "EN" by default', () => {
    cy.get('[data-testid="language-active"]').should('be.visible').invoke('text').then((text) => {
      expect(text.trim().toUpperCase()).to.equal('EN');
    });
  });
});

// ---------------------------------------------------------------------------
// M14: Map-Based Data Entry (180 pts)
// ---------------------------------------------------------------------------
describe('M14: Map-Based Data Entry (180 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/map');
  });

  it('map-page container exists', () => {
    cy.get('[data-testid="map-page"]').should('exist');
  });

  it('at least one map-region-* element exists', () => {
    cy.get('[data-testid^="map-region-"]').should('have.length.at.least', 1);
  });

  it('clicking a map region opens map-data-form', () => {
    cy.get('[data-testid^="map-region-"]').first().click();
    cy.get('[data-testid="map-data-form"]').should('be.visible');
  });

  it('map-data-form contains required fields and submit button', () => {
    cy.get('[data-testid^="map-region-"]').first().click();
    cy.get('[data-testid="map-data-field-region-name"]').should('exist');
    cy.get('[data-testid="map-data-field-category"]').should('exist');
    cy.get('[data-testid="map-data-field-revenue"]').should('exist');
    cy.get('[data-testid="map-data-form-submit"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M15: Report Builder (180 pts)
// ---------------------------------------------------------------------------
describe('M15: Report Builder (180 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('sidebar-reports-link navigates to reports-page', () => {
    cy.get('[data-testid="sidebar-reports-link"]').click();
    cy.get('[data-testid="reports-page"]').should('be.visible');
  });

  it('reports-create-button exists on reports-page', () => {
    cy.get('[data-testid="sidebar-reports-link"]').click();
    cy.get('[data-testid="reports-create-button"]').should('exist');
  });

  it('clicking reports-create-button shows report-wizard with required fields', () => {
    cy.get('[data-testid="sidebar-reports-link"]').click();
    cy.get('[data-testid="reports-create-button"]').click();
    cy.get('[data-testid="report-wizard"]').should('be.visible');
    cy.get('[data-testid="report-wizard-title"]').should('exist');
    cy.get('[data-testid="report-wizard-chart-select"]').should('exist');
    cy.get('[data-testid="report-wizard-save"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M16: Audit Trail (120 pts)
// ---------------------------------------------------------------------------
describe('M16: Audit Trail (120 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('sidebar-audit-link is visible for admin', () => {
    cy.get('[data-testid="sidebar-audit-link"]').should('be.visible');
  });

  it('clicking sidebar-audit-link shows audit-page and audit-table', () => {
    cy.get('[data-testid="sidebar-audit-link"]').click();
    cy.get('[data-testid="audit-page"]').should('be.visible');
    cy.get('[data-testid="audit-table"]').should('be.visible');
  });

  it('all audit filter controls are present', () => {
    cy.get('[data-testid="sidebar-audit-link"]').click();
    cy.get('[data-testid="audit-filter-action"]').should('exist');
    cy.get('[data-testid="audit-filter-date-from"]').should('exist');
    cy.get('[data-testid="audit-filter-date-to"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// M17: User Preferences & Settings (100 pts)
// ---------------------------------------------------------------------------
describe('M17: User Preferences & Settings (100 pts)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('settings-nav-link navigates to settings-page', () => {
    cy.get('[data-testid="settings-nav-link"]').click();
    cy.get('[data-testid="settings-page"]').should('be.visible');
  });

  it('all settings fields are present', () => {
    cy.get('[data-testid="settings-nav-link"]').click();
    cy.get('[data-testid="settings-page-size"]').should('exist');
    cy.get('[data-testid="settings-default-dashboard"]').should('exist');
    cy.get('[data-testid="settings-date-format"]').should('exist');
    cy.get('[data-testid="settings-sidebar-collapsed"]').should('exist');
  });

  it('settings-save-button exists on settings-page', () => {
    cy.get('[data-testid="settings-nav-link"]').click();
    cy.get('[data-testid="settings-save-button"]').should('exist');
  });
});
