# Build

```docker build -t whisper_stt .```

# Run

```docker run -p 8080:80 -v /home/rinat/hackatons/whisper_stt/models/:/models -it --rm whisper_stt:latest```