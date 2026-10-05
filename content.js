/* Course content. Written from the seven lecture decks, with extras from ariclabarr.com/machine-learning marked as "From the course site". */
const SITE = 'https://www.ariclabarr.com/machine-learning/';
const TF = ['True', 'False'];

const UNITS = [
/* ------------------------------------------------------------------ 1 */
{
  id: 'intro', title: 'Introduction', deck: 'Deck 1 · Introduction: Machine Learning',
  links: [['Course site: Introduction', SITE]],
  lede: 'What machine learning is, the four kinds of learning, and how to read the regression output you will be handed on the exam.',
  secs: [
    { h: 'What counts as machine learning', b: `
      <p>Both dictionary definitions on the slides say the same thing: a computer <b>learns to perform a task from a large dataset instead of being explicitly programmed</b>. It is a sub-field of artificial intelligence.</p>
      <p>The list of the ten most common methods includes <b>linear regression</b> and <b>logistic regression</b>, so you have already done ML. The others: k-nearest neighbors, decision trees, random forests, time series analysis, clustering, naïve Bayes, principal component analysis, gradient boosting.</p>
      <p>Methods sit on a spectrum from very interpretable (regression) to built mainly for prediction. There are many algorithms because <b>we cannot know ahead of time which one will work best</b> on a given dataset.</p>` },
    { h: 'The four kinds of learning', b: `
      <div class="tw"><table>
        <tr><th>Type</th><th>Learns from</th><th>Slide example</th></tr>
        <tr><td><b>Supervised</b></td><td>Labeled data (a known target)</td><td>Linear regression</td></tr>
        <tr><td><b>Unsupervised</b></td><td>Unlabeled data (no target)</td><td>Clustering</td></tr>
        <tr><td><b>Semi-supervised</b></td><td>A little labeled data mixed with a lot of unlabeled data</td><td>Image recognition</td></tr>
        <tr><td><b>Reinforcement</b></td><td>Interacting with its environment, trial and error</td><td>Autonomous vehicles</td></tr>
      </table></div>
      <p>Inside supervised learning the target decides the family: a <b>continuous</b> target is supervised <b>regression</b>; a <b>categorical</b> target is supervised <b>classification</b>. Unsupervised models have no target variable to relate the predictors to.</p>
      <p class="trap"><b>Exam trap</b>The difference between supervised and unsupervised is the presence of a target (labels), not the algorithm's complexity. This is question 12 on the practice midterm.</p>` },
    { h: 'Reading linear regression output', b: `
      <p>Click any highlighted number. This is the simple regression from the deck: insurance <code>charges</code> predicted by <code>age</code>.</p>
      <pre class="out" data-reader="ols">Dep. Variable:   charges     <b data-k="r2">R-squared:        0.089</b>
Model:               OLS     <b data-k="ar2">Adj. R-squared:   0.089</b>
No. Observations:   <b data-k="n">1338</b>     <b data-k="f">F-statistic:      131.2</b>
Df Residuals:       1336     <b data-k="pf">Prob (F-stat): 4.89e-29</b>
Df Model:              <b data-k="k">1</b>     AIC:          2.883e+04
=================================================================
              coef    std err        t    P>|t|    [0.025   0.975]
-----------------------------------------------------------------
const    <b data-k="b0">3165.8850</b>    937.149    3.378    0.001   1327.44  5004.33
age       <b data-k="b1">257.7226</b>     <b data-k="se">22.502</b>   <b data-k="t">11.453</b>    <b data-k="p">0.000</b>   <b data-k="ci">213.579  301.866</b></pre>
      <div class="out-note" data-note="ols">Pick a value above to see what it means and how to say it in a sentence.</div>
      <p>With all predictors in the model, R² rises to 0.751 and categorical variables appear as dummy variables:</p>
      <ul>
        <li><code>smoker_yes = 23,860</code>: smokers are charged about $23,860 more than non-smokers, <b>holding the other variables constant</b>.</li>
        <li><code>sex_male</code> has p = 0.691, so it is not statistically significant.</li>
        <li>Region shows three dummies (northwest, southeast, southwest). The missing level, northeast, is the <b>reference level</b>; each coefficient compares its region to northeast.</li>
      </ul>` },
    { h: 'Dummy variables and why Python', b: `
      <p>A categorical variable with <b>c categories needs c − 1 dummy variables</b>. In the Ames housing data, Neighborhood has 25 categories and becomes 24 dummies; across the example table 290 categories become 247 dummies.</p>
      <p>Ames has 81 variables, about 35 continuous and 46 categorical. Excel's Data Analysis ToolPak stops at 16 predictors and makes you build dummies by hand.</p>
      <div class="tw"><table>
        <tr><th>Excel</th><th>Python</th></tr>
        <tr><td>Point-and-click tool</td><td>Computing language</td></tr>
        <tr><td>Good for static datasets, smaller numbers of rows and columns</td><td>Repeatable; built for automation, data pipelines and deployment</td></tr>
      </table></div>` },
  ],
  cards: [
    ['Supervised learning', 'The model learns from labeled data: there is a known target variable. Example: linear regression.'],
    ['Unsupervised learning', 'The model learns from unlabeled data: no target variable. Example: clustering.'],
    ['Semi-supervised learning', 'Limited labeled data mixed with a large amount of unlabeled data. Example: image recognition.'],
    ['Reinforcement learning', 'The model learns by interacting with its environment through trial and error. Example: autonomous vehicles.'],
    ['Regression vs. classification', 'Both are supervised. Regression has a continuous target; classification has a categorical target.'],
    ['How many dummy variables for a variable with c categories?', 'c − 1. The dropped category is the reference level every coefficient is compared against.'],
    ['Why so many algorithms?', 'We do not know ahead of time which algorithm will work best for a specific dataset.'],
    ['Interpret a slope of 257.72 for age on charges', 'Each additional year of age is associated with $257.72 higher charges, on average.'],
  ],
  quiz: [
    { t: 'mc', q: 'A retailer groups customers into segments using purchase history. No segment labels exist beforehand. What kind of learning is this?', o: ['Supervised regression', 'Supervised classification', 'Unsupervised', 'Reinforcement'], a: 2, why: 'There is no target variable, so the model learns from unlabeled data. Clustering is the slide example of unsupervised learning.' },
    { t: 'mc', q: 'Predicting whether a loan will default (yes/no) from applicant data is:', o: ['Supervised regression', 'Supervised classification', 'Unsupervised learning', 'Semi-supervised learning'], a: 1, why: 'A known target makes it supervised; a categorical (binary) target makes it classification.' },
    { t: 'mc', q: 'Linear regression is not a machine learning method because it is a statistics technique.', o: TF, a: 1, why: 'False. Linear and logistic regression are both on the list of the ten most common ML methods.' },
    { t: 'num', q: 'A categorical variable has 9 categories (Sale Type in Ames). How many dummy variables does it need?', a: 8, tol: 0, why: 'c − 1 = 9 − 1 = 8. One category is left out as the reference level.' },
    { t: 'mc', q: 'In the multiple regression output, region_southeast has a coefficient of −1042 and no northeast row appears. The correct reading is:', o: ['Southeast charges are $1,042 lower than the overall average', 'Southeast charges are $1,042 lower than northeast, holding other variables constant', 'Northeast was removed for being insignificant', 'Southeast charges fall $1,042 per year'], a: 1, why: 'Northeast is the reference level. Every dummy coefficient is a comparison to the level that was dropped.' },
    { t: 'fill', q: 'A model that learns by interacting with its environment through trial and error is doing ______ learning.', accept: ['reinforcement'], why: 'Reinforcement learning. The slide example is autonomous vehicles.' },
    { t: 'mc', q: 'The simple regression of charges on age has R² = 0.089. Which statement is correct?', o: ['Age explains about 8.9% of the variation in charges', 'The model is correct 8.9% of the time', 'Charges rise 8.9% per year of age', 'Age is not statistically significant'], a: 0, why: 'R² is the share of variation in the target explained by the model. Age is still highly significant (t = 11.45); a variable can be significant and explain little.' },
    { t: 'short', q: 'Give two reasons the course uses Python instead of Excel for modeling.', why: 'Python is repeatable and built for automation, pipelines and deployment; it handles many rows and columns; it creates dummy variables for you. Excel is point-and-click, suited to small static data, and its regression tool is limited to 16 predictors.' },
  ],
},
/* ------------------------------------------------------------------ 2 */
{
  id: 'data', title: 'Data Preparation', deck: 'Deck 2 · Data Preparation',
  links: [['Course site: Introduction and data', SITE + 'part_1_intro.html']],
  lede: 'Missing values, feature engineering from transaction data, and the basic ways to cut a long variable list down before modeling.',
  secs: [
    { h: 'Why data preparation matters', b: `
      <p><b>Inference</b> means using information to reach a conclusion. The quality of the data drives the quality of the results. Three questions come before heavy analysis: what to do with missing values, whether we have the right variables, and how to reduce the variables to a reasonable number.</p>` },
    { h: 'Missing values: delete, keep or replace', b: `
      <p><b>Complete case analysis</b> drops every row with any missing value. It is not necessarily bad if you have enough observations, but it leaves no way to score a new observation that has a missing value.</p>
      <div class="tw"><table>
        <tr><th>Option</th><th>When</th><th>How</th></tr>
        <tr><td><b>Delete</b></td><td>More than 50% of the variable is missing</td><td>Consider removing the variable altogether</td></tr>
        <tr><td><b>Keep</b></td><td>Categorical variables</td><td>Add a "Missing" category. Missingness may itself be predictive.</td></tr>
        <tr><td><b>Replace</b></td><td>Continuous variables</td><td>Impute (median is the popular choice) and <b>always add and keep a missing-flag</b> binary variable</td></tr>
      </table></div>
      <p>A predictive model can also be used to impute, but the slides note it has not been shown empirically to add value over simple mean or median replacement.</p>
      <p class="trap"><b>Exam trap</b>The missing category for categorical variables can be added before the train/test split. Continuous imputation cannot: the median is calculated across rows, so it must be computed <b>after</b> the split, on training data only, and that training median is then used to fill the test set.</p>` },
    { h: 'Feature engineering', b: `
      <p>Feature engineering transforms raw data into variables (features) suited to a model. The slide's point: <b>better features beat fancier modeling</b>. Two classes that no straight line can separate in x₁ and x₂ become easy once the data is re-expressed as distance and direction.</p>
      <p>Models usually need <b>one row per entity</b> (customer, patient, account). <b>Transactional data</b> has many rows per entity and must be aggregated: long data (many rows) becomes wide data (many columns).</p>
      <p>Common aggregations, from the patient activity:</p>
      <ul>
        <li><b>Center</b> (mean, median). Often <i>not</i> where the signal is.</li>
        <li><b>Recency</b>: the latest values.</li>
        <li><b>Frequency</b>: how often something happens (count of visits).</li>
        <li><b>Trends</b>: rising or falling over time.</li>
        <li><b>Variability</b>: how much the values swing.</li>
        <li><b>Extremes</b>: maximum and minimum.</li>
      </ul>
      <p>How you summarize history determines what the model is able to learn. Try the patient lab to see three patients with similar averages and very different stories.</p>` },
    { h: 'Variable reduction', b: `
      <p>Basic techniques: <b>business logic</b>, <b>too much missingness</b>, <b>low or no variability</b>, and <b>univariate statistical testing</b> (unit 3). More advanced: automatic feature selection (unit 3), regularization and variable clustering (later in the course).</p>
      <p><b>Business logic</b> removes:</p>
      <ul>
        <li>Individual identifiers: street address, customer ID, SSN.</li>
        <li>Information you are not allowed to use: protected or private data.</li>
        <li>Information you would not know at the decision point, only afterwards (type of sale).</li>
      </ul>
      <p><b>Low variability</b>: if x never changes, it cannot answer "what happens to y when x changes?"</p>
      <ul>
        <li>Continuous variable with variance below 0.01: consider removing.</li>
        <li>Categorical variable with one category holding more than 95% of the data: consider removing. In Ames this removed Street (99.6%), Utilities (99.9%) and Heating (97.8%).</li>
        <li>Business logic can override and keep the variable.</li>
      </ul>
      <p>In Ames, the 50% missingness rule removed PoolQC, MiscFeature, Alley and Fence.</p>` },
  ],
  cards: [
    ['Complete case analysis', 'Keeping only rows with no missing values. Fine with enough data, but it cannot score new observations that have missing values.'],
    ['Rule of thumb for deleting a variable for missingness', 'More than 50% missing: consider removing it.'],
    ['How to handle missing values in a categorical variable', 'Add a "Missing" category. Missingness may be predictive.'],
    ['How to handle missing values in a continuous variable', 'Impute (median is popular) and always add and keep a binary missing-flag variable.'],
    ['Why can\'t continuous variables be imputed before the train/test split?', 'Imputation uses a calculation across rows (mean, median, a model). Doing it before the split leaks test information into training.'],
    ['Transactional data', 'Many rows per entity. It must be aggregated to one row per entity: long to wide.'],
    ['Six aggregation categories', 'Center, recency, frequency, trends, variability, extremes. Center is often not the signal.'],
    ['Low variability rules', 'Continuous: variance < 0.01. Categorical: one category > 95% of the data. Business logic can override.'],
  ],
  quiz: [
    { t: 'mc', q: 'A continuous predictor is missing in 12% of rows. The recommended approach is:', o: ['Delete the variable', 'Delete the rows', 'Impute with the median and add a missing-flag variable', 'Add a "Missing" category'], a: 2, why: 'Continuous: impute (median) and always add and keep a flag. A missing category is the categorical solution; deletion is for more than 50% missing.' },
    { t: 'mc', q: 'A categorical predictor is missing in 20% of rows. The recommended approach is:', o: ['Impute with the mode and add a flag', 'Create a "Missing" category', 'Delete the variable', 'Impute with a predictive model'], a: 1, why: 'For categorical variables you simply add a missing category. It is easy and the missingness might itself be predictive.' },
    { t: 'mc', q: 'Median imputation for continuous variables should be done before the train/test split so both sets get the same values.', o: TF, a: 1, why: 'False. The median must be calculated after the split, on the training data, then applied to the test data.' },
    { t: 'mc', q: 'Which variable would business logic remove before modeling home sale price?', o: ['Square footage', 'Number of bathrooms', 'Type of sale, known only after the sale', 'Central air'], a: 2, why: 'You would not know it at the decision point. Identifiers and protected information are removed for the same kind of reason.' },
    { t: 'fill', q: 'Turning many transaction rows per customer into one row per customer converts ______ data into wide data.', accept: ['long'], why: 'Long data (many rows) becomes wide data (many columns).' },
    { t: 'mc', q: 'Two patients have nearly the same average blood pressure over a year. One is steadily rising and the other steadily falling. Which aggregation captures the difference?', o: ['Center', 'Trend', 'Frequency', 'None; the patients are the same'], a: 1, why: 'Center is often not the signal. A trend feature (or recency: the latest reading) separates them.' },
    { t: 'mc', q: 'A categorical variable has 99.6% of its observations in one category. What should you do?', o: ['Keep it; rare categories are informative', 'Consider removing it for low variability', 'Impute the rare categories', 'Convert it to continuous'], a: 1, why: 'One category above 95% is the low-variability rule. This is the Street variable in Ames.' },
    { t: 'short', q: 'Why might a missing value be worth keeping rather than treating as a problem?', why: 'Missing values in predictors are not necessarily bad and might be predictive. A missing garage year means the house has no garage, which is real information. That is why you add a missing category or a missing flag.' },
  ],
},
/* ------------------------------------------------------------------ 3 */
{
  id: 'build', title: 'Model Building', deck: 'Deck 3 · Model Building',
  links: [['Course site: Model building', SITE + 'part_2_model.html']],
  lede: 'Training and test sets, error metrics, cross-validation, and forward, backward and stepwise selection.',
  secs: [
    { h: 'Training vs. testing', b: `
      <p>Partition the data. The model is <b>fit on the training set</b> and its <b>performance is evaluated on the test set</b>. Sometimes there is a third piece, validation. Set a random seed so the split is replicable.</p>
      <p>Models tend to pick up small, spurious patterns in the data they were built on. Holding data out gives an <b>honest assessment</b> of how the model performs on data it has never seen, and shows whether we have <b>overfit</b>.</p>
      <p class="trap"><b>Exam trap</b>Model selection is always done on training data. The test set is for comparing final models and reporting final metrics. Do not go back and rebuild after looking at it, and do not build thousands of models to compare on it.</p>` },
    { h: 'Univariate screening and conservative p-values', b: `
      <p>With many predictors, test each one individually against the target. For a continuous target the test is an <b>F-test</b> from a simple regression of the target on that one variable. Keep the variables whose p-value is below your cut-off.</p>
      <p>With large samples nearly everything looks significant at 0.05, so the significance level should shrink as the sample grows (Raftery, 1994). Ames has about 1,095 training rows, so the course uses <b>α = 0.009</b>.</p>
      <div class="tw"><table>
        <tr><th>Evidence</th><th class="n">n = 30</th><th class="n">50</th><th class="n">100</th><th class="n">1,000</th><th class="n">10,000</th><th class="n">100,000</th></tr>
        <tr><td>Weak</td><td class="n">.076</td><td class="n">.053</td><td class="n">.032</td><td class="n">.009</td><td class="n">.002</td><td class="n">.0007</td></tr>
        <tr><td>Fair</td><td class="n">.028</td><td class="n">.019</td><td class="n">.010</td><td class="n">.003</td><td class="n">.0008</td><td class="n">.0002</td></tr>
        <tr><td>Strong</td><td class="n">.005</td><td class="n">.003</td><td class="n">.001</td><td class="n">.0003</td><td class="n">.0001</td><td class="n">.00003</td></tr>
        <tr><td>Very strong</td><td class="n">.001</td><td class="n">.0005</td><td class="n">.0001</td><td class="n">.00004</td><td class="n">.00001</td><td class="n">.000004</td></tr>
      </table></div>` },
    { h: 'Model metrics', b: `
      <p>Lower is better for all four. They may not agree, and none is necessarily better than the others.</p>
      <div class="fx">MAE = (1/n) Σ |Y − Ŷ|<small>average absolute miss</small></div>
      <div class="fx">MAPE = (1/n) Σ |(Y − Ŷ) / Y|<small>average absolute percentage miss</small></div>
      <div class="fx">MSE = (1/n) Σ (Y − Ŷ)²<small>estimate of the error variance</small></div>
      <div class="fx">RMSE = √MSE<small>back in the units of Y</small></div>
      <div class="tw"><table>
        <tr><th>Metric</th><th>Problems</th></tr>
        <tr><td>MAE</td><td>Not scale invariant</td></tr>
        <tr><td>MAPE</td><td>Overweights over-predictions; breaks when an actual value is 0</td></tr>
        <tr><td>MSE, RMSE</td><td>Overweight larger errors; not scale invariant</td></tr>
      </table></div>` },
    { h: 'Selection algorithms', b: `
      <p>A <b>model metric</b> is the yardstick; a <b>selection algorithm</b> is the automated search that uses it.</p>
      <div class="tw"><table>
        <tr><th>Method</th><th>Starts from</th><th>Each step</th></tr>
        <tr><td><b>Forward</b></td><td>Intercept only (null model)</td><td>Adds the one variable that improves the metric most. Never removes.</td></tr>
        <tr><td><b>Backward</b></td><td>Full model, all variables</td><td>Removes the one variable whose removal improves the metric most. Never adds back.</td></tr>
        <tr><td><b>Stepwise</b></td><td>Intercept only</td><td>Adds like forward, but can also delete a variable already in the model.</td></tr>
      </table></div>
      <p>All three stop when no single move beats the current base model.</p>
      <p><b>The wrong way: RFE.</b> Recursive Feature Elimination has two problems. You must say how many features to keep in advance (the default keeps the top 50%), and it ranks variables by the <b>size of their coefficients</b>, not by a model metric. Coefficients depend on scale: rescaling Overall Quality from 1–10 to 0.1–1.0 made its coefficient ten times larger while the test statistic and p-value stayed exactly the same. A large coefficient does not mean a better variable.</p>` },
    { h: 'Cross-validation', b: `
      <p>Cross-validation is the common way to prevent overfitting when tuning a model, for example choosing the number of variables.</p>
      <ol>
        <li>Split the training data into k pieces (folds).</li>
        <li>Build the model on k − 1 pieces.</li>
        <li>Evaluate on the remaining piece.</li>
        <li>Repeat, switching the held-out piece, and <b>average</b> the metric over all k.</li>
      </ol>
      <p>Selection with CV looks at the <b>validation</b> metric at each step, not the training metric: which candidate is better on average across all validation folds?</p>
      <p>The selector can stop at the <b>best</b> number of features (best metric value) or the <b>parsimonious</b> one (the smallest model within one standard error of the best).</p>` },
    { h: 'Problems with automatic selection', b: `
      <ul>
        <li><b>Not all techniques agree.</b> On Ames, backward kept 1st and 2nd floor square footage and central air; stepwise kept above-ground living area and land contour instead.</li>
        <li>Biased parameter estimates, predictions and standard errors.</li>
        <li>Incorrect degrees of freedom (with the p-value method).</li>
        <li>P-values that overstate significance, raising the Type I error rate.</li>
        <li>The result can be a locally best model, not the globally best one.</li>
      </ul>
      <p class="trap"><b>Exam trap</b>Never blindly accept the model an automatic search returns. It gives a subset of candidate variables; you still explore other models and check assumptions. If you select with p-values, adjust them for a large sample.</p>` },
  ],
  cards: [
    ['Training set vs. test set', 'The model is fit on training data. The test set is held out to give an honest assessment of performance on unseen data and to detect overfitting.'],
    ['MAE', 'Mean absolute error: the average absolute difference between predictions and truth. Not scale invariant.'],
    ['MAPE weaknesses', 'Overweights over-predictions and cannot handle an actual value of 0.'],
    ['MSE and RMSE weakness', 'They overweight larger errors (errors are squared) and are not scale invariant. MSE estimates the error variance.'],
    ['Forward selection', 'Start with the intercept-only model and add one variable at a time until nothing improves the metric.'],
    ['Backward selection', 'Start with the full model and remove one variable at a time until removal no longer improves the metric.'],
    ['Stepwise selection', 'Starts like forward, but at each step it can also remove a variable already in the model.'],
    ['Why is RFE the wrong way?', 'It needs the number of features up front and ranks by coefficient size, which depends on each variable\'s scale, not on any model metric.'],
    ['k-fold cross-validation', 'Split training data into k folds; train on k − 1, evaluate on the one left out; rotate; average the metric.'],
    ['Why use a smaller α with large samples?', 'With big n almost everything is significant at 0.05. Raftery\'s table gives conservative cut-offs; about 0.009 for n ≈ 1,000.'],
  ],
  quiz: [
    { t: 'mc', q: 'Which metric punishes one very large error the most?', o: ['MAE', 'MAPE', 'MSE', 'They all treat it the same'], a: 2, why: 'MSE squares each error, so large errors are overweighted. RMSE inherits this.' },
    { t: 'mc', q: 'Why can MAPE fail on some datasets?', o: ['It is not in percentage units', 'An actual value of 0 makes it undefined', 'It squares the errors', 'It needs a categorical target'], a: 1, why: 'MAPE divides by the actual value. It also overweights over-predictions.' },
    { t: 'mc', q: 'Forward selection starts with:', o: ['All variables in the model', 'The intercept-only model', 'The variable with the largest coefficient', 'A random subset'], a: 1, why: 'Forward starts with the null (intercept-only) model and adds. Backward starts with the full model.' },
    { t: 'mc', q: 'Forward, backward and stepwise selection will always arrive at the same final model.', o: TF, a: 1, why: 'False. They are not guaranteed to agree. Each can end at a different locally best model.' },
    { t: 'mc', q: 'In 10-fold cross-validated backward selection, the variable to drop at each step is chosen by:', o: ['The largest p-value in the full training fit', 'The smallest coefficient', 'The best average validation metric across the 10 folds', 'The test set MSE'], a: 2, why: 'Each candidate removal is evaluated on every validation fold and the average decides. The test set is never used for selection.' },
    { t: 'mc', q: 'Rescaling a predictor from 1–10 to 0.1–1.0 changes its:', o: ['Coefficient only', 'Test statistic and p-value only', 'Coefficient, test statistic and p-value', 'Nothing'], a: 0, why: 'The coefficient and standard error both become 10 times larger, so the t-statistic and p-value stay the same. That is why ranking variables by coefficient size (RFE) is misleading.' },
    { t: 'num', q: 'Five predictions miss by 2, −4, 1, −3 and 10. What is the MAE?', a: 4, tol: 0.01, why: '(2 + 4 + 1 + 3 + 10) / 5 = 4. The MSE is (4 + 16 + 1 + 9 + 100) / 5 = 26, dominated by the single miss of 10.' },
    { t: 'mc', q: 'With about 1,000 observations, which significance level does the course use for screening variables?', o: ['0.10', '0.05', '0.009', '0.5'], a: 2, why: 'From the Raftery table, about 0.009 for n ≈ 1,000. Larger samples need smaller cut-offs.' },
    { t: 'short', q: 'Explain the difference between a training and a testing data set and why we have both.', why: 'The model is fit on the training set and evaluated on the test set. Models find spurious patterns in the data that built them, so a held-out set gives an honest assessment of performance on new data and reveals overfitting.' },
    { t: 'short', q: 'List three issues with automatic selection algorithms.', why: 'The techniques will not all agree; estimates, predictions and standard errors are biased; degrees of freedom are wrong; p-values overstate significance (more Type I error); the result may be a local, not global, best model.' },
  ],
},
/* ------------------------------------------------------------------ 4 */
{
  id: 'diag', title: 'Diagnostics', deck: 'Deck 4 · Diagnostics',
  links: [['Course site: Diagnostics', SITE + 'part_3_diag.html']],
  lede: 'The four assumptions of linear regression, how to spot each one failing, what to do about it, and multicollinearity.',
  secs: [
    { h: 'The four assumptions', b: `
      <ol>
        <li><b>Linearity.</b> The mean of the target is accurately modeled by a linear function of the predictors.</li>
        <li><b>Constant variance.</b> The variance of the errors (σ²) is constant: homoscedasticity.</li>
        <li><b>Normality.</b> The errors are Normal with a mean of 0.</li>
        <li><b>Independence.</b> Errors for any two observations are independent of each other.</li>
      </ol>
      <p>All four are statements about the <b>errors</b>. The true error ε is never observed because we only estimate the β's. What we have is its estimate, the <b>residual</b>:</p>
      <div class="fx">residual = y − ŷ</div>
      <p>Two ways to check: <b>plot residuals against predicted values</b> and look for trends, changes in variation and isolated extreme points; or run a statistical test. For every test here, <b>the null hypothesis is that the assumption is met</b>.</p>
      <p class="trap"><b>Exam trap</b>Because H₀ is "assumption holds", a <i>small</i> p-value is the bad news. A large p-value means no evidence of a problem.</p>` },
    { h: 'Cheat sheet: detect and fix', b: `
      <div class="tw"><table>
        <tr><th>Assumption</th><th>Plot signal</th><th>Test (H₀)</th><th>Fixes</th></tr>
        <tr><td>Linearity (lack of fit, misspecification)</td><td>A pattern or curve in residuals vs. predicted</td><td>None on the slides; use the plot</td><td>More complex model: polynomial terms, GAM, other ML models</td></tr>
        <tr><td>Constant variance</td><td>Changing spread, a fan or cone</td><td><b>Breusch-Pagan</b> (homoscedasticity)</td><td>Variance-stabilizing transformation such as log(y); weighted least squares; adjust the standard errors</td></tr>
        <tr><td>Normality</td><td>QQ-plot bends away from the straight line</td><td><b>Shapiro-Wilk</b> (small to medium n, under 2,000); <b>Anderson-Darling</b> (large n). H₀: Normal</td><td>Transform the target (log, Box-Cox); build a better model; deal with outliers</td></tr>
        <tr><td>Independence</td><td>Cyclical pattern, typical of time series data</td><td><b>Durbin-Watson</b> (no residual correlation)</td><td>Model the time dependence</td></tr>
      </table></div>` },
    { h: 'Linearity and what "linear" means', b: `
      <p>Residuals, like the errors they estimate, should be random. A pattern means the model is misspecified.</p>
      <p><b>Polynomial regression</b> adds terms such as x², x³ to bend the fit. It is still linear regression: "linear" refers to a <b>linear combination</b> of the terms, not to a straight line on the plot. Setting x₃ = x₁² gives the same linear form.</p>
      <p>A <b>generalized additive model (GAM)</b> adds together non-linear functions, y = β₀ + f₁(x₁) + f₂(x₂) + … + ε, and lets the computer estimate each shape. It works for regression or classification.</p>
      <p class="site"><b>From the course site</b>Besides residuals vs. predicted, the site also plots <b>partial residuals</b> against each predictor: the residual with that one predictor's effect added back, which shows the shape of that single variable's relationship after accounting for the rest.</p>` },
    { h: 'Unequal variance', b: `
      <p>Constant error variance is <b>homoscedasticity</b>; breaking it is <b>heteroscedasticity</b>. The classic picture is residuals that fan out as the predicted value grows.</p>
      <ul>
        <li><b>Variance-stabilizing transformation.</b> Converts a heteroscedastic model into a homoscedastic one. The natural log of the target is the common example.</li>
        <li><b>Weighted least squares.</b> Minimizes a weighted sum of squared errors. You need to know which variables cause the problem.</li>
        <li><b>Adjust the standard errors.</b> This does <b>not</b> change the coefficients, only the statistical tests.</li>
      </ul>` },
    { h: 'Normality', b: `
      <p>Very hard to meet in practice, and results change little if it fails on a small scale; symmetric may be enough.</p>
      <p>The plot to use is the <b>QQ-plot</b> (normal probability plot): residuals against the quantiles expected from a Normal distribution. Normal residuals fall on a straight diagonal line.</p>
      <ul>
        <li><b>Skewness</b>: the points form one curve, a bow that leaves the line in the same direction at both ends.</li>
        <li><b>Kurtosis</b>: an S shape; the tails leave the line in opposite directions.</li>
      </ul>` },
    { h: 'Independence', b: `
      <p><b>Cross-sectional</b> data is collected across different individuals at one point in time. <b>Time series</b> data follows one individual over consecutive points in time, and the value at time t is usually related to the value at t + 1. The errors become correlated, which the slides say underestimates the β coefficients.</p>
      <p>Look for a cyclical pattern in the residuals, or use the Durbin-Watson test.</p>` },
    { h: 'Multicollinearity', b: `
      <p>Multicollinearity is when two or more predictors are correlated with each other, so they bring similar information. Some correlation is nearly unavoidable; the problems come when it is high:</p>
      <ul>
        <li>Errors in the parameter estimates and in their standard errors.</li>
        <li>Counterintuitive results.</li>
      </ul>
      <p><b>Signs:</b> coefficients with the wrong sign; coefficients that change dramatically when a variable is added or removed; variables that switch between significant and not.</p>
      <div class="fx">VIF<sub>j</sub> = 1 / Tolerance<sub>j</sub> = 1 / (1 − R²<sub>j</sub>)</div>
      <p>R²<sub>j</sub> comes from regressing predictor j on <b>all the other predictors</b>. The target variable is not in that model. VIF measures how much the standard error of the estimate is inflated. <b>VIF above 10 is typically considered too high.</b></p>
      <p>In Ames, the missing-garage dummies had VIF = ∞ because they were perfectly redundant: every home without a garage is missing all garage variables at once.</p>
      <p><b>Solutions:</b> drop one of the correlated variables; avoid making inferences about the parameter estimates; use a biased regression technique (later deck).</p>` },
    { h: 'Scoring the test set', b: `
      <p>To score, you do not rerun the algorithm. You apply the final model's equation to the test data after giving it the same preparation: derived inputs, transformations, and missing-value imputation using the <b>training</b> median.</p>
      <p>If the model predicts log(price), take the exponential to get back to dollars before computing MAE and MAPE. The final linear regression scored MAE $18,310 and MAPE 11.58% on the test set.</p>` },
    { h: 'Optional on the slides: outliers and influence', b: `
      <ul>
        <li><b>Outlier</b>: a standardized or studentized residual more than 3 standard deviations from 0.</li>
        <li><b>Leverage</b> h<sub>i</sub>: how much an observation's own x values affect its prediction. Large if h<sub>i</sub> &gt; 2(k + 1)/n.</li>
        <li><b>Cook's D</b>: the influence of an observation on the estimated β coefficients. Flagged above 4/n. It is not a heteroscedasticity test, which is why it is a wrong answer on practice question 6.</li>
      </ul>` },
  ],
  cards: [
    ['Four assumptions of linear regression', 'Linearity of the mean; constant error variance; Normal errors with mean 0; independent errors.'],
    ['Residual', 'The estimate of the unobservable error: actual minus predicted, y − ŷ.'],
    ['Null hypothesis of every assumption test', 'The assumption is met. A small p-value means the assumption is broken.'],
    ['Breusch-Pagan test', 'Tests for heteroscedasticity. H₀: homoscedasticity (constant variance).'],
    ['Shapiro-Wilk vs. Anderson-Darling', 'Both test Normality with H₀: Normal. Shapiro-Wilk suits small to medium samples (< 2,000); Anderson-Darling suits large samples.'],
    ['Durbin-Watson test', 'Tests independence of errors. H₀: no residual correlation.'],
    ['Three fixes for heteroscedasticity', 'Variance-stabilizing transformation (log of the target), weighted least squares, adjusting the standard errors.'],
    ['Why is polynomial regression still linear regression?', 'Linear means a linear combination of terms. x² is just another term in the sum.'],
    ['VIF formula and cut-off', 'VIF = 1 / (1 − R²ⱼ), where R²ⱼ comes from regressing predictor j on all other predictors. Above 10 is too high.'],
    ['Three signs of multicollinearity', 'Wrong-signed coefficients; big coefficient changes when a variable is added or dropped; switches in significance.'],
    ['Three solutions to multicollinearity', 'Drop one of the correlated variables; avoid inference on the estimates; use biased regression.'],
    ['QQ-plot shapes', 'Straight line: Normal. One-directional bow: skewness. S shape: kurtosis.'],
  ],
  quiz: [
    { t: 'mc', q: 'Residuals plotted against predicted values form a clear upside-down U. The concern is:', fig: 'curve', o: ['Normality', 'Independence', 'Model misspecification', 'No concern'], a: 2, why: 'A trend or curve in the residuals means the linear form is missing something: lack of fit. Fix with polynomial terms or a GAM.' },
    { t: 'mc', q: 'Which test checks for heteroscedasticity?', o: ["Cook's D", 'Anderson-Darling', 'Breusch-Pagan', 'Durbin-Watson'], a: 2, why: 'Breusch-Pagan, with H₀: homoscedasticity. Anderson-Darling is Normality, Durbin-Watson is independence, Cook\'s D is influence.' },
    { t: 'mc', q: 'A Shapiro-Wilk test on the residuals returns p = 0.41. Conclusion:', o: ['Normality is violated', 'There is no evidence against Normality', 'The variance is constant', 'The errors are independent'], a: 1, why: 'H₀ is Normality. A large p-value fails to reject it, so the assumption looks fine.' },
    { t: 'num', q: 'Regressing predictor x₃ on all the other predictors gives R² = 0.80. What is the VIF for x₃?', a: 5, tol: 0.01, why: 'VIF = 1 / (1 − 0.80) = 5. Below 10, so not typically considered a problem.' },
    { t: 'mc', q: 'The R² used in a VIF calculation comes from a model that predicts:', o: ['The target from all predictors', 'The target from that one predictor', 'That predictor from all the other predictors', 'The residuals from the predictors'], a: 2, why: 'The target is not in the VIF model at all. It measures how well the other predictors explain this one.' },
    { t: 'mc', q: 'Adjusting the standard errors for heteroscedasticity changes the coefficient estimates.', o: TF, a: 1, why: 'False. It leaves the coefficients alone and changes only the statistical tests.' },
    { t: 'mc', q: 'Residuals from a model fit to monthly sales data show a repeating wave pattern. Which assumption is in doubt and which test applies?', o: ['Normality; Shapiro-Wilk', 'Independence; Durbin-Watson', 'Constant variance; Breusch-Pagan', 'Linearity; Anderson-Darling'], a: 1, why: 'Cyclical residuals in time series data point to correlated errors. Durbin-Watson tests H₀: no residual correlation.' },
    { t: 'mc', q: 'Adding x² to a regression means it is no longer a linear regression.', o: TF, a: 1, why: 'False. Linear refers to the linear combination of terms, not the shape of the fitted curve.' },
    { t: 'mc', q: 'A QQ-plot of residuals curves away from the line in the same direction at both ends, like a bow.', fig: 'qqSkew', o: ['Residuals are Normal', 'Residuals are skewed', 'Residuals have a kurtosis problem'], a: 1, why: 'A single bow is skewness. An S shape, with tails leaving in opposite directions, is kurtosis.' },
    { t: 'fill', q: 'Constant variance of the errors is called ______.', accept: ['homoscedasticity', 'homoskedasticity'], why: 'Homoscedasticity. Its violation is heteroscedasticity.' },
    { t: 'short', q: 'List the signs that a model has severe multicollinearity and one way to address it.', why: 'Signs: incorrect coefficient signs, extreme coefficient changes after adding or deleting a variable, switches in significance, VIF above 10. Fixes: drop one of the correlated variables, avoid inference on the estimates, or use biased regression.' },
  ],
},
/* ------------------------------------------------------------------ 5 */
{
  id: 'logit', title: 'Binary Logistic Regression', deck: 'Deck 5 · Binary Logistic Regression',
  links: [['Course site: Categorical data analysis', SITE + 'part_4_category.html'], ['Course site: Binary logistic regression', SITE + 'part_5_binary.html']],
  lede: 'Tests of association, odds ratios, separation, the logit model, maximum likelihood and how to interpret coefficients.',
  secs: [
    { h: 'Categorical variables', b: `
      <ul>
        <li><b>Nominal</b>: categories with no logical ordering.</li>
        <li><b>Ordinal</b>: categories with a logical order.</li>
        <li><b>Binary is ordinal.</b> With only two categories there are only two ways to order them.</li>
      </ul>
      <p>A continuous target uses linear regression; a categorical target uses logistic regression, which comes in binary, ordinal and nominal versions. Binary classification is one of the most common business problems: targeted marketing, churn, probability of default, fraud.</p>
      <p>The running example: <code>bonus = 1</code> if an Ames home sold above $175,000. The training data has 623 zeros and 472 ones. A target category at <b>5% or less is a rare event</b> and can cause classification problems (fraud, default, marketing response, weather events).</p>` },
    { h: 'Tests of association', b: `
      <p>Two categorical variables are <b>associated</b> if the distribution of one changes across the levels of the other. A <b>cross-tabulation</b> table shows the count for every combination.</p>
      <ul>
        <li>H₀: no association. Hₐ: association.</li>
        <li>The χ² distribution is bounded below by 0, right-skewed, and has one set of degrees of freedom.</li>
      </ul>
      <div class="fx">χ² = Σ (Observed − Expected)² / Expected<small>df = (rows − 1)(columns − 1)</small></div>
      <div class="fx">Expected count = row total × column total / grand total</div>
      <p>Central air example: 62 homes lack central air, and 56.9% of all homes are not bonus eligible, so we expect 62 × 0.569 = 35.27 non-eligible homes there. We observe 60.</p>
      <p>Screening predictors against a categorical target uses the <b>Pearson χ² test</b> for categorical predictors and the <b>ANOVA F-test</b> for continuous predictors.</p>` },
    { h: 'Odds and odds ratios', b: `
      <p>A test says whether an association exists; an odds ratio measures how strong it is.</p>
      <div class="fx">Odds = p / (1 − p)</div>
      <p>Odds are <b>not</b> probability. Without central air, P(not eligible) = 60/62 = 0.9677, so the odds are 0.9677 / 0.0323 = 30.22. With central air the odds are 0.545 / 0.455 = 1.20.</p>
      <div class="fx">Odds ratio = 30.22 / 1.20 = 25.2</div>
      <p>Homes without central air have 25.2 times the odds of not being bonus eligible compared with homes with central air. The reverse reading is equally true: homes with central air have 25.2 times the odds of being eligible.</p>` },
    { h: 'Separation', b: `
      <div class="tw"><table>
        <tr><th></th><th colspan="2">Complete</th><th colspan="2">Quasi-complete</th></tr>
        <tr><th></th><th class="n">Yes</th><th class="n">No</th><th class="n">Yes</th><th class="n">No</th></tr>
        <tr><td>Group A</td><td class="n">100</td><td class="n">0</td><td class="n">77</td><td class="n">23</td></tr>
        <tr><td>Group B</td><td class="n">0</td><td class="n">50</td><td class="n">0</td><td class="n">50</td></tr>
      </table></div>
      <ul>
        <li><b>Complete separation</b>: some combination of predictors perfectly predicts <i>every</i> outcome.</li>
        <li><b>Quasi-complete separation</b>: the outcome is perfectly predicted for only a <i>subset</i> of the data. A single zero cell is enough.</li>
      </ul>
      <p>A zero cell makes the odds 0 and the odds ratio infinite. The logit for that group is ±∞, and a logistic curve cannot predict exactly 0 or 1, so maximum likelihood fails to converge.</p>
      <p><b>Solutions:</b> collapse categories to remove the zero cell (for ordinal variables combine neighbouring levels, such as "4 or fewer rooms"; for nominal variables merge the level into a similar one); penalized maximum likelihood; or drop the category, which is usually not reasonable because it looks important.</p>` },
    { h: 'Why not ordinary least squares?', b: `
      <p>For a 0/1 target, the expected value is the probability of the event, so one could try p = β₀ + β₁x₁ + …, the <b>linear probability model</b>. Its problems:</p>
      <ul>
        <li>Probabilities are bounded but a line is not. What does a prediction of −0.4 or 1.1 mean?</li>
        <li>The relationship between probability and x is usually non-linear: one more unit of x matters differently near 0.5 than near 1.</li>
        <li>The properties of OLS do not hold.</li>
      </ul>` },
    { h: 'The logistic model and the logit', b: `
      <div class="fx">p = 1 / (1 + e<sup>−(β₀ + β₁x₁ + … + βₖxₖ)</sup>)</div>
      <p>Predicted probability is always between 0 and 1, the parameters do not enter linearly, and the rate of change in p varies as x varies (the S curve).</p>
      <div class="fx">logit(p) = log( p / (1 − p) ) = β₀ + β₁x₁ + … + βₖxₖ</div>
      <p>The <b>logit link</b> is the natural log of the odds. It is unbounded and <b>linear in the parameters</b>, which is why logistic output looks like linear regression output. Landmarks: p = 0.5 gives logit 0; p → 1 gives +∞; p → 0 gives −∞.</p>
      <p>Click the highlighted values in the model from the deck:</p>
      <pre class="out" data-reader="logit">Dep. Variable:       bonus    No. Observations:      1095
Model:               Logit    <b data-k="pr2">Pseudo R-squ.:       0.3529</b>
Method:                <b data-k="mle">MLE</b>    <b data-k="ll">Log-Likelihood:     -484.38</b>
converged:            <b data-k="conv">True</b>    <b data-k="llr">LLR p-value:     1.868e-115</b>
================================================================
                  coef   std err        z    P>|z|   [0.025  0.975]
----------------------------------------------------------------
const         <b data-k="lb0">-11.3561</b>     1.012  -11.222    0.000  -13.339  -9.373
GrLivArea       <b data-k="lb1">0.0042</b>     0.000   <b data-k="z">15.531</b>    0.000    0.004   0.005
CentralAir_Y    <b data-k="lb2">4.8704</b>     0.836    5.825    <b data-k="lp">0.000</b>    3.232   6.509</pre>
      <div class="out-note" data-note="logit">Pick a value above to see what it means.</div>` },
    { h: 'Interpreting coefficients', b: `
      <p>A one-unit increase in x changes the <b>logit</b> by β. Exponentiate to talk about odds:</p>
      <div class="fx">Odds ratio = e<sup>β</sup><small>% change in odds = 100 × (e<sup>β</sup> − 1)</small></div>
      <ul>
        <li><b>Categorical</b>, CentralAir_Y = 4.87: e<sup>4.87</sup> = 130.37. Homes with central air have 130.37 times the odds of being bonus eligible as homes without, on average. That is 12,937% higher odds.</li>
        <li><b>Continuous</b>, GrLivArea = 0.0042: e<sup>0.0042</sup> = 1.0042. Each additional square foot raises the expected odds of being bonus eligible by 0.42%.</li>
      </ul>
      <p>When you take the ratio, the intercept and all other terms cancel, which is why the odds ratio depends only on that variable's β.</p>
      <div class="fx">Amount of x to double the odds = log(2) / β<small>0.693 / 0.0042 ≈ 165 sq ft</small></div>
      <p class="trap"><b>Exam trap</b>β is a change in log-odds, e<sup>β</sup> is a ratio of odds. Neither is a change in probability. For a dummy variable the comparison is always to the reference level that was left out.</p>` },
    { h: 'Maximum likelihood estimation', b: `
      <p>OLS assumptions are all about residuals. In logistic regression the classic residual does not exist: on the logit scale the observed 0s and 1s sit at ±∞, so least squares cannot be calculated. Logistic regression is estimated by <b>maximum likelihood estimation (MLE)</b>.</p>
      <p>The <b>likelihood function</b> measures how probable a given set of β values is to have produced the data. We choose the β's that <b>maximize</b> it.</p>
      <div class="fx">L = Π p<sub>i</sub><sup>y<sub>i</sub></sup> (1 − p<sub>i</sub>)<sup>1 − y<sub>i</sub></sup></div>
      <p>In words: multiply p for every 1 and (1 − p) for every 0. The slide example with eight homes gives 0.994 × 0.962 × (1 − 0.618) × 0.535 × (1 − 0.366) × 0.328 × (1 − 0.171) × (1 − 0.026) = 0.0327. The log-likelihood, Σ [y log p + (1 − y) log(1 − p)], is easier to work with.</p>
      <p>With separation the likelihood has no maximum: it keeps climbing as β heads to infinity, so the estimation does not converge.</p>` },
    { h: 'Likelihood ratio test', b: `
      <p>If extra predictors add little, the model with them should not be much more likely than the model without. The <b>likelihood ratio test (LRT)</b> compares a <b>full</b> model with a <b>reduced</b> model nested inside it.</p>
      <p>Use it for a categorical variable with more than two levels. The individual dummy p-values do not show every comparison between levels, so compare the model with and without the whole variable:</p>
      <ul>
        <li>Low p-value: the models differ; the variable adds information.</li>
        <li>High p-value: no difference; the variable can be dropped.</li>
      </ul>` },
    { h: 'Assumption and predictions', b: `
      <p>The assumption for continuous predictors is that they are <b>linear in the logit</b>. There is no easy test. Build a more flexible model, a GAM that uses splines for each f(x), and compare the two with an LRT. If the GAM says a straight line is good enough, the assumption is met.</p>
      <p>If it fails: use the GAM logistic model (with more limited interpretation for that variable), or <b>bin</b> the continuous variable, which keeps the model interpretable.</p>
      <p>After fitting, convert logits back to probabilities for predictions. A 1,500 sq ft home without central air scores 0.006; a 2,000 sq ft home with central air scores 0.863.</p>` },
  ],
  cards: [
    ['Nominal vs. ordinal', 'Nominal categories have no logical order. Ordinal categories do. Binary counts as ordinal.'],
    ['Odds', 'p / (1 − p). Not the same as probability.'],
    ['Odds ratio', 'The odds of the event in one group divided by the odds in another. In logistic regression it equals e^β.'],
    ['Logit', 'log(p / (1 − p)), the natural log of the odds. It is the "y" in the linear form of logistic regression.'],
    ['Why not OLS for a binary target?', 'Predictions can fall outside 0 to 1, the probability–x relationship is non-linear, and OLS properties do not hold.'],
    ['How are logistic coefficients estimated?', 'Maximum likelihood estimation: choose the β\'s that make the observed data most probable.'],
    ['Complete vs. quasi-complete separation', 'Complete: predictors perfectly predict every outcome. Quasi-complete: perfect prediction for only a subset (a zero cell).'],
    ['Fixes for separation', 'Collapse categories to remove the zero cell; penalized maximum likelihood; drop the category (rarely sensible).'],
    ['Pearson χ² degrees of freedom', '(rows − 1) × (columns − 1).'],
    ['Percent change in odds for a one-unit increase', '100 × (e^β − 1) percent.'],
    ['x needed to double the odds', 'log(2) / β.'],
    ['Likelihood ratio test', 'Compares a full model with a nested reduced model. Used for categorical variables with more than two levels.'],
    ['How to check linearity in the logit', 'Fit a GAM and compare it with the plain logistic model using an LRT. If it fails, use the GAM or bin the variable.'],
    ['Rare event threshold', '5% or less of the target in one category.'],
  ],
  quiz: [
    { t: 'mc', q: 'Binary variables are considered ordinal categorical variables.', o: TF, a: 0, why: 'True. With two categories there are only two possible orderings, so binary is treated as ordinal.' },
    { t: 'num', q: 'The probability of an event is 0.80. What are the odds?', a: 4, tol: 0.01, why: 'Odds = 0.80 / 0.20 = 4.' },
    { t: 'mc', q: 'In logit(p) = β₀ + β₁x₁ + …, the left-hand side is:', o: ['The probability of the event', 'The log of the odds of the event', 'The odds of the event', 'The count of 1s'], a: 1, why: 'The logit is log(p / (1 − p)), the log-odds.' },
    { t: 'num', q: 'A logistic regression has β = 0.40 for a dummy variable. What is the odds ratio? (2 decimals)', a: 1.49, tol: 0.011, why: 'e^0.40 = 1.49. That group has 1.49 times the odds of the event (49% higher odds) than the reference level.' },
    { t: 'mc', q: 'β for GrLivArea is 0.0042. The best interpretation:', o: ['Each extra square foot raises the probability by 0.42%', 'Each extra square foot raises the odds by about 0.42%', 'Each extra square foot raises the odds by 0.0042', 'Each extra square foot raises the probability by 0.0042'], a: 1, why: '100 × (e^0.0042 − 1) = 0.42% higher odds per square foot. Coefficients describe odds, not probability.' },
    { t: 'mc', q: 'Which table shows quasi-complete separation?', o: ['A: 100 / 0, B: 0 / 50', 'A: 77 / 23, B: 0 / 50', 'A: 40 / 60, B: 55 / 45', 'A: 50 / 50, B: 50 / 50'], a: 1, why: 'One zero cell: the outcome is perfectly predicted for group B only. The first table is complete separation.' },
    { t: 'fill', q: 'Logistic regression coefficients are estimated with ______ ______ estimation.', accept: ['maximum likelihood', 'mle'], why: 'Maximum likelihood estimation. OLS needs residuals, which do not exist in the classic sense for a 0/1 target.' },
    { t: 'num', q: 'A 3 × 4 cross-tabulation is tested with a Pearson χ² test. How many degrees of freedom?', a: 6, tol: 0, why: '(3 − 1)(4 − 1) = 6.' },
    { t: 'mc', q: 'A categorical predictor has four levels. To decide whether the variable belongs in the logistic model you should:', o: ['Check that every dummy p-value is small', 'Run a likelihood ratio test of the model with and without the variable', 'Run a Durbin-Watson test', 'Compare R²'], a: 1, why: 'Dummy p-values only compare each level with the reference, so not all comparisons are shown. The LRT tests the whole variable.' },
    { t: 'mc', q: 'Logistic regression can only be used when the target has exactly two categories.', o: TF, a: 1, why: 'False. Ordinal and nominal logistic regression handle targets with more than two categories.' },
    { t: 'num', q: 'Three observations have targets 1, 0, 1 and predicted probabilities 0.9, 0.2, 0.6. What is the likelihood? (3 decimals)', a: 0.432, tol: 0.002, why: '0.9 × (1 − 0.2) × 0.6 = 0.432. Use p for the 1s and 1 − p for the 0s.' },
    { t: 'short', q: 'Give one reason ordinary least squares should not be used to predict a binary outcome.', why: 'Any of: predictions are not bounded between 0 and 1; the relationship between probability and x is non-linear; the OLS assumptions (Normal, constant-variance errors) do not hold for a 0/1 target.' },
  ],
},
/* ------------------------------------------------------------------ 6 */
{
  id: 'subset', title: 'Subset Selection', deck: 'Deck 6 · Subset Selection',
  links: [['Course site: Subset selection', SITE + 'part_7_subset.html']],
  lede: 'The same selection ideas from unit 3, applied to a logistic regression and scored with AUC.',
  secs: [
    { h: 'The pipeline for a logistic model', b: `
      <ol>
        <li><b>Univariate screening.</b> Split the dummy-coded predictors into categorical (two unique values) and continuous. Use the <b>χ² test</b> for categorical predictors and the <b>ANOVA F-test</b> for continuous ones, keeping p &lt; 0.009.</li>
        <li><b>Check for quasi-complete separation.</b> Cross-tabulate each remaining dummy with the target and look for a zero cell. In Ames, <code>HouseStyle_1.5Unf</code> (13 zeros, 0 ones) and <code>Foundation_Slab</code> (18 zeros, 0 ones) were flagged.</li>
        <li><b>Scale the data</b> so the optimizer behaves, then run the selection.</li>
        <li><b>Stepwise or backward selection with 10-fold CV</b>, scored on the validation folds.</li>
      </ol>` },
    { h: 'What changes from linear regression', b: `
      <div class="tw"><table>
        <tr><th></th><th>Linear (unit 3)</th><th>Logistic (this unit)</th></tr>
        <tr><td>Screening test, continuous predictor</td><td>F-test from simple regression</td><td>ANOVA F-test</td></tr>
        <tr><td>Screening test, categorical predictor</td><td>F-test on the dummy</td><td>Pearson χ² test</td></tr>
        <tr><td>Selection metric</td><td>MSE (lower is better)</td><td><b>AUC</b>, area under the ROC curve (higher is better)</td></tr>
        <tr><td>Extra check</td><td>None</td><td>Quasi-complete separation</td></tr>
      </table></div>
      <p>The search itself is identical: backward starts full and removes, forward starts empty and adds, stepwise adds and can remove. Each step looks at the average validation metric across the folds.</p>` },
    { h: 'The methods still disagree', b: `
      <p>On Ames, stepwise and backward shared most variables (lot configuration, building type, exterior, basement, heating and kitchen quality, fireplace quality, garage type, lot area, overall quality, year built, remodel year, basement and 1st floor square footage, living area, garage area).</p>
      <ul>
        <li><b>Stepwise only:</b> full bath, half bath, bedroom count, porch square footage.</li>
        <li><b>Backward only:</b> 2nd floor square footage, garage year.</li>
      </ul>
      <p class="trap"><b>Exam trap</b>Forward, backward and stepwise are not guaranteed to produce the same final model. This is practice question 11. Use the selection lab to watch three searches on the same data end in different places.</p>` },
  ],
  cards: [
    ['Screening test for a categorical predictor with a categorical target', 'Pearson χ² test.'],
    ['Screening test for a continuous predictor with a categorical target', 'ANOVA F-test.'],
    ['Metric used to select variables for the logistic model', 'AUC (area under the ROC curve), averaged over the cross-validation folds. Higher is better.'],
    ['What must be checked before fitting a logistic model on many dummies?', 'Quasi-complete separation: a zero cell in the cross-tab of a dummy with the target.'],
    ['Do forward, backward and stepwise agree?', 'Not necessarily. They can end at different models, each a local best.'],
    ['Stepwise vs. forward', 'Both start empty and add variables. Stepwise can also remove a variable added earlier.'],
  ],
  quiz: [
    { t: 'mc', q: 'When screening predictors for a binary target, the test for a continuous predictor is:', o: ['Pearson χ²', 'ANOVA F-test', 'Breusch-Pagan', 'Durbin-Watson'], a: 1, why: 'Continuous predictor against a categorical target: ANOVA F-test. Categorical predictors use the χ² test.' },
    { t: 'mc', q: 'A dummy variable has 18 homes with value 1, and none of them are bonus eligible. This is:', o: ['Multicollinearity', 'Quasi-complete separation', 'Heteroscedasticity', 'A rare event'], a: 1, why: 'A zero cell: the outcome is perfectly predicted for that subset. This is Foundation_Slab in Ames.' },
    { t: 'mc', q: 'Which scoring metric did the course use for cross-validated selection of the logistic model?', o: ['Negative MSE', 'R²', 'ROC AUC', 'Accuracy at 0.5'], a: 2, why: 'AUC measures how well the model ranks 1s above 0s. Linear regression selection used negative MSE.' },
    { t: 'mc', q: 'Your colleague ran forward, backward and stepwise selection. What do we know about the three final models?', o: ['They are not guaranteed to be the same', 'Forward and stepwise always match', 'Backward and stepwise always match', 'All three always match'], a: 0, why: 'Not all techniques agree; each is a greedy search that can settle in a different place.' },
    { t: 'mc', q: 'Stepwise selection differs from forward selection because it:', o: ['Starts from the full model', 'Uses p-values only', 'Can remove a variable it added earlier', 'Never uses cross-validation'], a: 2, why: 'Stepwise starts empty like forward but re-checks variables already in the model and may delete them.' },
    { t: 'short', q: 'Outline the steps to go from 80 raw predictors to a selected logistic regression model.', why: 'Screen each predictor (χ² for categorical, ANOVA F for continuous) at a sample-size-adjusted α such as 0.009; check the remaining categorical variables for quasi-complete separation and fix them; scale; run backward or stepwise selection with 10-fold cross-validation on AUC; then examine the result rather than accepting it blindly.' },
  ],
},
/* ------------------------------------------------------------------ 7 */
{
  id: 'assess', title: 'Model Assessment', deck: 'Deck 7 · Model Assessment',
  links: [['Course site: Model assessment', SITE + 'part_8_assess.html'], ['Course site: Rare events', SITE + 'part_6_catdata.html']],
  lede: 'Discrimination and calibration, concordance, the classification table and every metric built from it, cut-offs, lift and rare events.',
  secs: [
    { h: 'What makes a model good', b: `
      <p>Models are built for <b>estimation</b> (quantifying the expected change in the response associated with predictors) or <b>prediction</b> (predicting new responses). The two goals will not necessarily agree.</p>
      <p>Logistic regression models the <b>probability</b> of an event, not its occurrence. It can also be used to classify.</p>
      <ul>
        <li><b>Discrimination</b>: how well the model separates events from non-events, the 1s from the 0s.</li>
        <li><b>Calibration</b>: how well predicted probabilities agree with the actual frequency of outcomes. Are predictions systematically too low or too high?</li>
      </ul>
      <p class="site"><b>From the course site</b>A model is only "good" compared with another model. Likelihood-based metrics: <b>AIC</b> and <b>BIC</b> (lower is better; BIC penalizes complexity more and favors smaller models) and <b>McFadden's pseudo-R²</b> (higher is better; compares the model with the intercept-only model, and has no "percent of variance explained" interpretation).</p>` },
    { h: 'Rank-order statistics: concordance', b: `
      <p>Compare <b>every pair made of one 1 and one 0</b>.</p>
      <ul>
        <li><b>Concordant</b>: the 1 has the higher predicted probability. The model ordered them correctly.</li>
        <li><b>Discordant</b>: the 1 has the lower predicted probability.</li>
        <li><b>Tied</b>: both have the same predicted probability.</li>
      </ul>
      <p>Only the order matters, not the actual probability values.</p>
      <div class="fx">c = Concordant% + ½ Tied%<small>Somers' D (Gini) = 2c − 1</small></div>
      <div class="fx">Kendall's τ<sub>a</sub> = (#concordant − #discordant) / [ n(n − 1) / 2 ]</div>
      <p class="trap"><b>Exam trap</b>Concordance of 85% means the model ranked the 1 ahead of the 0 in 85% of pairs. It does <b>not</b> mean the model is accurate 85% of the time.</p>` },
    { h: 'Calibration curve', b: `
      <ul>
        <li>Curve <b>above</b> the 45° line: the model predicts <b>lower</b> probabilities than actually observed.</li>
        <li>Curve <b>below</b> the 45° line: the model predicts <b>higher</b> probabilities than observed.</li>
      </ul>
      <p>Logistic regressions are stable and natively well calibrated; more advanced ML models often are not. Calibration depends on the observed proportion of events, so it is best used as a goodness-of-fit check in training rather than on validation data.</p>` },
    { h: 'Classification table', b: `
      <p>Classifying forces ŷ = 1 when the predicted probability passes a <b>cut-off</b> (threshold), for example 0.5. Strict classification throws away the information in the probabilities themselves, and the table changes when the cut-off changes.</p>
      <div class="cm" style="max-width:420px">
        <div></div><div class="h">Predicted 0</div><div class="h">Predicted 1</div>
        <div class="h">Actual 0</div><div class="c ok"><strong>TN</strong>true negative</div><div class="c no"><strong>FP</strong>false positive</div>
        <div class="h">Actual 1</div><div class="c no"><strong>FN</strong>false negative</div><div class="c ok"><strong>TP</strong>true positive</div>
      </div>
      <div class="tw"><table>
        <tr><th>Metric</th><th>Formula</th><th>Question it answers</th></tr>
        <tr><td><b>Sensitivity</b> (recall, TPR)</td><td class="mono">TP / (TP + FN)</td><td>Of the actual 1s, how many did we catch?</td></tr>
        <tr><td><b>Specificity</b> (TNR)</td><td class="mono">TN / (TN + FP)</td><td>Of the actual 0s, how many did we clear?</td></tr>
        <tr><td>False positive rate</td><td class="mono">FP / (TN + FP) = 1 − specificity</td><td>Of the actual 0s, how many did we flag?</td></tr>
        <tr><td><b>Precision</b> (PPV)</td><td class="mono">TP / (TP + FP)</td><td>Of our predicted 1s, how many were right?</td></tr>
        <tr><td><b>Accuracy</b></td><td class="mono">(TP + TN) / n</td><td>What share did we classify correctly?</td></tr>
        <tr><td>Error (misclassification)</td><td class="mono">(FP + FN) / n</td><td>What share did we get wrong?</td></tr>
      </table></div>
      <p>Sensitivity and specificity divide by <b>actual</b> totals (rows). Precision divides by a <b>predicted</b> total (column).</p>` },
    { h: 'Choosing a cut-off', b: `
      <p>Always consider the <b>cost</b> of false positives and false negatives. When costs are not considered:</p>
      <div class="fx">Youden's J = sensitivity + specificity − 1</div>
      <p>Pick the cut-off with the highest J. It weighs false positives and false negatives equally.</p>
      <div class="fx">F₁ = 2 × (precision × recall) / (precision + recall)</div>
      <p>F₁ is the precision-recall version of Youden's index. The cut-off that maximizes F₁ <b>does not typically match</b> the Youden cut-off.</p>` },
    { h: 'ROC curve and AUC', b: `
      <p>The ROC curve plots the <b>true positive rate (sensitivity)</b> against the <b>false positive rate (1 − specificity)</b> across a grid of thresholds. The area under it, <b>AUC</b> or AUROC, summarizes the whole curve and is <b>equivalent to the c-statistic</b>. You want high sensitivity and high specificity: a curve that hugs the top-left corner.</p>` },
    { h: 'Lift and gains', b: `
      <div class="fx">Lift = PPV / π₁<small>π₁ = overall proportion of events</small></div>
      <p>Common in marketing. Interpretation: in the top <i>depth</i>% of customers ranked by predicted probability, you get <i>lift</i> times as many responses as you would by targeting a random sample of the same size. The cumulative capture (gain) chart shows the share of all events captured by each depth.</p>` },
    { h: 'Accuracy can fool you', b: `
      <p>If 5% of the data are events, a model that predicts "non-event" for everyone is 95% accurate and useless. Accuracy and error are fine to report but not to choose models with.</p>
      <p>Classification is a decision that sits outside the statistical model. It assumes the cost is the same for every individual, so it is useful for groups and risky for single-observation decisions.</p>` },
    { h: 'Rare events', b: `
      <p>A rare event is 5% or less in a category. Does logistic regression need to worry? <b>Short answer: no.</b></p>
      <ul>
        <li>The model's goal is to rank-order observations. Its probabilities are still well calibrated; they are just low, as they should be for a rare event.</li>
        <li><b>Oversampling is not needed</b> for logistic regression. The problem is the default 0.5 cut-off, not the probabilities. Adjust the cut-off.</li>
        <li>Other ML models will not be this easy.</li>
      </ul>
      <p class="site"><b>From the course site</b><b>Oversampling</b> replicates the rare events until they balance the non-events (bigger training set). <b>Undersampling</b> randomly keeps only enough non-events to match the events (smaller training set). Either one biases the predicted probabilities upward, so the model must be corrected by <b>adjusting the intercept</b> or by <b>weighting</b>.</p>` },
  ],
  cards: [
    ['Discrimination vs. calibration', 'Discrimination: separating 1s from 0s. Calibration: predicted probabilities matching observed frequencies.'],
    ['Concordant pair', 'A (1, 0) pair where the 1 has the higher predicted probability.'],
    ['c-statistic', 'Concordant% + ½ Tied%. Equal to the area under the ROC curve.'],
    ['Somers\' D', '2c − 1. Also called Gini.'],
    ['Sensitivity', 'TP / (TP + FN). Also called recall or true positive rate.'],
    ['Specificity', 'TN / (TN + FP). The true negative rate.'],
    ['Precision', 'TP / (TP + FP). Also called positive predictive value.'],
    ['Youden\'s J', 'Sensitivity + specificity − 1. Maximize it to choose a cut-off when FP and FN cost the same.'],
    ['F₁ score', '2 × precision × recall / (precision + recall). Its best cut-off usually differs from Youden\'s.'],
    ['ROC curve axes', 'True positive rate (sensitivity) on the y-axis against false positive rate (1 − specificity) on the x-axis.'],
    ['Lift', 'PPV / π₁. How many times more responses than random targeting at the same depth.'],
    ['Why is accuracy easy to fool?', 'With 5% events, predicting "no" for everyone is 95% accurate.'],
    ['Rare events and logistic regression', 'No oversampling needed. Probabilities are correctly low; change the cut-off from 0.5.'],
    ['Calibration curve above the 45° line', 'The model is predicting lower probabilities than actually observed.'],
  ],
  quiz: [
    { t: 'mc', q: 'A model has concordance of 88%. Which statement is correct?', o: ['It classifies 88% of observations correctly', 'In 88% of (1, 0) pairs the 1 received the higher predicted probability', '88% of predicted probabilities are above 0.5', 'Its sensitivity is 88%'], a: 1, why: 'Concordance is about ranking pairs, not accuracy.' },
    { t: 'num', q: 'TP = 40, FN = 10, FP = 20, TN = 130. What is the sensitivity?', a: 0.8, tol: 0.005, why: 'TP / (TP + FN) = 40 / 50 = 0.80.' },
    { t: 'num', q: 'Same table: TP = 40, FN = 10, FP = 20, TN = 130. What is the precision? (3 decimals)', a: 0.667, tol: 0.005, why: 'TP / (TP + FP) = 40 / 60 = 0.667.' },
    { t: 'num', q: 'Same table. What is the specificity? (3 decimals)', a: 0.867, tol: 0.005, why: 'TN / (TN + FP) = 130 / 150 = 0.867.' },
    { t: 'num', q: 'A cut-off gives sensitivity 0.80 and specificity 0.87. What is Youden\'s J?', a: 0.67, tol: 0.005, why: '0.80 + 0.87 − 1 = 0.67.' },
    { t: 'mc', q: 'The area under the ROC curve is equivalent to:', o: ['Accuracy', 'The c-statistic', 'Somers\' D', 'The F₁ score'], a: 1, why: 'AUC equals the c-statistic. Somers\' D is 2c − 1.' },
    { t: 'num', q: 'A model has c = 0.85. What is Somers\' D?', a: 0.7, tol: 0.005, why: '2 × 0.85 − 1 = 0.70.' },
    { t: 'mc', q: 'Lowering the cut-off from 0.5 to 0.2 will generally:', o: ['Raise sensitivity and lower specificity', 'Lower sensitivity and raise specificity', 'Raise both', 'Change neither'], a: 0, why: 'More observations are predicted 1, so more true 1s are caught and more true 0s are wrongly flagged.' },
    { t: 'mc', q: 'With a 3% event rate, you should oversample before fitting a logistic regression.', o: TF, a: 1, why: 'False. Oversampling is not needed for logistic regression. The probabilities are correctly low; adjust the cut-off instead.' },
    { t: 'mc', q: 'A calibration curve sits below the 45° line. The model is:', o: ['Predicting probabilities that are too high', 'Predicting probabilities that are too low', 'Perfectly calibrated', 'Unable to discriminate'], a: 0, why: 'Below the line: predicted probabilities are higher than the observed frequency.' },
    { t: 'num', q: 'The top 10% of customers by score respond at 24%. The overall response rate is 8%. What is the lift?', a: 3, tol: 0.01, why: 'Lift = PPV / π₁ = 0.24 / 0.08 = 3. You get three times as many responders as a random 10%.' },
    { t: 'short', q: 'Why is accuracy a poor metric for choosing between models when events are rare?', why: 'With 5% events, guessing non-event for everyone is 95% accurate while catching nothing. Accuracy can be easily fooled; it is fine to report but should not drive model choice.' },
  ],
},
];

