import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# User checks On Premise "Don't know" checkbox | Only selection made 

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    page.set_viewport_size({"width": 1920, "height": 1200})
   
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    # page.pause()
    
    # Organisation
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    expect(page.get_by_text("How many employees are in the")).to_be_visible()
    expect(page.get_by_label("How many employees are in the")).to_have_value("100");
    expect(page.get_by_text("What percentage of those")).to_be_visible()
    expect(page.get_by_text("Desktops 50%")).to_be_visible()
    expect(page.get_by_text("Laptops 50%")).to_be_visible()
    
    # On Prem
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    expect(page.get_by_text("We'll use the number of")).to_be_visible()
    expect(page.get_by_text("How many on-premise servers")).to_be_visible()
    page.get_by_label("I don't know").check()
    expect(page.get_by_text("info", exact=True)).to_be_visible()
    expect(page.get_by_text("We'll make an assumption")).to_be_visible()
    expect(page.get_by_text("Number of Servers:")).to_be_visible()
    expect(page.get_by_label("Number of Servers:")).to_be_disabled()
    expect(page.get_by_text("Where are they primarily")).to_be_visible()
    page.get_by_label("Where are they primarily located?", exact=True).press("Enter")
    page.get_by_label("Where are they primarily located?", exact=True).select_option("in the UK")
    page.get_by_label("Where are they primarily located?", exact=True).select_option("Globally")
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("Tell us about your cloud")).to_be_visible()
    expect(page.get_by_text("We don't use cloud services")).to_be_visible()
    page.pause()
    expect(page.get_by_label("We don't use cloud services")).to_be_visible()
    expect(page.get_by_label("We don't use cloud services")).not_to_be_checked()
    page.get_by_label("We don't use cloud services").check()
    page.get_by_label("We don't use cloud services").uncheck()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).to_be_visible()
    expect(page.get_by_text("Cloud 50%")).to_be_visible()
    expect(page.get_by_text("On-premise 50%")).to_be_visible()
    # page.get_by_label("Where are your cloud servers primarily located? helper popup").press("Tab")
    expect(page.get_by_label("Where are your cloud servers")).to_be_visible()
    page.get_by_label("Where are your cloud servers").select_option("GBR")
    page.get_by_label("Where are your cloud servers").select_option("WORLD")
    expect(page.get_by_text("We have derived a rough")).to_be_visible()
    expect(page.get_by_text("What is your monthly cloud")).to_be_visible()
    expect(page.get_by_label("What is your monthly cloud")).to_have_value("0: Object");
    
    # Users
    expect(page.get_by_role("heading", name="End-Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your end-users -")).to_be_visible()
    # page.get_by_label("Where are your cloud servers primarily located? helper popup").press("Tab")
    page.get_by_label("Where are your end-users primarily located?", exact=True).select_option("Globally")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    expect(page.get_by_label("How many monthly active users")).to_have_value("100");
    expect(page.get_by_text("What percentage of your end-users")).to_be_visible()
    expect(page.get_by_text("Mobile 50%")).to_be_visible()
    expect(page.get_by_text("Computer 50%")).to_be_visible()
    # page.get_by_label("What's the purpose of your website helper popup").click()
    # page.get_by_label("What's the purpose of your website helper popup").press("Tab")
    expect(page.get_by_text("What's the primary purpose of")).to_be_visible()
    page.get_by_label("What's the primary purpose of").select_option("socialMedia")
    page.get_by_label("What's the primary purpose of").select_option("average")
    # page.get_by_label("What's the purpose of your website?").press("Tab")
    
    # Calculate
    # Calculate outcome and make sure it matches spreadsheet
    # page.pause()
    page.get_by_role("button", name="Calculate").click()
    expect(page.locator("foreignobject")).to_contain_text("Upstream Emissions - 29%")
    expect(page.locator("foreignobject")).to_contain_text("Direct Emissions - 70%")
    expect(page.locator("foreignobject")).to_contain_text("Indirect Emissions - <1%")
    expect(page.locator("foreignobject")).to_contain_text("Downstream Emissions - <1%")
    

    
    ##############################################################################
    
