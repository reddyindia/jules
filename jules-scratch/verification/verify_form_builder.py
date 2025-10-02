from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    """
    Verifies the custom form builder page.
    - Checks if the custom tools are present in the toolbox.
    - Takes a screenshot of the page.
    """
    # Use a hardcoded base URL as the environment variable is not consistently available.
    base_url = "http://localhost"

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the form builder page
        form_builder_url = f"{base_url}/form-builder"
        page.goto(form_builder_url, wait_until="networkidle")

        # 1. Assert: Check the page title
        expect(page).to_have_title("Form Builder – تحلیلگر")

        # 2. Assert: Check for the custom fields in the toolbox
        # The fields are inside a div with class 'form-builder-fields'
        toolbox = page.locator(".form-builder-fields")

        # Check for some of the new custom tools
        expect(toolbox.locator('li[data-type="welcome_page"]')).to_be_visible()
        expect(toolbox.locator('li[data-type="question_group"]')).to_be_visible()
        expect(toolbox.locator('li[data-type="ranking"]')).to_be_visible()
        expect(toolbox.locator('li[data-type="end_page"]')).to_be_visible()

        # Check that a default tool has been removed
        expect(toolbox.locator('li[data-type="autocomplete"]')).not_to_be_visible()

        print("Frontend verification checks passed successfully.")

        # 3. Screenshot: Capture the final result for visual verification.
        screenshot_path = "jules-scratch/verification/form_builder_verification.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
    finally:
        # Clean up
        context.close()
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run_verification(playwright)