import { ref, onBeforeUnmount, onMounted } from 'vue';
import RecordRTC from 'recordrtc';
import hark from 'hark';
import { Mp3Encoder } from 'lamejs';
import axios from 'axios';

import {
  defaultStopTimeout,
  ffmpegCoreUrl,
  silenceRemoveCommand,
  whisperApiEndpoint,
} from '../configs';

export type UseWhisperConfig = {
  apiKey?: string
  autoStart?: boolean
  autoTranscribe?: boolean
  mode?: 'transcriptions' | 'translations'
  nonStop?: boolean
  removeSilence?: boolean
  stopTimeout?: number
  streaming?: boolean
  timeSlice?: number
  whisperConfig?: WhisperApiConfig
  onDataAvailable?: (blob: Blob) => void
  onTranscribe?: (blob: Blob) => Promise<UseWhisperTranscript>
}

export type UseWhisperTimeout = {
  stop?: NodeJS.Timeout
}

export type UseWhisperTranscript = {
  blob?: Blob
  text?: string
}

export type UseWhisperReturn = {
  recording: boolean
  speaking: boolean
  transcribing: boolean
  transcript: UseWhisperTranscript
  pauseRecording: () => Promise<void>
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
}

export type UseWhisperHook = (config?: UseWhisperConfig) => UseWhisperReturn

export type WhisperApiConfig = {
  model?: 'whisper-1' | string
  prompt?: string
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  temperature?: number
  language?: string
}

