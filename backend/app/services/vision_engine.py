import cv2
import mediapipe as mp
import numpy as np
from typing import Optional

# MediaPipe setup
mp_face_mesh = mp.solutions.face_mesh

# Landmark indices
LEFT_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
RIGHT_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
LEFT_IRIS_INDICES = [469, 470, 471, 472]
RIGHT_IRIS_INDICES = [474, 475, 476, 477]

# For blink detection
LEFT_EYE_TOP = 159
LEFT_EYE_BOTTOM = 145
LEFT_EYE_LEFT_CORNER = 33
LEFT_EYE_RIGHT_CORNER = 133


def calculate_ear(landmarks, eye_indices, frame_shape):
    """Eye Aspect Ratio for blink detection"""
    h, w = frame_shape[:2]

    def get_point(idx):
        lm = landmarks.landmark[idx]
        return np.array([lm.x * w, lm.y * h])

    # EAR = vertical distances / horizontal distance
    p1 = get_point(eye_indices[1])
    p2 = get_point(eye_indices[5])
    p3 = get_point(eye_indices[2])
    p4 = get_point(eye_indices[4])
    p5 = get_point(eye_indices[0])
    p6 = get_point(eye_indices[3])

    vertical1 = np.linalg.norm(p1 - p2)
    vertical2 = np.linalg.norm(p3 - p4)
    horizontal = np.linalg.norm(p5 - p6)

    ear = (vertical1 + vertical2) / (2.0 * horizontal + 1e-6)
    return ear


def calculate_gaze_score(landmarks, frame_shape) -> float:
    """
    Calculate eye contact score based on iris position within eye
    Score 0-100: high means looking at camera
    """
    h, w = frame_shape[:2]

    def get_x(idx):
        return landmarks.landmark[idx].x * w

    try:
        # Left iris center
        left_iris_x = get_x(LEFT_IRIS_INDICES[0])
        left_eye_left = get_x(LEFT_EYE_INDICES[0])
        left_eye_right = get_x(LEFT_EYE_INDICES[8])
        left_eye_width = left_eye_right - left_eye_left + 1e-6
        left_ratio = (left_iris_x - left_eye_left) / left_eye_width

        # Right iris center
        right_iris_x = get_x(RIGHT_IRIS_INDICES[0])
        right_eye_left = get_x(RIGHT_EYE_INDICES[0])
        right_eye_right = get_x(RIGHT_EYE_INDICES[8])
        right_eye_width = right_eye_right - right_eye_left + 1e-6
        right_ratio = (right_iris_x - right_eye_left) / right_eye_width

        avg_ratio = (left_ratio + right_ratio) / 2

        # Centered (0.4-0.6) = looking at camera = high score
        deviation = abs(avg_ratio - 0.5)
        if deviation < 0.1:
            score = 100
        elif deviation < 0.2:
            score = 80 - (deviation - 0.1) * 400
        else:
            score = max(0, 60 - (deviation - 0.2) * 300)

        return round(score, 1)
    except Exception:
        return 50.0


def calculate_head_pose(landmarks, frame_shape) -> dict:
    """Estimate head pose - is candidate looking straight?"""
    h, w = frame_shape[:2]

    nose_tip = landmarks.landmark[1]
    left_cheek = landmarks.landmark[234]
    right_cheek = landmarks.landmark[454]

    nose_x = nose_tip.x
    left_x = left_cheek.x
    right_x = right_cheek.x

    mid_face = (left_x + right_x) / 2
    deviation = nose_x - mid_face

    if abs(deviation) < 0.05:
        direction = "straight"
        score = 100
    elif deviation < -0.05:
        direction = "turned_left"
        score = max(50, 100 - abs(deviation) * 500)
    else:
        direction = "turned_right"
        score = max(50, 100 - abs(deviation) * 500)

    # Check vertical - looking down?
    nose_y = nose_tip.y
    top_y = landmarks.landmark[10].y
    chin_y = landmarks.landmark[152].y
    face_height = chin_y - top_y + 1e-6
    nose_ratio = (nose_y - top_y) / face_height

    if nose_ratio > 0.6:
        direction = "looking_down"
        score = min(score, 60)

    return {
        "direction": direction,
        "score": round(score, 1),
        "is_straight": direction == "straight"
    }


def analyze_frame(frame_bytes: bytes) -> dict:
    """
    Analyze a single webcam frame
    Returns: eye_contact, head_pose, face_detected, engagement metrics
    """
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"face_detected": False, "error": "Could not decode frame"}

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    with mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as face_mesh:

        results = face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return {
                "face_detected": False,
                "eye_contact_score": 0,
                "head_pose": {"direction": "not_detected", "score": 0},
                "engagement_score": 0
            }

        landmarks = results.multi_face_landmarks[0]

        gaze_score = calculate_gaze_score(landmarks, frame.shape)
        head_pose = calculate_head_pose(landmarks, frame.shape)

        # Check eye openness (blink detection)
        ear_left = calculate_ear(
            landmarks,
            [33, 159, 158, 133, 145, 144],
            frame.shape
        )
        ear_right = calculate_ear(
            landmarks,
            [362, 386, 385, 263, 374, 373],
            frame.shape
        )
        avg_ear = (ear_left + ear_right) / 2
        eyes_open = avg_ear > 0.2

        # Engagement = combination of gaze + head pose + eyes open
        engagement_score = round(
            gaze_score * 0.5 +
            head_pose["score"] * 0.35 +
            (100 if eyes_open else 30) * 0.15,
            1
        )

        return {
            "face_detected": True,
            "eye_contact_score": gaze_score,
            "head_pose": head_pose,
            "eyes_open": eyes_open,
            "engagement_score": min(100, engagement_score),
            "looking_at_camera": gaze_score > 60
        }


def aggregate_vision_metrics(frame_results: list) -> dict:
    """
    Aggregate multiple frame analyses into final session metrics
    Called at end of interview to compute overall vision scores
    """
    if not frame_results:
        return {
            "avg_eye_contact": 0,
            "avg_engagement": 0,
            "face_detected_ratio": 0,
            "looking_at_camera_ratio": 0,
            "head_pose_summary": "Not detected"
        }

    detected_frames = [f for f in frame_results if f.get("face_detected")]
    if not detected_frames:
        return {
            "avg_eye_contact": 0,
            "avg_engagement": 0,
            "face_detected_ratio": 0,
            "looking_at_camera_ratio": 0,
            "head_pose_summary": "Face not detected"
        }

    avg_eye_contact = np.mean([f["eye_contact_score"] for f in detected_frames])
    avg_engagement = np.mean([f["engagement_score"] for f in detected_frames])
    looking_ratio = sum(1 for f in detected_frames if f.get("looking_at_camera")) / len(detected_frames)

    # Head pose summary
    poses = [f["head_pose"]["direction"] for f in detected_frames]
    straight_ratio = poses.count("straight") / len(poses)
    if straight_ratio > 0.7:
        pose_summary = "Mostly facing camera"
    elif straight_ratio > 0.4:
        pose_summary = "Occasionally looking away"
    else:
        pose_summary = "Frequently looking away"

    return {
        "avg_eye_contact": round(float(avg_eye_contact), 1),
        "avg_engagement": round(float(avg_engagement), 1),
        "face_detected_ratio": round(len(detected_frames) / len(frame_results), 2),
        "looking_at_camera_ratio": round(looking_ratio, 2),
        "head_pose_summary": pose_summary,
        "total_frames_analyzed": len(frame_results),
        "frames_with_face": len(detected_frames)
    }
