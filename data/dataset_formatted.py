import pandas as pd
import os

# This file is used to load the dataset and do some minimal preprocessing.  For the purposes of intial EDA & model testing, we decided to remove the feature columns that we felt would not provide value for our initial project goals.  Additionally, we removed Grok from our dataset.  For all of these columns & Grok, they were essentially the same for all values (due to either the model never providing explicity sources in the case of Grok, or all column values being the same in the case of the feature columns).  We may revisit these decisions in the future, but for now we felt it was best to remove.

df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'llm_source_attribution_data.csv'))

# df = pd.read_csv('llm_source_attribution_data.csv')

df = df.drop(columns=['Question Number', 'Model Version', 'Explicit Attribution', 'Date', 'Notes While Testing', 'Ads Included in Response'])
df.columns = df.columns.str.strip()
df['Attributed Sources'] = df['Attributed Sources'].str.replace('"', '')

df = df[df['LLM'] != 'grok']