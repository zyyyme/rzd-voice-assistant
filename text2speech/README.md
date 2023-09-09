# Build

```docker build -t tts .```

(from https://github.com/openai/whisper/discussions/63)
# Download model
```wget https://models.silero.ai/models/tts/ru/v4_ru.pt -P models/model.pt```

# Run

```docker run --gpus all -p 8080:80 -v $PWD/models/:/models -v $PWD/vocab:/vocab -v $PWD/src:/src tts```