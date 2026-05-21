import os
import io
import tempfile
import numpy as np
import librosa
import whisper
import soundfile as sf
from typing import Optional

# Load Whisper model once (use "base" for speed, "medium" for better accuracy)
whisper_model = whisper.load_model("base")

# Common filler words to detect
FILLER_WORDS = [
    "um", "uh", "like", "basically", "you know", "so", "actually",
    "literally", "honestly", "right", "okay", "well", "kind of",
    "sort of", "i mean", "you see"
]


def transcribe_audio(audio_bytes: bytes, file_extension: str = "wav") -> dict:
    """Transcribe audio using Whisper"""
    with tempfile.NamedTemporaryFile(
        suffix=f".{file_extension}", delete=False
    ) as tmp_file:
        tmp_file.write(audio_bytes)
        tmp_path = tmp_file.name

    try:
        result = whisper_model.transcribe(tmp_path, language="en")
        return {
            "text": result["text"].strip(),
            "language": result.get("language", "en"),
            "segments": result.get("segments", [])
        }
    finally:
        os.unlink(tmp_path)


def analyze_audio_features(audio_bytes: bytes, file_extension: str = "wav") -> dict:
    """Extract audio features using librosa"""
    with tempfile.NamedTemporaryFile(
        suffix=f".{file_extension}", delete=False
    ) as tmp_file:
        tmp_file.write(audio_bytes)
        tmp_path = tmp_file.name

    try:
        y, sr = librosa.load(tmp_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)

        # Energy / RMS (confidence proxy)
        rms = librosa.feature.rms(y=y)
        avg_energy = float(np.mean(rms))
        energy_variance = float(np.var(rms))

        # Zero crossing rate (clarity)
        zcr = librosa.feature.zero_crossing_rate(y)
        avg_zcr = float(np.mean(zcr))

        # Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        avg_spectral = float(np.mean(spectral_centroid))

        # Pitch / F0
        f0, voiced_flag, _ = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'),
            fmax=librosa.note_to_hz('C7')
        )
        voiced_f0 = f0[voiced_flag] if voiced_flag is not None else []
        avg_pitch = float(np.mean(voiced_f0)) if len(voiced_f0) > 0 else 0
        pitch_variance = float(np.var(voiced_f0)) if len(voiced_f0) > 0 else 0

        return {
            "duration_seconds": round(duration, 2),
            "avg_energy": round(avg_energy, 4),
            "energy_variance": round(energy_variance, 6),
            "avg_zcr": round(avg_zcr, 4),
            "avg_spectral_centroid": round(avg_spectral, 2),
            "avg_pitch_hz": round(avg_pitch, 2),
            "pitch_variance": round(pitch_variance, 2)
        }
    finally:
        os.unlink(tmp_path)


def calculate_speaking_pace(transcript: str, duration_seconds: float) -> dict:
    """Calculate words per minute and classify pace"""
    word_count = len(transcript.split())
    duration_minutes = duration_seconds / 60

    wpm = round(word_count / duration_minutes, 0) if duration_minutes > 0 else 0

    if wpm < 100:
        pace_label = "Too Slow"
        pace_score = 50
    elif wpm < 130:
        pace_label = "Slow"
        pace_score = 65
    elif wpm <= 160:
        pace_label = "Normal"
        pace_score = 90
    elif wpm <= 180:
        pace_label = "Fast"
        pace_score = 75
    else:
        pace_label = "Too Fast"
        pace_score = 55

    return {
        "wpm": int(wpm),
        "label": pace_label,
        "score": pace_score,
        "word_count": word_count
    }


