# SinFoS: A Comprehensive Dataset for Sinhala Figures of Speech

**Authors**: Johan Sofalas, et al.  
**Venue**: European Chapter of the Association for Computational Linguistics (EACL), Rabat, 2024  
**Primary Discipline**: Computational Linguistics & Low-Resource Natural Language Processing  

---

## Abstract
Figures of speech such as metaphors (*Rūpaka*), idioms (*Rūḍhi*), and similes (*Upamā*) present profound semantic challenges in natural language understanding, especially within under-resourced languages. Sinhala, an Indo-Aryan language with over 17 million speakers, exhibits rich figurative expressions in both classical literature and contemporary digital media that remain uncaptured by standard token-level sentiment and classification architectures. 

In this work, we introduce **SinFoS**, the first publicly accessible, multi-domain benchmark dataset containing 12,500 annotated figurative expressions in Sinhala. Leveraging cross-lingual transfer learning from multilingual BERT (mBERT) and XLM-RoBERTa, complemented by domain-specific fine-tuning, our proposed architecture achieves an F1-score of 0.842 on fine-grained metaphor identification, outperforming zero-shot baselines by 19.4%.

---

## Dataset Characteristics
- **Total Annotated Expressions**: 12,500
- **Categories**: Metaphors (44%), Similes (32%), Idiomatic Collocations (24%)
- **Source Corpora**: Literary classics, contemporary news commentary, social discourse
- **Annotation Agreement**: Fleiss' Kappa $\kappa = 0.81$ across three native annotators

---

## Key Findings
1. Subword tokenization artifacts significantly degrade figurative boundary detection unless paired with morpho-syntactic boundary alignment.
2. Low-rank adaptation (LoRA) on multilingual backbones provides efficient parameter transfer with minimal overfitting on low-resource training splits.