/* Explanations for the two clickable output blocks. */
const READERS = {
  ols: {
    r2: ['R-squared 0.089', 'Age explains about 8.9% of the variation in charges. Low, but a single variable rarely explains much.'],
    ar2: ['Adj. R-squared 0.089', 'R² penalized for the number of predictors. Use it to compare models with different numbers of variables.'],
    n: ['1338 observations', 'The sample size. Degrees of freedom for residuals = n − k − 1 = 1338 − 1 − 1 = 1336.'],
    k: ['Df Model 1', 'One predictor. In the multiple regression this becomes 8 because each dummy variable counts.'],
    f: ['F-statistic 131.2', 'Tests whether the model as a whole is useful: H₀ is that all slopes equal 0.'],
    pf: ['Prob (F) 4.89e-29', 'Essentially 0. Reject H₀: at least one predictor is related to charges.'],
    b0: ['Intercept 3165.89', 'Predicted charges when age = 0. Usually not meaningful on its own.'],
    b1: ['Slope 257.72', 'Each additional year of age is associated with $257.72 higher charges, on average.'],
    se: ['Std err 22.50', 'How much the slope estimate would vary from sample to sample. Multicollinearity inflates this.'],
    t: ['t = 11.45', 'coef ÷ std err = 257.72 ÷ 22.50. How many standard errors the estimate is from 0.'],
    p: ['P>|t| 0.000', 'P-value for H₀: slope = 0. Below any reasonable α, so age is statistically significant.'],
    ci: ['95% CI 213.58 to 301.87', 'We are 95% confident the true slope is in this range. It excludes 0, which agrees with the p-value.'],
  },
  logit: {
    pr2: ['Pseudo R-squ. 0.3529', 'McFadden\'s pseudo-R²: how much better this model is than the intercept-only model. Useful only for comparing models; it is not "percent of variance explained".'],
    mle: ['Method: MLE', 'Maximum likelihood estimation, not least squares.'],
    ll: ['Log-Likelihood −484.38', 'The maximized log-likelihood. Closer to 0 is better. LL-Null (−748.55) is the intercept-only model.'],
    conv: ['converged: True', 'The optimizer found a maximum. With separation this would fail or warn.'],
    llr: ['LLR p-value 1.868e-115', 'Likelihood ratio test of this model against the intercept-only model. Tiny p-value: the predictors add information.'],
    lb0: ['const −11.36', 'The logit when both predictors are 0. It cancels out of every odds ratio.'],
    lb1: ['GrLivArea 0.0042', 'One more square foot adds 0.0042 to the log-odds. e^0.0042 = 1.0042, so 0.42% higher odds of being bonus eligible.'],
    lb2: ['CentralAir_Y 4.87', 'e^4.87 = 130.37. Homes with central air have 130.37 times the odds of being bonus eligible as homes without.'],
    z: ['z = 15.53', 'coef ÷ std err. Logistic output reports z instead of t.'],
    lp: ['P>|z| 0.000', 'Below α = 0.009, so central air is significant.'],
  },
};

