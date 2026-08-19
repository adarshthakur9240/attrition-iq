# AttritionIQ — Model Training Metrics

> **Primary metric:** Recall on `Attrition=Yes`  
> Missing a flight-risk employee is more costly than a false alarm.

## Dataset

| Item | Value |
|------|-------|
| Source | IBM HR Employee Attrition (Kaggle) |
| Total rows | 1 470 |
| Train / Test split | 80 % / 20 % (stratified) |
| Class imbalance handling | `class_weight='balanced'` |

## Model Comparison

| Model | Accuracy | Precision (Yes) | **Recall (Yes)** | F1 (Yes) | ROC-AUC |
|-------|----------|-----------------|------------------|----------|---------|
| RandomForest (balanced) | 0.827 | 0.447 | **0.362** | 0.400 | 0.767 |
| LogisticRegression (balanced) | 0.762 | 0.368 | **0.681** | 0.478 | 0.801 |

## Best Model: `LogisticRegression (balanced)`

Selected by: highest `recall_yes + roc_auc` composite score.

### Confusion Matrix (test set)

```
             Predicted No   Predicted Yes
Actual No         192            55
Actual Yes         15            32
```

### Classification Report

```
                      precision     recall   f1-score    support
No                        0.928      0.777      0.846        247
Yes                       0.368      0.681      0.478         47
accuracy                                        0.762        294
```

### Top 20 Feature Importances

| Rank | Feature | Importance |
|------|---------|------------|
| 1 | `over_time_Yes` | 0.0915 |
| 2 | `business_travel_Travel_Frequently` | 0.0818 |
| 3 | `job_role_Laboratory Technician` | 0.0748 |
| 4 | `job_role_Sales Representative` | 0.0537 |
| 5 | `job_role_Research Director` | 0.0481 |
| 6 | `education_field_Other` | 0.0441 |
| 7 | `business_travel_Travel_Rarely` | 0.0431 |
| 8 | `marital_status_Single` | 0.0414 |
| 9 | `total_working_years` | 0.0317 |
| 10 | `job_role_Human Resources` | 0.0277 |
| 11 | `years_since_last_promotion` | 0.0277 |
| 12 | `department_Research & Development` | 0.0260 |
| 13 | `num_companies_worked` | 0.0246 |
| 14 | `department_Sales` | 0.0233 |
| 15 | `years_with_curr_manager` | 0.0233 |
| 16 | `job_level` | 0.0229 |
| 17 | `environment_satisfaction` | 0.0225 |
| 18 | `job_satisfaction` | 0.0223 |
| 19 | `distance_from_home` | 0.0171 |
| 20 | `gender_Male` | 0.0168 |

---
_Generated automatically by `app/ml/train.py`_
