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
POSE_URL = 'https://www.yogajournal.com/pose-finder'
TYPE_URL = 'https://www.yogajournal.com/poses/types'
BENEFIT_URL = 'https://www.yogajournal.com/poses/yoga-by-benefit'


# url : url to be parsed
# container_html : element container
# container_class : css class of container
# parent_html : parent element of the content to be extracted
# parent_class : css class of parent
# data : data to parse
# data_spec : data additional info (optional)
# data_val : value to additional info (opt)
def html_parser(url, container_html, container_class, parent_html, parent_class, data, data_spec = None, data_val = None):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    container = soup.find(container_html, {'class': container_class})
    # print(container)
    parents = container.findChildren(parent_html, {'class': parent_class})
    list = []
    #print(parents)
    if (data_spec == None) :
        for article in parents:
            titles = article.findChildren(data)
            for title in titles :
                title_text = title.getText()
                list.append(title_text)
    else :
        for article in parents :
            titles = article.findChildren(data, {data_spec : data_val})
            for title in titles :
                title_text = title.getText()
                list.append(title_text)
    return list

# Get Sanskrit Name
sanskrit_poses = html_parser(POSE_URL, 'div', 'm-table', 'tr', '', 'td','data-col', 'Sanskrit Name')
print(sanskrit_poses)

# Get English Name
english_poses = html_parser(POSE_URL, 'div', 'm-table', 'tr', '', 'td','data-col', 'English Name')
print(english_poses)

# html_parser(TYPE_URL, 'section', 'm-card-group-container', 'article', 'm-card', 'h2')