/* The instructor's practice midterm, questions paraphrased, with worked answers. */
const HOUSE = `<p>A real estate analyst models home sale price (in $ thousands). X₁ = square footage, X₂ = age of home in years, X₃ = number of bedrooms, X₄ = two-car garage (1 = yes).</p>
<div class="tw"><table><tr><th>Parameter</th><th class="n">Estimate</th><th class="n">Std. err.</th><th class="n">t</th><th class="n">p-value</th></tr>
<tr><td>Intercept</td><td class="n">2.81</td><td class="n">2.49</td><td class="n">1.13</td><td class="n">0.2610</td></tr>
<tr><td>X₁</td><td class="n">0.09</td><td class="n">0.03</td><td class="n">3.03</td><td class="n">0.0034</td></tr>
<tr><td>X₂</td><td class="n">−0.52</td><td class="n">0.13</td><td class="n">−4.00</td><td class="n">0.0001</td></tr>
<tr><td>X₃</td><td class="n">4.93</td><td class="n">1.42</td><td class="n">3.47</td><td class="n">0.0008</td></tr>
<tr><td>X₄</td><td class="n">20.71</td><td class="n">1.09</td><td class="n">19.00</td><td class="n">&lt;0.0001</td></tr></table></div>`;
const BID = `<p>A construction firm models the probability of winning a bid with one variable, project size (Small, Medium, Large). X₁ = 1 for Small, X₂ = 1 for Medium.</p>
<div class="tw"><table><tr><th>Parameter</th><th class="n">Estimate</th><th class="n">Std. err.</th><th class="n">p-value</th></tr>
<tr><td>Intercept</td><td class="n">−0.0904</td><td class="n">0.1608</td><td class="n">0.5741</td></tr>
<tr><td>X₁ (Small)</td><td class="n">0.6717</td><td class="n">0.2465</td><td class="n">0.0064</td></tr>
<tr><td>X₂ (Medium)</td><td class="n">0.6659</td><td class="n">0.2404</td><td class="n">0.0056</td></tr></table></div>`;
const TEN = `<p>Ten observations scored by a logistic regression, classified at a cut-off of 0.5.</p>
<div class="tw"><table><tr><th>Obs</th><th class="n">Target</th><th class="n">Pred. prob.</th><th class="n">Pred. class</th></tr>
<tr><td>A</td><td class="n">1</td><td class="n">0.7</td><td class="n">1</td></tr><tr><td>B</td><td class="n">1</td><td class="n">0.8</td><td class="n">1</td></tr>
<tr><td>C</td><td class="n">0</td><td class="n">0.2</td><td class="n">0</td></tr><tr><td>D</td><td class="n">1</td><td class="n">0.5</td><td class="n">1</td></tr>
<tr><td>E</td><td class="n">0</td><td class="n">0.5</td><td class="n">1</td></tr><tr><td>F</td><td class="n">1</td><td class="n">0.6</td><td class="n">1</td></tr>
<tr><td>G</td><td class="n">1</td><td class="n">0.4</td><td class="n">0</td></tr><tr><td>H</td><td class="n">0</td><td class="n">0.1</td><td class="n">0</td></tr>
<tr><td>I</td><td class="n">0</td><td class="n">0.3</td><td class="n">0</td></tr><tr><td>J</td><td class="n">0</td><td class="n">0.5</td><td class="n">1</td></tr></table></div>`;