def detect_filler_words(transcript: str) -> dict:
    """Count filler words in transcript"""
    text_lower = transcript.lower()
    filler_counts = {}
    total_fillers = 0

    for filler in FILLER_WORDS:
        import re
        pattern = r'\b' + re.escape(filler) + r'\b'
        count = len(re.findall(pattern, text_lower))
        if count > 0:
            filler_counts[filler] = count
            total_fillers += count

    # Score: 0 fillers = 100, each filler reduces score
    filler_score = max(0, 100 - (total_fillers * 8))

    return {
        "filler_counts": filler_counts,
        "total_fillers": total_fillers,
        "score": filler_score,
        "label": "Excellent" if total_fillers == 0 else
                 "Good" if total_fillers <= 2 else
                 "Average" if total_fillers <= 5 else "Needs Improvement"
    }


def calculate_confidence_score(audio_features: dict) -> dict:
    """Estimate confidence from audio features"""
    energy = audio_features.get("avg_energy", 0)
    energy_variance = audio_features.get("energy_variance", 0)
    pitch_variance = audio_features.get("pitch_variance", 0)

    # Higher energy with low variance = confident, steady voice
    energy_score = min(100, energy * 5000)

    # Low variance in energy = consistent delivery
    consistency_score = max(0, 100 - energy_variance * 100000)

    # Moderate pitch variance = natural (too low = monotone, too high = nervous)
    if 1000 <= pitch_variance <= 8000:
        pitch_score = 85
    elif pitch_variance < 1000:
        pitch_score = 60  # Monotone
    else:
        pitch_score = 65  # Too varied / nervous

    confidence_score = round(
        energy_score * 0.4 + consistency_score * 0.35 + pitch_score * 0.25, 1
    )
    confidence_score = max(0, min(100, confidence_score))

    return {
        "score": confidence_score,
        "label": "High" if confidence_score >= 75 else
                 "Medium" if confidence_score >= 50 else "Low",
        "voice_energy": round(energy_score, 1),
        "voice_consistency": round(consistency_score, 1)
    }


def detect_hesitations(segments: list) -> dict:
    """Detect pauses/hesitations from Whisper segments"""
    if not segments:
        return {"count": 0, "score": 100, "long_pauses": []}

    long_pauses = []
    for i in range(1, len(segments)):
        gap = segments[i]["start"] - segments[i - 1]["end"]
        if gap > 2.0:  # pause > 2 seconds = hesitation
            long_pauses.append({
                "at_second": round(segments[i - 1]["end"], 1),
                "duration": round(gap, 1)
            })

    hesitation_count = len(long_pauses)
    hesitation_score = max(0, 100 - hesitation_count * 15)

    return {
        "count": hesitation_count,
        "score": hesitation_score,
        "long_pauses": long_pauses,
        "label": "Fluent" if hesitation_count == 0 else
                 "Mostly Fluent" if hesitation_count <= 2 else
                 "Some Hesitation" if hesitation_count <= 4 else "Frequent Hesitation"
    }


def analyze_speech(audio_bytes: bytes, file_extension: str = "wav") -> dict:
    """
    Main function — complete speech analysis pipeline
    Returns full metrics for voice/video interview
    """
    # Step 1: Transcribe
    transcription_data = transcribe_audio(audio_bytes, file_extension)
    transcript = transcription_data["text"]
    segments = transcription_data["segments"]

    # Step 2: Audio features
    audio_features = analyze_audio_features(audio_bytes, file_extension)
    duration = audio_features["duration_seconds"]

    # Step 3: Individual metrics
    pace = calculate_speaking_pace(transcript, duration)
    fillers = detect_filler_words(transcript)
    confidence = calculate_confidence_score(audio_features)
    hesitations = detect_hesitations(segments)

    # Overall communication score
    communication_score = round(
        pace["score"]          * 0.25 +
        fillers["score"]       * 0.25 +
        confidence["score"]    * 0.30 +
        hesitations["score"]   * 0.20,
        1
    )

    return {
        "transcript": transcript,
        "duration_seconds": duration,
        "speaking_pace": pace,
        "filler_words": fillers,
        "confidence": confidence,
        "hesitations": hesitations,
        "communication_score": communication_score,
        "audio_features": audio_features
    }
