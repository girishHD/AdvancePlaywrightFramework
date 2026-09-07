/**
 * End-to-end checkout flow with valid/invalid fixtures:
 *   - Valid: completes checkout successfully
 *   - Invalid: shows appropriate validation errors
 */

import { test, expect } from '@fixtures/test-base';
import { createLogger } from '@utils/logger';
import { visualStep } from '@utils/visualStep';
import checkoutCustomers from '../../test-data/checkout-customers.json';

const log = createLogger('e2e-checkout-fixtures');

const FIRST_ITEM_ID = 'test-allthethings-tshirt-red';

test.describe('@P0 @Regression E2E @Checkout Checkout Feature with Fixtures', () => {

    const validCustomers = checkoutCustomers.filter(c => c.isValid);
    const invalidCustomers = checkoutCustomers.filter(c => !c.isValid);

    for (const customer of validCustomers) {
        test(`should complete checkout for valid customer: ${customer.description}`, async ({
            page,
            loginPage,
            inventoryPage,
            cartPage,
            checkoutStepOnePage,
            checkoutStepTwoPage,
            checkoutCompletePage,
        }) => {
            await visualStep(page, 'Login as standard_user', async () => {
                log.info('Step 1: logging in as standard_user');
                await loginPage.open();
                await loginPage.loginAs('standard_user', 'tta_secret');
            });

            await visualStep(page, 'Go to the inventory page', async () => {
                log.info('Step 2: navigating to the inventory page');
                await inventoryPage.open();
            });

            await visualStep(page, 'Add one item to the cart', async () => {
                log.info(`Step 3: adding item "${FIRST_ITEM_ID}" to the cart`);
                await inventoryPage.addToCart(FIRST_ITEM_ID);
            });

            await visualStep(page, 'Open the cart', async () => {
                log.info('Step 4: opening the cart and verifying one row');
                await cartPage.open();
                expect(await cartPage.rowCount()).toBe(1);
            });

            await visualStep(page, 'Fill guest details (checkout step one)', async () => {
                log.info(`Step 5a: filling guest details for ${customer.firstName} ${customer.lastName}`);
                await cartPage.checkout();
                await checkoutStepOnePage.assertLoaded();
                await checkoutStepOnePage.fillGuest({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    postalCode: customer.postalCode,
                });
                await checkoutStepOnePage.continue();
            });

            await visualStep(page, 'Finish the order (checkout step two)', async () => {
                log.info('Step 5b: reviewing the overview and finishing the order');
                await checkoutStepTwoPage.assertLoaded();
                await checkoutStepTwoPage.finish();
            });

            await visualStep(page, 'Order is complete', async () => {
                log.info('Step 6: asserting the order is complete');
                await checkoutCompletePage.assertOrderComplete();
            });
        });
    }

    for (const customer of invalidCustomers) {
        test(`should show error for invalid customer: ${customer.description}`, async ({
            page,
            loginPage,
            inventoryPage,
            cartPage,
            checkoutStepOnePage,
        }) => {
            await visualStep(page, 'Login as standard_user', async () => {
                log.info('Step 1: logging in as standard_user');
                await loginPage.open();
                await loginPage.loginAs('standard_user', 'tta_secret');
            });

            await visualStep(page, 'Go to the inventory page', async () => {
                log.info('Step 2: navigating to the inventory page');
                await inventoryPage.open();
            });

            await visualStep(page, 'Add one item to the cart', async () => {
                log.info(`Step 3: adding item "${FIRST_ITEM_ID}" to the cart`);
                await inventoryPage.addToCart(FIRST_ITEM_ID);
            });

            await visualStep(page, 'Open the cart and checkout', async () => {
                log.info('Step 4: opening the cart and starting checkout');
                await cartPage.open();
                await cartPage.checkout();
                await checkoutStepOnePage.assertLoaded();
            });

            await visualStep(page, 'Fill invalid details and expect error', async () => {
                log.info(`Step 5: filling invalid details - ${customer.description}`);
                await checkoutStepOnePage.fillGuest({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    postalCode: customer.postalCode,
                });
                await checkoutStepOnePage.continue();
                await checkoutStepOnePage.expectErrorContains(customer.expectedError!);
            });
        });
    }

});
