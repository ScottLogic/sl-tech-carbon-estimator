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
    page.get_by_label("How many employees are in the").fill("100")
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
    page.get_by_label("Where are they primarily").select_option("uk")
    page.get_by_label("Where are they primarily").select_option("global")
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("Tell us about your cloud")).to_be_visible()
    expect(page.get_by_text("We don't use cloud services")).to_be_visible()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).to_be_visible()
    expect(page.get_by_text("Cloud 50%")).to_be_visible()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?Cloud 50%On-")).to_be_visible()
    page.get_by_text("On-prem 50%").click()
    expect(page.get_by_text("Where are your cloud servers")).to_be_visible()
    expect(page.get_by_label("Where are your cloud servers")).to_be_visible()
    page.get_by_label("Where are your cloud servers").select_option("uk")
    expect(page.get_by_label("Where are your cloud servers")).to_be_visible()
    page.get_by_label("Where are your cloud servers").select_option("global")
    expect(page.get_by_text("We have derived a rough")).to_be_visible()
    expect(page.get_by_text("What is your monthly cloud")).to_be_visible()
    expect(page.get_by_label("What is your monthly cloud")).to_be_visible()
    page.get_by_label("What is your monthly cloud").select_option("200-500")
    page.get_by_label("What is your monthly cloud").select_option("0-200")
    
    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your users. At")).to_be_visible()
    expect(page.get_by_text("Where are your users")).to_be_visible()
    expect(page.get_by_label("Where are your users")).to_be_visible()
    page.get_by_label("Where are your users").select_option("uk")
    page.get_by_label("Where are your users").select_option("global")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    expect(page.get_by_label("How many monthly active users")).to_be_visible()
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("100")
    expect(page.get_by_text("What percentage of your users")).to_be_visible()
    expect(page.get_by_text("Mobile 50%")).to_be_visible()
    expect(page.get_by_text("Computer 50%")).to_be_visible()
    expect(page.get_by_text("What's the purpose of your")).to_be_visible()
    expect(page.get_by_label("What's the purpose of your")).to_be_visible()
    page.get_by_label("What's the purpose of your").select_option("streaming")
    page.get_by_label("What's the purpose of your").select_option("average")
    
    # Calculate
    page.get_by_role("button", name="Calculate").click()
    expect(page.get_by_text("Upstream Emissions:")).to_be_visible()
    expect(page.get_by_text("28%")).to_be_visible()
    expect(page.get_by_text("Indirect Emissions:")).to_be_visible()
    expect(page.get_by_text("0%", exact=True)).to_be_visible()
    expect(page.get_by_text("Direct Emissions:", exact=True)).to_be_visible()
    expect(page.get_by_text("71%")).to_be_visible()
    expect(page.get_by_text("Downstream Emissions:")).to_be_visible()
    expect(page.get_by_text("1%", exact=True)).to_be_visible()
    
