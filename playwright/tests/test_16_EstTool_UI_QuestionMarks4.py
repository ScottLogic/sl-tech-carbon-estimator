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
    
    # Organisation
    expect(page.get_by_text("Desktops 50%")).to_be_visible()
    
    # 4th question mark (Users)
    page.locator("div").filter(has_text="Organisation expand_less To").nth(1).click()
    page.get_by_role("button", name="help_outline").nth(3).click()
    expect(page.locator("#cdk-overlay-0")).to_contain_text("The percentage of mobile users will affect the energy used by end user devices and network infrastructure.While the power demand of mobile devices is often much lower, the use of mobile networks can increase the power used when transferring data.")




    
    

    ##############################################################################
    