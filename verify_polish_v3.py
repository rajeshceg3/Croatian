from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Desktop Test
        print("Testing Desktop...")
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.goto('http://localhost:8080')

        # Wait for loader to disappear
        try:
            page.wait_for_selector('#loading-overlay.hidden', state='attached', timeout=5000)
            time.sleep(1) # Extra wait for fade out
        except:
            print("Loader did not disappear properly or fast enough")

        # Check Sidebar Width
        sidebar_width = page.eval_on_selector('#sidebar', 'el => getComputedStyle(el).width')
        print(f"Sidebar width: {sidebar_width}")
        if sidebar_width != '440px':
            print("FAIL: Sidebar width is not 440px")
        else:
            print("PASS: Sidebar width is 440px")

        # Check for Thumbnails
        # Wait for results to load
        page.wait_for_selector('.search-result-item', timeout=5000)

        # Check if thumbnail exists
        thumbnails = page.locator('.result-thumbnail img')
        count = thumbnails.count()
        print(f"Thumbnails found: {count}")
        if count > 0:
            print("PASS: Thumbnails are rendering")
        else:
            print("FAIL: No thumbnails found")

        page.screenshot(path='desktop_polish_v3.png')
        print("Desktop screenshot saved.")

        # Mobile Test
        print("Testing Mobile...")
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            is_mobile=True,
            has_touch=True
        )
        page_mobile = context.new_page()
        page_mobile.goto('http://localhost:8080')

        try:
            page_mobile.wait_for_selector('#loading-overlay.hidden', state='attached', timeout=5000)
            time.sleep(1)
        except:
             print("Mobile Loader did not disappear properly")

        # Check Sticky Header
        # We can't easily check 'sticky' computed style effectively without scrolling, but we can check if the element exists
        if page_mobile.locator('.sidebar-header').is_visible():
            print("PASS: Sidebar header exists on mobile")

        # Check Handle
        handle = page_mobile.locator('#mobile-handle-container')
        if handle.is_visible():
            print("PASS: Mobile handle is visible")
        else:
            print("FAIL: Mobile handle is NOT visible")

        page_mobile.screenshot(path='mobile_initial_v3.png')
        print("Mobile initial screenshot saved.")

        browser.close()

if __name__ == '__main__':
    run()
