import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# 25,000 empoyees
# Variety of input: users/desktops/servers etc
# Calcs match spreadsheet
   

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    
    page.set_viewport_size({"width": 1920, "height": 1200})
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
    #Organisation
    page.get_by_label("How many employees are in the").click()
    page.get_by_label("How many employees are in the").fill("25000")
    expect(page.get_by_text("Desktops 50%")).to_be_visible()
    page.get_by_label("What percentage of those").click()
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    expect(page.get_by_text("Desktops 80%")).to_be_visible()
    
    # On Prem Servers
    expect(page.get_by_text("How many on-premise servers")).to_be_visible()
    page.get_by_label("Number of Servers:").click()
    page.get_by_label("Number of Servers:").fill("500")
    expect(page.get_by_label("Where are they primarily")).to_have_value("WORLD");
    
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
    expect(page.get_by_text("Where are your end-users")).to_be_visible()
    page.get_by_label("Where are your end-users").select_option("in North America")
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("10000000")
    page.get_by_label("What percentage of your end-users").click()
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    page.get_by_label("What percentage of your end-users").press("ArrowRight")
    expect(page.locator("form")).to_contain_text("Mobile 80%")
    expect(page.get_by_text("What's the primary purpose of your")).to_be_visible()
    page.get_by_label("What's the primary purpose of your").select_option("streaming")
   
    # Calculate
    # Calculate outcome and make sure it matches spreadsheet
    page.get_by_role("button", name="Calculate").click()
    expect(page.locator("foreignobject")).to_contain_text("Upstream Emissions - 7%")
    expect(page.locator("foreignobject")).to_contain_text("Direct Emissions - 16%")
    expect(page.locator("foreignobject")).to_contain_text("Indirect Emissions - <1%")
    expect(page.locator("foreignobject")).to_contain_text("Downstream Emissions - 77%")
    
    

    
    ##############################################################################
    
    