import re
from playwright.sync_api import Page, expect

# This test is to ensure accordion buttons work as expected

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    page.set_viewport_size({"width": 1920, "height": 1200})

    # Organisation
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    page.pause()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    expect(page.locator("expansion-panel").filter(has_text="Organisation expand_less To").get_by_label("Hide details")).to_be_visible()
    page.locator("expansion-panel").filter(has_text="Organisation expand_less To").get_by_label("Hide details").click()
    expect(page.get_by_text("To understand the scale of")).not_to_be_visible()
    page.locator("expansion-panel").filter(has_text="Organisation expand_more To").get_by_label("Show details").click()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    
    # On Prem
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    expect(page.locator("expansion-panel").filter(has_text="On-Premise Servers").get_by_label("Hide details")).to_be_visible()
    page.locator("expansion-panel").filter(has_text="On-Premise Servers").get_by_label("Hide details").click()
    expect(page.get_by_text("We'll use the number of")).not_to_be_visible()
    page.locator("expansion-panel").filter(has_text="On-Premise Servers").get_by_label("Show details").click()
    expect(page.get_by_text("We'll use the number of")).to_be_visible()
    
 # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.locator("expansion-panel").filter(has_text="Cloud Services expand_less").get_by_label("Hide details")).to_be_visible()
    page.locator("expansion-panel").filter(has_text="Cloud Services expand_less").get_by_label("Hide details").click()
    expect(page.get_by_text("Cloud Services expand_less")).not_to_be_visible()
    page.locator("expansion-panel").filter(has_text="Cloud Services expand_more").get_by_label("Show details").click()
    expect(page.get_by_text("Cloud Services expand_less")).to_be_visible()

 # Users
    expect(page.get_by_role("heading", name="End-Users")).to_be_visible()
    expect(page.locator("expansion-panel").filter(has_text="End-Users expand_less Tell us").get_by_label("Hide details")).to_be_visible()
    expect(page.get_by_text("Tell us about your end-users")).to_be_visible()
    page.locator("expansion-panel").filter(has_text="End-Users expand_less Tell us").get_by_label("Hide details").click()
    expect(page.get_by_text("Tell us about your end-users")).not_to_be_visible()
    page.locator("expansion-panel").filter(has_text="End-Users expand_more Tell us").get_by_label("Show details").click()
    expect(page.get_by_text("Tell us about your end-users")).to_be_visible()
    