import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    const app = new App();
    expect(app).toBeTruthy();
    expect(app.title()).toBe('jobinbox');
  });
});
