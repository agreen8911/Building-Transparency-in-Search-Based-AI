import sys
import os
import pandas as pd
import numpy as np
import tldextract
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MultiLabelBinarizer
from collections import Counter
from IPython.display import display
from urllib.parse import urlparse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data')))

from dataset_formatted import df

df_test = df.__deepcopy__()

# Fill missing values for columns
df_test['Number of Sources'] = df_test['Number of Sources'].fillna(0)
df_test['Attributed Sources'] = df_test['Attributed Sources'].fillna('')
df_test['Are All Source Links Functional'] = df_test['Are All Source Links Functional'].fillna('')
df_test['Multi-modal Response'] = df_test['Multi-modal Response'].fillna('')

# Insert Trust Score column
df_test.insert(7, 'Trust Score', 0)

# Compute Trust Score
for index, r in df_test.iterrows():
    trust_score = 0
    if r['Number of Sources'] > 0:
        trust_score += 5
    if r['Are All Source Links Functional'] == 'all_links_functional':
        trust_score += 2
    elif r['Are All Source Links Functional'] == 'some_links_functional':
        trust_score += 1
    if r['Attributed Sources'] != '':
        unique_sources = set(r['Attributed Sources'].split(', '))
        trust_score += len(unique_sources)
    if r['Multi-modal Response'] == 'multi-modal':
        trust_score += 2
    elif r['Multi-modal Response'] == 'text_only':
        trust_score += 1

    df_test.at[index, 'Trust Score'] = trust_score

# One-hot encode LLM and Question Category
df_test = pd.get_dummies(df_test, columns=['LLM', 'Question Category'], prefix='', prefix_sep='', drop_first=False)

# One-hot encode Are All Source Links Functional and Multi-modal Response
df_test = pd.get_dummies(df_test, columns=['Are All Source Links Functional', 'Multi-modal Response'], drop_first=True)
df_test.columns = df_test.columns.str.lstrip('_')

# Ensure numeric columns are integers
numeric_columns = df_test.select_dtypes(include=[np.number, 'bool']).columns
df_test[numeric_columns] = df_test[numeric_columns].astype(int)

# Process Attributed Sources column
df_test['Attributed Sources'] = df_test['Attributed Sources'].apply(
    lambda x: [tldextract.extract(url.strip()).registered_domain for url in x.split(',')]
)

# Binarize Attributed Sources into individual columns
mlb = MultiLabelBinarizer()
url_features = pd.DataFrame(mlb.fit_transform(df_test['Attributed Sources']),
                            columns=mlb.classes_, index=df_test.index)

# Concatenate with the original dataframe and drop the original Attributed Sources column
df_test = pd.concat([df_test, url_features], axis=1)
df_test.drop(columns=['Attributed Sources'], inplace=True)


df_test.to_csv('/Users/adamgreen/Desktop/UNC MADS/DATA_780_ML/final_project/DATA_780_Final_Project/models/transformed_df.csv', index=False)