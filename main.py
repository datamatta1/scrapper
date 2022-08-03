import json
import pandas as pd


with open('day1file.json','r') as read_file:
    data = json.load(read_file)

    
ids = []
titles = []
prices = []

for key, value in data.items():
    print(value[0]['id'])
    
    for i in range(0, len(value)):
        ids.append(value[i]['id'])
        titles.append(value[i]['title'])
        prices.append(value[i]['variants'][0]['price'])

dataframe = pd.DataFrame(columns=['ID','Title','Price'])
dataframe['ID'] = pd.Series(ids)
dataframe['Title'] = pd.Series(titles)
dataframe['Price'] = pd.Series(prices)

print(dataframe)