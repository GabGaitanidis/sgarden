'use strict';

/**
 * Silent Mocha reporter for SGarden smoke tests.
 * Produces no per-test output — the run-smoke-tests.cjs script
 * reads the cypress.run() results and prints the mission summary.
 */
class SilentReporter {
  constructor(runner) {
    // Attach no-op listeners to consume all events so Mocha doesn't
    // complain about unhandled emitter events.
    runner.on('suite', () => {});
    runner.on('suite end', () => {});
    runner.on('test', () => {});
    runner.on('test end', () => {});
    runner.on('pass', () => {});
    runner.on('fail', () => {});
    runner.on('pending', () => {});
    runner.on('end', () => {});
  }
}

module.exports = SilentReporter;
