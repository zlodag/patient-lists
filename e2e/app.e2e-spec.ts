import { PatientListsPage } from './app.po';

describe('patient-lists App', function() {
  let page: PatientListsPage;

  beforeEach(() => {
    page = new PatientListsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
