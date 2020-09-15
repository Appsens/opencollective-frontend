import 'cypress-file-upload';

const random = Math.round(Math.random() * 100000);
const expenseDescription = `New expense ${random}`;

const uploadReceipt = (dropzoneElement = '.InputTypeDropzone input') => {
  cy.fixture('./images/receipt.jpg').then(picture => {
    cy.get(dropzoneElement).upload({ fileContent: picture, fileName: 'receipt.jpg', mimeType: 'image/jpeg' });
  });
  cy.wait(900);
};

describe('New expense flow', () => {
  describe('new expense when logged out', () => {
    it('shows the login screen', () => {
      cy.createHostedCollective().then(collective => {
        cy.visit(`/${collective.slug}/expenses/new`);
        cy.getByDataCy('signIn-form');
      });
    });
  });

  describe('new expense when logged in', () => {
    let user, collective;

    before(() => {
      cy.createHostedCollective().then(c => {
        collective = c;
        cy.signup({
          user: { name: 'Potatoes Lover' },
          redirect: `/${collective.slug}/expenses/new`,
        }).then(u => (user = u));
      });
    });

    beforeEach(() => {
      cy.login({ email: user.email, redirect: `/${collective.slug}/expenses/new` });
    });

    it('has a dismissible help message', () => {
      cy.getByDataCy('expense-create-help').should('exist');
      cy.getByDataCy('dismiss-expense-create-help').click();
      cy.getByDataCy('expense-create-help').should('not.exist');
      cy.wait(250); // Give some time for the GQL request
      cy.reload();
      cy.waitForLoggedIn();
      cy.wait(200); // Give some time to make sure frontend can fully refresh after logged in
      cy.getByDataCy('expense-create-help').should('not.exist');
    });

    it('submits new expense then edit it', () => {
      cy.getByDataCy('radio-expense-type-RECEIPT').click();
      // Select Payout Method
      cy.getByDataCy('payout-method-select').click();
      cy.contains('[data-cy="select-option"]', 'New PayPal account').click();
      cy.get('input[name="payoutMethod.data.email"]').type('paypal-test@opencollective.com');
      cy.getByDataCy('expense-next').click();

      cy.get('input[name="description"]').type('Brussels January team retreat');

      cy.getByDataCy('expense-summary-btn').should('be.disabled');
      // Upload 2 files to the multi-files dropzone
      cy.fixture('images/receipt.jpg').then(fileContent => {
        const getFile = idx => ({ fileContent, fileName: `receipt${idx}.jpg`, mimeType: 'image/jpeg' });
        const files = [getFile(1), getFile(2)];
        cy.getByDataCy('expense-multi-attachments-dropzone').upload(files, { subjectType: 'drag-n-drop' });
      });
      cy.getByDataCy('expense-attachment-form').should('have.length', 2);

      // Fill info for first attachment
      cy.get('input[name="items[0].description"]').type('Fancy restaurant');
      cy.get('input[name="items[0].amount"]').type('{selectall}183');
      cy.get('input:invalid').should('have.length', 2); // Missing attachment desctiption+amount
      cy.getByDataCy('expense-items-total-amount').should('contain', '--.--'); // amount for second item is missing

      // Try to submit with missing data
      cy.get('input:invalid').should('have.length', 2); // Previous incomplete fields + payout method email
      cy.getByDataCy('expense-summary-btn').click(); // Should not submit

      // Fill missing info & submit
      cy.get('input[name="items[1].description"]').type('Potatoes for the giant raclette');
      cy.get('input[name="items[1].amount"]').type('{selectall}92.50');
      cy.getByDataCy('expense-items-total-amount').should('contain', '$275.50 USD');
      cy.get('input:invalid').should('have.length', 0);
      cy.getByDataCy('expense-summary-btn').click();

      // Check summary
      cy.getByDataCy('expense-summary-payee').should('contain', 'Potatoes Lover');
      cy.getByDataCy('expense-summary-host').should('contain', 'Open Source Collective org');
      cy.getByDataCy('expense-summary-payout-method-data').should('contain', 'paypal-test@opencollective.com');
      cy.getByDataCy('expense-summary-payout-method-type').should('contain', 'PayPal');
      cy.getByDataCy('expense-items-total-amount').should('contain', '$275.50 USD');
      cy.getByDataCy('expense-summary-items').should('contain', 'Fancy restaurant');
      cy.getByDataCy('expense-summary-items').should('contain', 'Potatoes for the giant raclette');

      // Submit!
      cy.getByDataCy('submit-expense-btn').click();
      cy.contains('[data-cy="temporary-notification"]', 'Expense submitted!');
      cy.contains('[data-cy="expense-page-content"]', 'Brussels January team retreat');
      cy.getByDataCy('dismiss-temporary-notification-btn').click();
      cy.getByDataCy('temporary-notification').should('not.exist');

      // Start editing
      cy.getByDataCy('edit-expense-btn').click();
      cy.get('input[name="description"]').type(' edited');
      cy.get('input[name="items[0].description"]').type(' but not too expensive');
      cy.get('input[name="items[0].amount"]').type('{selectall}111');
      // Add new item
      cy.getByDataCy('expense-add-item-btn').click();
      cy.get('input[name="items[2].description"]').type('Some more delicious stuff');
      cy.get('input[name="items[2].amount"]').type('{selectall}34');
      cy.fixture('images/receipt.jpg').then(fileContent => {
        cy.getByDataCy('items[2].url-dropzone').upload(
          [{ fileContent, fileName: `receipt2.jpg`, mimeType: 'image/jpeg' }],
          { subjectType: 'drag-n-drop' },
        );
      });

      // Change payee - use a new organization
      cy.getByDataCy('expense-back').click();
      cy.getByDataCy('payout-method-select').click();
      cy.contains('[data-cy="select-option"]', 'New PayPal account').click();
      cy.get('input[name="payoutMethod.data.email"]').type('paypal-test-2@opencollective.com');
      cy.getByDataCy('expense-next').click();
      cy.getByDataCy('expense-summary-btn').click();
      cy.getByDataCy('save-expense-btn').click();
      cy.getByDataCy('save-expense-btn').should('not.exist'); // wait for form to be submitted

      // Check final expense page
      cy.contains('[data-cy="expense-page-content"]', 'Brussels January team retreat edited');
      cy.getByDataCy('expense-summary-payee').should('contain', 'Potatoes Lover');
      cy.getByDataCy('expense-summary-host').should('contain', 'Open Source Collective org');
      cy.getByDataCy('expense-summary-payout-method-data').should('contain', 'paypal-test-2@opencollective.com');
      cy.getByDataCy('expense-summary-payout-method-type').should('contain', 'PayPal');
      cy.getByDataCy('expense-items-total-amount').should('contain', '$237.50 USD');
      cy.getByDataCy('expense-summary-items').should('contain', 'Fancy restaurant');
      cy.getByDataCy('expense-summary-items').should('contain', 'Potatoes for the giant raclette');
      cy.getByDataCy('expense-summary-items').should('contain', 'Some more delicious stuff');
    });

    // This can happen if you start with an invoice then switch to receipts
    it('should prevent submitting receipts if missing items', () => {
      cy.getByDataCy('radio-expense-type-INVOICE').click();
      cy.getByDataCy('payout-method-select').click();
      cy.contains('[data-cy="select-option"]', 'New PayPal account').click();
      cy.get('input[name="payoutMethod.data.email"]').type('paypal-test@opencollective.com');
      cy.getByDataCy('expense-next').click();
      // Fill the form with valid data
      cy.get('input[name="description"]').type('March invoice');
      cy.get('input[name="items[0].description"]').type('Peeling potatoes');
      cy.get('input[name="items[0].amount"]').type('{selectall}4200');

      // Switch to receipt and acnkowledge error
      cy.getByDataCy('radio-expense-type-RECEIPT').click();
      cy.getByDataCy('expense-summary-btn').click();
      cy.getByDataCy('attachment-url-field').should('contain', 'Receipt required');
    });
  });

  describe('Actions on expense', () => {
    let collective;
    let user;
    let expenseUrl;

    before(() => {
      cy.signup().then(response => (user = response));
    });

    before(() => {
      cy.createHostedCollective({ userEmail: user.email }).then(c => (collective = c));
    });

    beforeEach(() => {
      cy.createExpense({
        userEmail: user.email,
        user: { paypalEmail: 'paypal@test.com', id: user.id },
        collective: { id: collective.id },
      }).then(expense => (expenseUrl = `/${collective.slug}/expenses/${expense.id}`));
    });

    it('Approve, unapprove, reject and pay actions on expense', () => {
      cy.visit(expenseUrl);
      cy.get('[data-cy="expense-status-msg"]').contains('Pending');
      cy.getByDataCy('approve-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Approved');
      cy.getByDataCy('unapprove-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Pending');
      cy.getByDataCy('approve-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Approved');
      cy.getByDataCy('unapprove-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Pending');
      cy.getByDataCy('reject-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Rejected');
    });

    it('Delete expense', () => {
      cy.login({ email: user.email, redirect: expenseUrl });
      cy.getByDataCy('reject-button').click();
      cy.get('[data-cy="expense-status-msg"]').contains('Rejected');

      // Now delete the expense
      cy.getByDataCy('delete-expense-button').click();
      cy.getByDataCy('confirmation-modal-continue').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/${collective.slug}/expenses`);
      cy.visit(expenseUrl);
      cy.getByDataCy('error-page').contains('Not found');
    });
  });
});

describe('Legacy expense flow', () => {
  describe('new expense when logged out', () => {
    it('requires to login to submit an expense', () => {
      cy.visit('/testcollective/expenses/new/legacy');
      cy.get('.CreateExpenseForm').contains('Sign up or login to submit an expense');
      cy.get('#email').type('testuser+admin@opencollective.com');
      cy.get('[data-cy="signin-btn"]').click();
      cy.wait(2000);
      cy.get('.inputField.description', { timeout: 5000 });
    });
  });

  describe('new expense when logged in', () => {
    beforeEach(() => {
      cy.login({ redirect: '/testcollective/expenses/new/legacy' });
    });

    it('submits new expense paypal', () => {
      cy.get('.descriptionField input').type(expenseDescription);
      cy.get('.error').should('have.text', 'Amount must be greater than 0');
      cy.get('.amountField input').type(12);
      cy.get('.categoryField select').select('Team');
      cy.get('.error').should('have.text', 'Missing attachment');
      uploadReceipt();
      cy.get('.error').should('have.text', 'Please pick the type of this expense');
      cy.get('.expenseField select').select('RECEIPT');
      cy.get('.inputField.paypalEmail input').type('{selectall}{del}');
      cy.get('.error').should('have.text', 'Please provide your PayPal email address (or change the payout method)');
      cy.get('.inputField.paypalEmail input').type('paypal@test.com');
      cy.get('[data-cy="ExpenseNotesEditor"] trix-editor').type('Some private note for the host');
      cy.get('button[type=submit]').click();
      cy.get('[data-cy="expenseCreated"]').contains('success');
      cy.visit('/testcollective/expenses/legacy');
      cy.get('.itemsList .expense', { timeout: 10000 });
      cy.get('.Expenses .expense:first .description').contains(expenseDescription);
      cy.get('.Expenses .expense:first .status').contains('Pending');
      cy.get('.Expenses .expense:first .meta').contains('Team');
    });

    it('submits a new expense other, edit it and approve it', () => {
      cy.get('.descriptionField input').type(expenseDescription);
      cy.wait(300);
      cy.get('.amountField input', { timeout: 5000 }).type(12);
      cy.get('.payoutMethod.inputField select').select('other');
      uploadReceipt();
      cy.get('.expenseField select').select('RECEIPT');
      cy.wait(300);
      cy.get('.LoginTopBarProfileButton').contains('testuseradmin', {
        timeout: 15000,
      });
      cy.get('[data-cy="ExpenseNotesEditor"] trix-editor').type('Some private note for the host');
      cy.get('button[type=submit]').click();
      cy.get('[data-cy="expenseCreated"]').contains('success');
      cy.visit('/testcollective/expenses/legacy');
      cy.get('.itemsList .expense', { timeout: 10000 });
      cy.get('.Expenses .expense:first .description').contains(expenseDescription);
      cy.get('.Expenses .expense:first .status').contains('Pending');
      cy.get('.Expenses .expense:first .privateMessage').contains('Some private note for the host');
      cy.get('.Expenses .expense:first .ApproveExpenseBtn button').click();
      cy.get('.Expenses .expense:first .status').contains('Approved');
      cy.get('.Expenses .expense:first .toggleEditExpense').click();
      cy.get('.Expenses .expense:first .inputField.description input').type(' edited');
      cy.get('.Expenses .expense:first .inputField.amount input').type('{selectall}13');
      cy.get('.Expenses .expense:first .inputField.category select').select('Team');
      cy.get('[data-cy="ExpenseNotesEditor"] trix-editor').type('{selectall}Another private note (edited)');
      cy.get('.Expenses .expense:first .inputField.description input').focus();
      cy.wait(300);
      cy.getByDataCy('expense-edit-save-btn').click();
      cy.get('.Expenses .expense:first .status').contains('Pending'); // editing an expense should switch status back to pending
      cy.get('.Expenses .expense:first .description').contains('edited');
      cy.get('.Expenses .expense:first .privateMessage').contains('edited');
      cy.get('.Expenses .expense:first .amount').contains('$13.00');
      cy.get('.Expenses .expense:first .ApproveExpenseBtn button').click();
      cy.wait(300);
      cy.get('.Expenses .expense:first .status', { timeout: 5000 }).contains('Approved');
    });
  });
});
