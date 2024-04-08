import re
from playwright.sync_api import Page, expect

# This test is to ensure accordion buttons work as expected

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    page.set_viewport_size({"width": 1920, "height": 1200})

    # Organisation
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    page.locator("sl-expansion-panel").filter(has_text="Organisation expand_less To").get_by_role("button").click()
    page.get_by_role("button", name="expand_more").click()
    
    # On Prem
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    page.locator("sl-expansion-panel").filter(has_text="On-Premise Servers").get_by_role("button").click()
    page.get_by_role("button", name="expand_more").click()
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    page.locator("sl-expansion-panel").filter(has_text="Cloud Services expand_less").get_by_role("button").click()
    page.get_by_role("button", name="expand_more").click()
    
    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    page.locator("sl-expansion-panel").filter(has_text="Users expand_less Tell us").get_by_role("button").click()
    page.get_by_role("button", name="expand_more").click()