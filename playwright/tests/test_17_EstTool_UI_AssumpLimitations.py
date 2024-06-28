import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# Check question mark overlays work as expected

   

def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    
    page.set_viewport_size({"width": 1920, "height": 1200})
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
    #Organisation
    page.get_by_label("How many employees are in the").click()
    page.get_by_label("How many employees are in the").fill("6000")
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
    page.get_by_label("Number of Servers:").fill("479")
    expect(page.get_by_label("Where are they primarily")).to_have_value("WORLD");
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("Tell us about your cloud")).to_be_visible()
    expect(page.get_by_text("We don't use cloud services")).to_be_visible()
    expect(page.get_by_label("We don't use cloud services")).not_to_be_checked()
    page.get_by_label("We don't use cloud services").check()
    expect(page.get_by_label("We don't use cloud services")).to_be_checked()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).not_to_be_visible()
    expect(page.get_by_text("What is your monthly cloud")).not_to_be_visible()
    # page.get_by_label("What is your monthly cloud").not_to_be_visible()
    

    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    expect(page.get_by_text("Where are your end-users")).to_be_visible()
    page.get_by_label("Where are your end-users").select_option("in Europe")
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("650000")
    page.get_by_label("What percentage of your end-users").click()
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    expect(page.locator("form")).to_contain_text("Mobile 45%")
    expect(page.get_by_text("What's the primary purpose of your")).to_be_visible()
    page.get_by_label("What's the primary purpose of your").select_option("eCommerce")
    page.get_by_role("button", name="Calculate").click()

    # Not recording calcs in this test. Content is here to check link and content of "Assumptions and limitations" page

    expect(page.get_by_role("button", name="Assumptions and limitations")).to_be_visible()
    page.get_by_role("button", name="Assumptions and limitations").click()
    expect(page.get_by_role("heading", name="Assumptions and Limitations")).to_be_visible()
    expect(page.get_by_label("Close assumptions and").filter(has_not_text=re.compile("Close"))).to_be_visible() # 'X' close button
    # Need regex because has_text="Close" is case insensitive and 'X' button has the text 'close'
    expect(page.get_by_text("The Technology Carbon Estimator tool is designed to")).to_be_visible()
    expect(page.get_by_role("heading", name="Assumptions", exact=True)).to_be_visible()
    expect(page.get_by_role("heading", name="Time period")).to_be_visible()
    expect(page.get_by_text("The estimation is based on a")).to_be_visible()
    expect(page.get_by_text("Desktops, Laptops and")).to_be_visible()
    expect(page.get_by_text("Servers and Networking")).to_be_visible()
    expect(page.get_by_text("Obviously, this may not match")).to_be_visible()
    expect(page.get_by_role("heading", name="Number of Employee Devices")).to_be_visible()
    expect(page.get_by_text("Without a specified number of devices, we estimate based on the number of")).to_be_visible()
    expect(page.get_by_role("heading", name="Number of Servers")).to_be_visible()
    expect(page.get_by_text("Without a specified number of servers, we give an initial estimate based on the")).to_be_visible()
    expect(page.get_by_role("heading", name="Number of Networking Devices")).to_be_visible()
    expect(page.get_by_text("At present, we estimate a")).to_be_visible()
    expect(page.get_by_role("heading", name="Power consumption")).to_be_visible()
    expect(page.get_by_text("Each class of device is given an average power demand, based on data compiled")).to_be_visible()
    expect(page.get_by_role("cell", name="Device Type").first).to_be_visible()
    expect(page.get_by_text("In the case of servers and")).to_be_visible()
    expect(page.get_by_role("heading", name="Carbon Intensity")).to_be_visible()
    expect(page.get_by_text("We make use of the latest")).to_be_visible()
    expect(page.get_by_role("cell", name="World Location")).to_be_visible()
    expect(page.get_by_role("heading", name="Upstream Emissions").first).to_be_visible()
    expect(page.get_by_role("cell", name="Device Type").nth(1)).to_be_visible()
    expect(page.get_by_text("* The network device figure")).to_be_visible()
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_text("We have derived average")).to_be_visible()
    expect(page.get_by_role("cell", name="Figure")).to_be_visible()
    expect(page.get_by_text("Clearly there is a large")).to_be_visible()
    expect(page.get_by_text("The estimated kWh of cloud")).to_be_visible()
    expect(page.get_by_role("heading", name="Downstream Emissions")).to_be_visible()
    expect(page.get_by_text("At present we focus on the")).to_be_visible()
    expect(page.get_by_role("cell", name="Type", exact=True)).to_be_visible()
    expect(page.get_by_text("These figures are combined")).to_be_visible()
    expect(page.get_by_role("heading", name="Network Data Transfer")).to_be_visible()
    expect(page.get_by_text("Our outgoing network data")).to_be_visible()
    page.get_by_role("heading", name="End-User Devices").click()
    expect(page.get_by_text("We combine device information")).to_be_visible()
    expect(page.get_by_role("heading", name="Limitations", exact=True)).to_be_visible()
    expect(page.get_by_text("Here are some aspects of the")).to_be_visible()
    expect(page.get_by_role("heading", name="Upstream Emissions").nth(1)).to_be_visible()
    expect(page.get_by_role("heading", name="Off the Shelf Software")).to_be_visible()
    expect(page.get_by_text("This is a tough area to")).to_be_visible()
    expect(page.get_by_text("Without this kind of detailed")).to_be_visible()
    expect(page.get_by_role("heading", name="Operational Emissions - Direct")).to_be_visible()
    expect(page.get_by_role("heading", name="Generators")).to_be_visible()
    expect(page.get_by_text("In the interests of using")).to_be_visible()
    expect(page.get_by_role("heading", name="Operational Emissions - Indirect")).to_be_visible()
    expect(page.get_by_role("heading", name="SaaS")).to_be_visible()
    expect(page.get_by_text("Like Off the shelf and open")).to_be_visible()
    expect(page.get_by_role("heading", name="Managed Services")).to_be_visible()
    expect(page.get_by_text("We currently do not make a")).to_be_visible()
    expect(page.get_by_label("Close assumptions and").filter(has_text=re.compile("Close"))).to_be_visible()
    page.get_by_label("Close assumptions and").filter(has_text=re.compile("Close")).click()
    expect(page.get_by_role("heading", name="Technology Carbon Estimator")).to_be_visible()
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()



    ##############################################################################
    