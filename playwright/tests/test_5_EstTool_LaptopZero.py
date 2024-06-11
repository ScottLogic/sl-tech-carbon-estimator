import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# User slides percentage for Laptop use down to 0%
# Ensure calcs are matching spreadsheet

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    page.set_viewport_size({"width": 1920, "height": 1200})
   
    page.get_by_role("heading", name="Carbon Estimator").click()
    
    # Organisation
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    expect(page.get_by_text("How many employees are in the")).to_be_visible()
    expect(page.get_by_label("How many employees are in the")).to_have_value("100");
    expect(page.get_by_text("What percentage of those")).to_be_visible()
    page.get_by_text("Desktops 50%").click()
    expect(page.get_by_label("What percentage of those")).to_have_value("50");
    page.get_by_label("What percentage of those").click()
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    expect(page.get_by_text("Laptops 0%")).to_be_visible()
    
    # On Prem
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    expect(page.get_by_text("We'll use the number of")).to_be_visible()
    expect(page.get_by_text("How many on-premise servers")).to_be_visible()
    expect(page.locator("label").filter(has_text="I don't know")).to_be_visible()
    expect(page.get_by_label("I don't know")).not_to_be_checked()
    expect(page.get_by_text("Number of Servers:")).to_be_visible()
    expect(page.get_by_label("Number of Servers:")).to_have_value("10");

    expect(page.get_by_text("Where are they primarily")).to_be_visible()
    page.get_by_label("Where are they primarily located?", exact=True).press("Enter")
    page.get_by_label("Where are they primarily located?", exact=True).select_option("GBR")
    page.get_by_label("Where are they primarily located?", exact=True).select_option("Globally")
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("Tell us about your cloud")).to_be_visible()
    expect(page.get_by_text("We don't use cloud services")).to_be_visible()
    expect(page.get_by_label("We don't use cloud services")).not_to_be_checked()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).to_be_visible()
    expect(page.get_by_text("Cloud 50%")).to_be_visible()
    expect(page.get_by_text("On-premise 50%")).to_be_visible()
    expect(page.get_by_text("Cloud 50%On-premise 50%")).to_be_visible()
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").click()
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    expect(page.get_by_text("Cloud 45%")).to_be_visible()
    
    expect(page.get_by_text("Where are your cloud servers")).to_be_visible()
    page.get_by_label("Where are your cloud servers").select_option("GBR")
    page.get_by_label("Where are your cloud servers").select_option("WORLD")
    expect(page.get_by_text("We have derived a rough")).to_be_visible()
    expect(page.get_by_text("What is your monthly cloud")).to_be_visible()
    expect(page.get_by_label("What is your monthly cloud")).to_have_value("0: Object");
    
    # Users
    expect(page.get_by_role("heading", name="End-Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your end-users -")).to_be_visible()
    # page.get_by_label("Where are your cloud servers primarily located? helper popup").press("Tab")
    expect(page.get_by_text("We don't have any external")).to_be_visible()
    expect(page.get_by_text("What's the primary purpose of")).to_be_visible()
    expect(page.get_by_label("What's the primary purpose of")).to_be_visible()
    page.get_by_label("What's the primary purpose of").select_option("information")
    page.get_by_label("What's the primary purpose of").select_option("average")


    # Calculate
    # Calculate outcome and make sure it matches spreadsheet
   # page.pause()
    page.get_by_role("button", name="Calculate").click()
    expect(page.locator("foreignobject")).to_contain_text("Upstream Emissions - 23%")
    expect(page.locator("foreignobject")).to_contain_text("Direct Emissions - 76%")
    expect(page.locator("foreignobject")).to_contain_text("Indirect Emissions - <1%")
    expect(page.locator("foreignobject")).to_contain_text("Downstream Emissions - <1%")
    

    
    ##############################################################################