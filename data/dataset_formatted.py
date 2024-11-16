import pandas as pd
from IPython.display import display
import os

df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'llm_source_attribution_data.csv'))

# df = pd.read_csv('llm_source_attribution_data.csv')

df = df.drop(columns=['Question Number', 'Model Version', 'Explicit Attribution', 'Date', 'Notes While Testing', 'Ads Included in Response'])
df.columns = df.columns.str.strip()
df['Attributed Sources'] = df['Attributed Sources'].str.replace('"', '')

df = df[df['LLM'] != 'grok']

print(df.head())