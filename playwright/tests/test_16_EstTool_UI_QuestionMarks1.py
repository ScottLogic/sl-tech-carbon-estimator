import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# Help icon "?"
# Ensure that text visible and link works
   

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    
    page.set_viewport_size({"width": 1920, "height": 1200})
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
    #Organisation
    expect(page.get_by_text("Desktops 50%")).to_be_visible()

    # 1st question mark (On Prem)
    page.locator("div").filter(has_text=re.compile(r"^Where are they primarily located\? help_outline$")).get_by_role("button").click()
    # expect(page.locator("#cdk-overlay-2")).to_contain_text("This will affect the average Carbon Intensity of the energy used by your servers.")
    expect(page.locator("#cdk-overlay-0")).to_contain_text("This will affect the average Carbon Intensity of the energy used by your servers.")
    expect(page.get_by_role("link")).to_contain_text("Carbon Intensity")
    page.get_by_role("link", name="Carbon Intensity").click()
    expect(page.get_by_role("link", name="Carbon Intensity", exact=True)).to_be_visible()
    
    
    

    ##############################################################################
    