# Python 3
# Creates a csv file parsing data need from the web
# Author : Cecilia Macioszek (GitHub : c-c-l, Instagram : this_is_ccl)

import csv
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import ssl

# Ignore SSL certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Constant variables
TYPEURL = 'https://www.yogajournal.com/poses/types'
BENEFITURL = 'https://www.yogajournal.com/poses/yoga-by-benefit'


# url : url to be parsed
# parenthtml : parent element of the content to be extracted
# parentclass : the css class of the parent
def htmlparser(url, parenthtml, parentclass):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    parent = soup.find(parenthtml, {'class': parentclass})
    print(parent)


htmlparser(TYPEURL, 'section', 'm-card-group')
