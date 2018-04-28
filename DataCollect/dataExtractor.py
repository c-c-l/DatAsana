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
BASE_URL = 'https://www.yogajournal.com'
POSE_URL = 'https://www.yogajournal.com/pose-finder'
TYPE_URL = 'https://www.yogajournal.com/poses/types'
BENEFIT_URL = 'https://www.yogajournal.com/poses/yoga-by-benefit'


# url : url to be parsed
# container_html : element container
# container_class : css class of container
# parent_html : parent element of the content to be extracted
# parent_class : css class of parent
# data : data to parse
# data_spec : data additional info (opt)
# data_val : value to additional info (opt)
def html_parser(url, container_html, container_class, parent_html, parent_class, data, data_spec = None, data_val = None):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    container = soup.find(container_html, {'class': container_class})
    parents = container.findChildren(parent_html, {'class': parent_class})
    list = []
    if (data_spec == None) :
        for article in parents:
            titles = article.findChildren(data)
            for title in titles :
                title_text = title.getText()
                if (title_text.find('Yoga for') != -1) :
                    title_text = title_text.replace('Yoga for ', '')
                list.append(title_text)
    else :
        for article in parents :
            titles = article.findChildren(data, {data_spec : data_val})
            for title in titles :
                title_text = title.getText()
                if (title_text.find(' Yoga Poses') != -1) :
                    title_text = title_text.replace(' Yoga Poses', '/')
                list.append(title_text)
    return list

def get_link(url, container_html, container_class, parent_html, parent_class, data):
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    container = soup.find(container_html, {'class': container_class})
    parents = container.findChildren(parent_html, {'class': parent_class})
    list_link = []
    for article in parents:
        links = article.findChildren(data)
        for link in links:
            link_content = link.get('href')
            list_link.append(link_content)
    return list_link

# Get Sanskrit Name
sanskrit_poses = html_parser(POSE_URL, 'div', 'm-table', 'tr', '', 'td','data-col', 'Sanskrit Name')

# Get English Name
english_poses = html_parser(POSE_URL, 'div', 'm-table', 'tr', '', 'td','data-col', 'English Name')

# Get Type of pose (NOTE : Multiple val are separated with slash)
type_poses = html_parser(POSE_URL, 'div', 'm-table', 'tr', '', 'td','data-col', 'Pose Type')

# Benefits
# Get title for benefits
benefits = html_parser(BENEFIT_URL, 'section', 'm-card-group-container', 'article', 'm-card', 'h2')
print(benefits)
# Get links for benefits
benefit_link=get_link(BENEFIT_URL, 'section', 'm-card-group-container', 'article', 'm-card', "a")
print(benefit_link)

# Create a list for each benefits with name and link
list_benef = []
print(type(list_benef))
for b_index in range(0, len(benefits)):
    t_bene = list_benef.append([benefits[b_index],benefit_link[b_index]])
    b_index = b_index + 1
print(list_benef)

# Create list of tuples that store Sanskrit name and English name in each tuple
list_sanskrit_english = []
for pose_index in range(0, len(sanskrit_poses)):
    tuple = list_sanskrit_english.append([sanskrit_poses[pose_index], english_poses[pose_index], type_poses[pose_index]])
    pose_index = pose_index + 1

# Create data set as csv file
csv_file = 'yoga_data.csv'
with open (csv_file, 'w', newline='') as newFile:
    writer = csv.writer(newFile, delimiter=',')
    for row in list_sanskrit_english :
        writer.writerow(row)
