from account_details import email, app_password
import smtplib
import pandas as pd
import numpy as np

#Initiating simple mail transfer protocol
smtp_object = smtplib.SMTP('smtp.gmail.com', 587)
smtp_object.ehlo()
smtp_object.starttls()

old_data = pd.read_csv('old_data.csv')
new_data = pd.read_csv('new_data.csv')

#Concating two dataframes and creating change signals (True or False)
df = pd.concat([old_data, new_data], axis=1)
df['Price Match'] = np.where(old_data['Price'] == new_data['Price'], 'True', 'False')
df['Id Match'] = np.where(old_data['Item Id'] == new_data['Item Id'], 'True', 'False')
df['Title Match'] = np.where(old_data['Title'] == new_data['Title'], 'True', 'False')

#Place to store everything that changed
id_changed = []
title_changed = []
price_changed = []
what_changed = []

#Comparing two files
for i in range(0, df.shape[0]):
    if df['Price Match'][i] == 'False':
        price_changed.append(new_data['Price'][i])
        id_changed.append(new_data['Item Id'][i])
        title_changed.append(new_data['Title'][i])
        what_changed.append('Price')
    elif df['Id Match'][i] == 'False':
        price_changed.append(new_data['Price'][i])
        id_changed.append(new_data['Item Id'][i])
        title_changed.append(new_data['Title'][i])
        what_changed.append('Item Id')
    
    elif df['Title Match'][i] == 'False':
        price_changed.append(new_data['Price'][i])
        id_changed.append(new_data['Item Id'][i])
        title_changed.append(new_data['Title'][i])
        what_changed.append('Title') 
    else:
        continue


#Loging in to the email and sending changes to the user
smtp_object.login(email, app_password)

from_address = email
to_address = 'mkomljenovic11@gmail.com'

subject = 'Your store requires attention'
message = f'Hi Mateo,\nThere are some changes that require your attention. \nThere is a total of {len(id_changed)} items that had a change. Here is a list item ids that had a change:\n\nItem Ids:{id_changed}\nWhat Changed:{what_changed}\n\nThanks for your support!\nKind regards'
msg = 'Subject: '+subject+'\n'+message

smtp_object.sendmail(from_address, to_address, msg)
smtp_object.quit()