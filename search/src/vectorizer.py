from sentence_transformers import SentenceTransformer
sentences = ["This is an example sentence", "Each sentence is converted"]

model = SentenceTransformer('symanto/sn-xlm-roberta-base-snli-mnli-anli-xnli')
embeddings = model.encode(sentences)
print(embeddings)


def vectorize(query: str):
    return model.encode(query)