import pandas as pd
from IPython.display import display
import matplotlib.pyplot as plt

df = pd.read_csv('llm_source_attribution_data.csv')

df = df.drop(columns=['Question Number', 'Notes While Testing', 'Ads Included in Response'])
df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
# df['Ads Included in Response'] = df['Ads Included in Response'].replace({'no_ads': False, 'ads': True})
df.columns = df.columns.str.strip()
df['Attributed Sources'] = df['Attributed Sources'].str.replace('"', '')