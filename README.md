# Machine Learning (DATA 780) Final Project for UNC's Master of Applied Data Science Program</br></br> _Building Trust in Search-Based AI:  Toward a Credibility Benchmark_
</br>

## About

Final project for our DATA 780 Machine Learning class in the University of North Carolina's Master of Applied Data Science (UNC MADS) program.

The primary purpose of this project is to evaluate variations in source attribution of search-based
large language models (LLMs) in open domain question answering (ODQA).  We focus on the evaluation of the quality and variation in explicit source attribution across
different LLMs and the changes to source attribution patterns over time. We propose a "trust score"
and application to compare the source attribution
performance of various models and products.

## Project Objectives:
* Evaluate source attribution in search-based large language models.
* Evaluate source credibility as well as how the LLM represents the source information.
* Contrast patterns in source attribution and source reliability for various LLMs.


                
## Creators

|                                                     [Nicole Petroski](https://www.linkedin.com/in/nicolepetroski/)                                                     |                                                   [Christopher Oxner](https://www.linkedin.com/in/chrisoxner/)                                                    |                                               [Adam Green](https://www.linkedin.com/in/agreen01/)                                               |                   
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | 
| [<img src="https://github.com/user-attachments/assets/b8ecbd8e-eaef-46e0-b681-3cf21039940b" width = "150" />](https://github.com/npetroski) | [<img src="https://github.com/user-attachments/assets/cda67df0-b6f3-45e2-a595-47b00467db5e" width = "150" />](https://github.com/OxDat) | [<img src="https://github.com/team-fun/SynergyConnect/assets/124797284/7ad0763d-cfab-47d4-ac31-ecb58da3bb9e" width = "150" />](https://github.com/agreen8911) | 
|   [<img src="https://user-images.githubusercontent.com/36062933/108450440-38656600-7233-11eb-9ed0-34ecedcae435.png" width="20"> ](https://github.com/npetroski)   |   [<img src="https://user-images.githubusercontent.com/36062933/108450440-38656600-7233-11eb-9ed0-34ecedcae435.png" width="20"> ](https://github.com/OxDat)    |   [<img src="https://user-images.githubusercontent.com/36062933/108450440-38656600-7233-11eb-9ed0-34ecedcae435.png" width="20"> ](https://github.com/agreen8911)    |   
|                  [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/nicolepetroski/)                   |                [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/chrisoxner/)                |              [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/agreen01/)              |               

## Data Collection & Creation Process

To build the foundation of our dataset, we started with [Google's Natural Questions data set](https://ai.google.com/research/NaturalQuestions), a dataset that includes 307,373 questions consisting of, ["real anonymized, aggregated queries issued to the Google search engine"](https://storage.googleapis.com/gweb-research2023-media/pubtools/4852.pdf), thus a good sample representation of open domain questions.  The dataset contains numerous columns, but we only extracted the questions for 100 randomly selected questions from the dataset.  

Using the 100 randomly selected questions, one team member manually categorized the questions into 11 categories: History, General Knowledge, Entertainment, Politics, Economics & Commerce, Food & Cooking, Literature, Science & Technology, Philosophy, Sports, and Geography.

We created copies of all 100 randomly selected questions for each of the LLMs that we chose to test.  These include:  Gemini, CoPilot, ChatGPT with Search, Llama, and Perplexity.

The team split model prompting and recording results across LLMs and we manually prompted our assigned models each of the 100 questions.  We recorded the results of each model's response, including if they provided explicit attribution, how many sources it provided, if the provided source's links were properly functioning, and whether or not the model provided multi-modal responses, or text-only.  For a baseline to ensure consistency in our prompting, we used zero-shot prompting, only used desktop browsers, always stayed logged out (when able - ChatGPT with Search was only available for logged-in plus users at the time of writing this), and used a supplemental prompt at the beginning of all of our prompts to reduce personalization in the model's response.  The supplemental prompt we used was, "Without consideration for any previous chats or
interactions between us, please answer this question and provide source citations for the information origin: [QUESTION].

After numerous round-table discussions, the team decided on several more feature columns in our dataset that we deemed would be appropriate characteristics to support our project goal of evaluating LLM source attribution, transparency, and overall goal of creating a *Trust Score* rating to help users to know how reliable a model's responses were.

For modeling purposes, our initial feature columns consist of the following:
- Question
- Question Category
- LLM
- Attributed Sources
- Number of Sources
- Are All Sources Functional
- Multi-modal Response

During the EDA and data transformation process, we also create the *Trust Score* metric (see below for more details) and add that as a feature column.  Additionally, we parse each source url provided in our dataset (from the *Attributed Sources* column) and create feature columns for each of unique URL.

## EDA 

The team performed EDA to identify trends and patterns in the data and to help inform the rest of the
project.

_General observations:_ </br></br>EDA revealed some interesting attributes of the data. An imbalance in the
question categories was noted, with a skew toward Entertainment, History & Science, and Technology.
Breaking out top sources by model showed an overall heavy reliance on Wikipedia, as well as .com
being the most common top level domain.

_Model-specific observations:_ </br></br>The data indicated a significantly higher number of total sources and
average number of sources by Perplexity and ChatGPT with Search as opposed to Llama and Copilot.
Gemini took a place in the middle of the pack. Though source attribution links were overall largely
functional (when provided), some instances of broken links were noted (less than five percent). At
the time of prompting, no models incorporated ads in responses and multi-modal responses (inclusion
of images, graphics and video) were limited, with the exception of Perplexity, which offered a 100
percent multi-model response pattern.

_Exploration of interrogatory:_ </br></br>The team performed exploration to gain more insight into the
questions, with a focus on question type (who, what, when, where, how, describe, list) related to
source attribution. No significant findings resulted.

## Developing a *Trust Score* - Quantifying Trust
The following criteria were identified as 1) quantifiable for the project and 2) relevant to the develop-
ment of a trust score based on research:

- Source Inclusion:  Does the model provide explicit source attribution?
- Source Accessibility:  Does the model's sources provide direct access to the attributed source (is it a clickable link)?
- Source Pool Diversity:  Does the model provide diverse sources, or does rely on a small group of specific sources across numerous questions?
- Multi-Modal Enrichment:  Does the model provide multi-modal sources in its responses, enriching the user's understanding?
- Source Alignment:  Does the model's response align with source information?

To enable us to have a quantifiable metric to use in our EDA & model development, we created a scoring system based on the aforementioned criteria, which we named the *Trust Score*:

Source Inclusion = +5 points</br>

Source Accessibility = +1 point for some links are functional, and +2 points if all links are functional</br></br>
Source Pool Diversity = +1 point per unique source provided in the model's response</br></br>
Multi-Modal Enrichment = +1 point if the model provides a response (some models did not provide answers to certain questions, such as political questions), and +2 if they provided multi-modal sources</br></br>
Source Alignment = not included in scoring system at this stage of the project as more research is needed

## Model Testing

The overall focus of model development for the project was to test different models to observe their
behaviors and how they perform with the dataset. The primary goals included: 1) becoming more
familiar with how these models are implemented and better understand their strengths and challenges,
and 2) gleaning insights into the project’s scope, objectives and future development.