export const useWhisper: UseWhisperConfig = (config) => {
  const {
    apiKey,
    autoStart,
    autoTranscribe,
    mode,
    nonStop,
    removeSilence,
    stopTimeout,
    streaming,
    timeSlice,
    whisperConfig,
    onDataAvailable: onDataAvailableCallback,
    onTranscribe: onTranscribeCallback,
  } = { ...defaultConfig, ...config };

  const chunks = ref([]);
  const encoder = ref(null);
  const listener = ref(null);
  const recorder = ref(null);
  const stream = ref(null);
  const timeout = ref({ stop: null });

  const recording = ref(false);
  const speaking = ref(false);
  const transcribing = ref(false);
  const transcript = ref({ blob: null, text: null });

  // Cleanup on component unmounted
  onBeforeUnmount(() => {
    cleanup();
  });

  // If config.autoStart is true, start speech recording immediately upon component mounted
  onMounted(async () => {
    if (autoStart) {
      await onStartRecording();
    }
  });

  const cleanup = () => {
    if (chunks.value) {
      chunks.value = [];
    }
    if (encoder.value) {
      encoder.value.flush();
      encoder.value = null;
    }
    if (recorder.value) {
      recorder.value.destroy();
      recorder.value = null;
    }
    onStopTimeout('stop');
    if (listener.value) {
      listener.value.off('speaking', onStartSpeaking);
      listener.value.off('stopped_speaking', onStopSpeaking);
    }
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop());
      stream.value = null;
    }
  };

  const startRecording = async () => {
    await onStartRecording();
  };

  const pauseRecording = async () => {
    await onPauseRecording();
  };

  const stopRecording = async () => {
    await onStopRecording();
  };

  const onStartRecording = async () => {
    try {
      if (!stream.value) {
        await onStartStreaming();
      }
      if (stream.value) {
        if (!recorder.value) {
          const recorderConfig = {
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1, // mono
            recorderType: RecordRTC.StereoAudioRecorder,
            sampleRate: 44100, // Sample rate = 44.1khz
            timeSlice: streaming ? timeSlice : undefined,
            type: 'audio',
            ondataavailable: autoTranscribe && streaming ? onDataAvailable : undefined,
          };
          recorder.value = new RecordRTC(stream.value, recorderConfig);
        }
        if (!encoder.value) {
          encoder.value = new Mp3Encoder(1, 44100, 96);
        }
        const recordState = await recorder.value.getState();
        if (recordState === 'inactive' || recordState === 'stopped') {
          await recorder.value.startRecording();
        }
        if (recordState === 'paused') {
          await recorder.value.resumeRecording();
        }
        if (nonStop) {
          onStartTimeout('stop');
        }
        recording.value = true;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onStartStreaming = async () => {
    try {
      if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop());
      }
      stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!listener.value) {
        listener.value = hark(stream.value, {
          interval: 100,
          play: false,
        });
        listener.value.on('speaking', onStartSpeaking);
        listener.value.on('stopped_speaking', onStopSpeaking);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onStartTimeout = (type) => {
    if (!timeout.value[type]) {
      timeout.value[type] = setTimeout(() => onStopRecording(), stopTimeout);
    }
  };

  const onStartSpeaking = () => {
    console.log('start speaking');
    speaking.value = true;
    onStopTimeout('stop');
  };

  const onStopSpeaking = () => {
    console.log('stop speaking');
    speaking.value = false;
    if (nonStop) {
      onStartTimeout('stop');
    }
  };

  const onPauseRecording = async () => {
    try {
      if (recorder.value) {
        const recordState = await recorder.value.getState();
        if (recordState === 'recording') {
          await recorder.value.pauseRecording();
        }
        onStopTimeout('stop');
        recording.value = false;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onStopRecording = async () => {
    try {
      if (recorder.value) {
        const recordState = await recorder.value.getState();
        if (recordState === 'recording' || recordState === 'paused') {
          await recorder.value.stopRecording();
        }
        onStopStreaming();
        onStopTimeout('stop');
        recording.value = false;
        if (autoTranscribe) {
          await onTranscribing();
        } else {
          let blob = await recorder.value.getBlob();
          setTranscript({ blob });
        }
        await recorder.value.destroy();
        chunks.value = [];
        if (encoder.value) {
          encoder.value.flush();
          encoder.value = null;
        }
        recorder.value = null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onStopStreaming = () => {
    if (listener.value) {
      listener.value.off('speaking', onStartSpeaking);
      listener.value.off('stopped_speaking', onStopSpeaking);
      listener.value = null;
    }
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop());
      stream.value = null;
    }
  };

  const onStopTimeout = (type) => {
    if (timeout.value[type]) {
      clearTimeout(timeout.value[type]);
      timeout.value[type] = null;
    }
  };

  const onTranscribing = async () => {
    console.log('transcribing speech');
    try {
      if (encoder.value && recorder.value) {
        const recordState = await recorder.value.getState();
        if (recordState === 'stopped') {
          transcribing.value = true;
          let blob = await recorder.value.getBlob();
          if (removeSilence) {
            const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
            const ffmpeg = createFFmpeg({
              mainName: 'main',
              corePath: ffmpegCoreUrl,
              log: true,
            });
            if (!ffmpeg.isLoaded()) {
              await ffmpeg.load();
            }
            const buffer = await blob.arrayBuffer();
            console.log({ in: buffer.byteLength });
            ffmpeg.FS('writeFile', '
            ffmpeg.FS('writeFile', 'in.wav', new Uint8Array(buffer));
            await ffmpeg.run(
              '-i', // Input
              'in.wav',
              '-acodec', // Audio codec
              'libmp3lame',
              '-b:a', // Audio bitrate
              '96k',
              '-ar', // Audio sample rate
              '44100',
              '-af', // Audio filter = remove silence from start to end with 2 seconds in between
              silenceRemoveCommand,
              'out.mp3' // Output
            );
            const out = ffmpeg.FS('readFile', 'out.mp3');
            console.log({ out: out.buffer.byteLength });
            // 225 seems to be an empty mp3 file
            if (out.length <= 225) {
              ffmpeg.exit();
              setTranscript({ blob });
              transcribing.value = false;
              return;
            }
            blob = new Blob([out.buffer], { type: 'audio/mpeg' });
            ffmpeg.exit();
          } else {
            const buffer = await blob.arrayBuffer();
            console.log({ wav: buffer.byteLength });
            const mp3 = encoder.value.encodeBuffer(new Int16Array(buffer));
            blob = new Blob([mp3], { type: 'audio/mpeg' });
            console.log({ blob, mp3: mp3.byteLength });
          }
          if (typeof onTranscribeCallback === 'function') {
            const transcribed = await onTranscribeCallback(blob);
            console.log('onTranscribe', transcribed);
            setTranscript(transcribed);
          } else {
            const file = new File([blob], 'speech.mp3', { type: 'audio/mpeg' });
            const text = await onWhispered(file);
            console.log('onTranscribing', { text });
            setTranscript({ blob, text });
          }
          transcribing.value = false;
        }
      }
    } catch (err) {
      console.error(err);
      transcribing.value = false;
    }
  };

  const onDataAvailable = async (data) => {
    console.log('onDataAvailable', data);
    try {
      if (streaming && recorder.value) {
        onDataAvailableCallback?.(data);
        if (encoder.value) {
          const buffer = await data.arrayBuffer();
          const mp3chunk = encoder.value.encodeBuffer(new Int16Array(buffer));
          const mp3blob = new Blob([mp3chunk], { type: 'audio/mpeg' });
          chunks.value.push(mp3blob);
        }
        const recorderState = await recorder.value.getState();
        if (recorderState === 'recording') {
          const blob = new Blob(chunks.value, {
            type: 'audio/mpeg',
          });
          const file = new File([blob], 'speech.mp3', {
            type: 'audio/mpeg',
          });
          const text = await onWhispered(file);
          console.log('onInterim', { text });
          if (text) {
            transcript.value.text = text;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onWhispered = async (file) => {
    // Whisper only accepts multipart/form-data currently
    const body = new FormData();
    body.append('file', file);
    body.append('model', 'whisper-1');
    if (mode === 'transcriptions') {
      body.append('language', whisperConfig?.language ?? 'en');
    }
    if (whisperConfig?.prompt) {
      body.append('prompt', whisperConfig.prompt);
    }
    if (whisperConfig?.response_format) {
      body.append('response_format', whisperConfig.response_format);
    }
    if (whisperConfig?.temperature) {
      body.append('temperature', `${whisperConfig.temperature}`);
    }
    const headers = {};
    headers['Content-Type'] = 'multipart/form-data';
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
      const response = await axios.post(whisperApiEndpoint + mode, body, {
        headers,
      });
      return response.data.text;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  };
}