const PRACTICE = [
  { n: 1, u: 'logit', t: 'short', q: 'Briefly explain the difference between nominal and ordinal categorical variables.', why: 'Nominal categories have no logical ordering (neighborhood, exterior material). Ordinal categories have a logical order (quality: poor, fair, good).' },
  { n: 2, u: 'logit', t: 'mc', q: 'Binary variables are considered ordinal categorical variables.', o: TF, a: 0, why: 'True. Two categories can only be ordered two ways, so binary is ordinal.' },
  { n: 3, u: 'diag', t: 'mc', fig: 'curve', q: 'A residual plot that looks like this would raise which concern?', o: ['Normality', 'Independence', 'Model misspecification', 'No concerns; this is a good residual plot'], a: 2, why: 'The residuals follow an upside-down U instead of random scatter. A pattern means the linear form is wrong: lack of fit. Add polynomial terms or use a GAM.' },
  { n: 4, u: 'diag', t: 'short', q: 'List two of the assumptions on the errors for simple linear regression.', why: 'Any two of: errors are Normally distributed with mean 0; errors have constant variance (homoscedasticity); errors are independent of each other. (The fourth assumption, linearity of the mean, shows up as a pattern in the errors.)' },
  { n: 5, u: 'diag', t: 'short', q: 'Simple linear regression has one predictor; multiple regression has more than one. What problems can arise with multiple predictors?', why: 'Multicollinearity: predictors correlated with each other give errors in the estimates and standard errors, wrong signs and switches in significance. Also, with many predictors you must decide which are informative, and automatic selection risks overfitting and biased results.' },
  { n: 6, u: 'diag', t: 'mc', q: 'Which test is used to determine whether heteroscedasticity exists?', o: ["Cook's D", 'Anderson-Darling test', 'Breusch-Pagan test', 'Mantel-Haenszel test'], a: 2, why: 'Breusch-Pagan (H₀: homoscedasticity). Cook\'s D measures influence, Anderson-Darling tests Normality, Mantel-Haenszel is a categorical association test.' },
  { n: 7, u: 'diag', t: 'mc', fig: 'qqSkew', q: 'What do you conclude from this QQ-plot of residuals?', o: ['Residuals are Normally distributed', 'Residuals are skewed', 'Residuals have a problem with kurtosis'], a: 1, why: 'The points form a single bow, above the line at both ends. That is skewness (here, right skew). Kurtosis would look like an S.' },
  { n: 8, u: 'intro', t: 'short', ctx: HOUSE, q: 'At a significance level of 0.002, which variables are statistically significant in predicting price?', why: 'Compare each p-value with 0.002. X₂ (0.0001), X₃ (0.0008) and X₄ (<0.0001) are significant. X₁ (0.0034) is not, even though it would be at 0.05.' },
  { n: 9, u: 'diag', t: 'short', ctx: HOUSE, q: 'From the variable names alone, do you see potential for multicollinearity? If so, give a possible solution.', why: 'Yes. Square footage and number of bedrooms are likely correlated (bigger homes have more bedrooms). Solutions: drop one of them, avoid inference on those coefficients, or use a biased regression technique.' },
  { n: 10, u: 'diag', t: 'num', ctx: HOUSE, q: 'R² from regressing X₃ on the other predictors is 0.95. What is the VIF for number of bedrooms?', a: 20, tol: 0.01, why: 'VIF = 1 / (1 − 0.95) = 20. Above 10, so severe multicollinearity: the standard error for bedrooms is badly inflated and its coefficient is unreliable.' },
  { n: 11, u: 'subset', t: 'mc', q: 'A colleague tried forward, backward and stepwise selection. What do we know about the final models?', o: ['The three techniques are not guaranteed to give the same final model', 'Forward and stepwise always match; backward differs', 'Backward and stepwise always match; forward differs', 'All three give the same model'], a: 0, why: 'Not all techniques agree. On Ames, backward and stepwise chose different variable lists.' },
  { n: 12, u: 'intro', t: 'short', q: 'What is the difference between supervised and unsupervised learning algorithms?', why: 'Supervised models learn from labeled data: there is a known target to predict (regression, classification). Unsupervised models learn from unlabeled data with no target (clustering).' },
  { n: 13, u: 'build', t: 'short', q: 'Briefly explain the difference between a training and a testing data set and why we have them.', why: 'The model is built on the training set and evaluated on the test set. The held-out data gives an honest assessment of performance on new data and shows whether the model has overfit.' },
  { n: 15, u: 'logit', t: 'short', q: 'Give one reason not to use ordinary least squares to predict a binary outcome.', why: 'Predictions are not bounded between 0 and 1; the relationship between probability and x is non-linear; OLS properties and assumptions do not hold.' },
  { n: 16, u: 'logit', t: 'mc', q: 'You can only run a logistic regression for a target with two categories, not more.', o: TF, a: 1, why: 'False. Logistic regression also has ordinal and nominal versions for targets with more than two categories.' },
  { n: 18, u: 'logit', t: 'num', ctx: BID, q: 'Calculate the odds ratio for winning bids between Small and Large projects. (2 decimals)', a: 1.96, tol: 0.011, why: 'Large is the reference level (no dummy). OR = e^0.6717 = 1.96.' },
  { n: 19, u: 'logit', t: 'short', ctx: BID, q: 'Interpret the odds ratio from the previous question.', why: 'Small projects have 1.96 times the odds of winning the bid compared with large projects, on average. Equivalently, about 96% higher odds.' },
  { n: 20, u: 'logit', t: 'mc', q: 'Logistic regression can be written as y = β₀ + β₁x₁ + … + βₖxₖ. What is y?', o: ['The probability of the event', 'The log of the odds of the event', "The number of 0's in the target", "The number of 1's in the target"], a: 1, why: 'The logit: log(p / (1 − p)).' },
  { n: 21, u: 'logit', t: 'fill', q: 'OLS cannot estimate logistic regression coefficients. Which estimation technique is used instead?', accept: ['maximum likelihood', 'mle'], why: 'Maximum likelihood estimation (MLE).' },
  { n: 23, u: 'logit', t: 'short', q: 'Fill in a 2 × 2 table (groups A and B by target 1 and 0) so the variable has a complete separation problem.', why: 'Every group must fall entirely in one outcome. For example, Group A: 100 ones and 0 zeros; Group B: 0 ones and 50 zeros. Zeros on one diagonal. If only one cell were 0 it would be quasi-complete.' },
  { n: 24, u: 'assess', t: 'num', ctx: TEN, q: 'How many false positives are in the predicted classification?', a: 2, tol: 0, why: 'False positive = actual 0, predicted 1. Observations E and J.' },
  { n: 25, u: 'assess', t: 'num', ctx: TEN, q: 'What is the sensitivity?', a: 0.8, tol: 0.005, why: 'Actual 1s: A, B, D, F, G (five). Predicted 1 among them: A, B, D, F (four). 4 / 5 = 0.80. G is a false negative.' },
  { n: 26, u: 'assess', t: 'num', ctx: TEN, q: 'What is the specificity?', a: 0.6, tol: 0.005, why: 'Actual 0s: C, E, H, I, J (five). Predicted 0 among them: C, H, I (three). 3 / 5 = 0.60.' },
];