Three model types were explored: 

1) Clustering using K-Means (tested with both Principal Component Analysis (PCA) and t-Distributed Stochastic Neighbor Embedding (t-SNE) applied) to understand any feature similarities as well as outliers, and to determine if dimensionality reduction would be beneficial,
2) Classification Model (Bidirectional Encoder Representations from Transformers (BERT)) to explore classification of question categories for new user-defined inputs in future real-time applications
3) Extreme Gradient Boosting (XGBoost) Model to predict trust scores.

For each of the models, with the exception of the BERT Classifier (which operates with tokenized
text embeddings), the dataset was standardized to ensure all features were on the same scale before
fitting the model.

The clustering and K-Means with PCA models did not reveal any significant findings; however,
applying t-SNE created various distinguishable clusters. Upon further investigation, many clusters
showed promising potential for uncovering patterns in context to trust scores. For classification, our
BERT (DistilBERT) model was not highly successful – accuracy: 0.6, precision: 0.62, recall: 0.6, f1
score: 0.58 – but was able to predict question categories based on sample questions. The team intends
to continue to tune and optimize the model to improve these metrics to be much higher (>90%).
Lastly, the XGBoost model included a K-Fold (5-fold) cross validation approach, which offered very
promising results – with each fold producing a mean absolute error (MAE) of 0.28, 0.27,0.28, 0.32,
and 0.28, respectively and an average MAE of 0.29. MAE was selected as the performance evaluation
metric due to it being less sensitive to extreme deviations and outliers (which the data was suspected
to contain, especially following the results of clustering exploration).

## Future Development

The project provides a number of opportunities for further development and research. The team
intends to continue to expand and build on the project as external forces impact the search landscape.

_Potential future areas of exploration & development:_ 

- Further development of project proof of concept
- Expansion of the dataset
- Evaluation of new products and advertising
- Exploration of content licensing and copyright challenges
- Impact of AI regulation



