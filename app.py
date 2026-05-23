import webview
import threading
from screeninfo import get_monitors
from api.main_api import MainDatabaseAPI
from api.vendor_api import VendorDatabaseAPI
from api.config_api import ConfigAPI


class ApplicationAPI:
    def __init__(self):
        self.config = ConfigAPI()
        self.main = MainDatabaseAPI(self.config)
        self.vendor = VendorDatabaseAPI(self.config)
    def close_app(self) -> None:
        webview.windows[0].destroy()

    def navigate_to(self, url) -> None:
        threading.Thread(target=webview.windows[0].load_url, args=(url,)).start()

api = ApplicationAPI()

if "__main__" == __name__:
    '''Start by getting the height and width of the current monitors
        This is to set the height and width of the application. This will grab monitor size for 
        each monitor that is available and average out the heigh and width. So the application
        will work well on both monitors regardless of size.'''

    monitors = get_monitors()
    totalWidth = 0
    totalHeight = 0
    avgWidth = 0
    avgHeight = 0

    for monitor in monitors:
        totalWidth += monitor.width
        totalHeight += monitor.height

    avgWidth = totalWidth / len(monitors)
    avgHeight = totalHeight / len(monitors)


    window = webview.create_window(
        title="The Solution",
        url="main_page.html",
        on_top=True,
        frameless=True,
        easy_drag=True,
        js_api=api,
        width=avgWidth / 2,
        height=avgHeight -50, )
    webview.start(debug=True)