const FORMULAS = [
  ['Regression metrics', [
    ['MAE', '(1/n) Σ |Y − Ŷ|'], ['MAPE', '(1/n) Σ |(Y − Ŷ) / Y|'], ['MSE', '(1/n) Σ (Y − Ŷ)²'], ['RMSE', '√MSE'], ['Residual', 'y − ŷ'],
  ]],
  ['Diagnostics', [
    ['VIF', '1 / (1 − R²ⱼ)   (too high above 10)'], ['Tolerance', '1 − R²ⱼ'], ['Outlier', '|standardized residual| > 3'], ['High leverage', 'hᵢ > 2(k + 1) / n'], ["Cook's D flag", 'D > 4 / n'],
  ]],
  ['Categorical association', [
    ['Expected count', 'row total × column total / n'], ['Pearson χ²', 'Σ (Obs − Exp)² / Exp'], ['χ² df', '(rows − 1)(columns − 1)'], ['Odds', 'p / (1 − p)'], ['Odds ratio', 'odds in group 1 / odds in group 2'],
  ]],
  ['Logistic regression', [
    ['Probability', 'p = 1 / (1 + e^−(β₀ + β₁x₁ + …))'], ['Logit', 'log(p / (1 − p)) = β₀ + β₁x₁ + …'], ['Odds ratio', 'e^β'], ['% change in odds', '100 × (e^β − 1)'], ['Double the odds', 'log(2) / β'], ['Likelihood', 'Π pᵢ^yᵢ (1 − pᵢ)^(1 − yᵢ)'],
  ]],
  ['Assessment', [
    ['c-statistic', 'Concordant% + ½ Tied%   (= AUC)'], ["Somers' D", '2c − 1'], ['Sensitivity (recall)', 'TP / (TP + FN)'], ['Specificity', 'TN / (TN + FP)'], ['False positive rate', 'FP / (TN + FP)'], ['Precision (PPV)', 'TP / (TP + FP)'], ['Accuracy', '(TP + TN) / n'], ['Error', '(FP + FN) / n'], ["Youden's J", 'sensitivity + specificity − 1'], ['F₁', '2 × precision × recall / (precision + recall)'], ['Lift', 'PPV / π₁'],
  ]],
];
const TESTS = [
  ['Breusch-Pagan', 'Constant variance', 'Homoscedasticity'],
  ['Shapiro-Wilk', 'Normality, n < 2,000', 'Residuals are Normal'],
  ['Anderson-Darling', 'Normality, large n', 'Residuals are Normal'],
  ['Durbin-Watson', 'Independence', 'No residual correlation'],
  ['Pearson χ²', 'Two categorical variables', 'No association'],
  ['ANOVA F-test', 'Continuous predictor vs. categorical target', 'No relationship'],
  ['Likelihood ratio test', 'Full vs. reduced nested model', 'Extra variables add nothing'],
];
const NUMBERS = [
  ['> 50% missing', 'Consider deleting the variable'],
  ['Variance < 0.01', 'Low-variability continuous variable'],
  ['One category > 95%', 'Low-variability categorical variable'],
  ['α ≈ 0.009', 'Screening cut-off for n ≈ 1,000 (Raftery)'],
  ['VIF > 10', 'Multicollinearity too high'],
  ['|residual| > 3 SD', 'Outlier'],
  ['≤ 5% events', 'Rare event'],
  ['n < 2,000', 'Shapiro-Wilk rather than Anderson-Darling'],
  ['c − 1', 'Dummy variables for c categories'],
];
