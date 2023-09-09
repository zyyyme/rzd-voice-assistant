# Build

```docker build -t whisper_stt .```

# Run

```docker run --gpus all -p 8080:80 -v $PWD/models/:/models -v $PWD/vocab:/vocab -v $PWD/src:/src whisper_stt:latest```