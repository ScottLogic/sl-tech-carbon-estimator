import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# Ensure calcs are matching spreadsheet

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    page.set_viewport_size({"width": 1920, "height": 1200})
    
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
        # Organisation
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    expect(page.get_by_text("How many employees are in the")).to_be_visible()
    expect(page.get_by_label("How many employees are in the")).to_be_visible()
    page.get_by_label("How many employees are in the").click()
    page.get_by_label("How many employees are in the").fill("1000")
    expect(page.get_by_text("What percentage of those")).to_be_visible()
    expect(page.get_by_text("Desktops 50%")).to_be_visible()
    expect(page.get_by_text("Laptops 50%")).to_be_visible()
    expect(page.get_by_label("What percentage of those")).to_be_visible()
    
    # On Prem
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    expect(page.get_by_text("We'll use the number of")).to_be_visible()
    expect(page.get_by_text("How many on-premise servers")).to_be_visible()
    expect(page.locator("label").filter(has_text="I don't know")).to_be_visible()
    expect(page.get_by_label("Number of Servers:")).to_be_visible()
    page.get_by_label("Number of Servers:").click()
    page.get_by_label("Number of Servers:").fill("10")
    expect(page.get_by_text("Where are they primarily")).to_be_visible()
    expect(page.get_by_label("Where are they primarily")).to_be_visible()
    page.get_by_label("Where are they primarily").select_option("WORLD")
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("Tell us about your cloud")).to_be_visible()
    expect(page.get_by_text("We don't use cloud services")).to_be_visible()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).to_be_visible()
    expect(page.get_by_text("Cloud 50%")).to_be_visible()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?Cloud 50%On-")).to_be_visible()
    page.get_by_text("On-premise 50%").click()
    expect(page.get_by_text("Where are your cloud servers")).to_be_visible()
    expect(page.get_by_label("Where are your cloud servers")).to_be_visible()
    page.get_by_label("Where are your cloud servers").select_option("in the UK")
    expect(page.get_by_text("We have derived a rough")).to_be_visible()
    expect(page.get_by_text("What is your monthly cloud")).to_be_visible()
    page.get_by_label("What is your monthly cloud").select_option("10: Object") #$1m-$2m
    
    # Users
    expect(page.get_by_role("heading", name="End-Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your end-users - ")).to_be_visible()
    expect(page.get_by_text("Where are your end-users")).to_be_visible()
    expect(page.get_by_label("Where are your end-users")).to_be_visible()
    page.get_by_label("Where are your end-users").select_option("in the UK")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    expect(page.get_by_label("How many monthly active users")).to_be_visible()
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("100")
    expect(page.get_by_text("What percentage of your end-users")).to_be_visible()
    expect(page.get_by_text("Mobile 50%")).to_be_visible()
    expect(page.get_by_text("Computer 50%")).to_be_visible()
    expect(page.get_by_text("What's the primary purpose of your")).to_be_visible()
    # expect(page.get_by_label("What's the primary purpose of your")).to_be_visible()
    page.get_by_label("What's the primary purpose of your").select_option("streaming")
    
    page.get_by_role("button", name="Calculate").click()
    expect(page.locator("foreignobject")).to_contain_text("Upstream Emissions - 11%")
    expect(page.locator("foreignobject")).to_contain_text("Direct Emissions - 9%")
    expect(page.locator("foreignobject")).to_contain_text("Indirect Emissions - 80%")
    expect(page.locator("foreignobject")).to_contain_text("Downstream Emissions - <1%")



    ##############################################################################