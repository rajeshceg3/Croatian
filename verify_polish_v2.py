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
        page.wait_for_selector('#loading-overlay.hidden', state='attached', timeout=5000)
        time.sleep(1) # Extra wait for fade out

        # Wait for map tiles and markers
        page.wait_for_selector('.leaflet-marker-icon', timeout=10000)

        page.screenshot(path='desktop_polish_v2.png')
        print("Desktop screenshot saved.")

        # Mobile Test
        print("Testing Mobile...")
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page_mobile = context.new_page()
        page_mobile.goto('http://localhost:8080')

        # Wait for loader
        page_mobile.wait_for_selector('#loading-overlay.hidden', state='attached', timeout=5000)
        time.sleep(1)

        # Wait for markers
        page_mobile.wait_for_selector('.leaflet-marker-icon', timeout=10000)

        page_mobile.screenshot(path='mobile_initial_v2.png')
        print("Mobile initial screenshot saved.")

        # Test interactions - Expand Sidebar
        # In Playwright we can drag or click
        # Try dragging the handle
        handle = page_mobile.locator('#mobile-handle-container')
        if handle.is_visible():
            box = handle.bounding_box()
            page_mobile.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
            page_mobile.mouse.down()
            page_mobile.mouse.move(box['x'] + box['width']/2, 100) # Drag up to y=100
            page_mobile.mouse.up()

            time.sleep(1) # Wait for animation
            page_mobile.screenshot(path='mobile_expanded_v2.png')
            print("Mobile expanded screenshot saved.")

        browser.close()

if __name__ == '__main__':
    run()
