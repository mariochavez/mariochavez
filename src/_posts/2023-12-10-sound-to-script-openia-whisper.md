---
layout: post
title: "Sound to Script: Using OpenAI's Whisper Model and Whisper.cpp"
date: 2023-12-10 00:00:00 -0600
published: Deciembre 10, 2023
categories: desarrollo
description: AI offers a different set of inputs and outputs for inferences. One of the many inference models is Automatic Speech Recognition (ASR). Using OpenAI's Whiper model makes transcribing pre-recorded or live audio possible.
keywords: openia, whisper, artifical intelligence
image: /images/whisper/sound.jpg
lang: en
---

AI offers a different set of inputs and outputs for inferences. One of the many inference models is Automatic Speech Recognition (ASR). Using OpenAI's Whiper model makes transcribing pre-recorded or live audio possible.

[Whisper.cpp](https://github.com/ggerganov/whisper.cpp) implements OpenAI's Whisper model, which allows you to run this model on your machine. It could be done running your CPU, Apple's Core ML from M processors, or using a dedicated GPU unit. You can run the smaller or larger Whisper model; Whisper.cpp also supports running quantized models, which require less memory and disk space using the [GGML library](https://github.com/ggerganov/ggml).

So, let's see how to use Whisper.cpp to process a video to get subtitle SRT format.

First, you need to clone the Whisper.cpp repository.

```bash
git clone [https://github.com/ggerganov/whisper.cpp](https://github.com/ggerganov/whisper.cpp)
```

If you are running Whisper.cpp from your CPU, change to the code folder and run the make command:

```bash
make
```

Then download a Whiper model in ggml format:

```bash
bash ./models/download-ggml-model.sh base.en
```

You can find available models here: [https://huggingface.co/ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp)

With the model in place, run the following command to test it with a sample audio in the repository.

```bash
./main -f samples/jfk.wav
```

You should see the model being loaded; at the end, it displays the inferred text from the audio.

```bash
main: processing 'samples/jfk.wav' (176000 samples, 11.0 sec), 4 threads, 1 processors, 5 beams + best of 5, lang = en, task = transcribe, timestamps = 1 ...
[00:00:00.000 --> 00:00:11.000]   And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.
```

Now, I'll focus on getting Whisper.cpp to work with Apple's silicon processor to get better performance at inference.

You need Python installed to prepare Whisper models for running with Apple's Core ML. The best way to set up Python is to install it via [Miniconda](https://docs.conda.io/projects/miniconda/en/latest/) and create an environment for Whisper.

```bash
conda create -n py310-whisper python=3.10 -y
conda activate py310-whisper
```

With Python ready and activated, install the following dependencies for Core ML.

```bash
pip install ane_transformers
pip install openai-whisper
pip install coremltools
```

Next, generate a Core ML model off the downloaded base.en Whisper model. If you downloaded a different model, update the command to reflect that change.

```bash
./models/generate-coreml-model.sh base.en
```

Finally, you need to compile Whisper.cpp with Core ML support.

```bash
make clean
WHISPER_COREML=1 make -j
```

Running the Core ML model with Whisper.cpp Core ML support produces faster inference.

```bash
./main -m models/ggml-base.en.bin -f samples/jfk.wav
```

With these tools ready, you can move to a different scenario where the audio needs to be extracted from a video, passed to Whisper.cpp, and produced the subtitle file in SRT format.

To extract audio from a video, [ffmpeg](https://ffmpeg.org) is the best tool for this job. Whisper.cpp needs audio in 16-bit format.

```bash
ffmpeg -i video.mp4  -ar 16000 -ac 1 -c:a pcm_s16le video.wav
```

The output is a WAV audio file that you can use to produce a transcription into a JSON file.

```
./main -m models/ggml-base.en.bin -f video.wav  -oj -ojf video
....
    
	"params": {
            "model": "models/ggml-medium.en-q5_0.bin",
            "language": "en",
            "translate": false
    },
    "result": {
            "language": "en"
    },
    "transcription": [
            {
                    "timestamps": {
                            "from": "00:00:00,720",
                            "to": "00:00:08,880"
                    },
                    "offsets": {
                            "from": 720,
                            "to": 8880
                    },
                    "text": " Hi, everyone. Would you let people in why? Okay. Yes. My name is Selma. For those of you that don't",
                    "tokens": [
                            {
                                    "text": " Hi",
                                    "timestamps": {
                                            "from": "00:00:00,000",
                                            "to": "00:00:00,240"
                                    },
                                    "offsets": {
                                            "from": 0,
                                            "to": 240
                                    },
                                    "id": 15902,
                                    "p": 0.882259
                            },
                            {
                                    "text": ",",
                                    "timestamps": {
                                            "from": "00:00:00,240",
                                            "to": "00:00:00,470"
                                    },
                                    "offsets": {
                                            "from": 240,
                                            "to": 470
                                    },
....
```

This JSON file can be transformed to meet our needs. In our case, we want to produce an SRT format for video player subtitles. This last part is done with a Ruby script.

```bash
json_data = JSON.parse(File.read(json_file_path))

transcription = json_data['transcription']
srt_content = ""

transcription.each_with_index do |entry, index|
  from_time = entry['timestamps']['from']
  to_time = entry['timestamps']['to']
  text = entry['text']

  srt_content += "#{index + 1}\\n"
  srt_content += "#{from_time} --> #{to_time}\\n"
  srt_content += "#{text}\\n\\n"
end

File.write(srt_file_path, srt_content)
```

It depends on the length of the extracted audio file; this process can take a few seconds or several minutes to complete.

The following is a Ruby script performs all three actions at once: extract audio, transcribe, and transform into SRT file format. 

```bash
require 'json'
require 'tmpdir'

def extract_audio(dir, input_video_path)
  # Generate temporary WAV file path based on the input video
  temp_wav_file_path = "#{dir}/#{File.basename(input_video_path, '.*')}.wav"

  # Construct the ffmpeg command
  ffmpeg_command = "ffmpeg -i '#{input_video_path}' -ar 16000 -ac 1 -c:a pcm_s16le '#{temp_wav_file_path}'"

  # Execute the ffmpeg command
  puts ffmpeg_command
  system(ffmpeg_command)

  # Check if the command was successful
  if $?.success?
    puts "Audio extracted successfully to #{temp_wav_file_path}"
    return temp_wav_file_path
  else
    puts "Error extracting audio. Please check your ffmpeg installation and the input video file."
    exit(1)
  end
end

def process_wav(dir, wav_file_path)
  # Path to the main command and binary file
  path = '~/Development/llm/whisper.cpp/'
  main_command = 'main'
  model_file = 'models/ggml-medium.en-q5_0.bin'

  # Generate temporary JSON file path based on the WAV file
  temp_json_file_path = "#{dir}/#{File.basename(wav_file_path, '.*')}"

  # Construct the full command with quotes around file paths
  full_command = "#{path}#{main_command} -m #{path}#{model_file} -f '#{wav_file_path}' -oj -ojf '#{temp_json_file_path}'"

  # Execute the command
  puts full_command
  system(full_command)

  # Check if the command was successful
  if $?.success?
    puts "Processing completed successfully for #{wav_file_path}"
    return "#{temp_json_file_path}.wav.json"
  else
    puts "Error processing the WAV file. Please check your command and the input file."
    exit(1)
  end
end

def process_json_to_srt(json_file_path, srt_file_path)
  json_data = JSON.parse(File.read(json_file_path))

  # Extract 'transcription' array from JSON
  transcription = json_data['transcription']
  srt_content = ""

  transcription.each_with_index do |entry, index|
    from_time = entry['timestamps']['from']
    to_time = entry['timestamps']['to']
    text = entry['text']

    srt_content += "#{index + 1}\n"
    srt_content += "#{from_time} --> #{to_time}\n"
    srt_content += "#{text}\n\n"
  end

  # Write SRT content to the new file
  File.write(srt_file_path, srt_content)

  puts "SRT file created at #{srt_file_path}"
end

# Check if the video file path is provided as a command-line argument
if ARGV.empty?
  puts "Usage: ruby combined_script.rb path/to/your/video.mp4"
  exit(1)
else
  video_path = ARGV[0]

  Dir.mktmpdir do |dir|
    # Extract audio
    wav_file_path = extract_audio(dir, video_path)

    # Process audio to obtain JSON transcript
    json_file_path = process_wav(dir, wav_file_path)

    # Convert JSON to SRT
    srt_file_path = "#{File.dirname(video_path)}/#{File.basename(video_path, '.*')}.srt"
    process_json_to_srt(json_file_path, srt_file_path)
  end
end
```

It needs a few changes in the `process_wav` method.

First, you need to update the path to your Whisper binaries. And second, the relative path to the binaries of your model.
After these changes, you can create subtitles for your video with the following command.

```bash
ruby transcribe.rb video.mp4
```

After script completion, you will have a video.srt file next to your video file.
