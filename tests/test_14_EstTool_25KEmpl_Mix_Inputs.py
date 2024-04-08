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
    expect(page.get_by_label("Where are they primarily")).to_have_value("global");
    
    # Cloud
    expect(page.get_by_text("Cloud 50%")).to_be_visible()
    page.get_by_label("Cloud 50%On-prem 50%").click()
    page.get_by_label("Cloud 50%On-prem 50%").press("ArrowRight")
    page.get_by_label("Cloud 55%On-prem 45%").press("ArrowRight")
    page.get_by_label("Cloud 60%On-prem 40%").press("ArrowRight")
    page.get_by_label("Cloud 65%On-prem 35%").press("ArrowRight")
    page.get_by_label("Cloud 70%On-prem 30%").press("ArrowRight")
    page.get_by_label("Cloud 75%On-prem 25%").press("ArrowRight")
    expect(page.get_by_label("Where are your cloud servers")).to_have_value("global");
    expect(page.get_by_text("What is your monthly cloud")).to_be_visible()
    page.get_by_label("What is your monthly cloud").select_option("10: Object")
    
    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    expect(page.get_by_text("Where are your users")).to_be_visible()
    page.get_by_label("Where are your users").select_option("us")
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("10000000")
    page.get_by_label("What percentage of your users").click()
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    expect(page.locator("form")).to_contain_text("Mobile 80%")
    expect(page.get_by_text("What's the purpose of your")).to_be_visible()
    page.get_by_label("What's the purpose of your").select_option("streaming")
   
    # Calculate
    page.get_by_role("button", name="Calculate").click()
    expect(page.get_by_text("Upstream Emissions:")).to_be_visible()
    expect(page.get_by_text("5%")).to_be_visible()
    expect(page.get_by_text("Indirect Emissions:")).to_be_visible()
    expect(page.get_by_text("0%", exact=True).first).to_be_visible()
    expect(page.get_by_text("Direct Emissions:", exact=True)).to_be_visible()
    expect(page.get_by_text("11%")).to_be_visible()
    expect(page.get_by_text("Downstream Emissions:")).to_be_visible()
    expect(page.get_by_text("84%", exact=True).last).to_be_visible()


    ##############################################################################
    
    