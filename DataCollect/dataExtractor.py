# Python 3
# Creates a csv file parsing data need from the web
# Author : Cecilia Macioszek (GitHub : c-c-l, Instagram : this_is_ccl)

import csv
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
from bs4 import SoupStrainer
import ssl

# Ignore SSL certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Constant variables
TYPEURL = 'https://www.yogajournal.com/poses/types'
BENEFITURL = 'https://www.yogajournal.com/poses/yoga-by-benefit'


# url : url to be parsed
# containerhtml : element container
# containerclass : css class of container
# parenthtml : parent element of the content to be extracted
# parentclass : css class of parent
def htmlparser(url, containerhtml, containerclass, parenthtml, parentclass):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    container = soup.find(containerhtml, {'class': containerclass})
    # print(container)
    parents = container.findChildren(parenthtml, {'class': parentclass})
    #print(parents)
    for article in parents:
        titles = article.findChildren('h2')
        for h2 in titles :
            titletext = h2.getText()
            print(titletext)

# Get types
htmlparser(TYPEURL, 'section', 'm-card-group-container', 'article', 'm-card')
