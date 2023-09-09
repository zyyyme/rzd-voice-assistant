# Build

```docker build -t whisper_stt .```

(from https://github.com/openai/whisper/discussions/63)
# Download model
```wget https://openaipublic.azureedge.net/main/whisper/models/345ae4da62f9b3d59415adc60127b97c714f32e89e936602e85993674d08dcb1/medium.pt -P models/medium.pt```

# Run

```docker run --gpus all -p 8080:80 -v $PWD/models/:/models -v $PWD/vocab:/vocab -v $PWD/src:/src whisper_stt:latest```